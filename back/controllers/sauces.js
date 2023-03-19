const jwt = require("jsonwebtoken")

function getSauces(req, res) {
    const header = req.header("Authorization")
    console.log("header: ", header)
    const token = header.split(" ")[1]

    if (!token) {
        res.status(403).send({ message: "Invalid"})
    }

    jwt.verify(token, process.env.JWT_PASSWORD, (err, decoded)=>handleToken(err, decoded, res))
    res.send({message: "ok voici toutes les sauces"})
}

function handleToken(err, decoded, res) {
    if (err) res.status(403).send({ message: "Token Invalid" + err.message})
    else {
        console.log("le token a l'air bon", decoded)
    }
}

module.exports = { getSauces }