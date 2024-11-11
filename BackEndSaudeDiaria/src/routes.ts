import {
    FastifyInstance,
    FastifyPluginOptions,
    FastifyRequest,
    FastifyReply
} from 'fastify'
import { CreateDiagnosticianController } from './controllers/CreateDiagnosticianController'


export async function routes(fastify:FastifyInstance, options: FastifyPluginOptions) {
    fastify.get("/teste", (request: FastifyRequest, reply: FastifyReply) => {
        console.log("Rota Chamada!")

        reply.send({ok: true})
    })
    
    fastify.post("/create", async (request: FastifyRequest, reply: FastifyReply) => {
        return new CreateDiagnosticianController().handle(request, reply)
    })
}