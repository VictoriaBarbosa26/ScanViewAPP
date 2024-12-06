import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { db } from '../../../../config/firebaseConfig';
import { getAuth } from 'firebase/auth';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore'; // Importa os métodos do Firestore
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export default function MainScreen({ navigation, route }) {
  const [data, setData] = useState(null);
  const [horario, setHorario] = useState(null);
  const [lab, setLab] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

  // Variáveis para armazenar os dados do usuário
  const [profileImage, setProfileImage] = useState(null);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  // Recebe o número do computador da navegação (parâmetro)
  const { computadorUsado } = route.params || {};

  // Recupera os dados do usuário autenticado
  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const userRef = doc(db, 'users', user.uid);
      getDoc(userRef)
        .then((docSnap) => {
          if (docSnap.exists()) {
            const userData = docSnap.data();
            setUserName(userData.name || '');
            setUserEmail(userData.email || '');
            const imageUrl = userData.profileImage;
            setProfileImage(imageUrl?.trim() !== '' ? imageUrl : null);
          }
        })
        .catch((error) => console.log('Erro ao obter dados do usuário:', error));
    }

    // Solicitar permissão para notificações
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permissão de notificações não concedida');
      }
    };

    // Configurar como as notificações devem ser tratadas
    Notifications.setNotificationHandler({
      handleNotification: async (notification) => {
        console.log('Notificação recebida: ', notification);
        return {
          shouldShowAlert: true,  // Exibe um alerta
          shouldPlaySound: true,  // Toca um som
          shouldSetBadge: true,   // Define um badge no ícone do app
        };
      },
    });

    requestPermissions();
  }, []);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleDateConfirm = (date) => {
    setData(date);
    hideDatePicker();
  };

  const showTimePicker = () => {
    setTimePickerVisibility(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  const handleTimeConfirm = (time) => {
    setHorario(time);
    hideTimePicker();
  };

  // Função para limpar os campos do formulário
  const clearData = () => {
    setData(null);
    setLab('');
    setHorario(null);
  };

  // Função para agendar a notificação
  const scheduleNotification = async (data) => {
    const today = new Date();
    const maintenanceDate = new Date(data);

    if (maintenanceDate <= today) {
      console.log('A data de manutenção deve ser no futuro. Nenhuma notificação será agendada.');
      return;
    }

    const notificationDate = new Date(maintenanceDate);
    notificationDate.setDate(notificationDate.getDate() - 1);

    const formattedDate = notificationDate.toLocaleString();
    const notificationBody = `Lembre-se de que o computador ${computadorUsado} está agendado para manutenção amanhã, em ${formattedDate}. Laboratório: ${lab} Curso: Administração`;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'ScanView',
        body: notificationBody,
        sound: true,
      },
      trigger: {
        date: notificationDate,
      },
    });

    console.log('Notificação agendada para', notificationDate);
  };

  const handleSubmit = async () => {
    try {
      const agendamento = {
        computador: computadorUsado,
        curso: 'Administração',
        data: data,
        horario: horario,
        laboratorio: lab,
      };

      await addDoc(collection(db, 'agendamentos'), agendamento);
      console.log('Agendamento enviado com sucesso:', agendamento);

      // Agendar a notificação
      scheduleNotification(data);

      navigation.navigate('AgendamentoSucesso_ADM');
    } catch (error) {
      console.error('Erro ao enviar agendamento:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.profileContainer}>
          <Image
            style={styles.profileIcon}
            source={profileImage ? { uri: profileImage } : require('../../../../assets/icon_momentaneo.png')}
          />
          <View>
            <Text style={styles.profileName}>{userName}</Text>
            <Text style={styles.profileEmail}>{userEmail}</Text>
          </View>
        </View>
        <Text style={styles.categoriesText}>Agendamento de Manutenção</Text>
      </View>

      <View style={styles.separator} />

      <LinearGradient colors={['#003185', '#000000']} style={styles.boxesContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Image style={styles.backIcon} source={require('../../../../assets/voltar.png')} />
        </TouchableOpacity>

        <View style={styles.spacing} />
        <Text style={styles.deviceText}>Computador</Text>

        <View style={styles.deviceNumberContainer}>
          <Text style={styles.deviceNumberText}>{computadorUsado}</Text>
        </View>

        <View style={styles.inputRow}>
          <View style={styles.inputContainer}>
            <Image style={styles.icon} source={require('../../../../assets/calendario.png')} />
            <Text style={styles.label}>Data</Text>
            <TouchableOpacity onPress={showDatePicker} style={styles.inputBox}>
              <Text style={styles.inputText}>{data ? data.toLocaleDateString() : ''}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Image style={styles.icon} source={require('../../../../assets/porta.png')} />
            <Text style={styles.label}>Laboratório</Text>
            <View style={styles.inputBoxLab}>
              <TextInput
                style={styles.input}
                placeholderTextColor="#ccc"
                value={lab}
                onChangeText={setLab}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Image style={styles.icon} source={require('../../../../assets/relog.png')} />
            <Text style={styles.label}>Horário</Text>
            <TouchableOpacity onPress={showTimePicker} style={styles.inputBox}>
              <Text style={styles.inputText}>{horario ? horario.toLocaleTimeString() : ''}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity onPress={clearData}>
          <Image style={styles.trashIcon} source={require('../../../../assets/lixeira.png')} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.bottomOption} onPress={handleSubmit}>
          <Text style={styles.sendButtonText}>Enviar</Text>
        </TouchableOpacity>
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

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleDateConfirm}
        onCancel={hideDatePicker}
      />

      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        is24Hour={true}
        onConfirm={handleTimeConfirm}
        onCancel={hideTimePicker}
      />
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
  deviceText: {
    color: '#ffff00',
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  deviceNumberContainer: {
    backgroundColor: '#fff',
    borderRadius: 50,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  deviceNumberText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 20,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',  // Aqui foi alterado para "space-between" para adicionar espaçamento
    marginBottom: 20,
    width: '100%',
  },
  inputContainer: {
    alignItems: 'center',
    marginBottom: 25,  // Adicionado para dar espaçamento entre os campos
    width: '30%',  // Definir um tamanho fixo para os campos (garantir que fiquem do mesmo tamanho)
  },
  icon: {
    width: 50,
    height: 50,
    marginBottom: 5,
  },
  label: {
    color: '#fff',
    fontSize: 14,
  },
  inputBox: {
    width: '85%', // Garantir que a caixa de entrada ocupe 100% do container
    backgroundColor: '#808080', // Caixa cinza
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  inputBoxLab: {
    width: '85%', // Garantir que a caixa de entrada ocupe 100% do container
    backgroundColor: '#808080', // Caixa cinza
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 1,
    marginBottom: 10,
    alignItems: 'center',
  },
  input: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
  inputText: {
    color: '#fff',
  },
  trashIcon: {
    width: 40,
    height: 40,
    marginBottom: 30,
  },
  sendButtonText: {
    backgroundColor: '#ffd700',
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 10,
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
