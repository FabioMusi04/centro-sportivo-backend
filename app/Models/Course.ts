import { DateTime } from 'luxon'
import { BaseModel, belongsTo, BelongsTo, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'

import Booking from './Booking'
import User from './User'

export default class Course extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string

  @column()
  public description: string

  @column()
  public maxParticipants: number

  @column()
  public userId: number //istruttore

  @column()
  public isActive: boolean

  @column()
  public location?: string

  @column()
  public isOnline: boolean

  @column()
  public category?: string

  @column.dateTime()
  public startDate: DateTime

  @column.dateTime()
  public endDate: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @hasMany(() => Booking)
  public bookings: HasMany<typeof Booking>
}
