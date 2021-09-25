const {Sequelize} = require("sequelize");
const keys = require("./keys")

const sequelize = new Sequelize(`postgres://${keys.pgUser}:${keys.pgPassword}@${keys.pgHost}:${keys.pgPort}/${keys.pgDatabase}`);

sequelize.authenticate().then(() => {
    console.log("API has connected to database successfully.")
}).catch(err => {
    console.error("API failed to connect to database.", err)
})

module.exports = sequelize;
