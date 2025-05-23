import User, { UserRole } from 'App/Models/User'
import Factory from '@ioc:Adonis/Lucid/Factory'

export const UserFactory = Factory
  .define(User, ({ faker }) => {
    return {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: 'password',
      role: UserRole.User,
    }
  }).build()
