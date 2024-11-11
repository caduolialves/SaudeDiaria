import { DataProps } from "../controllers/CreateDiagnosticianController"
import { GoogleGenerativeAI } from "@google/generative-ai"

class CreateDiagnosticianService {
    async execute({ name, weight, height, age, gender, systolic, diastolic }: DataProps){
        
        try{
            const genAI = new GoogleGenerativeAI(process.env.API_KEY!)
            const model = genAI.getGenerativeModel({model: 'gemini-1.5-flash'})

            const response = await model.generateContent(`
            
            Com base nas seguintes informações:
        
            Nome: ${name}
            Idade: ${age}
            Peso: ${weight} kg
            Altura: ${height} cm
            Gênero: ${gender}
            Pressão Sistólica: ${systolic} 0mmHg
            Pressão Diastólica: ${diastolic} 0mmHg

            Forneça um diagnóstico relacionado à pressão arterial,
            destacando se os níveis estão dentro da faixa normal,
            alta ou baixa para a idade e peso do paciente.
            Se houver risco ou indicação de hipertensão ou hipotensão,
            sugira medidas gerais de cuidado ou quando procurar um médico.
            O diagnóstico deve ser breve e fácil de entender.
            Ignore qualquer parâmetro que não seja os passados,
            retorne em json com as respectivas propriedades,
            propriedade Nome o nome da pessoa,
            propriedade Idade a idade da pessoa,
            propriedade Peso o peso da pessoa,
            propriedade Altura a altura da pessoa,
            propriedade Gênero o gênero da pessoa,
            propriedade Pressao Sistolica a pressao sistolica da pessoa,
            propriedade Pressao Diastolica a pressao diastolica da pessoa,
            propriedade Resposta com o seu diagnóstico,
            retorne em json e nenhuma propriedade pode ter acento.`)
            
            console.log(JSON.stringify(response, null, 2));

            if(response.response && response.response.candidates){
                const jsonText = response.response.candidates[0]?.content.parts[0].text as string;

                //Extrair o JSON
                let jsonString = jsonText.replace(/```\w*\n/g, '').replace(/\n```/g, '').trim()

                let jsonObject =JSON.parse(jsonString)

                return {data: jsonObject}
            }


        } catch(error) {
            console.error("Erro JSON: ", error)
            throw new Error("Failed create.")
        }
    }
}

export { CreateDiagnosticianService }