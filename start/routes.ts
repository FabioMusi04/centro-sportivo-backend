import Hash from '@ioc:Adonis/Core/Hash'
import Route from '@ioc:Adonis/Core/Route'
import User, { UserRole } from 'App/Models/User'
import { UserFactory, BookingFactory } from 'Database/factories'

Route.post('/register', 'AuthController.register')
Route.post('/login', 'AuthController.login')

Route.get('/', async () => {
  return { status: 'ok', message: 'API is running' }
})

Route.get('/factories', async ({ response }) => {
  const hashedPassword = await Hash.make("admin")

  await User.create({
    name: 'Admin User',
    email: 'admin@admin.com',
    password: hashedPassword,
    role: UserRole.Admin,
  })

  const instructor = await UserFactory.merge({ role: UserRole.Instructor }).create()

  const bookings = await BookingFactory
    .with('user', 100, (user) => {
      user.merge({ role: UserRole.User })
    })
    .with('course', 1, (course) => {
      course.merge({ userId: instructor.id })
    })
    .createMany(100)

  return response.json({
    bookings
  })
})

Route.group(() => {
  Route.resource('courses', 'CoursesController')
    .apiOnly()
    .middleware({
      '*': ['auth'],
      store: ['role:instructor,admin'],
      update: ['role:instructor,admin'],
      destroy: ['role:instructor,admin'],
    })

  Route.resource('bookings', 'BookingsController')
    .apiOnly()
    .middleware({
      '*': ['auth'],
    })

  Route.resource('users', 'UsersController')
    .apiOnly()
    .middleware({
      '*': ['auth'],
      destroy: ['role:admin'],
      store: ['role:admin'], 
    })
}).middleware(['auth'])
