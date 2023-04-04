const express = require("express")
const { 
    getSauces, 
    createSauce, 
    getSauceById, 
    deleteSauce, 
    modifySauce, 
    likeSauce 
} = require("../controllers/sauces")
const { authenticateUser } = require("../middleware/auth")
const { upload } = require("../middleware/multer")
const saucesRouter = express.Router()
const bodyParser = require("body-parser")

saucesRouter.use(bodyParser.json())
saucesRouter.use(authenticateUser)

saucesRouter.get("/", getSauces) //renvoie toutes les sauces de l'application lorsqu'un GET est reçu sur cette route
saucesRouter.post("/", upload.single("image"), createSauce) //crée une nouvelle sauce lorsqu'un POST est reçu sur cette route
saucesRouter.get("/:id", getSauceById) //renvoie une sauce spécifique lorsqu'un GET est reçu sur cette route
saucesRouter.delete("/:id", deleteSauce) //supprime une sauce spécifique lorsqu'un DELETE est reçu sur cette route
saucesRouter.put("/:id", upload.single("image"), modifySauce) //modifie une sauce spécifique lorsqu'un PUT est reçu sur cette route
saucesRouter.post("/:id/like", likeSauce)

module.exports = { saucesRouter }


