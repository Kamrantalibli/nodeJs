// Express
const express = require("express");
const port = 3000;
const app = express();
const cors = require("cors");

// Routes
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");

// Middleware
app.use(express.json());
app.use(cors({origin: "*" , methods: ["GET","POST","PUT","DELETE"]}));
app.use("/account", authRoutes);
app.use(userRoutes);


// Listen Port
app.listen(port, () => {
    console.log("Listening on port " + port);
});