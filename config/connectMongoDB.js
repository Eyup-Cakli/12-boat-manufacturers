const mongoose = require("mongoose");

const dbURI =
  "mongodb+srv://vanemar:v4N3-m4r@boat-manufacturers.rzeeobh.mongodb.net/?retryWrites=true&w=majority";
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
};

module.exports.connectMongoDB = () => {
  mongoose
    .connect(dbURI, options)
    .then(() => console.log("Database connected."))
    .catch((err) => console.error("Database connection error: ", err));
};