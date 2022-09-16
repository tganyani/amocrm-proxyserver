const express = require('express')
const router = require('./router')
const cors = require('cors')
const prisma = require('./lib/prisma')
const app = express()

const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({
    extended:true
}))
app.use('/',router)


app.listen(port, ()=>console.log(`The server is up and running on port ${port}`))
