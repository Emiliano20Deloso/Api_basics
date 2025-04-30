// testApi.js

async function main() {
    const base = 'http://localhost:3000';
  
    // -------- HTML --------
    console.log('--- GET / (servir página index) ---');
    let res = await fetch(`${base}/`);
    console.log('Status:', res.status);
    const html = await res.text();
    console.log('Body (primeros 200 caracteres):', html.slice(0, 200), '...');
  
    // -------- ITEMS --------
    console.log('--- GET /api/items ---');
    res = await fetch(`${base}/api/items`);
    console.log('Status:', res.status, 'Body:', await res.json());
  
    console.log('--- POST /api/items {name, type, effect} ---');
    res = await fetch(`${base}/api/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Espada de Luz', type: 'arma', effect: '+25 daño' })
    });
    const item1 = await res.json();
    console.log('Status:', res.status, 'Body:', item1);
  
    console.log('--- GET /api/items/:id ---');
    res = await fetch(`${base}/api/items/${item1.id}`);
    console.log('Status:', res.status, 'Body:', await res.json());
  
    console.log('--- PUT /api/items/:id ---');
    res = await fetch(`${base}/api/items/${item1.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ effect: '+30 daño' })
    });
    console.log('Status:', res.status, 'Body:', await res.json());
  
    console.log('--- DELETE /api/items/:id ---');
    res = await fetch(`${base}/api/items/${item1.id}`, { method: 'DELETE' });
    console.log('Status:', res.status, 'Body:', await res.json());
  
    // -------- USERS --------
    console.log('--- GET /api/users ---');
    res = await fetch(`${base}/api/users`);
    console.log('Status:', res.status, 'Body:', await res.json());
  
    console.log('--- POST /api/users (sin items) ---');
    res = await fetch(`${base}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Usuario Uno', email: 'uno@example.com' })
    });
    let data = await res.json();
    console.log('Status:', res.status, 'Body:', data);
    const user1Id = data.created ? data.created[0].user.id : data.id;
  
    console.log('--- POST /api/users (con items) ---');
    res = await fetch(`${base}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Usuario Dos', email: 'dos@example.com', items: [item1.id] })
    });
    data = await res.json();
    console.log('Status:', res.status, 'Body:', data);
    const user2Id = data.created ? data.created[0].user.id : data.id;
  
    console.log('--- GET /api/users/:id ---');
    res = await fetch(`${base}/api/users/${user2Id}`);
    console.log('Status:', res.status, 'Body:', await res.json());
  
    console.log('--- PUT /api/users/:id ---');
    res = await fetch(`${base}/api/users/${user2Id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Usuario Dos Modificado', items: [] })
    });
    console.log('Status:', res.status, 'Body:', await res.json());
  
    console.log('--- DELETE /api/users/:id ---');
    res = await fetch(`${base}/api/users/${user1Id}`, { method: 'DELETE' });
    console.log('Status:', res.status, 'Body:', await res.json());
  }
  
  main().catch(console.error);