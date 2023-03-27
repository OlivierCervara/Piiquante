const { app, express } = require("./server")
const port = 3000 //numéro de port sur lequel l'application écoutera les connexions entrantes.
const path = require("path") //le module path qui permet de manipuler les chemins de fichiers.

// Connection to Database
require("./mongo") //connexion à la base de données MongoDB à partir du fichier mongo.js.

// Controllers
const { createUser, logUser } = require("./controllers/user")
const { getSauces, createSauce, getSaucesById, deleteSauce, modifySauce } = require("./controllers/sauces")

// Middlewares
const { upload } = require("./middleware/multer")
const { authenticateUser } = require("./middleware/auth")

// Routes
app.post("/api/auth/signup", createUser) //définit la création d'un nouvel utilisateur lorsqu'un POST est reçu sur cette route.
app.post("/api/auth/login", logUser) //définit la connexion d'un utilisateur lorsqu'un POST est reçu sur cette route.

app.get("/api/sauces", authenticateUser, getSauces) //renvoie toutes les sauces de l'application lorsqu'un GET est reçu sur cette route
app.post("/api/sauces", authenticateUser, upload.single("image"), createSauce) //crée une nouvelle sauce lorsqu'un POST est reçu sur cette route
app.get("/api/sauces/:id", authenticateUser, getSaucesById) //renvoie une sauce spécifique lorsqu'un GET est reçu sur cette route
app.delete("/api/sauces/:id", authenticateUser, deleteSauce) //supprime une sauce spécifique lorsqu'un DELETE est reçu sur cette route
app.put("/api/sauces/:id", authenticateUser, upload.single("image"), modifySauce) //modifie une sauce spécifique lorsqu'un PUT est reçu sur cette route

// Listen
app.use("/images", express.static(path.join(__dirname, "images"))) //pour servir les fichiers images statiques à partir d'un dossier nommé "images"
app.listen(port, () => console.log("Listening on port " + port)) //lance le serveur sur le port spécifié


