const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');

router.get("/test", (req, res) => res.json({ msg: "This is the users route" }));

// USER REGISTER FUNCTIONALITY
router.post('/register', (req, res) => {

    User.findOne({ handle: req.body.handle })
        .then(user => {
            if (user) {
            return res.status(400).json({handle: "A user has already registered with that username"});
            } else {
                // Otherwise create a new user 
                const newUser = new User({
                    handle: req.body.handle,
                    email: req.body.email,
                    password: req.body.password
                })
                // Don't want to store the password in plain text, hash it out with bcrypt
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser
                            .save()
                            .then(user => {
                                const payload = { id: user.id, handle: user.handle };

                                jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
                                    res.json({
                                        success: true,
                                        token: "Bearer" + token
                                    });
                                });
                            })
                            .catch(err => console.log(err));
                    });
                });
            }
            
        });
});

// USER LOGIN FUNCTIONALITY
router.post('/login', (req, res) => {
    const handle = req.body.handle;
    const password = req.body.password;

    User.findOne({ handle })
        .then(user => {
            if (!user) {
                return res.status(400).json({handle: 'User does not exist.'})
            }

            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        const payload = { id: user.id, handle: user.handle }
                        // res.json({ msg: 'Success' });
                        jwt.sign(
                            payload,
                            keys.secretOrKey,
                            // Tell the key to expire in one hour
                            { expiresIn: 3600 },
                            (err, token) => {
                                res.json({
                                    success: true,
                                    token: 'Bearer ' + token
                                });
                            });
                    } else {
                        return res.status(400).json({password: 'Incorrect password.'});
                    }
                });
        });
});

module.exports = router;