import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../../config/firebaseConfig';

export default function ProblemasResolvidosScreen({ navigation, route }) {
  const { resolvidosFiltrados, laboratorioSelecionado } = route.params || {};

  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [profileImage, setProfileImage] = useState(null);

  // Buscar dados do usuário autenticado
  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const userRef = doc(db, 'users', user.uid); // Buscar dados do usuário no Firestore
      getDoc(userRef)
        .then((docSnap) => {
          if (docSnap.exists()) {
            const userData = docSnap.data();
            setUserName(userData.name || 'Nome do usuário');
            setUserEmail(userData.email || 'email@example.com');
            setProfileImage(userData.profileImage || null); // Carregar imagem de perfil
          }
        })
        .catch((error) => console.error('Erro ao obter dados do usuário:', error));
    }

    console.log('Laboratório Selecionado:', laboratorioSelecionado);
    console.log('Problemas Resolvidos:', resolvidosFiltrados);
  }, [laboratorioSelecionado, resolvidosFiltrados]);

  // Função para formatar a data do Timestamp
  const formatDataResolvido = (dataResolvido) => {
    if (dataResolvido && dataResolvido.seconds) {
      const date = dataResolvido.toDate ? dataResolvido.toDate() : new Date(dataResolvido.seconds * 1000);
      return date.toLocaleDateString(); // Formata a data
    }
    return 'Data não disponível'; // Caso o Timestamp esteja ausente ou inválido
  };

  // Função para navegação ao clicar no ícone de olho
  const handleEyeClick = (problema) => {
    navigation.navigate('UltimaMT_ADM', { problema });
  };

  return (
    <View style={styles.container}>
      {/* Parte superior fixa */}
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

      {/* Caixa com gradiente e conteúdo rolável */}
      <LinearGradient colors={['#003185', '#000000']} style={styles.boxesContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Image style={styles.backIcon} source={require('../../../../assets/voltar.png')} />
        </TouchableOpacity>

        {/* ScrollView para os problemas resolvidos */}
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.verticalContainer}>
            {resolvidosFiltrados && resolvidosFiltrados.length > 0 ? (
              resolvidosFiltrados.map((problema, index) => (
                <View
                  style={[
                    styles.boxContainer,
                    index === 0 && styles.firstProblem, // Margem adicional para o primeiro problema
                  ]}
                  key={index}
                >
                  <TouchableOpacity style={styles.box}>
                    <Text style={styles.numberText}>{problema.computadorUsado}</Text>
                    <Text style={styles.lastMaintenanceText}>
                      Última manutenção: {formatDataResolvido(problema.dataResolucao)} 
                    </Text>
                    <TouchableOpacity onPress={() => handleEyeClick(problema)}>
                      <Image style={styles.eyeIcon} source={require('../../../../assets/visao.png')} />
                    </TouchableOpacity>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text style={styles.noProblemsText}>Nenhum problema resolvido encontrado.</Text>
            )}
          </View>
        </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingBottom: 20, // Garantir que o conteúdo não fique cortado
  },
  verticalContainer: {
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  boxContainer: {
    marginBottom: 30,
    width: '100%',
  },
  firstProblem: {
    marginTop: 60, // Aumenta a margem do primeiro problema
  },
  box: {
    backgroundColor: '#fff',
    borderRadius: 5,
    borderColor: '#fff',
    borderWidth: 1,
    padding: 20,
    width: 300,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  numberText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 15,
  },
  lastMaintenanceText: {
    color: '#000',
    fontSize: 13,
  },
  eyeIcon: {
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
  noProblemsText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});
