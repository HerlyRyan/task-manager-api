const express = require("express");
const router = express.Router();

const { login, createTask } = require("./handler");

router.post('/login', login)
router.post('/createTask', createTask)


module.exports = router