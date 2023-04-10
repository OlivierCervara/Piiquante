const jwt = require("jsonwebtoken") //pour créer et vérifier des jetons d'authentification.

function authenticateUser(req, res, next) {
    const header = req.header("Authorization")
    if (header == null) return res.status(403).send({ message: "Invalid" })
    
    const token = header.split(" ")[1]
    if (!token) {
        res.status(403).send({ message: "Invalid" })
    }

    jwt.verify(token, process.env.JWT_PASSWORD, (err, decoded) => {
        if (err) return res.status(403).send({ message: "Token invalid " + err })
        next()
    })
}

module.exports = { authenticateUser }
