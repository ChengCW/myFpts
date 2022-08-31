import fastify, { FastifyInstance } from 'fastify'
import FastifyStatic from '@fastify/static'
import FastifyCors from '@fastify/cors'
import path from 'path'
import { createSequelizeConn } from './plugins/sequelize'
import { UserRouter } from './routes/user'
import { Iquery } from './types/user'

const opts = {

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

        reply.header("Access-Control-Allow-Origin", "*");
        reply.header("Access-Control-Allow-Methods", "GET");
        return reply.code(200).send({})
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