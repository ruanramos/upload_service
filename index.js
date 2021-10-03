
// TODO make it scalable by using a database to store blobs
// When client finishes sending chunks, one server take all blobs
// and build the file

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

    // TODO add idempotency and resumability
    // If a chunk get lost, we will append next one and file will be corrupted
    // We need to receive chunk id and make sure it's ok
    if (req.url === '/upload') {
        const filename = req.headers['filename'];
        req.on('data', (chunk) => {
            fs.appendFileSync(`./files/${filename}`, chunk)
            console.log(`Received chunk! ${chunk.length}`)
        });
        res.end("uploaded file!")
    }
});

server.listen(9000, "127.0.0.1");