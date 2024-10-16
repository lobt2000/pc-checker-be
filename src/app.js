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
server.register(function (fastify) {
    return __awaiter(this, void 0, void 0, function* () {
        fastify.get("/ws", { websocket: true }, (connection) => {
            connection.on("message", (data) => {
                var _a;
                const newData = JSON.parse(data.toString());
                switch (newData.event) {
                    case "join":
                        const messageListener = (event) => {
                            connection.send(JSON.stringify(event));
                        };
                        socket_emitter_1.emitter.on("room-event", messageListener);
                        break;
                    case "status":
                        socket_emitter_1.emitter.emit("room-event", {
                            client: newData.client,
                            event: "status",
                            status: newData.status,
                        });
                        break;
                    case "process":
                        socket_emitter_1.emitter.emit("room-event", {
                            client: newData.client,
                            event: "process",
                            process: (_a = newData.process) !== null && _a !== void 0 ? _a : [],
                        });
                        break;
                }
            });
        });
    });
});
server.get("/api/v1/pc/status", {}, (req, rep) => __awaiter(void 0, void 0, void 0, function* () {
    try {
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
server.post("/api/v1/process", {}, (req, rep) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { pid } = req.body;
        socket_emitter_1.emitter.emit("room-event", {
            client: "pc",
            event: "terminateProcess",
            pid,
        });
        return rep.code(200).send("");
    }
    catch (e) {
        return rep.code(500).send(e);
    }
}));
server.post("/api/v1/pc/turn-off", {}, (req, rep) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        socket_emitter_1.emitter.emit("room-event", {
            client: "pc",
            event: "turnOff",
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
