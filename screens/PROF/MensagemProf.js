import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, TextInput, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, collection, addDoc, getDocs } from 'firebase/firestore';
import { app } from '../../config/firebaseConfig';

export default function MainScreen({ route, navigation }) {
  const { subject, body, sender, date } = route.params; // Recebe os parâmetros da navegação
  const [isRead, setIsRead] = useState(false); // Variável para marcar como lida
  const [modalVisible, setModalVisible] = useState(false); // Controle do modal
  const [profileImage, setProfileImage] = useState(null);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [responseText, setResponseText] = useState('');

  // Função para enviar uma resposta
  const handleSendResponse = async () => {
    try {
      const db = getFirestore(app);
      const auth = getAuth(app);
      const currentUser = auth.currentUser;

      if (!currentUser) {
        console.log('Usuário não autenticado.');
        return;
      }

      await addDoc(collection(db, 'respostas'), {
        remetente: currentUser.email, // Email do usuário atual
        destinatario: sender,         // Email do remetente da mensagem original
        mensagem: responseText,       // Texto da resposta
        data: new Date().toISOString(), // Data atual
      });

      // Exibe o alerta de sucesso
      Alert.alert('Sucesso', 'Resposta enviada com sucesso!', [
        { text: 'OK', onPress: () => setModalVisible(false) }
      ]);

      setResponseText(''); // Limpa o texto da resposta
    } catch (error) {
      console.error('Erro ao enviar a resposta:', error);
      Alert.alert('Erro', 'Houve um problema ao enviar a resposta. Tente novamente.');
    }
  };

  // Função para buscar respostas do Firestore
  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const db = getFirestore(app);
        const responseRef = collection(db, 'respostas');
        const querySnapshot = await getDocs(responseRef);

        const responses = querySnapshot.docs
          .map((doc) => doc.data())
          .filter((resp) => resp.destinatario === userEmail); // Filtra por destinatário

        console.log('Respostas recebidas:', responses);
        // Atualize um estado local para exibir essas respostas na interface
      } catch (error) {
        console.error('Erro ao buscar respostas:', error);
      }
    };

    fetchResponses();
  }, [userEmail]);

  // Carregar dados do usuário logado
  useEffect(() => {
    const auth = getAuth(app);
    const user = auth.currentUser;

    if (user) {
      const db = getFirestore(app);
      const userRef = doc(db, 'users', user.uid);

      getDoc(userRef)
        .then((docSnap) => {
          if (docSnap.exists()) {
            const userData = docSnap.data();
            setUserName(userData.name || 'Nome da Pessoa');
            setUserEmail(userData.email || 'email@example.com');
            setProfileImage(userData.profileImage || null);
          }
        })
        .catch((error) => {
          console.log('Erro ao obter dados do usuário:', error);
        });
    }
  }, []);

  // Funções para controle de estado
  const handleMarkAsRead = () => {
    setIsRead(true);
  };

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Faixa preta superior */}
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

      {/* Linha branca separadora */}
      <View style={styles.separator} />

      {/* Gradiente principal */}
      <LinearGradient colors={['#003185', '#000000']} style={styles.gradientContainer}>
        <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('MainEmailProf')}>
          <Image style={styles.backIcon} source={require('../../assets/voltar.png')} />
        </TouchableOpacity>
        <View style={styles.contentContainer}>
          <View style={styles.boxesContainer}>
            <View style={styles.header}>
              <Text style={styles.title}>Remetente: {sender}</Text>
            </View>
            <View style={styles.content}>
              <Text style={styles.message}>Mensagem: {body}</Text>
              <Text style={styles.footer}>Data de envio: {date}</Text>
            </View>
            <View style={styles.actions}>
              {!isRead && (
                <TouchableOpacity onPress={handleOpenModal} style={styles.button}>
                  <Text style={styles.buttonText}>Responder</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={handleMarkAsRead} style={styles.button}>
                <Text style={styles.buttonText}>Marcar Como Lida</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.spacing} />
        </View>
      </LinearGradient>

      {/* Faixa preta inferior */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomOption} onPress={() => navigation.navigate('PerfilProf')}>
          <Image style={styles.bottomIcon} source={require('../../assets/perfil.png')} />
          <Text style={styles.bottomText}>Perfil</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomOption} onPress={() => navigation.navigate('MainProf')}>
          <Image style={styles.bottomIcon} source={require('../../assets/inicio.png')} />
          <Text style={styles.bottomText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomOption}>
          <Image style={styles.bottomIcon} source={require('../../assets/email.png')} />
          <Text style={styles.bottomText}>Inbox</Text>
        </TouchableOpacity>
      </View>

      {/* Modal para responder */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Responder</Text>
            <ScrollView style={styles.modalContent}>
              <TextInput
                style={styles.textInput}
                placeholder="Escreva sua resposta aqui..."
                multiline
                numberOfLines={6}
                value={responseText}
                onChangeText={setResponseText}
              />
            </ScrollView>
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={handleSendResponse} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Enviar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleCloseModal} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  gradientContainer: {
    flex: 1,
    padding: 10,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  boxesContainer: {
    backgroundColor: '#000',
    borderRadius: 10,
    padding: 15,
  },
  header: {
    marginBottom: 15,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    marginBottom: 20,
  },
  message: {
    color: '#fff',
    fontSize: 16,
  },
  footer: {
    color: '#ccc',
    fontSize: 10,
    marginTop: 10,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    padding: 10,
    backgroundColor: '#003185',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  spacing: {
    height: 80,
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
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalContent: {
    width: '100%',
  },
  textInput: {
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  modalButton: {
    padding: 10,
    backgroundColor: '#003185',
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  backIcon: {
    width: 30,
    height: 30,
  },
});
