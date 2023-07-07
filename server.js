const express = require("express");
const app = express();
const port = 4000;
const players = require("./Players");

app.use((req, res, next) => {
    console.log(`request: ${req.method} ${req.originalUrl}`);
    next();
});

app.use(express.json());

function getNextIdFromCollection(collection) {
    if (collection.length === 0) return 1; 
    const lastRecord = collection[collection.length - 1];
    return lastRecord.id + 1;
}

app.get("/", (req, res) => {
    res.send("Welcome to NBA Player API!");
});

// Returning list of players
app.get("/players", (req, res) => {
    res.send(players);
});

// Returning a single player
app.get("/players/:id", (req, res) => {
    const playerId = parseInt(req.params.id, 10);
    const player = players.find((player) => player.id === playerId);
    res.send(player);
});

// Adding a new player
app.post("/players", (req, res) => {
    const newPlayer = {
        ...req.body,
        id: getNextIdFromCollection(players)
    };
    console.log("newPlayer", newPlayer);
    players.push(newPlayer);
    res.send(newPlayer);
});

//updating a player
app.patch("/players/:id", (req, res) => {
    const playerId = parseInt(req.params.id, 10);
    const playerUpdates = req.body;
    const playerIndex = players.findIndex(player => player.id === playerId);
    const updatedPlayer = {...players[playerIndex], ...playerUpdates};
    if (playerIndex !== -1) {
      players[playerIndex] = updatedPlayer;
      res.send(updatedPlayer);  
    } else {
      res.status(404).send({ message: "Player not found..." });
    }
});

//deleting a player
app.delete("/players/:id", (req, res) => {
    const playerId = parseInt(req.params.id, 10);
    const playerIndex = players.findIndex((player) => player.id === playerId);
    if (playerIndex !== -1) {
        players.splice(playerIndex, 1);
        res.send({ message: "Player deleted successfully..." });
    } else {
        res.status(404).send({ message: "Player not found..." });
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
