const dotenv = require('dotenv');
const path = require('path');

dotenv.load({ path: path.join(__dirname, '../.env') });

const mustExist = (name) => {
  if (!process.env[name]) {
    console.log(`${name} is not defined but is mandatory.`);
    console.log('Exiting...');
    return process.exit(1);
  }
  return process.env[name];
};

const ENV = {
  // mongo url
  MONGO_URL: mustExist('NHS_LOOKUP_MONGO_URL'),

  // server details
  SERVER_PORT: process.env.NHS_LOOKUP_SERVER_PORT,

};

module.exports = {
  db: { url: ENV.MONGO_URL },
  // user auth
  server: { port: ENV.SERVER_PORT },
};
