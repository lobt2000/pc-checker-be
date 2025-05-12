import fastifyWebsocket from "@fastify/websocket";
import fastify from "fastify";
import { emitter } from "./emitter/socket-emitter";
import fastifyCors from "@fastify/cors";

const server = fastify();

server.register(fastifyWebsocket);

server.register(fastifyCors, {
  origin: "*", // You can restrict this to a specific domain if needed
  methods: ["GET", "PUT", "POST", "DELETE"],
  allowedHeaders: ["Content-Type"], // Дозволені заголовки запитів
});

server.register(async function (fastify) {
  fastify.get("/ws", { websocket: true }, (connection) => {
    connection.on("message", (data) => {
      const newData = JSON.parse(data.toString());
      console.log(newData);

      switch (newData.event) {
        case "join":
          const messageListener = (event: {
            client: string;
            event: string;
            status?: string;
            process?: any[];
            name?: string;
          }) => {
            console.log(event, "send event");

            connection.send(JSON.stringify(event));
          };

          emitter.on("room-event", messageListener);

          break;

        case "status":
          emitter.emit("room-event", {
            client: newData.client,
            event: "status",
            status: newData.status as boolean,
          });
          console.log("send event from pc", newData.status as boolean);
          break;

        case "process":
          emitter.emit("room-event", {
            client: newData.client,
            event: "process",
            process: newData.process ?? [],
          });
          console.log("send event from pc", newData.process ?? []);

          break;
      }
    });
  });
});

server.get("/api/v1/pc/status", {}, async (req, rep) => {
  try {
    emitter.emit("room-event", {
      client: "pc",
      event: "getStatus",
    });

    console.log("send event from client");

    return rep.code(200).send("");
  } catch (e) {
    return rep.code(500).send(e);
  }
});

server.get("/api/v1/pc/process", {}, async (req, rep) => {
  try {
    console.log("send event from client");

    emitter.emit("room-event", {
      client: "pc",
      event: "getProcess",
    });

    return rep.code(200).send("");
  } catch (e) {
    return rep.code(500).send(e);
  }
});

server.post("/api/v1/pc/process", {}, async (req, rep) => {
  try {
    const { pid } = req.body as { pid: string };

    emitter.emit("room-event", {
      client: "pc",
      event: "terminateProcess",
      pid,
    });

    return rep.code(200).send("");
  } catch (e) {
    return rep.code(500).send(e);
  }
});

server.post("/api/v1/pc/lock", {}, async (req, rep) => {
  try {
  
    emitter.emit("room-event", {
      client: "pc",
      event: "lock",
    });

    return rep.code(200).send("");
  } catch (e) {
    return rep.code(500).send(e);
  }
});

server.post("/api/v1/pc/turn-off", {}, async (req, rep) => {
  try {
    emitter.emit("room-event", {
      client: "pc",
      event: "turnOff",
    });

    return rep.code(200).send("");
  } catch (e) {
    return rep.code(500).send(e);
  }
});

server.listen({ port: 3000, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
