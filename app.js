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

// POST /api/users → crear uno o varios usuarios
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
    // 2) Unicidad por email
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

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
  })