const mongoose = require("mongoose");
const express = require("express");
const User = require("../models/user.js");
const asyncWrap = require("../utility/asyncWrap.js");

const app = express();
const router = express.Router();


router.get("/", (req, res)=>{
    res.render("users/signup");
});


