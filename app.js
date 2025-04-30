"use strict"
import express from 'express'
import fs from 'fs'
import path from 'path'

const app = express()
const PORT = 3000

//Midllewares 
app.use(express.json())
app.use(express.static('./public'))

// 1º Cargar la página web al acceder a la raíz "/"
app.get('/', (req, res) => {
    // Leemos el archivo HTML que queremos mostrar
    fs.readFile('./public/html/index.html', 'utf8', (err, html) => {
        if (err) {
            // Si ocurre un error al leer el archivo, devolvemos un error 500
            res.status(500).send('There was an error: ' + err)
            return
        }

        // Si el archivo se lee correctamente, lo enviamos como respuesta
        console.log("Sending page...")
        res.send(html)
        console.log("Page sent!")
    })
})
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
app.use(express.json())
app.use(express.static('public'))

let itemsCatalog = []
let nextId = 1  // Contador para asignar IDs únicos

// post-items 
app.post('/api/items', (req, res) => {
    const { name, type, effect } = req.body
  
    //Valida que lleguen todos los campos
    if (!name || !type || !effect) {
      return res.status(400).json({ message: "Faltan name, type o effect" })
    }
  
    //Verifica duplicados por nombre
    if (itemsCatalog.some(item => item.name === name)) {
      return res.status(409).json({ message: "Ese item ya existe" })
    }
  
    // 3) Crea el nuevo item con ID único
    const newItem = { id: nextId++, name, type, effect }
  
    // 4) Guardamos en el catálogo
    itemsCatalog.push(newItem)
  
    // 5) Devolverlo con código 201 Created
    res.status(201).json(newItem)
  })

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})





