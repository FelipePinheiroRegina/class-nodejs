import http from 'node:http';

const server = http.createServer(async (req, res) => {
    const buffers = [];

    for await (const chunk of req) {
        buffers.push(chunk)
    }

    try {
        req.body = JSON.parse(Buffer.concat(buffers).toString()) 
    } catch (error) {
        req.body = null
    }

    res.setHeader('Content-type', 'application/json') // More utils in APIs node
});

server.listen(3334, () => console.log('Server running on port 3334'));
