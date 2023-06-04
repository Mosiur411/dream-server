const { Router } = require('express')
const { userAdminRole } = require('../../../controller/admin/public/user.admin.controller')
const userAdminRoutes = Router()

userAdminRoutes.get('/public/auth', userAdminRole)








module.exports = { userAdminRoutes }

/* user.controller */