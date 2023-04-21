const express = require("express") // la librairie Express.js qui va nous permettre de créer les routes
const { getSauces, createSauce, getSauceById, deleteSauce, modifySauce, likeSauce } = require("../controllers/sauces") // On importe les fonctions de manipulation des sauces définies dans le fichier ../controllers/sauces.js.
const { authenticateUser } = require("../middleware/auth") // On importe la fonction d'authentification pour s'assurer que seules les utilisateurs authentifiés peuvent accéder aux routes.
const { upload } = require("../middleware/multer") // On importe la fonction d'upload de fichiers pour traiter les images des sauces.
const saucesRouter = express.Router() // On crée un nouvel objet Router pour définir nos routes.
const bodyParser = require("body-parser") // pour faciliter l'analyse des données du corps des requêtes.

saucesRouter.use(bodyParser.json()) // On utilise body-parser pour analyser les données des requêtes avec un format JSON.

saucesRouter.get("/", authenticateUser, getSauces)  // Cette route utilise l'authentification de l'utilisateur pour vérifier que l'utilisateur a le droit de voir les sauces.
saucesRouter.post("/", authenticateUser, upload.single("image"), createSauce) // Cette route utilise l'authentification de l'utilisateur pour s'assurer que seuls les utilisateurs authentifiés peuvent créer de nouvelles sauces. Elle utilise également le middleware d'upload de fichiers multer pour gérer les images.
saucesRouter.get("/:id", authenticateUser, getSauceById) //  Cette route utilise l'authentification de l'utilisateur pour s'assurer que seuls les utilisateurs authentifiés peuvent accéder à cette ressource.
saucesRouter.delete("/:id", authenticateUser, deleteSauce) // Cette route utilise l'authentification de l'utilisateur pour s'assurer que seuls les utilisateurs authentifiés peuvent supprimer cette ressource.
saucesRouter.put("/:id", authenticateUser, upload.single("image"), modifySauce) // Cette route utilise l'authentification de l'utilisateur pour s'assurer que seuls les utilisateurs authentifiés peuvent modifier cette ressource. Elle utilise également le middleware d'upload de fichiers multer pour gérer les images.
saucesRouter.post("/:id/like", authenticateUser, likeSauce) // Cette route utilise l'authentification de l'utilisateur pour s'assurer que seuls les utilisateurs authentifiés peuvent liker ou disliker

module.exports = { saucesRouter }