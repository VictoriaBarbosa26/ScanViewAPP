import React, { useEffect, useState } from 'react'; 
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ScrollView } from 'react-native'; 
import { LinearGradient } from 'expo-linear-gradient'; 
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs, addDoc, doc, getDoc } from 'firebase/firestore'; 
import { app } from '../../../../config/firebaseConfig'; // Importando a configuração do Firebase

// Componente de item de mensagem
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
      <Image source={require('../../../../assets/email.png')} style={styles.ema} />
    </TouchableOpacity>
  </View>
);

// Tela principal de agendamento
export default function MainScreen({ navigation }) {
  const [profileImage, setProfileImage] = useState(null);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Recupera dados do usuário logado e mensagens
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

  // Função para enviar mensagem
  const sendMessage = async () => {
    const auth = getAuth(app);
    const user = auth.currentUser;

    const recipient = 'admin@example.com'; // Defina o destinatário
    const message = 'Olá, gostaria de agendar uma manutenção.'; // Defina a mensagem
    const subject = 'Agendamento de Manutenção'; // Defina o assunto

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
            source={profileImage ? { uri: profileImage } : require('../../../../assets/icon_momentaneo.png')}
          />
          <View>
            <Text style={styles.profileName}>{userName}</Text>
            <Text style={styles.profileEmail}>{userEmail}</Text>
          </View>
        </View>
        <Text style={styles.categoriesText}>Inbox</Text>
      </View>

      <View style={styles.separator} />

      {/* Gradiente azul e preto */}
      <LinearGradient colors={['#003185', '#000000']} style={styles.boxesContainer}>
                {/* Botão de voltar no canto superior esquerdo */}
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Image style={styles.backIcon} source={require('../../../../assets/voltar.png')} />
        </TouchableOpacity>
        <View style={styles.successContainer}>
          {/* Ícone de sucesso */}
          <Image style={styles.successIcon} source={require('../../../../assets/correto.png')} />
          <Text style={styles.successText}>Manutenção agendada com sucesso!</Text>
          <Text style={styles.subText}>Um dia antes da manutenção ser realizada você será notificado.</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.messagesContainer}>
        {loading ? (
          <Text style={styles.loadingText}>Carregando mensagens...</Text>
        ) : (
          messages.map((message) => (
            <MessageItem key={message.id} item={message} navigation={navigation} />
          ))
        )}
      </ScrollView>

      {/* Faixa preta inferior com opções de navegação */}
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
    </View>
  );
}

// Definição dos estilos para os componentes
const styles = StyleSheet.create({
  container: {
    flex: 1,  // O container ocupa toda a tela
    backgroundColor: '#000',  // Cor de fundo preta
  },
  topBar: {
    backgroundColor: '#000',  // Fundo preto para a faixa superior
    padding: 20,  // Espaçamento interno
  },
  profileContainer: {
    flexDirection: 'row',  // Coloca os elementos (imagem e textos) em linha
    alignItems: 'center',  // Alinha os elementos no centro verticalmente
    marginBottom: 10,  // Espaçamento abaixo do container
  },
  profileIcon: {
    width: 75, // Tamanho do ícone do perfil
    height: 75,
    marginRight: 10, // Espaçamento entre o ícone e o texto
    borderRadius: 37.5, // Tornando a imagem redonda
  },
  profileName: {
    color: '#fff',  // Cor do texto branco
    fontSize: 18,  // Tamanho da fonte
    fontWeight: 'bold',  // Negrito
  },
  profileEmail: {
    color: '#ccc',  // Cor do texto cinza
    fontSize: 14,  // Tamanho da fonte
  },
  categoriesText: {
    color: '#00ffff',  // Cor do texto ciano
    fontSize: 20,  // Tamanho da fonte
    fontWeight: 'bold',  // Negrito
    textAlign: 'center',  // Centraliza o texto
  },
  separator: {
    height: 2,  // Altura da linha separadora
    backgroundColor: '#fff',  // Cor branca
  },
  boxesContainer: {
    flex: 1,  // O gradiente ocupa o restante da tela
    padding: 10,  // Espaçamento interno
    justifyContent: 'center',  // Centraliza verticalmente
    alignItems: 'center',  // Centraliza horizontalmente
  },
  successContainer: {
    justifyContent: 'center',  // Centraliza verticalmente
    alignItems: 'center',  // Centraliza horizontalmente
    marginTop: 50,  // Margem superior
  },
  successIcon: {
    width: 100,
    height: 100,  // Dimensões do ícone de sucesso
    marginBottom: 20,  // Espaçamento abaixo do ícone
  },
  successText: {
    color: 'white',  // Cor do texto branco
    fontSize: 18,  // Tamanho da fonte
    marginBottom: 10,  // Espaçamento inferior
    fontWeight: 'bold',  // Negrito
    textAlign: 'center',  // Centraliza o texto
  },
  subText: {
    color: '#fff',  // Cor do texto branco
    fontSize: 14,  // Tamanho da fonte
    textAlign: 'center',  // Centraliza o texto
    marginHorizontal: 20,  // Espaçamento nas laterais
  },
  backButton: {
    position: 'absolute',  // Posição absoluta para sobrepor o botão
    top: 10,  // Posição a partir do topo
    left: 20,  // Posição a partir da esquerda
    zIndex: 1,  // Garante que o botão apareça acima de outros componentes
  },
  backIcon: {
    width: 25,
    height: 25,  // Dimensões do ícone de voltar
  },
  bottomBar: {
    backgroundColor: '#000',  // Fundo preto para a faixa inferior
    flexDirection: 'row',  // Coloca os botões em linha
    justifyContent: 'space-around',  // Espaça igualmente os botões
    padding: 10,  // Espaçamento interno
  },
  bottomOption: {
    alignItems: 'center',  // Centraliza o conteúdo de cada botão
  },
  bottomIcon: {
    width: 25,
    height: 25,  // Dimensões dos ícones da barra inferior
    marginBottom: 5,  // Espaçamento abaixo do ícone
  },
  bottomText: {
    color: '#fff',  // Cor do texto branco
    fontSize: 12,  // Tamanho da fonte
  },
});
