const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const morgan = require("morgan");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");
const passport = require("passport");
const session = require("express-session"); // express-session and connect-mongo is used to persist session storage in DB
const MongoStore = require("connect-mongo");
const connectDB = require("./config/db");

// Load config
dotenv.config({ path: "./config/config.env" });

// Passport config
require("./config/passport")(passport);
connectDB();

const app = express();

// Logging
if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
}

// Handlebars
app.engine(".hbs", exphbs({ defaultLayout: "main", extname: ".hbs" }));
app.set("view engine", ".hbs");
// passport middleware
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    //  Forces the session to be saved back to the session store, even if the session was never modified during the request
    saveUninitialized: false,
    //  Forces a session that is "uninitialized" to be saved to the store. A session is uninitialized when it is new but not modified.
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Static folder - stores all static files like images styles
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/stories", require("./routes/stories"));

const PORT = process.env.PORT || 3000;
app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
