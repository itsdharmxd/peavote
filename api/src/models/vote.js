const db = require("../connections")
const Sequelize = require("sequelize")
const Poll = require("./poll")

const Vote = db.define("vote", {
    id: {primaryKey: true, type: Sequelize.STRING},
    option: Sequelize.STRING,
})

// foreign key relationship
Vote.belongsTo(Poll);

module.exports = Vote;
