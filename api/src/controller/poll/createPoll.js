const db = require("../../db")
const Poll = require("../../models/poll")
const uniqueID = require("../../utils/uniqueID")

const createPoll = (req, res) => {
    const {title, options, expiry, limit_IP} = req.body;

    if(title === undefined || options === undefined || expiry === undefined || limit_IP === undefined){
        return res.status(400).json({
            status: "error",
            message: "Missing required parameters",
        });
    }

    db.sync().then(()=>{
            return Poll.create({
            id: uniqueID(16),
            api_key: uniqueID(16),
            title,
            options,
            expiry,
            limit_IP,
        });
    }).then(poll => {
        return res.status(200).json({
            status: 'success',
            data: poll,
        });
    }).catch(err => {
        return res.status(500).json({
            status: 'error',
            message: err,
        });
    });
};

module.exports = createPoll;
