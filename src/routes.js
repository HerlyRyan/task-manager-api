const express = require("express");
const router = express.Router();

const { login, createTask, getTasks } = require("./handler");

router.post('/login', login)
router.post('/create-task', createTask)
router.get('/get-task', getTasks)


module.exports = router