
const newLocal = require("mongoose");

const http = require("http");
const fs = require("fs");

const server = http.createServer();

server.on("listening", () => {
    console.log(`Listening to port ${server.address().port} on address ${server.address().address}`);
    console.log(server.address());
});

server.on("error", (err) => console.log(`Error ${err}`));

server.on("request", (req, res) => {
    if (req.url === "/") {
        res.end(fs.readFileSync('index.html'));
        return;
    }
});

server.listen(9000, "127.0.0.1"); 