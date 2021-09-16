const db = require("../db")
const Sequelize = require("sequelize")

const Poll = db.define("poll", {
    id: {primaryKey: true, type: Sequelize.STRING},
    api_key: Sequelize.STRING,
    title: Sequelize.STRING,
    options: Sequelize.ARRAY(Sequelize.STRING),
    expiry: Sequelize.BIGINT,
    limit_IP: Sequelize.BOOLEAN,
})

module.exports = Poll;
