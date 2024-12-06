import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, TextInput, Modal, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs, addDoc, doc, getDoc } from 'firebase/firestore';
import { app } from '../../config/firebaseConfig';

const MessageItem = ({ item, navigation }) => (
  <View style={styles.messageContainer}>
    <Image
      source={{ uri: 'https://img.icons8.com/ios-filled/50/000000/agendamento.png' }}
      style={styles.leftImage}
    />
    <View style={styles.textContainer}>
      <Text style={styles.assunto}>Assunto: {item.subject}</Text>
    </View>
    <TouchableOpacity 
      onPress={() => 
        navigation.navigate('MensagemEmail', { 
          subject: item.subject,
          body: item.message,
          sender: item.senderName,
          date: item.createdAt.toDate().toLocaleString()
        })
      }
    >
      <Image
        source={{ uri: 'https://img.icons8.com/ios-filled/50/000000/visible.png' }}
        style={styles.icon}
      />
    </TouchableOpacity>
    <TouchableOpacity>
      <Image source={require('../../assets/email.png')} style={styles.ema} />
    </TouchableOpacity>
  </View>
);

export default function MainScreen({ navigation }) {
  const [profileImage, setProfileImage] = useState(null);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth(app);
    const user = auth.currentUser;
    const db = getFirestore(app);

    if (user) {
      const userRef = doc(db, 'users', user.uid);
      getDoc(userRef)
        .then((docSnap) => {
          if (docSnap.exists()) {
            const userData = docSnap.data();
            setUserName(userData.name || '');
            const email = userData.email || '';
            setUserEmail(email);
            const imageUrl = userData.profileImage;
            setProfileImage(imageUrl?.trim() !== '' ? imageUrl : null);
          }
        })
        .catch((error) => console.log('Erro ao obter dados do usuário:', error));

      const fetchMessages = async () => {
        try {
          const querySnapshot = await getDocs(collection(db, 'messages'));
          const fetchedMessages = [];
          querySnapshot.forEach((doc) => {
            const message = doc.data();
            if (message.recipient === userEmail) {
              fetchedMessages.push({ id: doc.id, ...message });
            }
          });
          setMessages(fetchedMessages);
        } catch (error) {
          console.error('Erro ao buscar mensagens:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchMessages();
    }
  }, [userEmail]);

  const sendMessage = async () => {
    const auth = getAuth(app);
    const user = auth.currentUser;

    if (user && recipient.trim() !== '' && message.trim() !== '' && subject.trim() !== '') {
      const db = getFirestore(app);
      try {
        await addDoc(collection(db, 'messages'), {
          recipient,
          message,
          sender: userEmail,
          senderName: userName,
          subject,
          createdAt: new Date(),
        });

        Alert.alert('Mensagem Enviada!', 'Sua mensagem foi enviada com sucesso.');
        setModalVisible(false);
        setRecipient('');
        setMessage('');
        setSubject('');
      } catch (error) {
        console.error('Erro ao enviar a mensagem:', error);
        Alert.alert('Erro', 'Houve um problema ao enviar sua mensagem.');
      }
    } else {
      Alert.alert('Campos obrigatórios', 'Por favor, preencha todos os campos.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.profileContainer}>
          <Image
            style={styles.profileIcon}
            source={profileImage ? { uri: profileImage } : require('../../assets/icon_momentaneo.png')}
          />
          <View>
            <Text style={styles.profileName}>{userName}</Text>
            <Text style={styles.profileEmail}>{userEmail}</Text>
          </View>
        </View>
        <Text style={styles.categoriesText}>Inbox</Text>
      </View>

      <View style={styles.separator} />

      {/* Gradiente com as caixinhas */}
      <LinearGradient colors={['#003185', '#000000']} style={styles.boxesContainer}>
        
        {/* Espaço extra adicionado acima das caixinhas */}
        <View style={styles.spacing} />

        <View style={styles.row}>
          <View style={styles.boxContainer}>
            <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('SelecionarCurso')}>
              <Image style={styles.boxImage} source={require('../../assets/relatar.png')} />
            </TouchableOpacity>
            <Text style={styles.boxText}>Visualizar Problemas</Text>
          </View>
          <View style={styles.boxContainer}>
            <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('AgendamentoMT')}>
              <Image style={styles.boxImage} source={require('../../assets/agendamento.png')} />
            </TouchableOpacity>
            <Text style={styles.boxText}>Agendamento de Manutenção</Text>
          </View>
        </View>

        {/* Espaço adicionado entre as linhas de caixinhas */}
        <View style={styles.spacing} />

        <View style={styles.row}>
          <View style={styles.boxContainer}>
            <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('HorarioDPS')}>
              <Image style={styles.boxImage} source={require('../../assets/horarios.png')} />
            </TouchableOpacity>
            <Text style={styles.boxText}>Horários de Disponibilidade</Text>
          </View>
        </View>
      </LinearGradient>



      {/* Faixa preta inferior com opções não funcionais */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomOption} onPress={() => navigation.navigate('PerfilADM')}>
          <Image style={styles.bottomIcon} source={require('../../assets/perfil.png')} />
          <Text style={styles.bottomText}>Perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.bottomOption}>
          <Image style={styles.bottomIcon} source={require('../../assets/inicio.png')} />
          <Text style={styles.bottomText}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.bottomOption} onPress={() => navigation.navigate('MainEmail')}>
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