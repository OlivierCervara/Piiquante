const multer = require("multer")

const storage = multer.diskStorage({
    destination: "images/", //Indique ou les images telechargees doivent etre stockees.
    filename: function (req, file, cb) { //Permet de renommer les images telechargees
        cb(null, makeFilename(req, file))
    }
})

function makeFilename(req, file){
    console.log("req, file: ", file)
    const fileName = `${Date.now()}-${file.originalname}`.replace(/\s/g, "-" )
    file.fileName = fileName
    return fileName
}
const upload = multer({ storage })

module.exports = {upload}