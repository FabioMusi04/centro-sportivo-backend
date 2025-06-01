import { DateTime } from 'luxon'
import { BaseModel, beforeFetch, beforeFind, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'

import Course from './Course'
import User from './User'
import { softDeleteQuery, softDelete } from 'App/Services/SoftDelete'

export enum Status {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
}

export default class Booking extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public courseId: number

  @column()
  public status: Status = Status.PENDING

  @column.dateTime()
  public bookingDate: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime()
  public cancelledAt?: DateTime

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @belongsTo(() => Course)
  public course: BelongsTo<typeof Course>

  @beforeFind()
  public static softDeletesFind = softDeleteQuery;  
  @beforeFetch()
  public static softDeletesFetch = softDeleteQuery;
  
  public async softDelete(column?: string) {
    await softDelete(this, column);
  }
}
