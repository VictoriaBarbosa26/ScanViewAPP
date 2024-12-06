import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../../../../config/firebaseConfig';

export default function MainScreen({ navigation, route }) {
  const { cursoSelecionado } = route.params || {};  // Curso Selecionado
  const [laboratoriosComProblema, setLaboratoriosComProblema] = useState({});
  const [laboratorioSelecionado, setLaboratorioSelecionado] = useState('');
  const laboratoriosFixos = ['Laboratório 1', 'Laboratório 2'];

  // Adicionando estados para armazenar informações do usuário
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    // Obter dados do usuário autenticado
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (user) {
      const userRef = doc(db, 'users', user.uid);  // Acessando o documento do usuário no Firestore
      getDoc(userRef)
        .then((docSnap) => {
          if (docSnap.exists()) {
            const userData = docSnap.data();
            setUserName(userData.name || '');
            setUserEmail(userData.email || '');
            setProfileImage(userData.profileImage || null); // Carregar imagem de perfil
          }
        })
        .catch((error) => console.error('Erro ao obter dados do usuário:', error));
    }

    // Lógica já existente para carregar os problemas
    const fetchProblemasPorLab = async () => {
      if (!cursoSelecionado) {
        console.log('Nenhum curso selecionado.');
        return;
      }

      const resolvidosCollection = collection(db, 'problema_resolvido');
      const querySnapshot = await getDocs(resolvidosCollection);
      const problemasPorLab = {};

      querySnapshot.forEach((doc) => {
        const problemaResolvido = doc.data();
        console.log('Problema Resolvido:', problemaResolvido);

        // Filtrar problemas pelo curso selecionado
        if (problemaResolvido.curso === cursoSelecionado) {
          const labKey = problemaResolvido.laboratorio; // Nome do laboratório

          // Inicializar a lista de problemas se a chave ainda não existir
          if (!problemasPorLab[labKey]) {
            problemasPorLab[labKey] = [];
          }

          problemasPorLab[labKey].push(problemaResolvido);
        }
      });

      // Garante que todos os laboratórios fixos existam no objeto, mesmo que estejam vazios
      laboratoriosFixos.forEach((lab) => {
        if (!problemasPorLab[lab]) {
          problemasPorLab[lab] = [];
        }
      });

      setLaboratoriosComProblema(problemasPorLab);
      console.log('Problemas por laboratório:', problemasPorLab);
    };

    fetchProblemasPorLab();
  }, [cursoSelecionado]);

  const handleLabSelect = (laboratorio) => {
    setLaboratorioSelecionado(laboratorio);

    const problemas = laboratoriosComProblema[laboratorio];

    if (problemas && problemas.length > 0) {
      console.log('Laboratório selecionado:', laboratorio);
      console.log('Problemas Resolvidos:', problemas);

      navigation.navigate('RecadoMT_ADM', {
        laboratorioSelecionado: laboratorio,
        resolvidosFiltrados: problemas, // Passa os problemas resolvidos do laboratório
        curso: cursoSelecionado, // Passa o curso selecionado
      });
    } else {
      alert(`Nenhum problema encontrado para o ${laboratorio}`);
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

        <Text style={styles.selectLabText}>Selecione um laboratório</Text>

        <View style={styles.spacing} />

        <View style={styles.columnContainer}>
          <View style={styles.topRowContainer}>
            {laboratoriosFixos.map((laboratorio) => {
              return (
                <View key={laboratorio} style={styles.boxContainerTop}>
                  <Text style={styles.boxText}>{laboratorio}</Text>
                  <TouchableOpacity
                    style={styles.box}
                    onPress={() => handleLabSelect(laboratorio)}
                  >
                    <Text style={styles.numberText}>{laboratorio.split(' ')[1]}</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </View>
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
    </View>
  );
}


// Estilos dos componentes
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  topBar: {
    backgroundColor: '#000',
    padding: 20,
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
  columnContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    width: '100%',
    alignItems: 'center',
  },
  topRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 10,
  },
  boxContainerTop: {
    alignItems: 'center',
    width: '40%',
  },
  box: {
    backgroundColor: '#fff',
    borderRadius: 5,
    borderColor: '#fff',
    borderWidth: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxText: {
    color: '#fad541',
    fontSize: 16,
    marginBottom: 5,
  },
  numberText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  selectLabText: {
    color: '#fad541',
    fontSize: 25,
    fontWeight: 'bold',
    position: 'absolute',
    top: 60,
    left: '33%',
    transform: [{ translateX: -50 }],
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 10,
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
    fontSize: 14,
    marginTop: 5,
  },
  spacing: {
    height: 20,
  },
});
