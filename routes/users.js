const { Router } = require("express");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

const router = Router();

router.get("/", (req, res) => {
  fs.readFile("users.json", "utf-8", (err, data) => {
    if (err) {
      console.log("Файл уншихад алдаа гарлаа. !!!");
      return;
    }
    console.log(data);
    const parsedData = JSON.parse(data);
    res.status(201).json({ users: parsedData.users });
  });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  const data = fs.readFileSync("users.json", "utf-8");
  const parsedData = JSON.parse(data);
  const user = parsedData.users.find((el) => el.id === id);
  res.status(200).json({ user });
});

module.exports = router;
