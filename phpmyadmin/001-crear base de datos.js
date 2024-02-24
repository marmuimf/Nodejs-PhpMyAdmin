//me conecto a mysql
var mysql = require('mysql')
// npm install mysql

var conexion = mysql.createConnection({
    host:"localhost",
    user:"nodejs",
    password:"nodejs"
});

conexion.connect(function(err){
    if(err) throw err;
    console.log("conectado")
    
    //creo una base de datos
    conexion.query('CREATE DATABASE nodejs',function(err,result){
        if(err) throw err;
        console.log("Se ha creado la base de datos")
    })
})
