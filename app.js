"use strict"
import express from 'express'
import fs from 'fs'

const app = express()
const PORT = 3000

// Middleware 
app.use(express.json())
app.use(express.static('./public'))

//1º Cargar la página web
app.get('/', (req, res) => {
    fs.readFile('./public/html/index.html', 'utf8', 
    (err, html) => {
        if (err) {
            res.status(500).send('There was an error: ' + err)
            return
        }

        console.log("Sending page...")
        res.send(html)
        console.log("Page sent!")
    })
})

//2º Lista todos los items almacenados en el catálogo
let itemsCatalog = []; // Vamos a usar esta variable para almacenar los items

app.get('/api/items', (req, res) => {
    if (itemsCatalog.length === 0) {
        return res.status(404).json({ message: "No items found" });
    }
    res.json(itemsCatalog);      
});

//3º Crear y agregar un nuevo item
app.post('/api/items', (req, res) => {
    const newItem = {
        id: itemsCatalog.length + 1, // Asigna un ID en +1 
        ...req.body
    };
    itemsCatalog.push(newItem);
    res.status(201).json(newItem);
});

//4º Obtener un item específico por ID
app.get('/api/items/:id', (req, res) => {
    const { id } = req.params;  // Obtener el ID del parámetro de la URL

    // Convertir ID a número de manera implícita
    const itemId = +id;

    // Buscar el item en el catálogo
    const item = itemsCatalog.find(item => item.id === itemId);

    // Verificar si el item existe
    if (!item) {
        return res.status(404).json({ message: "Item not found" });
    }

    // Enviar el item encontrado
    res.status(200).json(item);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
