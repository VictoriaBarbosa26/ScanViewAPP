import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, Alert, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { getFirestore, collection, addDoc, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import DropDownPicker from 'react-native-dropdown-picker';
import { app } from '../../../config/firebaseConfig';
import { getAuth } from 'firebase/auth';

const db = getFirestore(app);

const RegisterComputerScreen = () => {
  const navigation = useNavigation();

  const [nomeCompleto, setNomeCompleto] = useState('');
  const [computadorUsado, setComputadorUsado] = useState('');
  const [laboratorio, setLaboratorio] = useState('');
  const [professor, setProfessor] = useState(null);
  const [professores, setProfessores] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true); // Estado de carregamento

  // Função para carregar dados do usuário autenticado (nome, email e foto de perfil)
  useEffect(() => {
    const auth = getAuth(app);
    const user = auth.currentUser;

    if (user) {
      const userRef = doc(db, 'users', user.uid); // Supondo que a coleção do usuário seja "users"
      
      getDoc(userRef)
        .then((docSnap) => {
          if (docSnap.exists()) {
            const userData = docSnap.data();
            setUserName(userData.name || 'Nome do Usuário');
            setUserEmail(userData.email || 'email@example.com');
            setProfileImage(userData.profileImage || null);
          }
        })
        .catch((error) => {
          console.log('Erro ao obter dados do usuário:', error);
        });
    }
  }, []);

  // Carregar lista de professores
  const fetchProfessores = async () => {
    const q = query(collection(db, 'users'), where('role', '==', 'Prof'));
    try {
      const querySnapshot = await getDocs(q);
      const listaProfessores = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.name) {
          listaProfessores.push({ label: data.name, value: doc.id });
        } else {
          console.warn(`Professor sem nome: ${doc.id}`);
        }
      });
      setProfessores(listaProfessores);
    } catch (error) {
      console.error('Erro ao carregar professores: ', error);
    } finally {
      setLoading(false); // Termina o carregamento
    }
  };

  useEffect(() => {
    fetchProfessores();
  }, []);

  // Registrar computador
  const handleRegister = async () => {
    if (!nomeCompleto || !computadorUsado || !laboratorio || !professor) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }
    try {
      const docRef = await addDoc(collection(db, 'registros'), {
        nomeCompleto,
        computadorUsado,
        laboratorio,
        professor,
      });

      console.log('Documento registrado com ID: ', docRef.id);
      Alert.alert('Sucesso', 'Registro realizado com sucesso!');
      setNomeCompleto('');
      setComputadorUsado('');
      setLaboratorio('');
      setProfessor(null);
    } catch (error) {
      console.error('Erro ao registrar os dados:', error);
      Alert.alert('Erro', 'Houve um problema ao registrar. Tente novamente mais tarde.');
    }
  };

  // Renderizar os campos do formulário
  const renderItem = ({ item }) => {
    switch (item.type) {
      case 'textInput':
        return (
          <View style={styles.inputRow}>
            <Image style={styles.inputIcon} source={item.icon} />
            <TextInput
              style={styles.input}
              placeholder={item.placeholder}
              value={item.value}
              onChangeText={item.onChangeText}
            />
          </View>
        );
      case 'dropdown':
        return (
          <View style={styles.inputRow}>
            <Image style={styles.inputIcon} source={item.icon} />
            <DropDownPicker
              open={open}
              value={professor}
              items={professores}
              setOpen={setOpen}
              setValue={setProfessor}
              placeholder={item.placeholder}
              containerStyle={{ height: 54, flex: 1 }}
              style={styles.picker}
              dropDownContainerStyle={styles.dropDownContainer}
            />
          </View>
        );
      default:
        return null;
    }
  };

  const inputData = [
    {
      type: 'textInput',
      icon: require('../RegistrarPC/IMG_Registro/nome.png'),
      placeholder: 'Nome Completo',
      value: nomeCompleto,
      onChangeText: setNomeCompleto,
    },
    {
      type: 'textInput',
      icon: require('../RegistrarPC/IMG_Registro/pc.png'),
      placeholder: 'Computador Usado',
      value: computadorUsado,
      onChangeText: setComputadorUsado,
    },
    {
      type: 'textInput',
      icon: require('../RegistrarPC/IMG_Registro/lab.png'),
      placeholder: 'Laboratório',
      value: laboratorio,
      onChangeText: setLaboratorio,
    },
    {
      type: 'dropdown',
      placeholder: 'Selecione o professor',
      icon: require('../RegistrarPC/IMG_Registro/prof.png'),
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.profileContainer}>
          <Image
            style={styles.profileIcon}
            source={profileImage ? { uri: profileImage } : require('../RegistrarPC/IMG_Registro/icon_momentaneo.png')}
          />
          <View>
            <Text style={styles.profileName}>{userName}</Text>
            <Text style={styles.profileEmail}>{userEmail}</Text>
          </View>
        </View>
        <Text style={styles.headerText}>Registrar Computador</Text>
      </View>
      <View style={styles.separator} />
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Image style={styles.backIcon} source={require('../../../assets/voltar.png')} />
      </TouchableOpacity>
      <LinearGradient colors={['#003185', '#000000']} style={styles.boxesContainer}>
        <FlatList
          data={inputData}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.contentContainer}
          ListFooterComponent={
            <View style={styles.footerContainer}>
              <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Enviar</Text>
              </TouchableOpacity>
            </View>
          }
        />
      </LinearGradient>
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomOption} onPress={() => navigation.navigate('PerfilAluno')}>
          <Image style={styles.bottomIcon} source={require('../RegistrarPC/IMG_Registro/perfil.png')} />
          <Text style={styles.bottomText}>Perfil</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomOption} onPress={() => navigation.navigate('MainAluno')}>
          <Image style={styles.bottomIcon} source={require('../RegistrarPC/IMG_Registro/inicio.png')} />
          <Text style={styles.bottomText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomOption} onPress={() => navigation.navigate('MainEmailAluno')}>
          <Image style={styles.bottomIcon} source={require('../RegistrarPC/IMG_Registro/email.png')} />
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
    borderRadius: 50,
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
    paddingTop: 50,
  },
  contentContainer: {
    padding: 10,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  inputIcon: {
    width: 54,
    height: 54,
    marginRight: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 8,
    padding: 12,
    color: 'black',
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: '#FFC107',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 90,
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
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
    top: 180,
    left: 20,
    zIndex: 1,
  },
  backIcon: {
    width: 25,
    height: 25,
  },
  picker: {
    backgroundColor: 'white',
    borderColor: 'black',
    height: 54,
    flex: 1,
  },
  dropDownContainer: {
    backgroundColor: 'white',
  },
  footerContainer: {
    paddingBottom: 20,
  },
});

export default RegisterComputerScreen;
