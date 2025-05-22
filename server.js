require("dotenv").config();
const fastify = require("fastify")({ logger: true });
const path = require("path");

// register the
fastify.register(require("@fastify/cors"))
fastify.register(require("@fastify/env"),{
    schema:{
        type:"object",
        required:["PORT","MONGO_URI","JWT_TOKEN"],
        properties:{
            PORT:{type:"string",default:4000},
            MONGO_URI:{type:"string"},
            JWT_TOKEN:{type:"string"}
        }
        
    }
})
fastify.register(require("@fastify/sensible"));

// Declare a route
fastify.get("/", function (request, reply) {
  reply.send({ hello: "world" });
});

const start = async () => {
  try {
    await fastify.listen({ port: process.env.PORT });
    fastify.log.info(`
          Server is running at http://localhost:${process.env.PORT}
        `);
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
};

start();
