/* 
Instalación de librerias requeridas por medio de PowerShell
npm install express
npm install cors 
npm install mysql2 
npm install dotenv
npm install body-parse
*/
const express = require("express");
const cors = require("cors");
const bodyPaser = require("body-parser");
const mysql = require("mysql2/promise");
const bodyParser = require("body-parser");
const app = express();
const port = 5002;

app.use(cors());
app.use(bodyParser.json());

//Conexion

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "agenda",
});

//Consultar base de datos

app.get("/todo", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM todo");
    res.json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error al obtener tareas");
  }
});

//Agregar datos a la base de datos

app.post("/todo", async (req, res) => {
  const { text } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO todo(text,completed) VALUES(?,?)",
      [text, false]
    );
    res.json({ id: result.insertId });
  } catch (error) {
    res.status(500).send("Error al agregar tarea");
  }
});

//Actualizar tabla

app.put("/todo/:id", async (req, res) => {
  const { ID } = req.params;
  const { text, completed } = req.body;
  try {
    if (text !== undefined) {
      await pool.query("UPDATE `todo` SET `completed` '=?' WHERE `todo`.ID = ?", [completed,ID]);
      res.json({message:"Tarea actualizada con éxito"});
    }
  } catch (error) {
    console.log("Error:", error);
    res.status(500).send("Error al actualizar la tarea");
  }
});

//Eliminar datos dentro de la tabla

app.delete("/todo/:id", async(req,res)=>{
  const {ID}=req.params;
  try {
    await pool.query("DELETE FROM todo WHERE ID=?", [ID]);
    res.json({message:"Tarea eliminado con éxito"});
  } catch (error) {
    console.log("error ", error);
    res.status(500).send("Error al elminar la tarea");
  }
});

//Iniciar el servidor

app.listen(port, ()=>{
  console.log(`Servidor en el puerto ${port}`)
})
