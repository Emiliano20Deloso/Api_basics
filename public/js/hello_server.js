document.addEventListener('DOMContentLoaded', () => {
    const base = window.location.origin;
  
    async function doFetch(path, opts = {}) {
      try {
        const res = await fetch(base + path, opts);
        const ct = res.headers.get('Content-Type') || '';
        const body = ct.includes('application/json')
          ? await res.json()
          : await res.text();
        console.log(`${opts.method || 'GET'} ${path} → ${res.status}`, body);
        return body;
      } catch (err) {
        console.error(`Error ${opts.method || 'GET'} ${path}:`, err);
      }
    }
  
    (async () => {
      // Raíz
      await doFetch('/');
  
      // ITEMS
      await doFetch('/api/items');
      const newItem = await doFetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Espada Tron', type: 'arma', effect: '+99 daño' })
      });
      const itemId = newItem.id ?? newItem.created?.[0]?.id;
      await doFetch(`/api/items/${itemId}`);
      await doFetch(`/api/items/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ effect: '+100 daño' })
      });
      await doFetch(`/api/items/${itemId}`, { method: 'DELETE' });
  
      // USERS
      await doFetch('/api/users');
      const u1 = await doFetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Usuario Tron', email: 'tron@ejemplo.com' })
      });
      const user1Id = u1.created?.[0]?.user?.id ?? u1.id;
      const u2 = await doFetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Usuario Neo', email: 'neo@ejemplo.com', items: [itemId] })
      });
      const user2Id = u2.created?.[0]?.user?.id ?? u2.id;
      await doFetch(`/api/users/${user2Id}`);
      await doFetch(`/api/users/${user2Id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Neo Modificado', items: [] })
      });
      await doFetch(`/api/users/${user1Id}`, { method: 'DELETE' });
    })();
  });