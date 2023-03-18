require("dotenv").config()
const express = require("express")
const app = express()
const cors = require("cors")
const port = 3000

// Connection to Database
require("./mongo")

// Controllers
const { createUser } = require("./controllers/user")

// Middlewares
app.use(cors())
app.use(express.json())

// Routes
app.post("/api/auth/signup", createUser)

// Listen
app.listen(port, () => console.log("Listening on port " + port))


