console.log("AAA")
const btnUpload = document.getElementById('btnUpload');
const divOutput = document.getElementById('divOutput');
const file = document.getElementById('file');
 
btnUpload.addEventListener('click', function (e) {
    const fileReader = new FileReader();
    // TODO make more than one file upload possible
    const theFile = file.files[0];
    fileReader.onload = ev => {
        console.log('Read successfully');
        const filename = Math.random() * 1000 + theFile.name;

        const CHUNK_SIZE = 1000;
        const chunkCount = ev.target.result.byteLength / (CHUNK_SIZE + 1);

        for (let chunkId = 0; chunkId < chunkCount; chunkId++) {
            const chunk = ev.target.result.slice(CHUNK_SIZE * chunkId, CHUNK_SIZE * chunkId + CHUNK_SIZE);
            console.log(chunk);
            await fetch('http://localhost:9000/upload', {
                "method": "POST",
                "headers": {
                    "content-type": "application/octet-stream",
                    "content-length": chunk.length,
                    "filename": filename
                },
                "body": chunk
            });
        }
    };
    fileReader.readAsArrayBuffer(theFile);
})