const connection = require('../config/db')

exports.getUser = (req, res, next ) => {
    
    const {id} = req.params;  
    const query = `SELECT * FROM user WHERE id = ?`;
    connection.query(query, [id], (err, result) => {
        if(err) {
            res.status(400).json({
                err,
                succesful : false
            })
            return;
        }
        res.status(200).json({
            succesful : true,
            data : result
            
        })
    })
};
exports.getAllUsers = (req, res, next) => {
    const query = `SELECT * FROM user`;
    connection.query(query, (err, result) => {
        if(err) {
            res.status(400).json({
                err,
                succesful: false
            })
            return;
        }
        res.status(200).json({
            succesful: true,
            data: result
        })
    })
};
exports.createUser = (req, res, next) => {
    const {name, email, password} = req.body;
    const query = `INSERT INTO user ( name, email, password) VALUES (?, ?, ?)`;
    
    connection.query(query, [name, email, password], (err, result) => {
        if(err) {
            res.status(400).json({
                err,
                succesful : false
            })
            return;
        }
        res.status(200).json({
            succesful : true,
            data : result
        })
    })
};