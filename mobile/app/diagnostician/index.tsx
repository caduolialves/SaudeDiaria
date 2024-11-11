import { View, Text, StyleSheet, Pressable, ScrollView, Share } from 'react-native';
import { useDataStore } from '../../store/data';
import { api } from '../../services/api';
import { useQuery } from '@tanstack/react-query';
import { colors } from '../../constants/colors';
import { Link } from 'expo-router';

export default function Diagnostician() {
    const user = useDataStore(state => state.user);

    const { data, isFetching, error } = useQuery({
        queryKey: ["diagnostician"],
        queryFn: async () => {
            if (!user) {
                throw new Error("Falha ao tentar carregar diagnóstico!");
            }

            try {
                const response = await api.post("", {
                    name: user.name,
                    weight: user.weight,
                    height: user.height,
                    age: user.age,
                    gender: user.gender,
                    systolic: user.systolic,
                    diastolic: user.diastolic,
                });

                return response.data;
            } catch (err) {
                throw new Error("Erro ao gerar diagnóstico.");
            }
            
        }
    });

    if (isFetching) {
        return (
            <View style={styles.loading}>
                <Text style={styles.loadingText}>Gerando diagnóstico!</Text>
                <Text style={styles.loadingText}>Consultando IA...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.loading}>
                <Text style={styles.loadingText}>Erro ao gerar diagnóstico.</Text>
                <Link href="/create">
                    <Text style={styles.retry}>Tente Novamente</Text>
                </Link>
            </View>
        );
    }

    // Pegar a data e hora atuais
    const now = new Date();
    const date = now.toLocaleDateString(); // formato da data (dia/mês/ano)
    const time = now.toLocaleTimeString(); // formato da hora

    // Função para compartilhar o diagnóstico
    const handleShare = async () => {
        try {
            const message = `
                Diagnóstico de ${user.name} - ${date} às ${time}
                Peso: ${user.weight} kg
                Pressão Sistólica: ${user.systolic}0mmHg
                Pressão Diastólica: ${user.diastolic}0mmHg
                Diagnóstico da IA: ${data?.data?.Resposta || 'Não disponível'}
            `;
            await Share.share({
                message,
            });
        } catch (error) {
            console.error('Erro ao compartilhar:', error);
        }
    };

    return (
        <ScrollView style={styles.container}>

            <View style={styles.containerHeader}>
                <View style={styles.contentHeader}>
                    <Text style={styles.title}>Diagnóstico</Text>

                    <Pressable style={styles.buttonShare} onPress={handleShare}>
                        <Text style={styles.buttonShareText}>Compartilhar</Text>
                    </Pressable>
                </View>
            </View>
            
            <View>

                {data && Object.keys(data).length > 0 && (
                    <>
                        <Text style={styles.name}>Nome: {user.name}</Text>
                        <Text style={styles.age}>Idade: {user.age}</Text>

                        <Text style={styles.diagnosticianText}>Histórico de Diagnósticos:</Text>
                    </>
                )}
            </View>
            

            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.card}>
                    <View style={styles.listItem}>
                        <Text style={styles.label}>Data do diagnóstico:</Text>
                        <Text style={styles.value}>{date} às {time}</Text>
                    </View>

                    <View style={styles.listItem}>
                        <Text style={styles.label}>Peso:</Text>
                        <Text style={styles.value}>{user.weight} kg</Text>
                    </View>

                    <View style={styles.listItem}>
                        <Text style={styles.label}>Pressão Sistólica:</Text>
                        <Text style={styles.value}>{user.systolic}0mmHg</Text>
                    </View>

                    <View style={styles.listItem}>
                        <Text style={styles.label}>Pressão Diastólica:</Text>
                        <Text style={styles.value}>{user.diastolic}0mmHg</Text>
                    </View>

                    {/* Exibindo o diagnóstico gerado pela IA */}
                    {data && data.data && data.data.Resposta ? (
                    <View style={styles.diagnosisSection}>
                        <Text style={styles.label}>Diagnóstico da IA:</Text>
                        <Text style={styles.diagnosisText}>{data.data.Resposta}</Text>
                    </View>
                    ) : (
                    <Text style={styles.diagnosisText}>Erro ao carregar diagnóstico. Dados: {JSON.stringify(data)}</Text>
                    )}
                </View>

                <Pressable style={styles.button}>
                    <Link href="/step">
                        <Text style={styles.buttonText}>Novo Diagnóstico</Text>
                    </Link>
                </Pressable>
            </ScrollView>
        
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    card:{
        backgroundColor: colors.white,
        padding: 40,
        borderRadius: 10,
        marginBottom: 20,
    },
    listItem: {
        marginBottom: 12,
    },
    label: {
        fontSize: 16,
        color: '#333',
        fontWeight: '600',
    },
    value: {
        fontSize: 14,
        color: '#555',
        marginTop: 5,
    },
    diagnosisSection: {
        marginTop: 20,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    diagnosisText: {
        fontSize: 14,
        color: '#333',
        marginTop: 10,
    },
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: 20,
    },
    loading: {
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 18,
        color: colors.white,
        marginBottom: 4,
    },
    containerHeader: {
        backgroundColor: colors.white,
        borderBottomLeftRadius: 14,
        borderBottomRightRadius: 14,
        paddingTop: 60,
        paddingBottom:20,
        marginBottom: 16,
    },
    contentHeader:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 16,
        paddingRight: 16,
    },
    title:{
        fontSize: 28,
        color: colors.background,
        fontWeight: 'bold',
    },
    buttonShare: {
        backgroundColor: colors.blue,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
        borderRadius: 4,
    },
    buttonShareText:{
        color: colors.white,
        fontWeight: '500',
    },
    retry:{
        color: colors.blue,
        fontSize: 18,
    },
    name:{
        color: colors.white,
        fontSize: 20,
        fontWeight: 'bold'
    },
    age:{
        color: colors.white,
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    diagnosticianText:{
        color: colors.white,
        fontSize: 15,
        fontWeight: 'bold'
    },
    button:{
        backgroundColor: colors.blue,
        height:40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        marginBottom:60,
    },
    buttonText:{
        color: colors.white,
    },
});