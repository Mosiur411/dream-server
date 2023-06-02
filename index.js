const express = require('express')
const cors = require('cors')
const { connectDatabase } = require('./config/bd.config')
const { userRoutes } = require('./routes/user.routes')
const { initializeFirebase } = require('./config/firebase.config')
const { employeeRoutes } = require('./routes/employee.router')

require('dotenv').config()
const app = express()

const port = process.env.PORT || 5001
// middlewares 
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World!')
})

/* route   */

/* admin handel  */
app.use('/', userRoutes)
app.use('/employee', employeeRoutes)


// database
const mongodb_uri = process.env.PROD_DB;
connectDatabase(mongodb_uri)
initializeFirebase()
app.listen(port, "0.0.0.0", () => {
    console.log(`Example app listening on port ${process.env.PORT}`)
})