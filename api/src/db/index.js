const {Sequelize} = require("sequelize");

const sequelize = new Sequelize(process.env.DATABASE_URI);

sequelize.authenticate().then(() => {
    console.log("API has connected to database successfully.")
}).catch(err => {
    console.error("API failed to connect to database.", err)
})

module.exports = sequelize;
