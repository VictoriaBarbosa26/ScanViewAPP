import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../../../config/firebaseConfig';

const predefinedCourses = [
  { label: 'Administração', value: 'administracao', link: 'SelecionarLabADM', abbreviation: 'ADM' },
  { label: 'Automação Industrial', value: 'automacao_industrial', link: 'SelecionarLabAUT', abbreviation: 'AUT' },
  { label: 'Desenvolvimento de Sistemas', value: 'desenvolvimento_de_sistemas', link: 'SelecionarLabDS', abbreviation: 'DS' },
];

export default function MainScreen({ navigation }) {
  const [userID, setUserID] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null); 
  const [userName, setUserName] = useState('Nome da Pessoa');
  const [userEmail, setUserEmail] = useState('email@example.com');
  const [profileImage, setProfileImage] = useState(null);

  // Fetch user info from Firebase Auth and Firestore
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserID(user.uid);
      setUserEmail(user.email);
      getUserProfile(user.uid);
    }
  }, []);

  const getUserProfile = async (uid) => {
    try {
      const userDoc = doc(db, 'users', uid);
      const docSnap = await getDoc(userDoc);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        setUserName(userData.name || 'Nome não disponível');
        setProfileImage(userData.profileImage || null);
      } else {
        console.log("Usuário não encontrado no Firestore.");
      }
    } catch (error) {
      console.error("Erro ao buscar perfil do usuário:", error);
    }
  };

  const handleCourseSelect = async (course) => {
    setLoading(true);
    setSelectedCourse(course);
  
    console.log("--- SELEÇÃO DE CURSO ---");
    console.log(`Curso selecionado: ${course.label} (${course.value})`);
  
    try {
      if (!course) {
        console.log("Curso não selecionado corretamente.");
        return;
      }
  
      const usersCollection = collection(db, 'users');
      const usersQuery = query(usersCollection, where('course', '==', course.value));
      const querySnapshot = await getDocs(usersQuery);
      const alunosList = [];
  
      querySnapshot.forEach((doc) => {
        const aluno = doc.data();
        alunosList.push(aluno);
      });
  
      console.log(`Total de alunos encontrados no curso ${course.label}: ${alunosList.length}`);
  
      if (alunosList.length > 0) {
        console.log("Alunos no curso:", alunosList);
  
        const relatosCollection = collection(db, 'relatos');
        const relatosSnapshot = await getDocs(relatosCollection);
  
        const relatosFiltrados = {};
        relatosSnapshot.forEach((doc) => {
          const relato = doc.data();
  
          const alunoRelacionado = alunosList.find(aluno => aluno.email === relato.nomeCompleto);
  
          if (alunoRelacionado && alunoRelacionado.course === course.value) {
            const labKey = `Laboratório ${relato.laboratorio || "Indefinido"}`;
            if (!relatosFiltrados[labKey]) relatosFiltrados[labKey] = [];
            relatosFiltrados[labKey].push(relato);
          }
        });
  
        console.log("Relatos filtrados por laboratório:", relatosFiltrados);
  
        if (relatosFiltrados && Object.keys(relatosFiltrados).length > 0) {
          console.log("Passando dados para a próxima tela...");
          navigation.navigate(course.link, {
            userID,
            alunos: alunosList,
            relatosFiltrados,
            cursoSelecionado: course.value,
          });
        } else {
          Alert.alert(
            "Nenhum Relato Encontrado",
            `Não há relatos registrados para o curso de ${course.label}.`,
            [{ text: "OK", onPress: () => console.log("Alerta fechado.") }]
          );
        }
      } else {
        console.log(`Nenhum aluno encontrado no curso: ${course.label}`);
        Alert.alert(
          "Nenhum Problema Encontrado",
          `Não existem problemas no curso de ${course.label}.`,
          [{ text: "OK", onPress: () => console.log("Alerta fechado.") }]
        );
      }
    } catch (error) {
      console.error("Erro ao buscar alunos ou relatos:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.profileContainer}>
          {/* Exibe a foto de perfil ou uma imagem padrão */}
          <Image 
            style={styles.profileIcon} 
            source={profileImage ? { uri: profileImage } : require('../../../assets/icon_momentaneo.png')} 
          />
          <View>
            <Text style={styles.profileName}>{userName}</Text>
            <Text style={styles.profileEmail}>{userEmail}</Text>
          </View>
        </View>
        <Text style={styles.categoriesText}>Visualizar Problemas</Text>
      </View>

      <View style={styles.separator} />

      <LinearGradient colors={['#0056b3', '#000000']} style={styles.boxesContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Image style={styles.backIcon} source={require('../../../assets/voltar.png')} />
        </TouchableOpacity>

        <Text style={styles.selectCourseText}>Selecione o curso desejado:</Text>

        <View style={styles.verticalContainer}>
          {predefinedCourses.map((course) => (
            <View key={course.value} style={styles.boxContainer}>
              <TouchableOpacity
                style={styles.box}
                onPress={() => handleCourseSelect(course)} 
                disabled={loading} 
              >
                <Text style={styles.numberText}>{course.abbreviation}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
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
  verticalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '30%', 
  },
  boxContainer: {
    alignItems: 'center',
    width: '80%',
    marginBottom: 25, 
  },
  box: {
    backgroundColor: '#fff',
    borderRadius: 5,
    borderColor: '#fff',
    borderWidth: 1,
    height: 80, 
    width: '100%', 
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectCourseText: {
    color: '#fad541', 
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    top: '-10%',
  },
  numberText: {
    color: 'black',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
  },
  bottomBar: {
    backgroundColor: '#000',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    paddingBottom: 10,
  },
  bottomOption: {
    alignItems: 'center',
  },
  bottomIcon: {
    width: 30,
    height: 30,
  },
  bottomText: {
    color: '#fff',
    fontSize: 12,
  },
});
