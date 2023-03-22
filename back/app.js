require("dotenv").config()
const express = require("express")
const app = express()
const cors = require("cors")
const port = 3000
const multer = require("multer")
const path = require("path")

const storage = multer.diskStorage({
    destination: "images/",
    filename: function (req, file, cb) {
        cb(null, makeFilename(req, file))
    }
})

function makeFilename(req, file){
    console.log("req, file: ", req, file)
    const fileName = `${Date.now()}-${file.originalname}`.replace(/\s/g, "-" )
    file.fileName = fileName
    return fileName
}

const upload = multer({ storage: storage })

// Connection to Database
require("./mongo")

// Controllers
const { createUser, logUser } = require("./controllers/user")
const { getSauces, createSauce } = require("./controllers/sauces")

// Middlewares
app.use(cors())
app.use(express.json())

const { authenticateUser } = require("./middleware/auth")

// Routes
app.post("/api/auth/signup", createUser)
app.post("/api/auth/login", logUser)
app.get("/api/sauces", authenticateUser, getSauces)
app.post("/api/sauces", authenticateUser, upload.single("image"), createSauce)

// Listen
app.use("/images", express.static(path.join(__dirname, "images")))
app.listen(port, () => console.log("Listening on port " + port))


