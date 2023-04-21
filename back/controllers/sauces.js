const mongoose = require("mongoose")
const { unlink } = require("fs/promises") // Permet de supprimer des fichiers.
const Product = require("../models/Sauce") // Definition d'un modèle pour les produits, qui utilise le schéma défini précédemment

function getSauces(req, res) { // Récupère tous les produits de la base de données et les renvoie au client.
  Product.find({})
    .then((products) => res.send(products))
    .catch((error) => res.status(400).send(error))
}

function getSauce(req, res) { // Récupère un produit spécifique de la base de données à partir de son identifiant.
  const { id } = req.params
  return Product.findById(id)
}

function getSauceById(req, res) { // Appelle "getSauce" pour récupérer un produit spécifique et renvoie une réponse au client.
  getSauce(req, res)
    .then((product) => sendClientResponse(product, res))
    .catch((err) => res.status(500).send(err))
}

function deleteSauce(req, res) { // Supprime un produit de la base de données à partir de son identifiant, supprime également l'image associée, puis renvoie une réponse au client.
  const { id } = req.params;

  Product.findByIdAndDelete(id)
  .then((product) => sendClientResponse(product, res))
  .then((item) => deleteImage(item))
  .catch((err) => res.status(500).send({ message: err }))
}

function modifySauce(req, res) { // Modifie un produit existant dans la base de données, en vérifiant que l'utilisateur a l'autorisation de le faire, en mettant à jour les champs modifiés et en supprimant l'image d'origine.
  const {
    params: { id }
  } = req

  let userId = req.body.userId ? req.body.userId : JSON.parse(req.body.sauce).userId; // permet de définir la variable userId en utilisant la valeur de req.body.userId si elle est définie, sinon en extrayant la valeur de userId depuis un objet JSON stocké dans req.body.sauce.// permet de définir la variable userId en utilisant la valeur de req.body.userId si elle est définie, sinon en extrayant la valeur de userId depuis un objet JSON stocké dans req.body.sauce.
  Product.findById(id) // Récupérer la sauce
    .then(sauce => {
      if (sauce.userId !== userId) { // Vérifier l'autorisation
        return res.status(403).send({ message: 'Requete non authoriser' })
      }

      const hasNewImage = req.file != null
      const payload = makePayload(hasNewImage, req)

      Product.findByIdAndUpdate(id, payload)
        .then((dbResponse) => sendClientResponse(dbResponse, res))
        .then((product) => deleteImage(product))
        .catch((err) => console.error("Probleme d'update", err))
    })
}

function deleteImage(product) { // Supprime l'image associée à un produit, en extrayant le nom du fichier à partir de l'URL de l'image.
  if (product == null) return
  const imageToDelete = product.imageUrl.split("/").at(-1)
  return unlink("images/" + imageToDelete)
}

function makePayload(hasNewImage, req) { // Crée un objet de données à partir des données de la requête HTTP. Si une nouvelle image est présente, l'URL de l'image est modifiée pour pointer vers le nouveau fichier.
  if (!hasNewImage) return req.body
  const payload = JSON.parse(req.body.sauce)
  payload.imageUrl = makeImageUrl(req, req.file.fileName)
  return payload
}

function sendClientResponse(product, res) { // Renvoie une réponse HTTP au client, contenant les données du produit. S'il n'y a pas de produit, la fonction renvoie une réponse d'erreur.
  if (product == null) {
    return res.status(404).send({ message: "Objet pas trouve dans la base de donnee" })
  }
  return Promise.resolve(res.status(200).send(product)).then(
    () => product
  )
}

function makeImageUrl(req, fileName) { // Crée une URL pour une image, en combinant le protocole, le nom de domaine et le chemin d'accès au fichier.
  return req.protocol + "://" + req.get("host") + "/images/" + fileName
}

