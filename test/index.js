// Express
const express = require("express");
const port = 3000;
const app = express();
const cors = require("cors");
require('dotenv').config();

app.setMaxListeners = Infinity;
const session = require("express-session"); //insert express-session



// Routes
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");

// Middleware
app.use(express.json());
app.use(
    session({
        secret: "hello world",
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 1000 * 60 * 60 * 24 }
    })
)
app.use(cors({origin: "*" , methods: ["GET","POST","PUT","DELETE"]}));
app.use("/account", authRoutes);
app.use(userRoutes);


// Listen Port
app.listen(port, () => {
    console.log("Listening on port " + port);
});