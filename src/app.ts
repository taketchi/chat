import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io'
import {router} from "./routes/api";
import pkg from './../package.json';


const app = express();
// @ts-ignore
const port = parseInt(process.env.PORT) || 8080;
const server = createServer(app)
const io = new Server(server)

app.use(router)

server.listen(port, () =>
    console.log(`${pkg.name}: listening on port ${port}`)
);

io.on('connection', socket => {
    socket.on('signin', async ({user, room}, callback) => {
        try {

            // const messages = await getRoom(room)
            // callback(null, messages)
        }
        catch (error) {
            callback(error, null)
        }
    })
})

process.on('SIGTERM', () => {
    console.log(`${pkg.name}: received SIGTERM`);
    process.exit(0);
});

module.exports = app;