
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
        res.end(fs.readFileSync('./client/index.html'));
        return;
    }

    if (req.url === "/upload.js") {
        res.end(fs.readFileSync('./client/upload.js'));
        return;
    }

    // TODO add idempotency and resumability
    // If a chunk get lost, we will append next one and file will be corrupted
    // We need to receive chunk id and make sure it's ok
    if (req.url === '/upload') {
        const filename = req.headers['filename'];
        req.on('data', (chunk) => {
            if (!fs.existsSync('./files')) {
                fs.mkdir('./files', (err) => {
                    console.log(err);
                });
            }
            fs.appendFileSync(`./files/${filename}`, chunk)
            console.log(`Received chunk! Filename: ${filename} - Chunk size: ${chunk.length}`)
        });
        res.end("uploaded file!")
    }
});

// server.listen(9000, "localhost");
server.listen(9000, "0.0.0.0");