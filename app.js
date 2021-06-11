/**
 * @description      :
 * @author           :
 * @group            :
 * @created          : 09/06/2021 - 18:32:46
 *
 * MODIFICATION LOG
 * - Version         : 1.0.0
 * - Date            : 09/06/2021
 * - Author          :
 * - Modification    :
 **/
//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const ejs = require("ejs");
const encrypt = require("mongoose-encryption");
const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
// mongo connect and mongoose schema
mongoose.connect("mongodb://localhost:27017/userDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
});

// database encryption

userSchema.plugin(encrypt, {
    secret: process.env.SECRET,
    encryptedFields: ["password"],
});

const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res) {
    res.render("home");
});
app.get("/login", function(req, res) {
    res.render("login");
});
app.get("/register", function(req, res) {
    res.render("register");
});

app.post("/register", function(req, res) {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password,
    });

    newUser.save(function(err) {
        if (err) {
            console.log(err);
        } else {
            res.render("secrets");
        }
    });
});
app.post("/login", function(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ email: username }, function(err, foundUser) {
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {
                if (foundUser.password === password) {
                    res.render("secrets");
                } else {
                    console.log("invalid password");
                }
            } else {
                console.log("user not found");
            }
        }
    });
});

app.listen(3000, function() {
    console.log("server has started succesfully");
    6;
});