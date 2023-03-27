const jwt = require("jsonwebtoken") //pour créer et vérifier des jetons d'authentification.

/**
 * 
 * @param {object} req - L'objet requête contenant des informations sur la requête HTTP.
 * @param {object} res - L'objet réponse contenant des informations sur la réponse HTTP.
 * @param {function} next - La fonction à appeler si l'utilisateur est authentifié.
 * @returns {void}
 */
function authenticateUser(req, res, next) {
    console.log(authenticateUser)
    const header = req.header("Authorization") // Récupère la valeur de l'en-tête Authorization à partir de la requête HTTP.
    if (header == null) return res.status(403).send({ message: "Invalid"})
    
    const token = header.split(" ")[1] //Récupère le jeton d'authentification à partir de l'en-tête en supprimant le préfixe Bearer.
    if (token == null) return res.status(403).send({ message: "token cannot be null"})

    jwt.verify(token, process.env.JWT_PASSWORD, (err, decoded) => { //Vérifie si le jeton est valide en utilisant la méthode verify du module jsonwebtoken. Si le jeton est valide, la fonction next est appelée pour permettre à l'utilisateur d'accéder à la ressource demandée.
        if (err) return res.status(403).send({ message: "Token Invalid" + err})
        console.log("le token est bien valide, on continue")
        next()
    })
}

module.exports = { authenticateUser }