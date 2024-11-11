import{
    View,
    Text,
    StyleSheet,
    Pressable,
    ScrollView,
} from 'react-native'

import { colors } from '../../constants/colors'
import { Header } from '../../components/header'
import { Select } from '../../components/input/select'
import { Input } from '../../components/input'
import { useDataStore } from '../../store/data'
import { router } from 'expo-router'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

const schema = z.object({
    gender: z.string().min(1, {message: "O sexo é obrigatório"}),
    systolic: z.string().min(1, {message: "A Pressão Sistólica é obrigatória"}),
    diastolic: z.string().min(1, {message: "A Pressão Diastólica é obrigatória"}),
})

type FormData = z.infer<typeof schema>

export default function Create() {

    const { control, handleSubmit, formState: {errors, isValid}} =
    useForm<FormData>({
        resolver: zodResolver(schema)
    })

    const setPageTwo = useDataStore(state => state.setPageTwo)

    const genderOptions = [
        {label: "Masculino", value: "Masculino"},
        {label: "Feminino", value: "Feminino"},
    ]

    function handleCreate(data: FormData){
        setPageTwo({
            gender: data.gender,
            systolic: data.diastolic,
            diastolic: data.systolic,
        })

        router.push("/diagnostician")
    }

    return(
        <View style={styles.container}>
            <Header
                step='Passo 2'
                title='Finalizando diagnóstico'
            />

        <ScrollView style={styles.content}>
            
            <Text style={styles.label}>Sexo:</Text>
            <Select
                control={control}
                name='gender'
                placeholder='Selecione o seu Sexo'
                error={errors.gender?.message}
                options={genderOptions}
            />

            <Text style={styles.label}>Pressão Diastólica</Text>
            <Input
            name="diastolic"
            control={control}
            placeholder="Ex: 14"
            error={errors.diastolic?.message}
            keyboardType="numeric"
            />  

            <Text style={styles.label}>Pressão Sistólica</Text>
            <Input
            name="systolic"
            control={control}
            placeholder="Ex: 8"
            error={errors.systolic?.message}
            keyboardType="numeric"
            />

            <Pressable style={styles.button} onPress={handleSubmit(handleCreate)}>
                <Text style={styles.buttonText}>Avançar</Text>
            </Pressable>
            
            </ScrollView>


        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: colors.background,

    },
    content:{
        paddingLeft: 16,
        paddingRight: 16,

    },
    label:{
        fontSize: 16,
        color: colors.white,
        fontWeight: 'bold',
        marginBottom: 8,

    },
    button:{
        backgroundColor: colors.blue,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
    },
    buttonText:{
        color: colors.white,
        fontSize: 16,
        fontWeight: 'bold'
    },
})