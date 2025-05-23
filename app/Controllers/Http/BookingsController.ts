import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Booking from 'App/Models/Booking'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class BookingsController {
  public async index({}: HttpContextContract) {
    return await Booking.all()
  }

  public async show({ params, response }: HttpContextContract) {
    const booking = await Booking.find(params.id)
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
    })

    const payload = await request.validate({ schema: bookingSchema })

    const booking = await Booking.create(payload)
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
    await booking.delete()
    return response.noContent()
  }
}
