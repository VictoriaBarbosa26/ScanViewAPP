import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { app } from '../../../config/firebaseConfig';

const db = getFirestore(app);

const ProblemsScreen = () => {
  const navigation = useNavigation();
  const [registros, setRegistros] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  // Carregar dados do usuário (nome, email, imagem de perfil)
  useEffect(() => {
    const auth = getAuth(app);
    const user = auth.currentUser;

    if (user) {
      const userRef = doc(db, 'users', user.uid); // Refere-se ao documento do usuário na coleção "users"
      
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

  const fetchRegistros = async () => {
    const registrosCollection = collection(db, 'registros');
    const querySnapshot = await getDocs(registrosCollection);
    const registrosList = [];
    querySnapshot.forEach((doc) => {
      registrosList.push(doc.data());
    });
    setRegistros(registrosList);
  };

  useEffect(() => {
    fetchRegistros();
  }, []);

  return (
    <View style={styles.container}>
      {/* Faixa preta superior com informações do perfil */}
      <View style={styles.topBar}>
        <View style={styles.profileContainer}>
          <Image 
            style={styles.profileIcon} 
            source={profileImage ? { uri: profileImage } : require('../../../assets/icon_momentaneo.png')} 
          />
          <View>
            <Text style={styles.profileName}>{userName}</Text>
            <Text style={styles.profileEmail}>{userEmail}</Text>
          </View>
        </View>
        <Text style={styles.headerText}>Registro dos Alunos</Text>
      </View>

      <View style={styles.separator} />

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Image style={styles.backIcon} source={require('../../../assets/voltar.png')} />
      </TouchableOpacity>

      <LinearGradient colors={['#003185', '#000000']} style={styles.boxesContainer}>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <View style={styles.table}>
            <View style={styles.headerRow}>
              <Text style={styles.headerCell}>Alunos</Text>
              <Text style={styles.headerCell}>Comput.</Text>
            </View>

            {registros.map((registro, index) => (
              <View key={index} style={styles.row}>
                <Text style={styles.cell}>{registro.nomeCompleto}</Text>
                <Text style={styles.cell}>{registro.computadorUsado}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </LinearGradient>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomOption} onPress={() => navigation.navigate('PerfilProf')}>
          <Image style={styles.bottomIcon} source={require('../../../assets/perfil.png')} />
          <Text style={styles.bottomText}>Perfil</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomOption} onPress={() => navigation.navigate('MainProf')}>
          <Image style={styles.bottomIcon} source={require('../../../assets/inicio.png')} />
          <Text style={styles.bottomText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('MainEmailProf')}>
          <Image style={styles.bottomIcon} source={require('../../../assets/email.png')} />
          <Text style={styles.bottomText}>Inbox</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

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
    width: 75,
    height: 75,
    marginRight: 10,
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
  headerText: {
    color: '#00ffff',
    fontSize: 24,
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
    paddingTop: 60,
  },
  contentContainer: {
    flexGrow: 1,
    padding: 10,
  },
  table: {
    backgroundColor: '#FFFFFF',
    borderColor: '#000000',
    borderWidth: 2,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#0056b3',
    padding: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#000',
  },
  headerCell: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  cell: {
    color: '#000',
    fontSize: 16,
    flex: 1,
    textAlign: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 180,
    left: 20,
    zIndex: 1,
  },
  backIcon: {
    width: 25,
    height: 25,
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
});

export default ProblemsScreen;
