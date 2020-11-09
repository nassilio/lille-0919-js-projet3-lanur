require("dotenv").config();

const mysql = require("mysql");

let CONFIG = {
  backendPort: process.env.BACKEND_PORT || "4200",
  jwtSecret: process.env.JWT_SECRET || "jwt_please_change",
  saltRounds: process.env.SALT_ROUNDS || "10",
  jwtExpiration: process.env.JWT_EXPIRATION || "10000"
};

const db = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST || "example.org", // adresse du serveur
  user: process.env.DB_USER || "bob", // le nom d'utilisateur
  password: process.env.DB_PASSWORD || "secret", // le mot de passe
  database: process.env.DB_DATABASE || "my_db" // le nom de la base de données
});

const cloudinary = require("cloudinary");
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME || "cloud_name",
  api_key: process.env.API_KEY || "api_key",
  api_secret: process.env.API_SECRET || "api_secret"
});

module.exports = {
  CONFIG,
  db,
  cloudinary
};
