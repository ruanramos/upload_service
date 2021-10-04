const btnUpload = document.getElementById('btnUpload');
const divOutput = document.getElementById('divOutput');
const fileInput = document.getElementById('file');

btnUpload.addEventListener('click', function (e) {
    const fileReader = new FileReader();
    // TODO make more than one file upload possible
    const theFile = fileInput.files[0];

    // Finished reading the file
    fileReader.onload = async ev => {
        console.log(`Read file ${theFile.name} successfully`);
        const filename = Math.random() * 1000 + theFile.name;

        const fileSize = ev.target.result.byteLength;
        const CHUNK_SIZE = 15000;
        const chunkCount = fileSize / (CHUNK_SIZE + 1);
        const progress = 0;

        divOutput.innerText = `Uploading: ${progress}%\nSize: ${fileSize} bytes`;

        const startTime = Date.now();

        for (let chunkId = 0; chunkId < chunkCount; chunkId++) {
            divOutput.innerText = `Uploading: ${Math.round(chunkId * 100 / chunkCount, 0)}%`;
            const chunk = ev.target.result.slice(CHUNK_SIZE * chunkId, CHUNK_SIZE * chunkId + CHUNK_SIZE);

            // TODO remove filename from header and pass as body
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

        const elapsedTime = Date.now() - startTime;
        divOutput.innerText = `Finished uploading ${fileSize} bytes.\nElapsed time: ${elapsedTime / 1000} seconds`;
    };
    fileReader.readAsArrayBuffer(theFile);
})