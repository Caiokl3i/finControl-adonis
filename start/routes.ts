import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'

router.get('/', () => {
  return { hello: 'world' }
})


router
  .group(() => {
    router.post('signup', [controllers.NewAccount, 'store'])
    router.post('login', [controllers.AccessTokens, 'store'])
  })
  .prefix('auth')
  .as('auth')

router
  .group(() => {
    router.get('profile', [controllers.Profile, 'show'])
    router.post('logout', [controllers.AccessTokens, 'destroy'])
  })
  .prefix('account')
  .as('profile')
  .use(middleware.auth())

router
  .group(() => {
    router.get('/', [controllers.Categories, 'index'])
    router.get('/:id', [controllers.Categories, 'show'])
    router.post('/', [controllers.Categories, 'store'])
    router.put('/:id', [controllers.Categories, 'update'])
    router.delete('/:id', [controllers.Categories, 'destroy'])
  })
  .prefix('categories')
  .as('categories')
  .use(middleware.auth())

