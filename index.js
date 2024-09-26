const express = require('express');
const app = express();

const port = 8080;
const swaggerUi = require('swagger-ui-express');
const yamljs = require('yamljs');
const swaggerDocument = yamljs.load('C:/Users/opilane/source/repos/artur/Project/games-api-Artur/docs/swagger.yaml');

app.use(express.json());

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

// Create a new game
app.post('/games', (req, res) => {
    if (!req.body.name || !req.body.price) {
        return res.status(400).send({ error: 'One or all params are missing' });
    }
    let game = {
        id: games.length + 1,
        price: req.body.price,
        name: req.body.name
    };
    games.push(game);
    res.status(201)
        .location(`${getBaseURL(req)}/games/${game.id}`)
        .send(game);
});

// Get all games
app.get('/games', (req, res) => {
    res.send(games);
});

// Get a game by ID
app.get('/games/:id', (req, res) => {
    const gameId = parseInt(req.params.id, 10);
    if (isNaN(gameId) || gameId < 1 || gameId > games.length) {
        return res.status(404).send({ error: "Game Not Found" });
    }
    res.send(games[gameId - 1]);
});

// Delete a game
app.delete('/games/:id', (req, res) => {
    const gameIndex = req.params.id - 1;
    if (typeof games[gameIndex] === 'undefined') {
        return res.status(404).send({ error: "Game not found" });
    }
    games.splice(gameIndex, 1);
    res.status(204).send(); // No content to return
});

// Swagger documentation
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => {
    console.log(`API up at: http://localhost:${port}`);
});

// Utility function to get base URL
function getBaseURL(req) {
    return (req.connection && req.connection.encrypted ? 'https' : 'http') + `://${req.headers.host}`;
}
