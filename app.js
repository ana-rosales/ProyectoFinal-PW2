const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

/*instanciar*/
const app = express();
/*puerto*/
const port = 3036;

app.use(bodyParser.urlencoded({extend:false}));
//analizar los datos del cuerpo de las solicitudes HTTP
app.use(express.static('public'));
//configurar carpeta public

//motor de plantillas para html de forma dinamica
app.set('view engine','ejs');

//motor de plantillas para html de forma dinamica
app.set('view engine','ejs');

//credenciales para DB
const db = mysql.createConnection({
    host:'localhost',
    user: 'root',
    password: '',
    database: 'crud',
    port: '3306' //de la bd en mi caso xampp
});

//conexion a la DB
db.connect(err=>{
    if(err){
        console.log(`Error al momento de hacer conexiON BD: ${err}`);
    } else {
        console.log(`Conexion exitosa >:3`);
        
    }
});

//server inicio
app.listen(port,()=>{
    console.log(`El server esta en escucha desde http://localhost:${port}`);
})

//Monstrar lista de usuarios
app.get('/',(req,res)=>{
    //Consulta a la base de datos
    const query = 'SELECT * FROM user';
    //trabajar con la conexion
    db.query(query,(err,results)=>{
        if(err){
            console.error(`Error al recuperar datos -> Codigo de Error: ${err}`);
            res.send('Error en recuperar datos.');
        } else {
            res.render('index',{users:results});
        }
    });
});

////AGREGAR USUARIO////
app.get('/add',(req,res)=>{
    res.render('agregar');
});

app.post('/add',(req,res)=>{
    const {name,email} = req.body; //funcion obtener informacion por http
    const query = 'INSERT INTO user (nombre, email) VALUES(?,?)';
    db.query(query,[name,email],(err)=>{
        if(err){
            console.error(`Error al insertar en Users -> Codigo de Error: ${err}`);
            res.send('Error al guardar usuario.')
        } else {
            res.redirect('/');
        }
    });
});

///EDITAR USUARIO///
app.get('/edit/:id',(req,res)=>{
    const {id} = req.params;
    const query = 'SELECT * FROM user WHERE id = ?'
    db.query(query,[id],(err,results)=>{
        if(err){
            console.error('Error en SELECT');
            res.send('Error al editar');
        }else{
            res.render('editar',{user:results[0]});
        }
    });
});

app.post('/edit',(req,res)=>{
    const {id,name,email} = req.body; //funcion obtener informacion por http
    const query = 'UPDATE user SET nombre = ?, email = ? WHERE id = ?';
    db.query(query,[name,email,id],(err,results)=>{
        if(err){
            console.error('Error en UPDATE: ' + err);
            res.send('Error al editar');
        }else{
            res.redirect('/');
        }
    });
});

///ELIMINAR USUARIO///
app.get('/delete/:id',(req,res)=>{
    const {id} = req.params;
    const query = 'DELETE FROM user WHERE id = ?';
    db.query(query,[id],(err,results)=>{
        if(err){
            console.error('Error en DELETE');
            res.send('Error en al eliminar');
        }else{
            res.redirect('/');
        }
    });
});

//server inicio

//MILWARE???

// const operacionPromesa = (numero1, numero2) => {
//     const resultado = numero1 + numero2;
//     return new Promise( resolve => {
//         setTimeout(()=>{
//             resolve(resultado)
//         },300)
//     });
// }

// operacionPromesa(1,3).then(resultado => console.log(resultado));