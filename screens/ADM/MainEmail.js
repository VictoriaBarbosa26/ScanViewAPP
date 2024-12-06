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

      <LinearGradient colors={['#003185', '#000000']} style={styles.gradient}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Image style={styles.backIcon} source={require('../../assets/voltar.png')} />
        </TouchableOpacity>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {loading ? (
            <Text style={styles.loadingText}>Carregando...</Text>
          ) : messages.length > 0 ? (
            messages.map((item) => <MessageItem key={item.id} item={item} navigation={navigation} />)
          ) : (
            <Text style={styles.emptyText}>Nenhuma mensagem encontrada.</Text>
          )}
        </ScrollView>

        <TouchableOpacity style={styles.moreButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.moreText}>+</Text>
        </TouchableOpacity>
      </LinearGradient>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomOption} onPress={() => navigation.navigate('PerfilADM')}>
          <Image style={styles.bottomIcon} source={require('../../assets/perfil.png')} />
          <Text style={styles.bottomText}>Perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.bottomOption} onPress={() => navigation.navigate('MainScreenADM')}>
          <Image style={styles.bottomIcon} source={require('../../assets/inicio.png')} />
          <Text style={styles.bottomText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.bottomOption}>
          <Image style={styles.bottomIcon} source={require('../../assets/email.png')} />
          <Text style={styles.bottomText}>Inbox</Text>
        </TouchableOpacity>
      </View>

      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TextInput
              style={styles.input}
              placeholder="Destinatário"
              value={recipient}
              onChangeText={setRecipient}
            />
            <TextInput
              style={styles.input}
              placeholder="Assunto"
              value={subject}
              onChangeText={setSubject}
            />
            <TextInput
              style={[styles.input, { height: 100 }]}
              placeholder="Mensagem"
              value={message}
              onChangeText={setMessage}
              multiline={true}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.button} onPress={sendMessage}>
                <Text style={styles.buttonText}>Enviar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    marginVertical: 20,
  },
  emptyText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    marginVertical: 20,
  },
  
  container: {
    flex: 1,
  },
  topBar: {
    backgroundColor: '#000',
    padding: 20,
  },
  messageContainer: {
    width: 300, // Define a largura como 90% da tela, por exemplo
    height: 38, // Altura fixa da box
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#fff',
    marginHorizontal: 20, 
    marginVertical: 10, 
    padding: 10, 
    borderRadius: 10, 
    right: -45,
    top: 70,
  },
  backButton: {
    position: 'absolute',  // Posição absoluta para o botão de voltar
    top: 10,  // Distância do topo
    left: 20,  // Distância da esquerda
    zIndex: 1,  // Garante que o botão de voltar fique sobreposto a outros elementos
  },
  backIcon: {
    width: 25,  // Largura do ícone de voltar
    height: 25,  // Altura do ícone de voltar
  },
  leftImage: {
    width: 24, // Tamanho da imagem à esquerda
    height: 24,
    marginRight: 10, // Espaçamento entre a imagem e o texto
  },
  icon: {
    width: 24, 
    height: 24,
    marginLeft: 10, // Espaçamento entre o texto e o ícone de visualização
  },
  ema: {
    width: 30, 
    height: 24,
    marginLeft: 10,
    right: 300, // Espaçamento entre o texto e o ícone de visualização
  },
  textContainer: {
    flex: 1, // O texto ocupará o espaço disponível
  },
  assunto: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  assuntoText: {
    fontWeight: 'normal',
  },
  scrollViewContent: {
    paddingBottom: 20, // Adiciona espaço ao final da lista
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
  gradient: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 10,
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
  moreButton: {
    position: 'absolute',
    right: 20,
    top: 10, // Ajuste a posição conforme necessário
    backgroundColor: '#00ffff',
    width: 30,
    height: 30,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreText: {
    fontSize: 20,
    color: '#000',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#003185',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },

});
