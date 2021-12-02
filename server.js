import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = 3003;

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET || "secret",
  })
);

// const users = [
//   {
//     username: "ja",
//     firstName: "James",
//     lastName: "Anderson",
//     email: "ja@mail.com",
//   },
//   {
//     username: "ac",
//     firstName: "Ashley",
//     lastName: "Cartwright",
//     email: "ac@mail.com",
//   },
// ];

const users = [
  {
    username: "anonymousUser",
    firstName: "Anonymous",
    lastName: "User",
    accessGroups: "loggedOutUsers",
  },
  {
    username: "jj",
    firstName: "James",
    lastName: "JustSignedUpton",
    accessGroups: "loggedInUsers,notApprovedUsers",
  },
  {
    username: "aa",
    firstName: "Ashley",
    lastName: "Approvedmemberton",
    accessGroups: "loggedInUsers, members",
  },
  {
    username: "kc",
    firstName: "Kyle",
    lastName: "ContentEditorton",
    accessGroups: "loggedInUsers, members, contentEditors",
  },
  {
    username: "ma",
    firstName: "Mindy",
    lastName: "Administraton",
    accessGroups: "loggedInUsers, members, admins",
  },
];

app.post("/login", (req, res) => {
  const username = req.body.username;
  //   const password = req.body.password;
  const user = users.find((user) => user.username === username);
  if (user) {
    req.session.user = user;
    req.session.save();
    res.send(user);
  }
});

// app.get("/currentuser", (req, res) => {
//   if (req.session.user) {
//     res.send(req.session.user);
//   } else {
//     res.status(500).send("bad access");
//   }
// });
app.get("/currentuser", (req, res) => {
  let user = req.session.user;
  if (!user) {
    user = users.find((user) => user.username === "anonymousUser");
  }
  res.json(user);
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  const user = users.find((user) => user.username === "anonymousUser");
  res.json(user);
});

app.listen(PORT, (req, res) => {
  console.log(`API listening on port http://localhost:${PORT}`);
  console.log(`                      http://localhost:${PORT}/currentuser`);
  console.log(`                      http://localhost:${PORT}/logout`);
  console.log(`                      http://localhost:${PORT}/login/anonymousUser`);
  console.log(`                      http://localhost:${PORT}/login/kc`);
});
