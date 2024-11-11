import { FastifyRequest, FastifyReply } from "fastify";
import { CreateDiagnosticianService } from "../services/CreateDiagnosticianService"

export interface DataProps{
    name: string
    weight: string
    height: string
    age: string
    gender: string
    systolic: string
    diastolic: string
}

class CreateDiagnosticianController{
    async handle(request: FastifyRequest, reply: FastifyReply){
        const { name, weight, height, age, gender, systolic, diastolic } = request.body as DataProps;

    
        const createDiagnostician = new CreateDiagnosticianService();

        const diagnostician = await createDiagnostician.execute({
            name,
            weight,
            height,
            age,
            gender,
            systolic,
            diastolic
        });

        reply.send(diagnostician);
    }    
}

export { CreateDiagnosticianController }