const express = require('express')
const app = express()
const port = 8080
const swaggerUi = require('swagger-ui-express')
const yamljs = require('yamljs')
const swaggerDocument = yamljs.load('./docs/swagger.yaml');
const cors = require('cors')


app.use(express.json())
app.use(cors())

const games = [
    { id: 1, name: "Viperr", price: 3500 },
    { id: 2, name: "Cyberpunk", price: 3500 },
    { id: 3, name: "Witcher 3", price: 3500 },
    { id: 4, name: "Minecraft", price: 3500 },
    { id: 5, name: "CS2", price: 3500 },
    { id: 6, name: "Roblox", price: 3500 },
    { id: 7, name: "Grand Theft Auto 2", price: 3500 },
    { id: 8, name: "Valorant", price: 3500 },
    { id: 9, name: "Dota 2", price: 3500 },
    { id: 10, name: "Forza Horizon 5", price: 3500 }
];

app.get('/games', (req,res) =>{
    res.send(games)
})

app.get('/games/:id', (req,res) => {
    if (typeof games[req.params.id -1] === 'undefined'){
        return res.status(404).send({error: "Game not found"})
    }
    res.send(games[req.params.id -1])
})

app.post('/games', (req, res) => {
    if (!req.body.name || !req.body.price) {
        return res.status(400).send({ error: 'One or all params are missing' });
    }

    // Use the highest existing ID plus one for the new game ID
    const newId = games.length > 0 ? Math.max(...games.map(game => game.id)) + 1 : 1;

    const newGame = {
        id: newId,
        name: req.body.name,
        price: req.body.price
    };

    games.push(newGame);
    res.status(201).send(newGame);
});

app.delete('/games/:id', (req, res) => {
    const gameId = parseInt(req.params.id);
    const gameIndex = games.findIndex(game => game.id === gameId);
    if (gameIndex === -1) {
        return res.status(404).send({ error: "Game not found" });
    }
    games.splice(gameIndex, 1); // Remove the game by index
    res.status(204).send(); // Respond with no content
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.listen(port, () => {
    console.log(`API up at: http://localhost:${port}/games`)
})
app.put('/games/:id', (req, res) => {
    const gameId = parseInt(req.params.id);
    const gameIndex = games.findIndex(game => game.id === gameId);
    if (gameIndex === -1) {
        return res.status(404).send({ error: "Game not found" });
    }

    const updatedGame = {
        id: gameId,
        name: req.body.name,
        price: req.body.price
    };

    games[gameIndex] = updatedGame; // Update the game in the array
    res.send(updatedGame); // Send the updated game back
});


function getBaseUrl(req) {
    return req.connection && req.connection.encrypted
        ? 'https' : 'http' + `://${req.headers.host}`
}