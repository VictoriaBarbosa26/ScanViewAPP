import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { app } from '../../../config/firebaseConfig';

const ProblemsScreen = () => {
  const navigation = useNavigation();
  const [horarios, setHorarios] = useState([]); // Store available times
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null); // To store selected time
  const [nomeProfessor, setNomeProfessor] = useState(""); // Professor's name
  const [emailProfessor, setEmailProfessor] = useState(""); // Professor's email
  const [profileImage, setProfileImage] = useState(null); // To store the user's profile image

  // Firebase setup
  const db = getFirestore(app);
  const auth = getAuth(app);

  // Format date function
  const formatarData = (data) => {
    const date = new Date(data);
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const ano = date.getFullYear();
    return `${dia}/${mes}/${ano}`;
  };

  // Fetch available times from Firestore
  const fetchHorarios = async () => {
    const horariosRef = collection(db, 'horarioDisponivel');
    const horariosSnapshot = await getDocs(horariosRef);
    const horariosList = horariosSnapshot.docs.map(doc => doc.data());
    setHorarios(horariosList);
  };

  // Fetch professor's info and profile image
  const fetchNomeProfessor = async () => {
    const user = auth.currentUser;
    if (user) {
      const userDoc = doc(db, 'users', user.uid);
      const userSnapshot = await getDoc(userDoc);
      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        setNomeProfessor(userData.name || "Professor");
        setEmailProfessor(userData.email || "email@professor.com");

        // Fetching profile image from Firestore
        const imageUrl = userData.profileImage;
        setProfileImage(imageUrl ? imageUrl : null);
      }
    }
  };

  // Call functions when component mounts
  useEffect(() => {
    fetchHorarios();
    fetchNomeProfessor();
  }, []);

  // Handle date press
  const handleDatePress = (date) => {
    setSelectedDate(date);
  };

  // Handle time selection
  const handleTimePress = (time) => {
    setSelectedTime(time);
    Alert.alert(`Selected time: ${time.horaEntrada} - ${time.horaSaida}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.profileContainer}>
          <Image
            style={styles.profileIcon}
            source={profileImage ? { uri: profileImage } : require('../../../assets/icon_momentaneo.png')} // Display profile image or default
          />
          <View>
            <Text style={styles.profileName}>{nomeProfessor}</Text>
            <Text style={styles.profileEmail}>{emailProfessor}</Text>
          </View>
        </View>
        <Text style={styles.headerText}>Horários de Disponibilidade</Text>
      </View>

      <View style={styles.separator} />

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Image style={styles.backIcon} source={require('../../../assets/voltar.png')} />
      </TouchableOpacity>

      <LinearGradient colors={['#003185', '#000000']} style={styles.boxesContainer}>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <View style={styles.datesContainer}>
            {horarios.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.dateItem}
                onPress={() => handleDatePress(item.data)}
              >
                <Image
                  source={require('./IMG_HorarioDisp/agenda.png')}
                  style={styles.calendarImage}
                />
                <View style={styles.dateText}>
                  <Text style={styles.date}>{formatarData(item.data)}</Text>
                  <Text style={styles.time}>
                    {item.horaEntrada} - {item.horaSaida}
                  </Text>
                  <Text style={styles.AdmName}>Administrador: {item.nome}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </LinearGradient>

      {/* Selected date and time display */}
      {selectedDate && selectedTime && (
        <View style={styles.selectedInfoContainer}>
          <Text style={styles.selectedInfoText}>Data: {formatarData(selectedDate)}</Text>
          <Text style={styles.selectedInfoText}>Horário: {selectedTime.horaEntrada} - {selectedTime.horaSaida}</Text>
        </View>
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
    alignItems: 'center',
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
  datesContainer: {
    padding: 20,
    alignItems: 'center',
  },
  dateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    backgroundColor: '#002462',
    borderWidth: 1,
    borderColor: '#808080',
    width: '97%',
  },
  selectedInfoContainer: {
    marginTop: 20,
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 8,
  },
  selectedInfoText: {
    color: '#fff',
    fontSize: 16,
  },
  calendarImage: {
    width: 45,
    height: 45,
    marginRight: 15,
  },
  dateText: {
    flex: 1,
  },
  date: {
    color: '#fff',
    fontSize: 16,
  },
  time: {
    color: '#fff',
    fontSize: 14,
  },
  AdmName: {
    color: '#ccc',
    fontSize: 12,
  },
});

export default ProblemsScreen;
