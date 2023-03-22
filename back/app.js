const { app, express } = require("./server")
const port = 3000
const path = require("path")

// Connection to Database
require("./mongo")

// Controllers
const { createUser, logUser } = require("./controllers/user")
const { getSauces, createSauce } = require("./controllers/sauces")

// Middlewares
const { upload } = require("./middleware/multer")
const { authenticateUser } = require("./middleware/auth")

// Routes
app.post("/api/auth/signup", createUser)
app.post("/api/auth/login", logUser)
app.get("/api/sauces", authenticateUser, getSauces)
app.post("/api/sauces", authenticateUser, upload.single("image"), createSauce)

// Listen
app.use("/images", express.static(path.join(__dirname, "images")))
app.listen(port, () => console.log("Listening on port " + port))


