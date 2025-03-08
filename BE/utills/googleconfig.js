const { google } = require("googleapis");
require("dotenv").config();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

console.log("GOOGLE_CLIENT_ID:", GOOGLE_CLIENT_ID); // Debug
console.log("GOOGLE_CLIENT_SECRET:", GOOGLE_CLIENT_SECRET);

const oAuth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  "http://localhost:5173" // Frontend redirect URI
);
console.log("oAuth2Client:", GOOGLE_CLIENT_ID); // Debug
console.log("oAuth2Client Secret:", GOOGLE_CLIENT_SECRET); // Debug
module.exports = {
  oAuth2Client,
};