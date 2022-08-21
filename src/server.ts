import fastify, { FastifyInstance } from 'fastify'
import FastifyStatic from '@fastify/static'
import FastifyCors from '@fastify/cors'
import path from 'path'
import { createSequelizeConn } from './plugins/sequelize'
import { UserRouter } from './routes/user'
import { Iquery } from './types/user'

const opts = {
    schema: {
        querystring: {
            type: "object",
            properties: {
                eqpId: {
                    type: "string",
                },
                ruleObj: {
                    type: "object",
                    properties: {
                        ruleId: { type: "number" },
                        fabphase: { type: "string" },
                    }

                }
            },
        },
    },
}


const listenAddress = '0.0.0.0'

const startFastify = async () => {
    const server: FastifyInstance = fastify({
        logger: {
            transport: {
                target: 'pino-pretty'
            },
            level: 'debug'
        }
    })

    createSequelizeConn()

    server.register(FastifyCors, {})

    server.get<{ Querystring: Iquery }>('/ping', opts, async (request, reply) => {
        const toolObj = { eqpId: "123", phase: "456" }
        const eqplist = [toolObj, toolObj, toolObj, toolObj, toolObj, toolObj]
        reply.header("Access-Control-Allow-Origin", "*");
        reply.header("Access-Control-Allow-Methods", "GET");
        return reply.code(200).send({ eqplist })
    })

    server.get('/pingping', async (request, reply) => {
        return reply.status(200).send({ msg: 'pong' })
    })

    server.register(UserRouter, { prefix: '/api' })

    const fastifyConfig = {
        port: 8888,
        host: listenAddress
    }

    try {
        await server.listen(fastifyConfig)
    } catch (error) {
        server.log.fatal(`${error}`)
    }

    return server
}

export { startFastify }