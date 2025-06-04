import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Booking, { Status } from 'App/Models/Booking'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class BookingsController {
  public async index({}: HttpContextContract) {
    return await Booking.query()
      .preload('user')
      .preload('course', (courseQuery) => {
        courseQuery.preload('user')
      })
  }

  public async show({ params, response }: HttpContextContract) {
    const booking = await Booking.query()
      .where('id', params.id)
      .preload('user')
      .preload('course', (courseQuery) => {
        courseQuery.preload('user')
      })
      .first()

    if (!booking) {
      return response.notFound({ message: 'Booking not found' })
    }
    return booking
  }

  public async store({ request, response }: HttpContextContract) {
    const bookingSchema = schema.create({
      userId: schema.number([rules.exists({ table: 'users', column: 'id' })]),
      courseId: schema.number([rules.exists({ table: 'courses', column: 'id' })]),
      bookingDate: schema.date({ format: 'yyyy-MM-dd HH:mm:ss' }),
      status: schema.enum.optional(Object.values(Status)),
    })

    const payload = await request.validate({ schema: bookingSchema })

    const booking = await Booking.create({
      ...payload,
      status: payload.status || Status.PENDING,
    })
    return response.created(booking)
  }

  public async update({ params, request, response }: HttpContextContract) {
    const booking = await Booking.find(params.id)
    if (!booking) {
      return response.notFound({ message: 'Booking not found' })
    }

    const bookingSchema = schema.create({
      userId: schema.number.optional([rules.exists({ table: 'users', column: 'id' })]),
      courseId: schema.number.optional([rules.exists({ table: 'courses', column: 'id' })]),
      bookingDate: schema.date.optional({ format: 'yyyy-MM-dd HH:mm:ss' }),
      status: schema.enum.optional(Object.values(Status)),
      cancelledAt: schema.date.optional({ format: 'yyyy-MM-dd HH:mm:ss' }),
    })

    const payload = await request.validate({ schema: bookingSchema })

    booking.merge(payload)
    await booking.save()
    return booking
  }

  public async destroy({ params, response }: HttpContextContract) {
    const booking = await Booking.find(params.id)
    if (!booking) {
      return response.notFound({ message: 'Booking not found' })
    }

    await booking.softDelete()
    return response.noContent()
  }

  public async confirm({ params, response }: HttpContextContract) {
    const booking = await Booking.find(params.id)
    if (!booking) {
      return response.notFound({ message: 'Booking not found' })
    }

    booking.status = Status.CONFIRMED
    await booking.save()

    return booking
  }

  public async cancel({ params, response }: HttpContextContract) {
    const booking = await Booking.find(params.id)
    if (!booking) {
      return response.notFound({ message: 'Booking not found' })
    }

    booking.status = Status.CANCELLED
    
    await booking.softDelete()

    return booking
  }

  public async restore({ params, response }: HttpContextContract) {
    const booking = await Booking.find(params.id)
    if (!booking) {
      return response.notFound({ message: 'Booking not found' })
    }

    booking.cancelledAt = undefined
    await booking.save()

    return booking
  }

  public async ongoingBookings({ response }: HttpContextContract) {
    const bookings = await Booking.query()
      .where('status', Status.PENDING)
      .orWhere('status', Status.CONFIRMED)
      .whereNull('cancelledAt')
      .preload('user', (query) => query.select(['id', 'name']))
      .preload('course', (query) => query.select(['id', 'name']))
      .orderBy('bookingDate', 'asc')

    const result = bookings.map((booking) => ({
      userName: booking.user?.name,
      courseName: booking.course?.title,
      bookingDate: booking.bookingDate,
    }))

    return response.ok(result)
  }

  public async getNumberOfBookingsOfUser({ params, response }: HttpContextContract) {
    const userId = params.userId
    const bookingsCount = await Booking.query()
      .where('userId', userId)
      .whereNull('cancelledAt')
      .count('* as count')

    return response.ok({ userId, bookingsCount: bookingsCount[0] })
  }

  public async getCoursesWithMostBookings({ response }: HttpContextContract) {
    const courses = await Booking.query()
      .select('courseId')
      .count('* as bookingCount')
      .whereNull('cancelledAt')
      .groupBy('courseId')
      .orderBy('bookingCount', 'desc')
      .preload('course', (query) => query.select(['id', 'title']))
      .limit(5)

    return response.ok(courses)
  }
}
