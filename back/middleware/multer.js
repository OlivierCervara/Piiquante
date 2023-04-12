const multer = require("multer")

const storage = multer.diskStorage({ // la variable "storage" est définie comme un objet de configuration Multer qui définit où stocker les images téléchargées et comment les renommer
    destination: "images/", // Indique ou les images telechargees doivent etre stockees.
    filename: function (req, file, cb) { // Permet de renommer les images telechargees
        cb(null, makeFilename(req, file))
    }
})

function makeFilename(req, file){ // renvoie un nom de fichier unique en combinant la date courante avec le nom original du fichier
    const fileName = `${Date.now()}-${file.originalname}`.replace(/\s/g, "-" ) // La méthode replace() remplace tous les espaces par des tirets pour éviter les problèmes avec les noms de fichiers contenant des espaces
    file.fileName = fileName // e nom de fichier généré est stocké comme une propriété du fichier avant d'être retourné.
    return fileName
}
const upload = multer({ storage })

module.exports = {upload}
