//requiressss
const express = require("express");
const app = new express();

const ejs = require("ejs");
app.set("view engine", "ejs");

app.use(express.static("public"));

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const mongoose = require("mongoose");
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB Connection Successful!"));

const expressSession = require("express-session");
app.use(
  expressSession({
    secret: "keyboard cat",
  })
);

global.loggedIn = null;
app.use("*", (req, res, next) => {
  loggedIn = req.session.userId;
  next();
});

const flash = require("connect-flash")
app.use(flash())

const mainController = require("./controllers/mainPage");
app.get("/", mainController);

const loginController = require("./controllers/loginPage");
app.get("/login", loginController);

const verifier = require("./controllers/loginUser");
app.post("/users/login", verifier);

const validmiddleware = require("./middleware/validmiddleware");
const userProfilePage = require("./controllers/userProfile");
app.get("/user/profile", validmiddleware, userProfilePage);

const worker_login = require("./controllers/adminLoginController");
app.get("/worker_login", worker_login);

const adminVerifier = require("./controllers/adminLoginVerify");
app.post("/admin_store/login", adminVerifier);

const adminPage = require("./controllers/adminPage");
app.get("/adminPage/verified", adminPage);

const registerController = require("./controllers/sign_upPage.js");
app.get("/sign_up", registerController);

const useradder = require("./controllers/newUser");
app.post("/user/store", useradder);

// const registration = require("./controllers/registration");
const Center = require("./models/center");
app.get("/registration", async (req, res) => {
  const center = await Center.find({});
  // console.log(center);
  res.render("registration", {center} );
});

const van_system = require("./controllers/van_system");

app.get("/van_system", van_system);

app.use((req, res) => res.render("notfound"));

app.listen(process.env.PORT || 3000, () => {
  console.log("server Running");
});
