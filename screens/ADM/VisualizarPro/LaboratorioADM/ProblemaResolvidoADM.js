import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getAuth } from 'firebase/auth'; // Importação para Firebase Auth
import { getFirestore, doc, getDoc } from 'firebase/firestore'; // Importação para Firestore
import { app } from '../../../../config/firebaseConfig'; // Sua configuração do Firebase

export default function ViewProblemsScreen({ navigation }) {
  // Estados para armazenar nome, e-mail e foto de perfil do usuário
  const [nome, setNome] = useState('Nome da Pessoa');
  const [email, setEmail] = useState('email@example.com');
  const [profileImage, setProfileImage] = useState(null);

  // Instâncias do Firebase
  const auth = getAuth(app);
  const db = getFirestore(app);

  // Função para obter as informações do usuário logado
  const getUserInfo = async () => {
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

  // Chama a função para obter as informações do usuário quando o componente for montado
  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <View style={styles.container}>
      {/* Faixa preta superior */}
      <View style={styles.topBar}>
        <View style={styles.profileContainer}>
          {/* Ícone de perfil */}
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

      {/* Linha branca separando a faixa preta do gradiente */}
      <View style={styles.separator} />

      {/* Gradiente com o ícone e texto centralizado */}
      <LinearGradient colors={['#0056b3', '#000000']} style={styles.resolvedContainer}>
        {/* Botão de voltar no canto superior esquerdo da área azul */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Image style={styles.backIcon} source={require('../../../../assets/voltar.png')} />
        </TouchableOpacity>

        {/* Ícone de correto centralizado */}
        <Image 
          style={styles.checkIcon} 
          source={require('../../../../assets/correto.png')} // Substitua pelo caminho correto do ícone
        />
        {/* Texto "Problema Resolvido" abaixo do ícone */}
        <Text style={styles.resolvedText}>Problema Resolvido</Text>
      </LinearGradient>

      {/* Faixa preta inferior com opções não funcionais */}
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
  resolvedContainer: {
    flex: 1,
    justifyContent: 'center', // Centraliza verticalmente
    alignItems: 'center', // Centraliza horizontalmente
  },
  checkIcon: {
    width: 100, // Ajuste o tamanho conforme necessário
    height: 100,
    marginBottom: 20,
  },
  resolvedText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
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
});
