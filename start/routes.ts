import Route from '@ioc:Adonis/Core/Route'

Route.post('/register', 'AuthController.register')
Route.post('/login', 'AuthController.login')

Route.get('/', async () => {
  return { status: 'ok', message: 'API is running' }
})

Route.group(() => {
  Route.resource('books', 'BooksController')
    .apiOnly()
    .middleware({
      '*': ['auth'],
      store: ['role:admin'],
      update: ['role:admin'],
      destroy: ['role:admin'],
    })


  Route.resource('authors', 'AuthorsController')
    .apiOnly()
    .middleware({
      '*': ['auth'],
      store: ['role:admin'],
      update: ['role:admin'],
      destroy: ['role:admin'],
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
