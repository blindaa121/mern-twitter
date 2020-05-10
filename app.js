const express = require("express");
const mongoose = require('mongoose');
const port = process.env.PORT || 5000;
const app = express();
const db = require('./config/keys').mongoURI;
const passport = require('passport');

mongoose
    .connect(db, { useNewUrlParser: true })
    .then(() => console.log("Connected to MongoDB successfully"))
    .catch(err => console.log(err));

app.listen(port, () => console.log(`Server is running on port ${port}`));

//parse the JSON for the frontend
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// users and tweets routes
const users = require("./routes/api/users");
const tweets = require("./routes/api/tweets");
app.use("/api/users", users);
app.use("/api/tweets", tweets);

//passport 
app.use(passport.initialize());
require('./config/passport')(passport);