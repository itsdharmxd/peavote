const db = require("../../db")
const Poll = require("../../models/poll")
const {QueryTypes} = require("sequelize")

const getPoll = (req, res) => {
    const pollID =  req.params.id;

    if(pollID === undefined){
        return res.status(400).json({
            status: "error",
            error: "Invalid request."
        })
    }

    Poll.findByPk(pollID).then(poll => {
        const title = poll.get('title');
        const options = poll.get('options');
        const createdAt = poll.get('createdAt');
        const expiry = poll.get('expiry');

        let query = `
        SELECT option, count(option) as vote_count
        FROM votes
        WHERE "pollID = '${pollID}'
        GROUP BY option;`

        db.query(query, {type: QueryTypes.SELECT}).then(results => {
            return res.status(200).json({
                status: "success",
                data: {
                    title,
                    options,
                    createdAt,
                    expiry,
                    votes: results,
                }
            })
        }).catch(err => {
            console.err(err);
            res.status(500).json({
                status: "error",
                error: "Could not retrieve poll results."
            })
        }).catch(() => {
            res.status(404).json({
                status: "error",
                error: "Could not find the poll with the supplied ID."
            })
        })
    })
}

module.exports = getPoll;
