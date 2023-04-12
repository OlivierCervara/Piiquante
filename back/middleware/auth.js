const jwt = require("jsonwebtoken") // Pour créer et vérifier des jetons d'authentification.

function authenticateUser(req, res, next) {
    const header = req.header("Authorization") // Extrait la valeur de l'en-tête Authorization de l'objet de requête.
    if (header == null) return res.status(403).send({ message: "Invalid" }) // Si l'en-tête est nul, renvoie une erreur HTTP 403
    
    const token = header.split(" ")[1] // Extrait le jeton d'authentification à partir de l'en-tête.
    if (!token) { // Si le jeton n'est pas présent, renvoie une erreur HTTP 403
        res.status(403).send({ message: "Invalid" })
    }

    jwt.verify(token, process.env.JWT_PASSWORD, (err, decoded) => { // Vérifie la validité du jeton à l'aide de la méthode verify de jsonwebtoken. Elle prend trois arguments : le jeton d'authentification, la clé secrète pour décoder le jeton et une fonction de rappel qui est appelée avec les résultats de la vérification.
        if (err) return res.status(403).send({ message: "Token invalid " + err }) // Si la vérification échoue, renvoie une erreur HTTP 403 avec un message d'erreur.
        next() // Si la vérification réussit, appelle la fonction next pour continuer à traiter la requête.
    })
}

module.exports = { authenticateUser }
