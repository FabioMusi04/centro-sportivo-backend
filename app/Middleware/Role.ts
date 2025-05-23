import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class RoleMiddleware {
  public async handle({ auth, response }: HttpContextContract, next: () => Promise<void>, guards: string[]) {
    const user = auth.user

    if (!user || !guards.includes(user.role)) {
      return response.unauthorized({ message: 'Unauthorized access' })
    }

    await next()
  }
}
