import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io'
import {router} from "./routes/api";
import pkg from './../package.json';
import jwt from "jsonwebtoken";
import {Env} from "./type";
import dotenv from "dotenv";
import {getUser} from "./users";

const myEnv: Env = {
    SECRET:"",
    REFRESH_SECRET:""
}
dotenv.config({ path: '../.env', processEnv: myEnv })
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
    socket.on('signin', async ({user, room, token}, callback) => {
        try {
            const decoded = jwt.verify(token,myEnv.SECRET)

            // @ts-ignore
            const user = await getUser(decoded.mailAddress)
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