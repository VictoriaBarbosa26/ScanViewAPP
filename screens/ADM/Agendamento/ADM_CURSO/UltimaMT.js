import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../../config/firebaseConfig';

export default function MainScreen({ navigation, route }) {
  const { problema } = route.params || {}; // Obtendo o problema da navegação
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [profileImage, setProfileImage] = useState(null);

  // Buscar dados do usuário autenticado
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

            // Verificar se a URL da imagem é válida
            if (imageUrl && imageUrl.trim() !== '') {
              setProfileImage({ uri: imageUrl }); // Definindo a URL da imagem do perfil
            } else {
              // Fallback para imagem local se não houver URL de perfil
              setProfileImage(require('../../../../assets/icon_momentaneo.png'));
            }
          }
        })
        .catch((error) => console.log('Erro ao obter dados do usuário:', error));
    }
  }, []);

  // Exibe o número do computador no console para debug
  console.log('Número do computador:', problema ? problema.computadorUsado : 'Nenhum computador fornecido');

  return (
    <View style={styles.container}>
      {/* Parte superior fixa */}
      <View style={styles.topBar}>
        <View style={styles.profileContainer}>
          <Image style={styles.profileIcon} source={profileImage || require('../../../../assets/icon_momentaneo.png')} />
          <View>
            <Text style={styles.profileName}>{userName || 'Nome da Pessoa'}</Text>
            <Text style={styles.profileEmail}>{userEmail || 'email@example.com'}</Text>
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

        {/* Exibindo os dados do problema */}
        <Text style={styles.deviceText}>Computador</Text>
        
        {/* Número do dispositivo */}
        <View style={styles.deviceNumberContainer}>
          <Text style={styles.deviceNumberText}>{problema.computadorUsado}</Text>
        </View>

        {/* Descrição da manutenção */}
        <View style={styles.maintenanceBox}>
          <Text style={styles.maintenanceText}>{problema.descricao}</Text>
        </View>

        {/* Botão de agendar nova manutenção */}
        <TouchableOpacity
          style={styles.scheduleButton}
          onPress={() => {
            // Passando o computador usado como parâmetro para a próxima tela
            navigation.navigate('AgendarMT_ADM', {
              computadorUsado: problema.computadorUsado,  // Passando o computador usado como parâmetro
            });
          }}
        >
          <Text style={styles.scheduleButtonText}>Agendar nova manutenção</Text>
        </TouchableOpacity>

      </LinearGradient>

      {/* Parte inferior fixa */}
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
  maintenanceBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 30,
    width: '80%',
    alignItems: 'center',
  },
  maintenanceText: {
    color: '#000',
    fontSize: 14,
    textAlign: 'left',
  },
  scheduleButton: {
    backgroundColor: '#ffd700',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  scheduleButtonText: {
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
