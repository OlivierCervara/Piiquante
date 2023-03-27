const multer = require("multer")

const storage = multer.diskStorage({
    destination: "images/", //Indique ou les images telechargees doivent etre stockees.
    filename: function (req, file, cb) { //Permet de renommer les images telechargees
        cb(null, makeFilename(req, file))
    }
})

/**
 * Crée un nom de fichier unique pour un fichier téléchargé en concaténant la date actuelle avec le nom de fichier original du fichier.
 *
 * @param {Object} req - L'objet de requête HTTP pour la requête en cours.
 * @param {Object} file - L'objet de fichier pour le fichier téléchargé.
 * @returns {string} - Le nom de fichier généré pour le fichier téléchargé.
 */
function makeFilename(req, file){
    console.log("req, file: ", file)
    const fileName = `${Date.now()}-${file.originalname}`.replace(/\s/g, "-" )
    file.fileName = fileName
    return fileName
}
const upload = multer({ storage })

module.exports = {upload}