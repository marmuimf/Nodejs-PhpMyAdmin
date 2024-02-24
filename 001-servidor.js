
//https://youtu.be/wYB0KFkDxxs

var servidor = require('http'); //creo una variable servidor
var archivos = require('fs');//filesystem para leer y escribir archivos
var ruta = require('url');
var procesador = require('querystring');
var mysql = require('mysql') //para conectar con mysql

//me conecto a mi base de datos
var conexion = mysql.createConnection({
    host: "localhost",
    user: "nodejs",
    password: "nodejs",
    database: "nodejs"
});

conexion.connect(function (err) {
    if (err) throw err;
    console.log("conectado")
})

servidor.createServer(function (req, res) { //creo servidor
    res.writeHead(200, { 'Content-Type': 'text/html' })
    var rutacompleta = ruta.parse(req.url, true)

    //cargo cabecera
    archivos.readFile('plantillas/cabecera.html', function (err, data) {
        res.write(data)

        switch (req.url) {
            case "/":
                archivos.readFile('home.html', function (err, data) {
                    res.write(data)
                });
                break;
            case "/aboutus":
                archivos.readFile('aboutus.html', function (err, data) {
                    res.write(data)
                });
                break;
            case "/menu": //solo se conecta a la base de datos con menu imprime contenido de mysql en html

                conexion.query(`
                SELECT * FROM drinks
            `, function (err, result, fields) {
                    if (err) throw err;
                    console.log(result)
                    for (let i = 0; i < result.length; i++) {
                        console.log(result[i])
                        res.write(`
                        <article>
                            <h4>`+ result[i].coffee + `</h4>
                            <p>`+ result[i].ingredients + `</p>
                        </article>
                    `)
                    }
                })

                break;
            case "/contact":
                archivos.readFile('contact.html', function (err, data) {
                    res.write(data)
                });
                break;
            // case "/procesa":
            //     let datos = '';
            //        req.on('data',parte=>{
            //            datos += parte.toString();
            //        })
            //        req.on('end',()=>{
            //            var cadena = datos
            //            var procesado = procesador.parse(cadena)
            //            console.log(procesado)
            //        })

            //     break;
            default:
                res.end("This site cant be reached");
        }
        //cargo pie de pagina 
        archivos.readFile('plantillas/piedepagina.html', function (err, data) {
            res.write(data)
            res.end("")
        });
    });

    //guardamos el registro de navegacion en un archivo txt
    if (req.url != "/favicon.ico") {
        var fecha = new Date();
        archivos.appendFile("registro.txt", fecha.getFullYear() + "," + fecha.getMonth() + "," + fecha.getDate() + "," + fecha.getHours() + "," + fecha.getMinutes() + "," + fecha.getSeconds() + "," + rutacompleta.host + "," + rutacompleta.pathname + "," + rutacompleta.search + "," + req.url + "\n", function (err) {
            if (err) throw err;
        })
    }

}).listen(8080)