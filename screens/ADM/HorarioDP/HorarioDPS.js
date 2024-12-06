import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getFirestore, doc, getDoc, collection, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { app } from '../../../config/firebaseConfig';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function MainScreen({ navigation }) {
  const [data, setData] = useState(null);
  const [horaEntrada, setHoraEntrada] = useState(null);
  const [horaSaida, setHoraSaida] = useState(null);

  const [showDataPicker, setShowDataPicker] = useState(false);
  const [showEntradaPicker, setShowEntradaPicker] = useState(false);
  const [showSaidaPicker, setShowSaidaPicker] = useState(false);

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [profileImage, setProfileImage] = useState(null);

  const db = getFirestore(app);
  const auth = getAuth(app);

  // Função para pegar dados do usuário atual
  const getNomeEEmailAdministrador = async () => {
    const user = auth.currentUser;
    if (user) {
      const userDoc = doc(db, 'users', user.uid);
      const userSnapshot = await getDoc(userDoc);
      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        setNome(userData.name || 'Administrador');
        setEmail(userData.email || 'email@example.com');
        setProfileImage(userData.profileImage || null);  // Definindo a foto de perfil
      }
    }
  };

  useEffect(() => {
    getNomeEEmailAdministrador();
  }, []);

  const registrarHorario = async () => {
    if (!data || !horaEntrada || !horaSaida) {
      Alert.alert(
        'Erro',
        'Por favor, preencha todos os campos antes de registrar o horário.',
        [{ text: 'OK' }]
      );
      return;  // Não continua a execução se os campos não estiverem preenchidos
    }

    const horarioRef = collection(db, 'horarioDisponivel');
    try {
      await addDoc(horarioRef, {
        nome: nome,
        data: data ? data.toISOString().split('T')[0] : '',
        horaEntrada: horaEntrada ? horaEntrada.toLocaleTimeString() : '',
        horaSaida: horaSaida ? horaSaida.toLocaleTimeString() : '',
      });
      alert('Horário registrado com sucesso!');
      // Navegar para a tela HorarioRS após o sucesso
      navigation.navigate('HorarioRS');  // Navegação para a tela HorarioRS
    } catch (e) {
      alert('Erro ao registrar horário: ' + e.message);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || data;
    setShowDataPicker(Platform.OS === 'ios' ? true : false);
    setData(currentDate);
  };

  const handleEntradaChange = (event, selectedDate) => {
    const currentDate = selectedDate || horaEntrada;
    setShowEntradaPicker(Platform.OS === 'ios' ? true : false);
    setHoraEntrada(currentDate);
  };

  const handleSaidaChange = (event, selectedDate) => {
    const currentDate = selectedDate || horaSaida;
    setShowSaidaPicker(Platform.OS === 'ios' ? true : false);
    setHoraSaida(currentDate);
  };

  const showDatePicker = () => setShowDataPicker(true);
  const showEntradaPickerDialog = () => setShowEntradaPicker(true);
  const showSaidaPickerDialog = () => setShowSaidaPicker(true);

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.profileContainer}>
          <Image
            style={styles.profileIcon}
            source={profileImage ? { uri: profileImage } : require('../../../assets/icon_momentaneo.png')}
          />
          <View>
            <Text style={styles.profileName}>{nome}</Text>
            <Text style={styles.profileEmail}>{email}</Text>
          </View>
        </View>
        <Text style={styles.categoriesText}>Horário de Disponibilidade</Text>
      </View>

      <View style={styles.separator} />

      <LinearGradient colors={['#0056b3', '#000000']} style={styles.boxesContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Image style={styles.backIcon} source={require('../../../assets/voltar.png')} />
        </TouchableOpacity>

        <View style={styles.spacing} />

        <View style={styles.inputRow}>
          <View style={styles.inputContainerData}>
            <Image style={styles.icon} source={require('../../../assets/calendario.png')} />
            <Text style={styles.label}>Data</Text>
            <TouchableOpacity onPress={showDatePicker} style={styles.inputBox}>
              <Text style={styles.inputText}>
                {data ? data.toLocaleDateString() : ''}
              </Text>
            </TouchableOpacity>
            {showDataPicker && (
              <DateTimePicker
                value={data || new Date()}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}
          </View>

          <View style={styles.inputContainer}>
            <Image style={styles.icon} source={require('../../../assets/relog.png')} />
            <Text style={styles.label}>Entrada</Text>
            <TouchableOpacity onPress={showEntradaPickerDialog} style={styles.inputBox}>
              <Text style={styles.inputText}>
                {horaEntrada ? horaEntrada.toLocaleTimeString() : ''}
              </Text>
            </TouchableOpacity>
            {showEntradaPicker && (
              <DateTimePicker
                value={horaEntrada || new Date()}
                mode="time"
                display="default"
                onChange={handleEntradaChange}
              />
            )}
          </View>

          <View style={styles.inputContainer}>
            <Image style={styles.icon} source={require('../../../assets/relog.png')} />
            <Text style={styles.label}>Saída</Text>
            <TouchableOpacity onPress={showSaidaPickerDialog} style={styles.inputBox}>
              <Text style={styles.inputText}>
                {horaSaida ? horaSaida.toLocaleTimeString() : ''}
              </Text>
            </TouchableOpacity>
            {showSaidaPicker && (
              <DateTimePicker
                value={horaSaida || new Date()}
                mode="time"
                display="default"
                onChange={handleSaidaChange}
              />
            )}
          </View>
        </View>

        <TouchableOpacity onPress={() => {
          setData(null);
          setHoraEntrada(null);
          setHoraSaida(null);
        }}>
          <Image style={styles.trashIcon} source={require('../../../assets/lixeira.png')} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.bottomOption} onPress={registrarHorario}>
          <Text style={styles.sendButtonText}>Registrar Horário</Text>
        </TouchableOpacity>
      </LinearGradient>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomOption} onPress={() => navigation.navigate('PerfilADM')}>
          <Image style={styles.bottomIcon} source={require('../../../assets/perfil.png')} />
          <Text style={styles.bottomText}>Perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.bottomOption} onPress={() => navigation.navigate('MainScreenADM')}>
          <Image style={styles.bottomIcon} source={require('../../../assets/inicio.png')} />
          <Text style={styles.bottomText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.bottomOption} onPress={() => navigation.navigate('MainEmail')}>
          <Image style={styles.bottomIcon} source={require('../../../assets/email.png')} />
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
  boxesContainer: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  inputContainer: {
    alignItems: 'center',
    width: '30%',
    marginBottom: 20,
    marginRight: 10,
  },
  inputContainerData: {
    alignItems: 'center',
    width: '36%',
    marginBottom: 20,
    marginRight: 10,
  },
  icon: {
    width: 30,
    height: 30,
    marginBottom: 5,
  },
  label: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputBox: {
    backgroundColor: '#ccc',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputText: {
    color: '#333',
    fontSize: 16,
  },
  trashIcon: {
    width: 40,
    height: 40,
    marginTop: 20,
  },
  sendButtonText: {
    backgroundColor: '#ffd700',
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginTop: 20,
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
  spacing: {
    height: 20,
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
