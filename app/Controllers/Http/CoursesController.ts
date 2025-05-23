import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Course from 'App/Models/Course'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class CoursesController {
  public async index({}: HttpContextContract) {
    return await Course.all()
  }

  public async create({}: HttpContextContract) {
    // Not needed for API, usually for rendering forms in web apps
  }

  public async store({ request, response }: HttpContextContract) {
    const courseSchema = schema.create({
      title: schema.string({}, [rules.maxLength(255)]),
      description: schema.string.optional({ trim: true }),
      max_participants: schema.number([rules.unsigned()]),
      instructor_id: schema.number([rules.unsigned()]),
    })

    const payload = await request.validate({ schema: courseSchema })

    const course = await Course.create(payload)
    return response.created(course)
  }

  public async show({ params, response }: HttpContextContract) {
    const course = await Course.find(params.id)
    if (!course) {
      return response.notFound({ message: 'Course not found' })
    }
    return course
  }

  public async edit({}: HttpContextContract) {
    // Not needed for API, usually for rendering forms in web apps
  }

  public async update({ params, request, response }: HttpContextContract) {
    const course = await Course.find(params.id)
    if (!course) {
      return response.notFound({ message: 'Course not found' })
    }

    const courseSchema = schema.create({
      title: schema.string.optional({}, [rules.maxLength(255)]),
      description: schema.string.optional({ trim: true }),
      max_participants: schema.number.optional([rules.unsigned()]),
      instructor_id: schema.number.optional([rules.unsigned()]),
    })

    const payload = await request.validate({ schema: courseSchema })
    course.merge(payload)
    await course.save()
    return course
  }

  public async destroy({ params, response }: HttpContextContract) {
    const course = await Course.find(params.id)
    if (!course) {
      return response.notFound({ message: 'Course not found' })
    }
    await course.delete()
    return response.noContent()
  }
}
