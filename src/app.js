"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const websocket_1 = __importDefault(require("@fastify/websocket"));
const fastify_1 = __importDefault(require("fastify"));
const socket_emitter_1 = require("./emitter/socket-emitter");
const server = (0, fastify_1.default)();
server.register(websocket_1.default);
// server.register(fastifyPostgres, {
//   host: "localhost",
//   user: "postgres",
//   password: "qwerty1234",
//   port: 5432,
//   database: "postgres",
// });
server.register(function (fastify) {
    return __awaiter(this, void 0, void 0, function* () {
        fastify.get("/ws", { websocket: true }, (connection) => {
            connection.on("message", (data) => {
                var _a;
                const newData = JSON.parse(data.toString());
                console.log(newData);
                switch (newData.event) {
                    case "join":
                        const messageListener = (event) => {
                            console.log(event);
                            if (event.client == newData.clientId)
                                connection.send(JSON.stringify(event));
                        };
                        socket_emitter_1.emitter.on("room-event", messageListener);
                        break;
                    case "status":
                        socket_emitter_1.emitter.emit("room-event", {
                            client: newData.client,
                            status: newData.status,
                        });
                        break;
                    case "process":
                        socket_emitter_1.emitter.emit("room-event", {
                            client: newData.client,
                            process: (_a = newData.process) !== null && _a !== void 0 ? _a : [],
                        });
                        break;
                }
            });
        });
    });
});
// async function runMigrations(): Promise<void> {
//   const client = new Client({
//     host: "localhost",
//     user: "postgres",
//     password: "qwerty1234",
//     port: 5432,
//     database: "postgres",
//   });
//   try {
//     await client.connect();
//     const script = fs.readFileSync(
//       path.join(__dirname, "./mock/create-tables.sql"),
//       "utf8"
//     );
//     await client.query(script);
//   } catch (error) {
//     server.log.error("Error running migrations:", error);
//   }
// }
// server.addHook("preHandler", (req, res, next) => {
//   return next();
// });
// server.addHook("onReady", function (done) {
//   runMigrations()
//     .then(() => done())
//     .catch((e) => {
//       console.log(e);
//     });
// });
server.get("/api/v1/pc/status", {}, (req, rep) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const status = (
        //   await req.db.query("Select status from pc where id = $1", [1])
        // ).rows[0];
        console.log("fere");
        socket_emitter_1.emitter.emit("room-event", {
            client: "pc",
            event: "getStatus",
        });
        return rep.code(200).send("");
    }
    catch (e) {
        return rep.code(500).send(e);
    }
}));
server.get("/api/v1/process", {}, (req, rep) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("here");
        socket_emitter_1.emitter.emit("room-event", {
            client: "pc",
            event: "getProcess",
        });
        return rep.code(200).send("");
    }
    catch (e) {
        return rep.code(500).send(e);
    }
}));
server.delete("/api/v1/process", {}, (req, rep) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.body;
        socket_emitter_1.emitter.emit("room-event", {
            client: "pc",
            event: "killProcess",
            name,
        });
        return rep.code(200).send("");
    }
    catch (e) {
        return rep.code(500).send(e);
    }
}));
server.listen({ port: 3000, host: "0.0.0.0" }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server listening at ${address}`);
});
