import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Course from 'App/Models/Course'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class CoursesController {
  public async index({}: HttpContextContract) {
    return await Course.query().preload('user')
  }

  public async create({}: HttpContextContract) {}

  public async store({ request, response }: HttpContextContract) {
    const courseSchema = schema.create({
      title: schema.string({}, [rules.maxLength(255)]),
      description: schema.string.optional({ trim: true }),
      maxParticipants: schema.number([rules.unsigned()]),
      userId: schema.number([rules.unsigned()]),
    })

    const payload = await request.validate({ schema: courseSchema })

    const course = await Course.create(payload)
    return response.created(course)
  }

  public async show({ params, response }: HttpContextContract) {
    const course = await Course.query()
      .where('id', params.id)
      .preload('user')
      .first()
    if (!course) {
      return response.notFound({ message: 'Course not found' })
    }
    return course
  }

  public async edit({}: HttpContextContract) {}

  public async update({ bouncer, params, request, response }: HttpContextContract) {
    const course = await Course.find(params.id)
    if (!course) {
      return response.notFound({ message: 'Course not found' })
    }

    await bouncer.authorize('manageCourse', course)

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

  public async destroy({ bouncer, params, response }: HttpContextContract) {
    const course = await Course.find(params.id)
    if (!course) {
      return response.notFound({ message: 'Course not found' })
    }

    await bouncer.authorize('manageCourse', course)

    await course.delete()
    return response.noContent()
  }

  public async activeCourses({ response }: HttpContextContract) {
    const activeCourses = await Course.query()
      .where('isActive', true)
      .whereRaw('participants_count < max_participants')
      .preload('user')
    return response.ok(activeCourses)
  }

  public async getCoursesByInstructor({ params, response }: HttpContextContract) {
    const courses = await Course.query().where('instructorId', params.instructorId).preload('user')
    if (courses.length === 0) {
      return response.notFound({ message: 'No courses found for this instructor' })
    }
    return response.ok(courses)
  }
  
}
