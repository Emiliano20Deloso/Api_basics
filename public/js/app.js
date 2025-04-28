const express = requiere('express') 
const app = express (); 
const PORT = 3000;

//Midllewares 
app.use(express.json());
app.use(express.static('public'));

//Primer endpoint
app.get('/api/items', (req, res) => {
    res.json([]);      
});

app.get('/', (req, res)=>{
    fs.readFile('public/html/hello_server.html', 'utf8',(err, html) => {
        if(err){
            res.status(500).send('There was an error: ' + err)
            return 
        }

    console.log("Sending page...")
    res.send(html)
    console.log("Page sent!")
    })      
})





