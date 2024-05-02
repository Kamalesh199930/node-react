const express = require("express");
const users = require("./sample.json");
const cors = require("cors");
const app = express();
app.use(express.json());
const fs = require("fs");
const port = 8000;

//Display all users
app.use(cors());
app.get("/users", (req, res) => {
    return res.json(users);
});
//Delete User Detail
app.delete("/users/:id", (req, res) => {
    let id = Number(req.params.id);
    let filteredUsers = users.filter((user) => user.id !== id);
    fs.writeFile(
        "./sample.json",
        JSON.stringify(filteredUsers),
        (err, data) => {
            return res.json(filteredUsers);
        }
    );
});
//ADD New User

app.post("/users", (req, res) => {
    let { name, age, city } = req.body;
    if (!name || !age || !city) {
        return res.status(400).send({
            message: "All Fields Required",
        });
    }
    let id = Date.now();
    users.push({ id, name, age, city });
    fs.writeFile("./sample.json", JSON.stringify(users), (err, data) => {
        return res.json({ message: "User Details added success" });
    });
});
//Update user
app.patch("/users/:id", (req, res) => {
    let id = Number(req.params.id);
    let { name, age, city } = req.body;
    if (!name || !age || !city) {
        return res.status(400).send({
            message: "All Fields Required",
        });
    }

    let index = users.findIndex((user) => user.id === id);
    if (index !== -1) {
        // If user is found, update its details
        users[index] = { ...users[index], name, age, city };
        fs.writeFile("./sample.json", JSON.stringify(users), (err, data) => {
            return res.json({ message: "User Details Updated success" });
        });
    } else {
        // If user is not found, return error
        return res.status(404).json({ message: "User not found" });
    }
});

app.listen(port, (err) => {
    console.log(`App is running in port ${port}`);
});
app.use(
    cors({
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PATCH", "DELETE"],
    })
);
