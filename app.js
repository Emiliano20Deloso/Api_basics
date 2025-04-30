"use strict"
import express from 'express'
import fs from 'fs'

const app = express()
const PORT = 3000

//Midllewares 
app.use(express.json())
app.use(express.static('./public'))

//1º Carga la pagina web
app.get('/', (req, res)=>
    {
        fs.readFile('./public/html/index.html', 'utf8', 
        (err, html) => {
            if(err)
            {
                res.status(500).send('There was an error: ' + err)
                return 
            }
            
            console.log("Sending page...")
            res.send(html)
            console.log("Page sent!")
        })
    })

//2º Lista todos los items almacenados en el catalogo
app.get('/api/items', (req, res) => {
    res.json([]);      
});


//3º 
    app.get('/api/hello', (req, res)=>
        {
            console.log(req.query)
            // The hasOwnProperty method is used to check if a property exists in the request object
            if(req.query.hasOwnProperty('name') && req.query.hasOwnProperty('surname'))
                res.send(`Hello ${req.query.name} ${req.query.surname}`)
            else
                res.send('Hello!')
        })
        
        // The /api/greeting/:name/:surname route will return a simple greeting. The name and surname parameters are required, and can be passed as parameters.
        app.post('/api/greeting/:name/:surname', (req, res)=>{
            console.log(req.params)
            if(req.params.hasOwnProperty('name') && req.params.hasOwnProperty('surname'))
                res.send(`Hello ${req.params.name} ${req.params.surname}`)
            else
                res.send('Hello!')
        })
        
// almacén en memoria
let items = [];

// POST /api/items → crea y devuelve el nuevo item
app.post('/api/items', (req, res) => {
  const newItem = {
    id: items.length + 1,
    ...req.body
  };
  items.push(newItem);
  res.status(201).json(newItem);
});

app.put('/api/items', (req, res) => {
    console.log ("update");

})

//4º update 
app.put('/api/items/:id', (req, res) => {
    const { id } = req.params;  // Obtener el ID del parámetro de la URL
    const { name, effect } = req.body;  // Obtener los datos a actualizar desde el cuerpo de la solicitud

    // Convertir ID a número de manera implícita, si los IDs son cadenas, puedes omitir esto
    const itemId = +id; // Usando el operador unario + para convertirlo a número

    // Buscar el item en el catálogo
    const item = items.find(item => item.id === itemId);

    // Verificar si el item existe
    if (!item) {
        console.log(`Item with ID ${id} not found.`);
        return res.status(404).json({ message: "Item not found" });
    }

    // Actualizar los campos del item (solo los campos enviados)
    if (name) item.name = name;
    if (effect) item.effect = effect;

    // Enviar la respuesta con el item actualizado
    res.status(200).json(item);
});

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
  })