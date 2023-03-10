const express = require('express');
const cors = require('cors');
const fs = require('fs');
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const mysql = require("mysql2");
const routerUser = require('./routes/users');
const connection = require('./config/db');
const port = 8000;

const server = express();
// middleware
server.use(cors());
server.use(express.json());

server.use('/api/user/', routerUser)

server.post('/signup',(req, res) => {
    
});

server.post("/signin", (req, res) => {
    const { email, password } = req.body;
    console.log(email)
    connection.query(`SELECT name, password FROM user WHERE email='${email}' AND password='${password}'`,(err,result)=>{
        if(err){
            console.log(err)
            res.status(401).json({ message: "Алдаа гарлаа."});
            return;
        }

        const findUser = result[0];
       if(!findUser) {
        res.status(401).json({ message: "Ийм хэрэглэгч олдсонгүй"});
        return;
        }

        res.status(200).json({ message: "Амжилттай нэвтэрлээ.", user: findUser });
       
    });


    // if (!findUser) {
       
    // }
    // const isCheck = bcrypt.compareSync(password, findUser.password);
    // if (isCheck) {
    //     res.status(200).json({ message: "Амжилттай нэвтэрлээ.", user: findUser });
    // }else{
    //     res
    //        .status(401)
    //        .json({ message: "Имэйл эсвэл нууц үг буруу байна.", user: null });
    // }
});
   
  server.listen(port, () => {
    console.log(`Server is running at ${port}`);
  });

  

