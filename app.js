"use strict"
import express from 'express'
import fs from 'fs'

const app = express()
const PORT = 3000

//Midllewares 
app.use(express.json())
app.use(express.static('./public'))

let usersCatalog = [];
let nextUserId = 1;

// POST /api/users 
app.post('/api/users', (req, res) => {
  const payload = req.body;
  const newUsers = Array.isArray(payload) ? payload : [payload];
  const created = [];
  const errors = [];

  newUsers.forEach(user => {
    const { name, email, items } = user;

    // 1) Validar name y email
    if (!name || !email) {
      errors.push({ user, message: "Faltan name o email" });
      return;
    }
    
    if (usersCatalog.some(u => u.email === email)) {
      errors.push({ user, message: `Email "${email}" ya registrado` });
      return;
    }
    // 3) Validar items (si vienen)
    let userItems = [];
    if (items !== undefined) {
      if (!Array.isArray(items)) {
        errors.push({ user, message: "Items debe ser un array de IDs" });
        return;
      }
      const invalid = items.filter(id => !itemsCatalog.some(it => it.id === id));
      if (invalid.length) {
        errors.push({ user, message: `Items inválidos: ${invalid.join(', ')}` });
        return;
      }
      userItems = [...items];
    }
    // 4) Crear y guardar
    const newUser = { id: nextUserId++, name, email, items: userItems };
    usersCatalog.push(newUser);
    created.push({ id: newUser.id, message: "Usuario creado" });
  });

  // 5) Responder según resultados
  if (created.length && !errors.length)      return res.status(201).json({ created });
  if (!created.length && errors.length)      return res.status(400).json({ errors });
  /* mixto */                              return res.status(207).json({ created, errors });
});

// GET /api/users 
app.get('/api/users', (req, res) => {

  if (usersCatalog.length === 0) {
    return res.status(200).json({ message: "No hay usuarios" });
  }

  // Mapear cada usuario para reemplazar los IDs de items por los objetos completos
  const result = usersCatalog.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    items: u.items.map(itemId => {
      return itemsCatalog.find(it => it.id === itemId);
    })
  }));

  res.json(result);
});

// GET /api/users/:id
app.get('/api/users/:id', (req, res) => {
  const id = Number(req.params.id);
  const user = usersCatalog.find(u => u.id === id);

  // Verifica existencia
  if (!user) {
    return res.status(404).json({ message: "Usuario no existe" });
  }

  //Reemplaza cada item ID por el objeto completo
  const userWithItems = {
    id: user.id,
    name: user.name,
    email: user.email,
    items: user.items.map(itemId => itemsCatalog.find(it => it.id === itemId))
  };

  res.json(userWithItems);
});

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
  })