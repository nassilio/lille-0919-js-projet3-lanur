require("dotenv").config();

const backend = process.env.REACT_APP_BACKEND;
const twitch_Client_ID = process.env.REACT_APP_TWITCH_CLIENT_ID;
const twitch_Authorization_token = process.env.REACT_APP_TWITCH_AUTHORIZATION_TOKEN

export { backend, twitch_Client_ID, twitch_Authorization_token };

