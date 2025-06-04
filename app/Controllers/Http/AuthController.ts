import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from "App/Models/User"
import Hash from '@ioc:Adonis/Core/Hash'

export default class AuthController {
    async login(ctx: HttpContextContract) {
        const email = ctx.request.input('email')
        const password = ctx.request.input('password')

        if (!email || !password) {
            return ctx.response.status(400).json({ message: 'Email and password are required' })
        }

        const user = await User.findBy('email', email)
        if (!user) {
            return ctx.response.status(401).json({ message: 'Invalid credentials' })
        }

        const passwordVerified = await Hash.verify(user.password, password)
        if (!passwordVerified) {
            return ctx.response.status(401).json({ message: 'Invalid credentials' })
        }

        const token = await ctx.auth.use('api').generate(user)
        return { user, token }
    }

    async register(ctx: HttpContextContract) {
        const { email, password, name } = ctx.request.all()

        if (!email || !password || !name) {
            return ctx.response.status(400).json({ message: 'Email and password are required' })
        }

        const existingUser = await User.findBy('email', email)
        if (existingUser) {
            return ctx.response.status(409).json({ message: 'Email already in use' })
        }

        try {
            const hashedPassword = await Hash.make(password)

            const user = await User.create({
                email,
                password: hashedPassword,
                name,
            })

            return ctx.response.status(201).json(user)
        } catch (error) {
            return ctx.response.status(400).json({ message: `Error registering user: ${error?.message}` })
        }
    }
}