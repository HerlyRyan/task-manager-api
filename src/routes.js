const express = require("express");
const router = express.Router();

const login = require("./handler");

router.post('/login', login)