import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { app } from '../../../config/firebaseConfig';

const ProblemsScreen = () => {
  const navigation = useNavigation();

  const [userData, setUserData] = useState({
    nome: '',
    email: '',
    profileImage: null
  });

  const [registros, setRegistros] = useState([]); // Iniciar com um array vazio
  const [filteredRegistros, setFilteredRegistros] = useState([]); // Também começar vazio
  const [showPicker, setShowPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [message, setMessage] = useState(''); // Adicionando o estado da mensagem

  const handleDeleteRegistro = (id) => {
    const updatedRegistros = registros.filter(registro => registro.id !== id);
    setRegistros(updatedRegistros);
    setFilteredRegistros(updatedRegistros);
  };

  const handleAddRegistro = () => {
    navigation.navigate('NovoRegistroAula');
  };

  const onChange = (event, date) => {
    setShowPicker(false);
    if (date) {
      setSelectedDate(date);
      const selectedDateString = date.toLocaleDateString('pt-BR');
      
      // Filtra os registros com base na data selecionada
      const newFilteredRegistros = registros.filter(registro => {
        const registroDate = new Date(registro.data.split('/').reverse().join('/')); // "DD/MM/YYYY" -> Date object
        return registroDate.toLocaleDateString('pt-BR') === selectedDateString;
      });

      // Verifica se encontrou registros ou não
      if (newFilteredRegistros.length > 0) {
        setFilteredRegistros(newFilteredRegistros);
        setMessage(''); // Limpa a mensagem se houver registros
      } else {
        setFilteredRegistros([]);
        setMessage('Não tem registro de aulas'); // Exibe a mensagem de "não tem registros"
      }
    } else {
      setFilteredRegistros(registros);
      setMessage(''); // Limpa a mensagem se não houver filtro
    }
  };

  const fetchUserData = async () => {
    const auth = getAuth(app);
    const db = getFirestore(app);
    const user = auth.currentUser;

    if (user) {
      const userDoc = doc(db, 'users', user.uid);
      const userSnapshot = await getDoc(userDoc);
      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        setUserData({
          nome: userData.name || "Nome não disponível",
          email: userData.email || "Email não disponível",
          profileImage: userData.profileImage || require('../../../assets/icon_momentaneo.png')
        });
      }
    }
  };

  const fetchRegistros = async () => {
    const db = getFirestore(app);
    const registrosRef = collection(db, 'registros_aulas');
    const registrosSnapshot = await getDocs(registrosRef);

    const registrosData = registrosSnapshot.docs.map(doc => ({
      id: doc.id,  // Adicionando o ID do documento
      ...doc.data()  // Pegando os dados do documento
    }));

    setRegistros(registrosData);
    setFilteredRegistros(registrosData); // Inicialmente exibe todos os registros
  };

  useEffect(() => {
    fetchUserData();
    fetchRegistros(); // Buscar os registros reais quando a tela carregar
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.registro}>
      <Image style={styles.registroIcon} source={require('./IMG_RegistroAula/agenda.png')} />
      <View style={styles.registroInfo}>
        <Text style={styles.registroData}>{item.data}</Text>
        <Text style={styles.registroAula}>Aula de: {item.disciplina}</Text>
      </View>
      <TouchableOpacity style={styles.registroDelete} onPress={() => handleDeleteRegistro(item.id)}>
        <Icon name="delete" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.profileContainer}>
          <Image
            style={styles.profileIcon}
            source={userData.profileImage ? { uri: userData.profileImage } : require('../../../assets/icon_momentaneo.png')}
          />
          <View>
            <Text style={styles.profileName}>{userData.nome}</Text>
            <Text style={styles.profileEmail}>{userData.email}</Text>
          </View>
        </View>
        <Text style={styles.headerText}>Registro de Aulas</Text>
      </View>

      <View style={styles.separator} />

      <LinearGradient colors={['#0056b3', '#000000']} style={styles.boxesContainer}>
        {showPicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={onChange}
          />
        )}

        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Image style={styles.backIcon} source={require('../../../assets/voltar.png')} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton} onPress={() => setShowPicker(true)}>
            <Icon name="filter-list" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.addButton} onPress={handleAddRegistro}>
          <Image style={styles.addButtonIcon} source={require('./IMG_RegistroAula/agenda.png')} />
          <Text style={styles.addButtonLabel}>+ Adicionar Novo Registro</Text>
        </TouchableOpacity>

        {/* Exibe mensagem se não houver registros filtrados */}
        {message ? (
          <Text style={styles.noRecordsText}>{message}</Text>
        ) : (
          <FlatList
            data={filteredRegistros.sort((a, b) => new Date(a.data.split('/').reverse().join('-')) - new Date(b.data.split('/').reverse().join('-')))}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            style={styles.list}
            contentContainerStyle={styles.listContainer}
          />
        )}
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
    borderRadius: 37.5,
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
    paddingTop: 10,
  },
  list: {
    padding: 16,
  },
  listContainer: {
    paddingBottom: 80,
  },
  registro: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    marginBottom: 20,
    backgroundColor: '#002462',
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  registroIcon: {
    width: 40,
    height: 40,
    marginRight: 15,
  },
  registroInfo: {
    flex: 1,
  },
  registroData: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registroAula: {
    color: '#fff',
    fontSize: 14,
  },
  registroDelete: {
    padding: 8,
  },
  addButton: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 40,
  },
  addButtonIcon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  addButtonLabel: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    position: 'absolute',
    top: 0,
    left: 10,
    zIndex: 1,
  },
  backIcon: {
    width: 25,
    height: 25,
  },
  filterButton: {
    position: 'absolute',
    top: 0,
    right: 10,
    zIndex: 1,
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
  noRecordsText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    marginTop: 20,
  },
});

export default ProblemsScreen;
