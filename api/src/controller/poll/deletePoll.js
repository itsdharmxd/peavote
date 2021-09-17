const Poll = require("../../models/poll")

const deletePoll = (req, res) => {
    const pollId = req.params.id;
    const api_key = req.headers.api_key;

    if(pollId === undefined || api_key === undefined){
        return res.status(401).json({
            status: "error",
            error: "Unauthorized for this request. Please authenticate."
        })
    }

    Poll.findByPk(pollId).then(poll => {
        const poll_api_key = poll.get('api_key')

        if(api_key !== poll_api_key){
            return res.status(401).json({
                status: "error",
                error: "Unauthorized for this request. Please authenticate."
            })
        }
    })

    Poll.destroy({where: {id: pollId}}).then(() => {
        return res.status(200).json({
            status: "success",
            message: "Poll deleted successfully."
        })
    }).catch(() => {
        res.status(500).json({
            status: "error",
            error: "Could not delete poll."
        })
    }).catch(() => {
        res.status(404).json({
            status: "error",
            error: "Could not find the poll with the supplied ID."
        })
    })
}

module.exports = deletePoll;
