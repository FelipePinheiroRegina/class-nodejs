import http from 'node:http';

const server = http.createServer(async (req, res) => {
    const buffers = [];

    for await (const chunk of req) {
        buffers.push(chunk);
    }

    const fullStreamContent = Buffer.concat(buffers).toString();
    console.log(fullStreamContent)

    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('File received and processed');
});

server.listen(3334, () => console.log('Server running on port 3334'));
