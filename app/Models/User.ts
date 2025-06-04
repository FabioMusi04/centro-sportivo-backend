import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'

import Course from './Course'
import Booking from './Booking'

export enum UserRole {
  Instructor = 'instructor',
  User = 'user',
  Admin = 'admin',
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
    consume: (value?: string) => value as UserRole,
    serialize: (value: UserRole) => value,
  })
  public role: UserRole = UserRole.User

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Course)
  public courses: HasMany<typeof Course>

  @hasMany(() => Booking)
  public bookings: HasMany<typeof Booking>
}
