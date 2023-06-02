const { Router } = require('express')
const { userSignup, userGetAdmin, userUpdateAdmin, userDeleteAdmin, userGet, userUpdate } = require('../controller/user.controller')
const userRoutes = Router()
/* user signup  */
userRoutes.post('/signup', userSignup)
/* user handel  */
userRoutes.get('/user', userGet)
userRoutes.put('/user/update', userUpdate)

/* admin admin  */
userRoutes.get('/admin/user', userGetAdmin)
userRoutes.put('/admin/user/update', userUpdateAdmin)
userRoutes.delete('/admin/user/delete', userDeleteAdmin)

module.exports = { userRoutes }

/* user.controller */