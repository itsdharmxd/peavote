const express = require("express");

const {
    createPoll,
    deletePoll,
    getPoll,
    updatePoll,
    votePoll
} = require("../controller/poll");

const router = express.Router();


router.post("/", createPoll)
router.delete("/:id", deletePoll)
router.get("/:id", getPoll)
router.put("/:id", updatePoll)
router.put("/:id/vote", votePoll)
