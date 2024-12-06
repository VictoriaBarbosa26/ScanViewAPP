import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getAuth } from 'firebase/auth'; // Para autenticação
import { db } from '../../../../config/firebaseConfig'; // Referência ao Firestore
import { doc, getDoc } from 'firebase/firestore'; // Função para buscar dados no Firestore

export default function MainScreen({ navigation, route }) {
  const { laboratorioSelecionado, problemas, cursoAluno } = route.params || {};
  const [relatos, setRelatos] = useState([]);
  const [nome, setNome] = useState('Nome da Pessoa');
  const [email, setEmail] = useState('email@example.com');
  const [profileImage, setProfileImage] = useState(null); // Foto de perfil

  // Função para remover o problema resolvido da lista
  const removeResolvedProblem = (computadorUsado) => {
    setRelatos((prevRelatos) => prevRelatos.filter((relato) => relato.computadorUsado !== computadorUsado));
  };

  // Função para obter informações do usuário logado
  const getUserInfo = async () => {
    const auth = getAuth();
    const user = auth.currentUser; // Obtém o usuário logado
    if (user) {
      const userDoc = doc(db, 'users', user.uid); // Acessa o documento do usuário no Firestore
      const userSnapshot = await getDoc(userDoc); // Obtém os dados do usuário
      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        setNome(userData.name || 'Nome não disponível');
        setEmail(userData.email || 'email@example.com');
        setProfileImage(userData.profileImage || null); // Se existir, usa a imagem do perfil
      }
    }
  };

  useEffect(() => {
    if (problemas) {
      console.log("Problemas recebidos:", problemas);

      // Filtrando relatos com base no laboratório selecionado
      const relatosPorLaboratorio = problemas.filter((relato) => {
        return `Laboratório ${relato.laboratorio}` === laboratorioSelecionado;
      });

      setRelatos(relatosPorLaboratorio); // Atualiza o estado com os relatos filtrados
    }

    // Obtenção das informações do usuário logado
    getUserInfo();

    // Log dos parâmetros para preparar o envio para a próxima tela
    console.log("Laboratório Selecionado:", laboratorioSelecionado);
    console.log("Relatos filtrados:", relatos);

    // Log para verificar o cursoAluno recebido
    console.log("Curso do aluno recebido:", cursoAluno);
  }, [laboratorioSelecionado, problemas, cursoAluno]);

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.profileContainer}>
          {/* Exibe a foto do perfil, se houver uma */}
          <Image 
            style={styles.profileIcon} 
            source={profileImage ? { uri: profileImage } : require('../../../../assets/icon_momentaneo.png')} 
          />
          <View>
            <Text style={styles.profileName}>{nome}</Text>
            <Text style={styles.profileEmail}>{email}</Text>
          </View>
        </View>
        <Text style={styles.categoriesText}>Visualizar Problemas</Text>
      </View>

      <View style={styles.separator} />

      <LinearGradient colors={['#0056b3', '#000000']} style={styles.boxesContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Image style={styles.backIcon} source={require('../../../../assets/voltar.png')} />
        </TouchableOpacity>

        <View style={styles.spacing} />

        {/* ScrollView para os relatos */}
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {relatos.length > 0 ? (
            relatos.map((relato, index) => (
              <View key={index} style={styles.boxContainer}>
                <TouchableOpacity
                  style={styles.box}
                  onPress={() => {
                    const computadorUsado = relato.computadorUsado;

                    // Navegação para a tela de resolução do problema
                    navigation.navigate('BoxADM', {
                      problemas: relato.problemas,
                      nomeCompleto: relato.nomeCompleto,
                      cursoAluno: cursoAluno,
                      laboratorioSelecionado: laboratorioSelecionado,
                      computadorUsado: computadorUsado,
                      removeResolvedProblem: removeResolvedProblem, // Passando a função
                    });
                  }}
                >
                  <Text style={styles.numberText}>{relato.computadorUsado}</Text>
                  <Text style={styles.boxText}>{relato.nomeCompleto}</Text>
                  <Image style={styles.eyeIcon} source={require('../../../../assets/visao.png')} />
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text style={styles.noRecordsText}>Nenhum registro encontrado.</Text>
          )}
        </ScrollView>
      </LinearGradient>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomOption} onPress={() => navigation.navigate('PerfilADM')}>
          <Image style={styles.bottomIcon} source={require('../../../../assets/perfil.png')} />
          <Text style={styles.bottomText}>Perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.bottomOption} onPress={() => navigation.navigate('MainScreenADM')}>
          <Image style={styles.bottomIcon} source={require('../../../../assets/inicio.png')} />
          <Text style={styles.bottomText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.bottomOption} onPress={() => navigation.navigate('MainEmail')}>
          <Image style={styles.bottomIcon} source={require('../../../../assets/email.png')} />
          <Text style={styles.bottomText}>Inbox</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Estilos da tela
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  topBar: {
    backgroundColor: '#000',
    padding: 20,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileIcon: {
    width: 75, // Tamanho do ícone do perfil
    height: 75,
    marginRight: 10, // Espaçamento entre o ícone e o texto
    borderRadius: 37.5, // Tornando a imagem redonda
  },
  profileName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileEmail: {
    color: '#ccc',
    fontSize: 14,
  },
  categoriesText: {
    color: '#00ffff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  separator: {
    height: 2,
    backgroundColor: '#fff',
  },
  boxesContainer: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingBottom: 20, // Garantir que o conteúdo não fique cortado
  },
  boxContainer: {
    marginBottom: 30,
  },
  box: {
    backgroundColor: '#fff',
    borderRadius: 5,
    borderColor: '#fff',
    borderWidth: 1,
    padding: 10,
    width: 300,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  numberText: {
    color: '#000',
    fontWeight: 'bold',
  },
  boxText: {
    color: '#000',
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  eyeIcon: {
    width: 25,
    height: 25,
  },
  noRecordsText: {
    color: '#fff',
    textAlign: 'center',
    marginVertical: 20,
  },
  bottomBar: {
    backgroundColor: '#000',
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  bottomOption: {
    alignItems: 'center',
  },
  bottomIcon: {
    width: 25,
    height: 25,
    marginBottom: 5,
  },
  bottomText: {
    color: '#fff',
    fontSize: 12,
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 20,
    zIndex: 1,
  },
  backIcon: {
    width: 25,
    height: 25,
  },
  spacing: {
    height: 110, // Ajuste para garantir que o conteúdo tenha espaço adequado
  },
});
