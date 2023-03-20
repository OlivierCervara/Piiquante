require("dotenv").config()
const express = require("express")
const app = express()
const cors = require("cors")
const bodyParser = require("body-parser")
const port = 3000

// Connection to Database
require("./mongo")

// Controllers
const { createUser, logUser } = require("./controllers/user")
const { getSauces, createSauce } = require("./controllers/sauces")

// Middlewares
app.use(cors())
app.use(express.json())
app.use(bodyParser.json())
const {authenticateUser} = require("./middleware/auth")

// Routes
app.post("/api/auth/signup", createUser)
app.post("/api/auth/login", logUser)
app.get("/api/sauces", authenticateUser, getSauces)
app.post("/api/sauces", authenticateUser, createSauce)

// Listen
app.listen(port, () => console.log("Listening on port " + port))


