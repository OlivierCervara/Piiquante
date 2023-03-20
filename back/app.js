require("dotenv").config()
const express = require("express")
const app = express()
const cors = require("cors")
const bodyParser = require("body-parser")
const path = require("path")
const port = 3000

// Connection to Database
require("./mongo")

// Controllers
const { createUser, logUser } = require("./controllers/user")
const { getSauces, createSauce } = require("./controllers/sauces")

// Middlewares
app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use("/images", express.static(path.join(__dirname, "images"))) // Attention au chemin


const {authenticateUser} = require("./middleware/auth")
const multer = require("multer")
const storage = multer.diskStorage({destination: "images/", filename: makeFilename})
const upload = multer({storage: storage})

function makeFilename(req, file, cb) {
    cb(null, Date.now() + "." + file.originalname)
}

// Routes
app.post("/api/auth/signup", createUser)
app.post("/api/auth/login", logUser)
app.get("/api/sauces", authenticateUser, getSauces)
app.post("/api/sauces", authenticateUser, upload.single("image"), createSauce)

// Listen
app.listen(port, () => console.log("Listening on port " + port))


