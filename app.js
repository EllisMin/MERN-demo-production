const path = require('path')
const express = require("express");
const mongoose = require("mongoose");
const { MONGODB_URI } = require("./config");
const userRoutes = require("./routes/user");

const app = express();
app.use(express.json());

// Serve public folder (front-end build folder)
app.use(express.static(path.join("public")));

// Set CORS header
app.use((req, res, next) => {
  res.setHeader("Access-control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE");
  // Allow client to set headers with Content-Type
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Register Route
app.use(userRoutes);

app.use((req, res, next) => {
  res.sendFile(path.resolve(__dirname, "public", "index.html"));
});

// Error Handler
app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data; // Passing original error data
  res.status(status).json({ message: message, data: data });
});

// DB connection
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(result => {
    const port = process.env.PORT || 8080;
    app.listen(port, () => {
      console.log(`Listening on port ${port}...`);
    });
  })
  .catch(err => {
    // Handle error
  });
