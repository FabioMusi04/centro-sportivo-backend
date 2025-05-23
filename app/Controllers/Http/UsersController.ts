import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User, { UserRole } from 'App/Models/User'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class UsersController {
  public async index({}: HttpContextContract) {
    return await User.all()
  }

  public async create({}: HttpContextContract) {}

  public async store({ request, response }: HttpContextContract) {
    const userSchema = schema.create({
      name: schema.string({ trim: true }, [rules.maxLength(255)]),
      email: schema.string({ trim: true }, [
        rules.email(),
        rules.maxLength(255),
        rules.unique({ table: 'users', column: 'email' }),
      ]),
      password: schema.string({}, [rules.minLength(6)]),
      role: schema.enum.optional(Object.values(UserRole)),
    })

    const payload = await request.validate({ schema: userSchema })

    const user = await User.create(payload)
    return response.created(user)
  }

  public async show({ params, response }: HttpContextContract) {
    const user = await User.find(params.id)
    if (!user) {
      return response.notFound({ message: 'User not found' })
    }
    return user
  }

  public async edit({}: HttpContextContract) {}

  public async update({ params, request, response }: HttpContextContract) {
    const user = await User.find(params.id)
    if (!user) {
      return response.notFound({ message: 'User not found' })
    }

    const userSchema = schema.create({
      name: schema.string.optional({ trim: true }, [rules.maxLength(255)]),
      email: schema.string.optional({ trim: true }, [
        rules.email(),
        rules.maxLength(255),
        rules.unique({ table: 'users', column: 'email', whereNot: { id: params.id } }),
      ]),
      password: schema.string.optional({}, [rules.minLength(6)]),
      role: schema.enum.optional(Object.values(UserRole)),
    })

    const payload = await request.validate({ schema: userSchema })

    user.merge(payload)
    await user.save()
    return user
  }

  public async destroy({ params, response }: HttpContextContract) {
    const user = await User.find(params.id)
    if (!user) {
      return response.notFound({ message: 'User not found' })
    }
    await user.delete()
    return response.noContent()
  }
}
