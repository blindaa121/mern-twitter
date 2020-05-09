const express = require("express");
const mongoose = require('mongoose');
const port = process.env.PORT || 5000;
const app = express();
const db = require('./config/keys').mongoURI;
const users = require("./routes/api/users");
const tweets = require("./routes/api/tweets");

mongoose
    .connect(db, { useNewUrlParser: true })
    .then(() => console.log("Connected to MongoDB successfully"))
    .catch(err => console.log(err));

app.get("/", (req, res) => res.send("MERN Twitter"));
app.listen(port, () => console.log(`Server is running on port ${port}`));

// users and tweets routes
app.use("/api/users", users);
app.use("/api/tweets", tweets);