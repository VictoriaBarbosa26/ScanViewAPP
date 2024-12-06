import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, FlatList, TextInput, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc, doc, getDoc } from 'firebase/firestore';
import { app } from '../../../config/firebaseConfig'; 
import DateTimePicker from '@react-native-community/datetimepicker';

const App = () => {
  const navigation = useNavigation();
  const [data, setData] = useState('');
  const [horario, setHorario] = useState('');
  const [laboratorio, setLaboratorio] = useState('');
  const [disciplina, setDisciplina] = useState('');
  const [showLaboratorioModal, setShowLaboratorioModal] = useState(false);
  const [userData, setUserData] = useState({
    nome: '',
    email: '',
    profileImage: null,
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const auth = getAuth(app);
  const firestore = getFirestore(app);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const userDoc = await getDoc(doc(firestore, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserData({
              nome: userData.name || "Nome não disponível",
              email: userData.email || "Email não disponível",
              profileImage: userData.profileImage || require('../../../assets/icon_momentaneo.png')
            });
          } else {
            console.log('Usuário não encontrado no Firestore');
          }
        } catch (error) {
          console.log('Erro ao buscar dados do usuário:', error);
        }
      }
    };

    fetchUserData();
  }, []);

  const getRandomLaboratories = () => {
    const numbers = [1, 2, 3, 4, 5];
    let randomLabs = [];
    while (randomLabs.length < 5) {
      const rand = numbers.splice(Math.floor(Math.random() * numbers.length), 1)[0];
      randomLabs.push(rand);
    }
    return randomLabs;
  };

  const handleSubmit = async () => {
    if (!disciplina || !data || !horario || !laboratorio) {
      alert('Por favor, preencha todos os campos!');
      return;
    }

    try {
      await addDoc(collection(firestore, 'registros_aulas'), {
        disciplina,
        data,
        horario,
        laboratorio,
        createdAt: new Date(),
      });

      alert('Registro de aula enviado com sucesso!');
      setDisciplina('');
      setData('');
      setHorario('');
      setLaboratorio('');
    } catch (error) {
      console.error('Erro ao enviar os dados para o Firestore:', error);
      alert('Erro ao enviar o registro. Tente novamente mais tarde.');
    }
  };

  const handleLaboratorioSelect = (lab) => {
    setLaboratorio(lab);
    setShowLaboratorioModal(false);
  };

  const renderLaboratorioItem = ({ item }) => (
    <TouchableOpacity style={styles.laboratorioItem} onPress={() => handleLaboratorioSelect(item)}>
      <Text style={styles.laboratorioText}>{item}</Text> 
    </TouchableOpacity>
  );

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || data;
    setShowDatePicker(false);
    setData(currentDate.toLocaleDateString());
  };

  const onTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || horario;
    setShowTimePicker(false);
    setHorario(currentTime.toLocaleTimeString());
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.profileContainer}>
          <Image
            style={styles.profileIcon}
            source={userData.profileImage ? { uri: userData.profileImage } : require('../../../assets/icon_momentaneo.png')}
          />
          <View>
            <Text style={styles.profileName}>{userData.nome || 'Nome não disponível'}</Text>
            <Text style={styles.profileEmail}>{userData.email || 'Email não disponível'}</Text>
          </View>
        </View>
        <Text style={styles.headerText}>Novo Registro de Aulas</Text>
      </View>

      <View style={styles.separator} />

      <View style={styles.headerIcons}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Image style={styles.backIcon} source={require('../../../assets/voltar.png')} />
        </TouchableOpacity>
      </View>

      <LinearGradient colors={['#003185', '#000000']} style={styles.boxesContainer}>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <View style={styles.form}>
            <View style={styles.headerWithIcon}>
              <Image source={require('./IMG_RegistroAula/livros.png')} style={styles.bookIcon} />
              <TextInput
                style={styles.disciplinaInput}
                placeholder="Disciplina Aplicada"
                value={disciplina}
                onChangeText={setDisciplina}
              />
            </View>

            <View style={styles.fieldsContainer}>
              <View style={styles.fieldWrapper}>
                <TouchableOpacity
                  style={styles.inputContainer}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Image source={require('./IMG_RegistroAula/agenda.png')} style={styles.icon} />
                </TouchableOpacity>
                <Text style={styles.input}>Data</Text>
                {data ? (
                  <View style={styles.selectionBox}>
                    <Text style={styles.selectionText}>{data}</Text>
                  </View>
                ) : null}
              </View>

              <View style={styles.fieldWrapper}>
                <TouchableOpacity
                  style={styles.inputContainer}
                  onPress={() => setShowTimePicker(true)}
                >
                  <Image source={require('./IMG_RegistroAula/relogio.png')} style={styles.icon} />
                </TouchableOpacity>
                <Text style={styles.input}>Horário</Text>
                {horario ? (
                  <View style={styles.selectionBox}>
                    <Text style={styles.selectionText}>{horario}</Text>
                  </View>
                ) : null}
              </View>

              <View style={styles.fieldWrapper}>
                <TouchableOpacity style={styles.inputContainer} onPress={() => setShowLaboratorioModal(true)}>
                  <Image source={require('./IMG_RegistroAula/porta.png')} style={styles.icon} />
                </TouchableOpacity>
                <Text style={styles.input}>{'Laboratório'}</Text>
                {laboratorio ? (
                  <View style={styles.selectionBox}>
                    <Text style={styles.selectionText}>{laboratorio}</Text>
                  </View>
                ) : null}
              </View>
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Enviar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>

      <Modal
        transparent={true}
        visible={showLaboratorioModal}
        onRequestClose={() => setShowLaboratorioModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecione um Laboratório</Text>
            <FlatList
              data={getRandomLaboratories()}
              renderItem={renderLaboratorioItem}
              keyExtractor={(item) => item.toString()}
            />
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowLaboratorioModal(false)}>
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {showDatePicker && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={new Date()}
          mode="time"
          display="default"
          onChange={onTimeChange}
        />
      )}

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












// Estilos para os componentes
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
    top: 5,
  },
  boxesContainer: {
    flex: 1,
    padding: 10,
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  form: {
    marginBottom: 20,
    marginTop: 20,
  },
  headerWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  bookIcon: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  disciplinaInput: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 7,
    color: 'black',
  },
  fieldsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  fieldWrapper: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  inputContainer: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'transparent',
    borderRadius: 20,
    width: '100%',
  },
  icon: {
    width: 50,
    height: 50,
  },
  input: {
    color: 'white',
    textAlign: 'center',
  },
  selectionBox: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#444',
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  selectionText: {
    color: '#fff',
  },
  submitButton: {
    backgroundColor: '#ffcc00',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  laboratorioItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  laboratorioText: {
    fontSize: 16,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#ffcc00',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#000',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#000',
  },
  bottomOption: {
    alignItems: 'center',
  },
  bottomIcon: {
    width: 25,
    height: 25,
  },
  bottomText: {
    color: '#fff',
  },
  headerIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 5,
    alignItems: 'flex-start',
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 1,
  },
  backIcon: {
    width: 25,
    height: 25,
  },
});

export default App;
