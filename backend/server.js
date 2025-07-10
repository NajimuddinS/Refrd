const express = require("express");
require("dotenv").config();
const cors = require('cors');

const MongoDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const candidateRoutes = require('./routes/candidateRoutes');



const app = express();

app.use(cors({
  origin: true, // Allow only your frontend origin
  credentials: true // If you're using cookies/sessions
}));
app.use(express.json());
app.use("/api/users", userRoutes);
app.use('/api/candidates', candidateRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  MongoDB();
  console.log(`running on ${PORT}`);
});