function createSauce(req, res) { //  Crée un nouveau produit dans la base de données, en utilisant les données fournies dans la requête HTTP.
  const { body, file } = req
  const { fileName } = file
  const sauce = JSON.parse(body.sauce)
  const { name, manufacturer, description, mainPepper, heat, userId } = sauce

  const product = new Product({
    userId: userId,
    name: name,
    manufacturer: manufacturer,
    description: description,
    mainPepper: mainPepper,
    imageUrl: makeImageUrl(req, fileName),
    heat: heat,
    likes: 0,
    dislikes: 0,
    usersLiked: [], 
    usersDisliked: []
  })
  product.save()
    .then((message) => res.status(201).send({ message }))
    .catch((err) => res.status(500).send(err))
}


function likeSauce(req, res) { // Met à jour le compteur de "likes" ou de "dislikes" d'un produit, en fonction des données fournies dans la requête HTTP. Si le "like" n'est pas égal à 1, 0 ou -1, la fonction renvoie une réponse d'erreur.
  const { like, userId } = req.body
  if (![0, -1, 1].includes(like)) return res.status(400).send({ message: "mauvaise requete" })

  getSauce(req, res)
    .then((product) => updateVote(product, like, userId, res))
    .then((pr) => pr.save())
    .then((prod) => sendClientResponse(prod, res))
    .catch((err) => res.status(500).send(err))
}

function updateVote(product, like, userId, res) { // Vérifie si l'utilisateur a aimé ou n'a pas aimé le produit en vérifiant si like est égal à 1 ou à -1. Si tel est le cas, la fonction appelle la fonction incrementVote. Sinon, la fonction appelle la fonction resetVote
  if (like === 1 || like === -1) return incrementVote(product, userId, like)
  return resetVote(product, userId, res)
}

function resetVote(product, userId, res) { // Vérifie d'abord si l'utilisateur a voté pour le produit à la fois positivement et négativement en vérifiant si l'identifiant de l'utilisateur figure dans les tableaux usersLiked et usersDisliked de l'objet product. Si tel est le cas, la fonction renvoie une promesse rejetée avec le message
  const { usersLiked, usersDisliked } = product
  if ([usersLiked, usersDisliked].every((arr) => arr.includes(userId)))
    return Promise.reject("User seems to have voted both ways")

  if (![usersLiked, usersDisliked].some((arr) => arr.includes(userId))) // vérifie ensuite si l'utilisateur a voté pour le produit en vérifiant si l'identifiant de l'utilisateur figure dans l'un des tableaux usersLiked et usersDisliked de l'objet product. Si ce n'est pas le cas, la fonction renvoie une promesse rejetée avec le message  
    return Promise.reject("User seems to not have voted")

  if (usersLiked.includes(userId)) { // si l'utilisateur a voté pour le produit, la fonction décrémente le nombre de votes positifs ou négatifs selon le cas, et supprime l'identifiant de l'utilisateur du tableau correspondant. La fonction renvoie ensuite l'objet product mis à jour.
    --product.likes
    product.usersLiked = product.usersLiked.filter((id) => id !== userId)
  } else {
    --product.dislikes
    product.usersDisliked = product.usersDisliked.filter((id) => id !== userId)
  }

  return product
}

function incrementVote(product, userId, like) {
  const { usersLiked, usersDisliked } = product // commence par récupérer les tableaux usersLiked et usersDisliked de l'objet product.

  const votersArray = like === 1 ? usersLiked : usersDisliked // détermine ensuite le tableau correspondant au vote de l'utilisateur en fonction de la valeur de like
  if (votersArray.includes(userId)) return product // Si l'identifiant de l'utilisateur figure déjà dans le tableau correspondant, la fonction renvoie simplement l'objet product
  votersArray.push(userId)

  like === 1 ? ++product.likes : ++product.dislikes // Sinon, elle ajoute l'identifiant de l'utilisateur au tableau correspondant, incrémente le nombre de votes positifs ou négatifs selon le cas, et renvoie l'objet product mis à jour.
  return product
}
module.exports = { getSauces, createSauce, getSauceById, deleteSauce, modifySauce, likeSauce }
