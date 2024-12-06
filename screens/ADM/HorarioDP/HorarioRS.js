import React, { useState, useEffect } from 'react'; 
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'; 
import { LinearGradient } from 'expo-linear-gradient';
import { getAuth } from 'firebase/auth'; // Importação para Firebase Auth
import { getFirestore, doc, getDoc } from 'firebase/firestore'; // Importação para Firestore
import { app } from '../../../config/firebaseConfig'; // Sua configuração do Firebase

// Componente principal da tela
export default function MainScreen({ navigation }) {
  // Definição de estados para armazenar informações da data, laboratório e horário
  const [data, setData] = useState(''); 
  const [lab, setLab] = useState('');
  const [horario, setHorario] = useState('');
  const [nome, setNome] = useState(''); // Estado para o nome do usuário
  const [email, setEmail] = useState(''); // Estado para o e-mail do usuário
  const [profileImage, setProfileImage] = useState(null); // Estado para a imagem de perfil

  // Instâncias do Firebase
  const auth = getAuth(app);
  const db = getFirestore(app);

  // Função para obter o nome, e-mail e imagem de perfil do usuário logado
  const getNomeEEmail = async () => {
    const user = auth.currentUser; // Obtém o usuário logado
    if (user) {
      const userDoc = doc(db, 'users', user.uid); // Refere-se ao documento do usuário no Firestore
      const userSnapshot = await getDoc(userDoc); // Obtém o documento
      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        setNome(userData.name || 'Nome não disponível'); // Define o nome
        setEmail(userData.email || 'email@example.com'); // Define o e-mail
        setProfileImage(userData.profileImage || null); // Define a imagem de perfil
      }
    }
  };

  // Chama a função para obter nome, e-mail e imagem de perfil quando o componente for montado
  useEffect(() => {
    getNomeEEmail();
  }, []);

  // Função para limpar os estados (data, lab, horario)
  const clearData = () => {
    setData('');
    setLab('');
    setHorario('');
  };

  // Função para enviar os dados e navegar para a tela "AgendarCN"
  const handleSubmit = () => {
    navigation.navigate('HorarioRS');
  };

  return (
    <View style={styles.container}>
      {/* Faixa preta superior */}
      <View style={styles.topBar}>
        {/* Container com as informações do perfil */}
        <View style={styles.profileContainer}>
          {/* Ícone de perfil */}
          <Image 
            style={styles.profileIcon} 
            source={profileImage ? { uri: profileImage } : require('../../../assets/icon_momentaneo.png')} 
          />
          <View>
            {/* Nome e email da pessoa logada */}
            <Text style={styles.profileName}>{nome}</Text>
            <Text style={styles.profileEmail}>{email}</Text>
          </View>
        </View>
        {/* Texto de título "Horário de Disponibilidade" */}
        <Text style={styles.categoriesText}>Horário de Disponibilidade</Text>
      </View>

      {/* Linha branca separando a faixa preta do gradiente */}
      <View style={styles.separator} />

      {/* Gradiente azul com preto para a mensagem de sucesso */}
      <LinearGradient colors={['#0056b3', '#000000']} style={styles.boxesContainer}>
        
        {/* Botão de voltar no canto superior esquerdo */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Image style={styles.backIcon} source={require('../../../assets/voltar.png')} />
        </TouchableOpacity>

        {/* Mensagem de sucesso centralizada */}
        <View style={styles.successContainer}>
          {/* Ícone de sucesso */}
          <Image style={styles.successIcon} source={require('../../../assets/correto.png')} />
          <Text style={styles.successText}>Horario Registrado com sucesso!</Text>
        </View>
      </LinearGradient>

      {/* Faixa preta inferior com opções de navegação */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomOption} onPress={() => navigation.navigate('PerfilADM')}>
          <Image style={styles.bottomIcon} source={require('../../../assets/perfil.png')} />
          <Text style={styles.bottomText}>Perfil</Text>
        </TouchableOpacity>

        {/* Botão de navegação para a tela principal de administrador */}
        <TouchableOpacity style={styles.bottomOption} onPress={() => navigation.navigate('MainScreenADM')}>
          <Image style={styles.bottomIcon} source={require('../../../assets/inicio.png')} />
          <Text style={styles.bottomText}>Home</Text>
        </TouchableOpacity>

        {/* Botão de navegação para a caixa de entrada */}
        <TouchableOpacity style={styles.bottomOption} onPress={() => navigation.navigate('MainEmail')}>
          <Image style={styles.bottomIcon} source={require('../../../assets/email.png')} />
          <Text style={styles.bottomText}>Inbox</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Definição dos estilos para os componentes
const styles = StyleSheet.create({
  container: {
    flex: 1,  // O container ocupa toda a tela
    backgroundColor: '#000',  // Cor de fundo preta
  },
  topBar: {
    backgroundColor: '#000',  // Fundo preto para a faixa superior
    padding: 20,  // Espaçamento interno
  },
  profileContainer: {
    flexDirection: 'row',  // Coloca os elementos (imagem e textos) em linha
    alignItems: 'center',  // Alinha os elementos no centro verticalmente
    marginBottom: 10,  // Espaçamento abaixo do container
  },
  profileIcon: {
    width: 75, // Tamanho do ícone do perfil
    height: 75,
    marginRight: 10, // Espaçamento entre o ícone e o texto
    borderRadius: 37.5, // Tornando a imagem redonda
  },
  profileName: {
    color: '#fff',  // Cor do texto branco
    fontSize: 18,  // Tamanho da fonte
    fontWeight: 'bold',  // Negrito
  },
  profileEmail: {
    color: '#ccc',  // Cor do texto cinza
    fontSize: 14,  // Tamanho da fonte
  },
  categoriesText: {
    color: '#00ffff',  // Cor do texto ciano
    fontSize: 20,  // Tamanho da fonte
    fontWeight: 'bold',  // Negrito
    textAlign: 'center',  // Centraliza o texto
  },
  separator: {
    height: 2,  // Altura da linha separadora
    backgroundColor: '#fff',  // Cor branca
  },
  boxesContainer: {
    flex: 1,  // O gradiente ocupa o restante da tela
    padding: 10,  // Espaçamento interno
    justifyContent: 'center',  // Centraliza verticalmente
    alignItems: 'center',  // Centraliza horizontalmente
  },
  successContainer: {
    justifyContent: 'center',  // Centraliza verticalmente
    alignItems: 'center',  // Centraliza horizontalmente
    marginTop: 50,  // Margem superior
  },
  successIcon: {
    width: 100,
    height: 100,  // Dimensões do ícone de sucesso
    marginBottom: 20,  // Espaçamento abaixo do ícone
  },
  successText: {
    color: 'white',  // Cor do texto branco
    fontSize: 18,  // Tamanho da fonte
    marginBottom: 10,  // Espaçamento inferior
    fontWeight: 'bold',  // Negrito
    textAlign: 'center',  // Centraliza o texto
  },
  backButton: {
    position: 'absolute',  // Posição absoluta para sobrepor o botão
    top: 10,  // Posição a partir do topo
    left: 20,  // Posição a partir da esquerda
    zIndex: 1,  // Garante que o botão apareça acima de outros componentes
  },
  backIcon: {
    width: 25,
    height: 25,  // Dimensões do ícone de voltar
  },
  bottomBar: {
    backgroundColor: '#000',  // Fundo preto para a faixa inferior
    flexDirection: 'row',  // Coloca os botões em linha
    justifyContent: 'space-around',  // Espaça igualmente os botões
    padding: 10,  // Espaçamento interno
  },
  bottomOption: {
    alignItems: 'center',  // Centraliza o conteúdo de cada botão
  },
  bottomIcon: {
    width: 25,
    height: 25,  // Dimensões dos ícones da barra inferior
    marginBottom: 5,  // Espaçamento abaixo do ícone
  },
  bottomText: {
    color: '#fff',  // Cor do texto branco
    fontSize: 12,  // Tamanho da fonte
  },
});
