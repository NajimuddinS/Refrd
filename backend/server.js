const express = require("express");
require("dotenv").config();
const cors = require('cors');

const MongoDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const candidateRoutes = require('./routes/candidateRoutes');



const app = express();

const corsOptions = {
  origin: ['http://localhost:5173', 'https://refrd.vercel.app'], // Add all allowed origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200 // For legacy browser support
};

app.use(express.json());
app.use("/api/users", userRoutes);
app.use('/api/candidates', candidateRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  MongoDB();
  console.log(`running on ${PORT}`);
});
