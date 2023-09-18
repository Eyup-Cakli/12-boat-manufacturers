const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { connectMongoDB } = require("./config/connectMongoDB.js");
const boatManufacturerRoute = require("./routes/boatManufacturerRoute.js");
const boatTypeRoute = require("./routes/boatTypeRoute.js");
const boatModelRoute = require("./routes/boatModelRoute.js");

const app = express();
const port = 3000;

// middlewares
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true }));
app.use(express.json());
app.use(cookieParser());

// database connection
connectMongoDB();

//routes
app.get('/', (req, res) => res.send('main page.'));

app.use(boatManufacturerRoute);
app.use(boatTypeRoute);
app.use(boatModelRoute);

app.listen(port, () => {
    console.log(`listening on ${port}`)
});