# Piiquante 🌶


Sixième projet du parcours "Développeur web" d'OpenClassroom. L'objectif est de construire une API sécurisée.

# Technologies utilisées

 <img src="https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E" /><img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" /> </br> <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" /> <img src="https://img.shields.io/badge/MongoDB-white?style=for-the-badge&logo=mongodb&logoColor=4EA94B" />

# Contexte du projet 

Piiquante souhaite créer une application web dans laquelle les utilisateurs peuvent ajouter leurs sauces préférées et liker ou disliker les sauces ajoutées par les autres.

# API Routes 

Toutes les routes sauce pour les sauces doivent disposer d’une autorisation (le token est envoyé par le front-end avec l'en-tête d’autorisation : « Bearer <token> »). Avant que l'utilisateur puisse apporter des modifications à la route sauce, le code doit vérifier si l'userId actuel correspond à l'userId de la sauce. Si l'userId ne correspond pas, renvoyer « 403: unauthorized request. » Cela permet de s'assurer que seul le propriétaire de la sauce peut apporter des modifications à celle-ci.

# Exigences de sécurité
  
- Le mot de passe de l'utilisateur doit être haché.
- L'authentification doit être renforcée sur toutes les routes sauce requises.
- Les adresses électroniques dans la base de données sont uniques et un
plugin Mongoose approprié est utilisé pour garantir leur unicité et signaler
les erreurs.
- La sécurité de la base de données MongoDB (à partir d'un service tel que
MongoDB Atlas) ne doit pas empêcher l'application de se lancer sur la
machine d'un utilisateur.
- Un plugin Mongoose doit assurer la remontée des erreurs issues de la base
de données.
- Les versions les plus récentes des logiciels sont utilisées avec des correctifs
de sécurité actualisés.
- Le contenu du dossier images ne doit pas être téléchargé sur GitHub.
  

  
## Installation ##

Here are the dependancies you need to install:
- NodeJS 12.14 or 14.0.
- Angular CLI 7.0.2.
- node-sass : make sure to use the corresponding version to NodeJS. For Noe 14.0 for instance, you need node-sass in version 4.14+.

On Windows, these installations require to use PowerShell in administrator mode.

Then, clone this repo, run `npm install`, and run `npm run start`.

Don't forget to create .env file with these informations :
DB_PASSWORD=gmVgZ4JCpL1zq1J9
DB_USER=oliviercervara
DB_NAME=cluster0
JWT_PASSWORD=8a9e767e-9394-4992-b6de-1310ad8190d0


## Usage ##

Run `npm start`. This should both run the local server and launch your browser.

If your browser fails to launch, or shows a 404 error, navigate your browser to http://localhost:84200/login.

The app should reload automatically when you make a change to a file.

Use `Ctrl+C` in the terminal to stop the local server.
