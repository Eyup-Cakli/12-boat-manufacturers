const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { connectMongoDB } = require("./config/connectMongoDB.js");
const boatManufacturerRoute = require("./routes/boatManufacturerRoute.js");
const boatTypeRoute = require("./routes/boatTypeRoute.js");
const boatModelRoute = require("./routes/boatModelRoute.js");
const boatManufacturerLogoRoute = require("./routes/boatManufacturerLogoRoute.js");

const app = express();
const port = 3000;

// middlewares
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true }));
app.use(express.json());
app.use(cookieParser());
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
})

// database connection
connectMongoDB();

//routes
app.get('/', (req, res) => res.send('main page.'));

app.use(boatManufacturerRoute);
app.use(boatTypeRoute);
app.use(boatModelRoute);
app.use(boatManufacturerLogoRoute);

app.listen(port, () => {
    console.log(`listening on ${port}`)
});