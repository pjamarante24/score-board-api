const express = require('express')
const cors = require('cors')
const router = require("./router")
const bodyParser = require('body-parser')

const app = express()
const port = 3001

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use('/', router)

app.listen(port, () => console.log(`Listening on port ${port}`))