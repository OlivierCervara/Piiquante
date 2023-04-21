const { app, express } = require("./server")
const { saucesRouter } = require("./routers/sauces.router")
const { authRouter } = require("./routers/auth.router")
const port = 3000 //numéro de port sur lequel l'application écoutera les connexions entrantes.
const path = require("path") //le module path qui permet de manipuler les chemins de fichiers.
const bodyParser = require("body-parser") // permet de récupérer le corps d'une requête HTTP.

// Connection to Database
require("./mongo") //connexion à la base de données MongoDB à partir du fichier mongo.js.

// Middlewares
app.use(bodyParser.json())
app.use("/api/sauces", saucesRouter) // on utilise les routes définies dans les fichiers "sauces.router.js" et "auth.router.js".
app.use("/api/auth", authRouter)

// Listen
app.use("/images", express.static(path.join(__dirname, "images"))) // pour servir les fichiers images statiques à partir d'un dossier nommé "images"
app.listen(port, () => console.log("Listening on port " + port)) // on lance le serveur en écoutant les connexions entrantes sur le port spécifié et on affiche un message de confirmation sur la console.
