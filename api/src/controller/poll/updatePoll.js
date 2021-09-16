const Poll = require("../../models/poll")

const updatePoll = (req, res) => {
    const pollID = req.param.id;
    const api_key = req.headers.api_key;

    const expiry = req.body.expiry;

    if(pollID === undefined || api_key === undefined || expiry === undefined){
        return res.status(400).json({
            status: "error",
            error: "Invalid request."
        })
    }

    Poll.findByPk(pollID).then(poll => {
        const poll_api_key = poll.get('api_key')

        if(api_key !== poll_api_key){
            return res.status(401).json({
                status: "error",
                error: "Unauthorized for this request. Please authenticate."
            })
        }
    })

    Poll.update({expiry}, {where: {id: pollID}}).then(() => {
        return res.status(200).json({
            status: "success",
            message: "Poll updated successfully."
        })
    }).catch(() => {
        res.status(500).json({
            status: "error",
            error: "Could not update poll."
        })
    }).catch(() => {
        res.status(404).json({
            status: "error",
            error: "Could not find the poll with the supplied ID."
        })
    })
}

module.exports = updatePoll;
