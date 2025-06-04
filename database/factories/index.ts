import User, { UserRole } from 'App/Models/User'
import Booking, { Status } from 'App/Models/Booking'
import { DateTime } from 'luxon'

import Course from 'App/Models/Course'
import Factory from '@ioc:Adonis/Lucid/Factory'

export const UserFactory = Factory
  .define(User, ({ faker }) => {
    return {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: 'password',
      role: faker.helpers.arrayElement([
        UserRole.Instructor,
        UserRole.User,
      ]),
    }
  })
  .build()

export const CourseFactory = Factory
  .define(Course, ({ faker }) => {
    const startDate = DateTime.now().plus({ days: faker.number.int({ min: 1, max: 30 }) })
    const endDate = startDate.plus({ hours: faker.number.int({ min: 1, max: 3 }) })
    return {
      title: faker.lorem.words(3),
      description: faker.lorem.sentence(),
      maxParticipants: faker.number.int({ min: 5, max: 30 }),
      isActive: true,
      location: faker.location.city(),
      isOnline: faker.datatype.boolean(),
      category: faker.lorem.word(),
      startDate,
      endDate,
    }
  })
  .relation('user', () => UserFactory)
  .build()

export const BookingFactory = Factory
  .define(Booking, ({ faker }) => {
    return {
      status: faker.helpers.arrayElement([
        Status.PENDING,
        Status.CONFIRMED,
        Status.CANCELLED,
      ]),
      bookingDate: DateTime.now().plus({ days: faker.number.int({ min: 1, max: 30 }) }),
      cancelledAt: undefined,
    }
  })
  .relation('user', () => UserFactory)
  .relation('course', () => CourseFactory)
  .build()