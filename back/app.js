const { app, express } = require("./server")
const { saucesRouter } = require("./routers/sauces.router")
const { authRouter } = require("./routers/auth.router")
const port = 3000 //numéro de port sur lequel l'application écoutera les connexions entrantes.
const path = require("path") //le module path qui permet de manipuler les chemins de fichiers.
const bodyParser = require("body-parser")

// Connection to Database
require("./mongo") //connexion à la base de données MongoDB à partir du fichier mongo.js.

// Middlewares
app.use(bodyParser.json())
app.use("/api/sauces", saucesRouter)
app.use("/api/auth", authRouter)

// Listen
app.use("/images", express.static(path.join(__dirname, "images"))) //pour servir les fichiers images statiques à partir d'un dossier nommé "images"
app.listen(port, () => console.log("Listening on port " + port)) //lance le serveur sur le port spécifié


