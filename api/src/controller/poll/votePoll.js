const db = require("../../db")
const Poll = require("../../models/poll")
const Vote = require("../../models/vote")

const uniqueID = require("../../utils/uniqueID")

const votePoll = (req, res) => {
    const pollID = req.params.id;
    const option = req.body.option;

    Poll.findByPk(pollID).then(poll => {
        if(Date.now() > parseInt(poll.get('expiry'))){
            return res.status(400).json({
                message: "Poll has expired."
            })
        }

        const id = poll.get('limit_IP') ? `${req.ip}-${pollID}` : uniqueID(64)

        db.sync().then(() => {
            return Vote.create({
                id, pollID, option
            })
        }).then(vote => {
            return res.status(200).json({
                status: "success",
                data: vote,
            })
        }).catch(err => {
            console.error(err);
            res.status(404).json({
                status: "error",
                error: "Could not find the poll with the supplied ID"
            })
        })
    })
}

module.exports = votePoll;
