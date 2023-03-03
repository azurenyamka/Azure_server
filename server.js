const express = require('express');
const cors = require('cors');
const fs = require('fs');
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const mysql = require("mysql2");



const port = 8000;

const server = express();
server.use(cors());
server.use(express.json());

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "azure_db",
});

server.put('/:id', (req, res)=>{
    let lastname = req.body.ovog,
        {id} = req.params;
    connection.query(`UPDATE azure_user SET ovog="${lastname}" WHERE aid=${id}`,(err, result)=>{
        if(err){
            res.status(400).json({message: err.message });
        }

        res.status(200).json({ message: " AZURE SERVER : Хүсэлт амжилттай",
        data: result});
    });
});

server.post('/', (req, res)=>{
    let lastname = req.body.ovog,
        firstname = req.body.name,
        id = req.body.aid;
    connection.query(`INSERT INTO azure_user ( aid, name, ovog)  VALUES ("${lastname}", ${id}, "${firstname}")`, (err, result)=>{
        if(err){
            res.status(400).json({message: err.message});
        }
        
        res.status(200).json({message: "AZURE SERVER : Succesful",
        data: result});
    });    
        
});

server.delete

server.get('/', async (req, res)=>{
    connection.query("SELECT * FROM azure_user",(err, result)=>{
        if(err){
            res.status(400).json({message: err.message });
        }

        res.status(200).json({ message: " AZURE SERVER : Хүсэлт амжилттай",
        data: result});
    });
});
server.get('/:id', async (req, res)=>{
    const { id } = req.params;
    connection.query(`SELECT * FROM azure_user WHERE aid=${id}`,(err, result)=>{
        if(err){
            res.status(400).json({message: err.message });
        }

        res.status(200).json({ message: " AZURE SERVER : Хүсэлт амжилттай",
        data: result});
    });
});
server.post('/signup',(req, res) => {
    const { name, role, email, password } = req.body;
    const data = fs.readFileSync("users.json", "utf-8");
    const parsedData = JSON.parse(data);
    const id = uuidv4();
    const salted = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salted);
    console.log(hashedPassword);

    const newUser = {
        id,
        name,
        role,
        email,
        password: hashedPassword,
    };

    parsedData.users.push(newUser);
    fs.writeFileSync("users.json", JSON.stringify(parsedData));

    res.status(201).json({message: "Шинэ хэрэглэгчийг амжилттай бүртгэлээ."});

});

server.post("/signin", (req, res) => {
    const { id, email, password } = req.body;
    const data = fs.readFileSync("users.json", "utf-8");
    const parsedData = JSON.parse(data);
    const findUser = parsedData.user.find((user) => user.id === id);
    if (!findUser) {
        res.status(401).json({ message: "Ийм хэрэглэгч олдсонгүй."});
    }
    const isCheck = bcrypt.compareSync(password, findUser.password);
    if (isCheck) {
        res.status(200).json({ message: "Амжилттай нэвтэрлээ.", user: findUser });
    }else{
        res
           .status(401)
           .json({ message: "Имэйл эсвэл нууц үг буруу байна.", user: null });
    }
});
server.get("/users", (req, res) => {
    fs.readFile("users.json", "utf-8", (err, data) => {
        if(err) {
            console.log("Файл уншихад алдаа гарлаа. !!!");
        }
    })
    fs.readFile("users.json", "utf-8", (err, data) => {
        if(err) {
            console.log("Файл уншихад алдаа гарлаа.!!!");
            return;
        }
        console.log(data);
        const parsedData = JSON.parse(data);
        res.status(201).json({ users: parsedData.users });
    });
});    
server.get("/users/:id", (req, res) => {
    const { id } = req.params;
    const data = fs.readFileSync("users.json", "utf-8");
    const parsedData = JSON.parse(data);
    const user = parsedData.users.find((el) => el.id === id);
    res.status(200).json({ user });
  });
  
  server.put("/users/:id", (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const data = fs.readFileSync("users.json", "utf-8");
    const parsedData = JSON.parse(data);
    const findIndex = parsedData.users.findIndex((el) => el.id === id);
    parsedData.users[findIndex].name = name;
    fs.writeFileSync("users.json", JSON.stringify(parsedData));
    res
      .status(201)
      .json({ message: "Шинэ хэрэглэгчийн өгөгдөл амжилттай солигдлоо." });
  });
  
  server.delete("/users/:id", (req, res) => {
    const { id } = req.params;
    const data = fs.readFileSync("users.json", "utf-8");
    const parsedData = JSON.parse(data);
    const findIndex = parsedData.users.findIndex((el) => el.id === id);
    parsedData.users.splice(findIndex, 1);
    fs.writeFileSync("users.json", JSON.stringify(parsedData));
    res
      .status(201)
      .json({ message: `${id} тай хэрэглэгч амжилттай устгагдлаа.` });
  });
  
  server.listen(port, () => {
    console.log(`Server is running at ${port}`);
  });

  

