import { Client } from "tmi.js";
import express from "express";

const client = new Client({
    channels: ["IlloJuan"],
    options: { joinInterval: 300 }
});

let userCount: Map<string, number> = new Map();
let tmiAlreadyConnected = false;

// client
//     .connect()
//     .then(() => console.log("tmi connected"))
//     .catch(console.error);

client.connect().then(([addr, port]) => {
    tmiAlreadyConnected = true;
    console.log(`[TMI] Connected to chat - Addr: ${addr}:${port}`);
});

client.on("connected", () => {
    tmiAlreadyConnected && console.log("[TMI] Reconnecting to chat");
});

client.on("message", (channel, tags, message, self) => {
    if (self) return;
    if (!tags.username) return;

    if (userCount.has(tags.username)) {
        userCount.set(tags.username, userCount.get(tags.username)! + 1);
    } else {
        userCount.set(tags.username, 1);
    }
});

const app = express();
const port = 8000;

app.get("/", (req, res) => {
    res.send(JSON.stringify(Object.fromEntries(userCount)));
});

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
