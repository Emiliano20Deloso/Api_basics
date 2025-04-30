"use strict"
import express from 'express'
import fs from 'fs'

const app = express()
const PORT = 3000

// Middlewares
app.use(express.json())
app.use(express.static('./public'))

// 
let itemsCatalog = []        
let usersCatalog = []
let nextUserId = 1

// POST /api/users 
app.post('/api/users', (req, res) => {
  const payload  = req.body
  const newUsers = Array.isArray(payload) ? payload : [payload]
  const created  = []
  const errors   = []

  newUsers.forEach(user => {
    const { name, email, items } = user

    if (!name || !email) {
      errors.push({ user, message: "Faltan name o email" })
      return
    }

    if (usersCatalog.some(u => u.email === email)) {
      errors.push({ user, message: `Email "${email}" ya registrado` })
      return
    }

    let userItemIds = []
    if (items !== undefined) {
      if (!Array.isArray(items)) {
        errors.push({ user, message: "Items debe ser un array de IDs" })
        return
      }
      const invalid = items.filter(id => !itemsCatalog.some(it => it.id === id))
      if (invalid.length) {
        errors.push({ user, message: `Items inválidos: ${invalid.join(', ')}` })
        return
      }
      userItemIds = [...items]
    }
    const newUser = { id: nextUserId++, name, email, items: userItemIds }
    usersCatalog.push(newUser)

    const newUserWithItems = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      items: newUser.items.map(itemId =>
        itemsCatalog.find(it => it.id === itemId)
      )
    }
    created.push({ user: newUserWithItems, message: "Usuario creado exitosamente" })
  })

  if (created.length && !errors.length)      return res.status(201).json({ created })
  if (!created.length && errors.length)      return res.status(400).json({ errors })
  return res.status(207).json({ created, errors })
})

// GET /api/users 
app.get('/api/users', (req, res) => {
  if (usersCatalog.length === 0) {
    return res.status(200).json({ message: "No hay usuarios" });
  }
  const result = usersCatalog.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    items: u.items.map(itemId =>
    itemsCatalog.find(it => it.id === itemId)
    )
  }));
  res.json(result);
});

// GET /api/users/:id →
app.get('/api/users/:id', (req, res) => {
  const id = Number(req.params.id);
  const user = usersCatalog.find(u => u.id === id);

  if (!user) {
    return res.status(404).json({ message: "Usuario no existe" });
  }
  const userWithItems = {
    id: user.id,
    name: user.name,
    email: user.email,
    items: user.items.map(itemId =>
      itemsCatalog.find(it => it.id === itemId)
    )
  };

  res.json(userWithItems);
});

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
  })