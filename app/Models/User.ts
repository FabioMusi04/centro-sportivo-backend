import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export enum UserRole {
  Instructor = 'instructor',
  User = 'user',
}

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column({
    consume: (value?: string) =>
      value === UserRole.Instructor ? UserRole.Instructor : UserRole.User,
    serialize: (value: UserRole) => value,
  })
  public role: UserRole = UserRole.User

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
