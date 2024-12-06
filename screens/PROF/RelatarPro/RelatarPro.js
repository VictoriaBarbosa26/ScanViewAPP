import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, Alert, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { getFirestore, collection, addDoc, doc, getDoc } from 'firebase/firestore';
import DropDownPicker from 'react-native-dropdown-picker';
import { app } from '../../../config/firebaseConfig';
import { getAuth } from 'firebase/auth';

const ProblemsScreen = () => {
  const navigation = useNavigation();
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: '2', value: '2' },
    { label: '3', value: '3' },
    { label: '4', value: '4' },
    { label: '5', value: '5' },
    { label: '6', value: '6' },
    { label: '7', value: '7' },
    { label: '8', value: '8' },
    { label: '9', value: '9' },
    { label: '10', value: '10' },
    { label: '11', value: '11' },
    { label: '12', value: '12' },
    { label: '13', value: '13' },
    { label: '14', value: '14' },
    { label: '15', value: '15' },
    { label: '16', value: '16' },
    { label: '17', value: '17' },
    { label: '18', value: '18' },
    { label: '19', value: '19' },
    { label: '20', value: '20' },
  ]);
  const [lab, setLab] = useState('');
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setNomeCompleto(user.displayName || user.email);

      // Buscar a imagem de perfil no Firestore (se disponível)
      const db = getFirestore(app);
      const userRef = doc(db, 'users', user.uid);

      getDoc(userRef)
        .then((docSnap) => {
          if (docSnap.exists()) {
            const userData = docSnap.data();
            const imageUrl = userData.profileImage;
            if (imageUrl && imageUrl.trim() !== '') {
              setProfileImage(imageUrl);
            } else {
              setProfileImage(null);
            }
            setUserName(userData.name || 'Nome de Usuário');
          }
        })
        .catch((error) => {
          console.error('Erro ao buscar dados do usuário:', error);
        });
    }
  }, []);

  const handleCheckboxChange = (option) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter((item) => item !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  const handleSend = async () => {
    const db = getFirestore(app);
    try {
      await addDoc(collection(db, 'relatos'), {
        nomeCompleto,
        computadorUsado: value,
        laboratorio: lab,
        problemas: selectedOptions,
      });
      Alert.alert('Problema relatado com sucesso!');
      setSelectedOptions([]);
      setValue(null);
      setLab('');
    } catch (error) {
      console.error('Erro ao enviar problema: ', error);
      Alert.alert('Erro ao relatar problema. Tente novamente.');
    }
  };

  const options = [
    'Mau funcionamento do PC',
    'Problema com Monitor',
    'Rede wifi sem conectar',
    'Computador super lento',
    'Aquece demasiado e faz barulho',
    'Entrada USB não funciona',
  ];

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.profileContainer}>
          <Image
            style={styles.profileIcon}
            source={profileImage ? { uri: profileImage } : require('../../../assets/icon_momentaneo.png')}
          />
          <View>
            <Text style={styles.profileName}>{userName}</Text>
            <Text style={styles.profileEmail}>{nomeCompleto}</Text>
          </View>
        </View>
        <Text style={styles.headerText}>Relatar Problemas</Text>
      </View>
      <View style={styles.separator} />
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Image style={styles.backIcon} source={require('../../../assets/voltar.png')} />
      </TouchableOpacity>
      <LinearGradient colors={['#003185', '#000000']} style={styles.boxesContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Laboratório"
            value={lab}
            onChangeText={setLab}
            placeholderTextColor="#ccc"
          />
          <DropDownPicker
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            placeholder="Selecione um Computador"
            containerStyle={{ height: 40, width: '70%' }}
          />
        </View>
        <FlatList
          data={options}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.option} onPress={() => handleCheckboxChange(item)}>
              <View style={[styles.checkbox, selectedOptions.includes(item) && styles.checkboxSelected]} />
              <Text style={styles.optionText}>{item}</Text>
            </TouchableOpacity>
          )}
        />
        <TouchableOpacity style={styles.button} onPress={handleSend}>
          <Text style={styles.buttonText}>Enviar</Text>
        </TouchableOpacity>
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
        <TouchableOpacity style={styles.bottomOption} onPress={() => navigation.navigate('MainEmailAProf')}>
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
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    height: 45,
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 20,
    color: '#fff',
    marginRight: 10,
    width: '28%',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  optionText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 4,
    marginRight: 10,
  },
  checkboxSelected: {
    backgroundColor: '#00ffff',
  },
  button: {
    backgroundColor: '#FFC107',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
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
    width: 30,
    height: 30,
  },
});

export default ProblemsScreen;
