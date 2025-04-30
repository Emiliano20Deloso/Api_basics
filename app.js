"use strict"
import express from 'express'
import fs from 'fs'

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