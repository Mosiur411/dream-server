const { Router } = require('express')
const { employeeSignup, employeeUpdate } = require('../controller/employee.controller')
const employeeRoutes = Router()
employeeRoutes.post('/signup', employeeSignup)
employeeRoutes.put('/update', employeeUpdate)
module.exports = { employeeRoutes }