import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Button, Modal, TextInput, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore'; 
import { app } from '../../config/firebaseConfig';

export default function MensagemAluno({ route, navigation }) {

  const [profileImage, setProfileImage] = useState(null);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  // Carregar dados do usuário
  useEffect(() => {
    const auth = getAuth(app);
    const user = auth.currentUser;

    if (user) {
      const db = getFirestore(app);
      const userRef = doc(db, 'users', user.uid); // Supondo que a coleção do usuário seja "users"

      // Buscando dados do usuário (nome, email, imagem de perfil)
      getDoc(userRef)
        .then((docSnap) => {
          if (docSnap.exists()) {
            const userData = docSnap.data();
            setUserName(userData.name || 'Nome da Pessoa');
            setUserEmail(userData.email || 'email@example.com');
            setProfileImage(userData.profileImage || null); // URL da imagem de perfil
          }
        })
        .catch((error) => {
          console.log('Erro ao obter dados do usuário:', error);
        });
    }
  }, []);

  return (
    <View style={styles.container}>
      {/* Faixa preta superior */}
      <View style={styles.topBar}>
        <View style={styles.profileContainer}>
          {/* Exibindo a imagem do perfil, ou o ícone padrão caso não tenha imagem */}
          <Image
            style={styles.profileIcon}
            source={profileImage ? { uri: profileImage } : require('../../assets/icon_momentaneo.png')}
          />
          <View>
            <Text style={styles.profileName}>{userName}</Text>
            <Text style={styles.profileEmail}>{userEmail}</Text>
          </View>
        </View>
        <Text style={styles.categoriesText}>Mensagem</Text>
      </View>

      {/* Linha branca separando a faixa preta do gradiente */}
      <View style={styles.separator} />

      {/* Gradiente com as caixinhas */}
      <LinearGradient colors={['#003185', '#000000']} style={styles.boxesContainer}>
        <View style={styles.spacing} />

        <View style={styles.row}>
          <View style={styles.boxContainer}>
            <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('RelatarPro')}>
              <Image style={styles.boxImage} source={require('../../assets/relatar.png')} />
            </TouchableOpacity>
            <Text style={styles.boxText}>Relatar Problemas</Text>
          </View>
          <View style={styles.boxContainer}>
            <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('RegistrarPC')}>
              <Image style={styles.boxImage} source={require('../../assets/agendamento.png')} />
            </TouchableOpacity>
            <Text style={styles.boxText}>Registro de Computador</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Faixa preta inferior com opções não funcionais */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomOption} onPress={() => navigation.navigate('PerfilAluno')}>
          <Image style={styles.bottomIcon} source={require('../../assets/perfil.png')} />
          <Text style={styles.bottomText}>Perfil</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomOption}>
          <Image style={styles.bottomIcon} source={require('../../assets/inicio.png')} />
          <Text style={styles.bottomText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomOption} onPress={() => navigation.navigate('MainEmailAluno')}>
          <Image style={styles.bottomIcon} source={require('../../assets/email.png')} />
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
    width: 75, // Tamanho da imagem do perfil
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
    color: '#00ffff', // Ciano
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  separator: {
    height: 2,
    backgroundColor: '#fff', // Linha branca
  },
  boxesContainer: {
    flex: 1,
    padding: 10, // Reduzido para aumentar a proximidade das caixinhas
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15, // Aumenta a distância entre as linhas de caixinhas
  },
  boxContainer: {
    alignItems: 'center',
    width: '48%', // Largura menor para duas caixinhas lado a lado
  },
  box: {
    backgroundColor: '#000',
    borderRadius: 5,
    borderColor: '#fff',
    borderWidth: 1,
    padding: 15, // Mantido para acomodar a imagem
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxImage: {
    width: 50, // Tamanho da imagem
    height: 50,
  },
  boxText: {
    color: '#00ffff', // Ciano
    textAlign: 'center',
    marginTop: 5, // Espaçamento entre a imagem e o texto
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
    width: 25, // Tamanho do ícone
    height: 25,
    marginBottom: 5, // Espaçamento entre o ícone e o texto
  },
  bottomText: {
    color: '#fff',
    fontSize: 12,
  },
  spacing: {
    height: 80, // Espaço extra adicionado para descer as caixinhas
  },
});