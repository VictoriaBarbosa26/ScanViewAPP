import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; // Importação para Firebase Auth
import { db } from '../../../../config/firebaseConfig'; // Configuração do Firebase

export default function MainScreen({ navigation, route }) {
  const { userID, alunos, cursoSelecionado, relatosFiltrados } = route.params || {};

  // Estados para armazenar nome, e-mail e foto de perfil do usuário
  const [nome, setNome] = useState('Nome da Pessoa');
  const [email, setEmail] = useState('email@example.com');
  const [profileImage, setProfileImage] = useState(null);

  // Estado para armazenar os laboratórios com problemas
  const [laboratoriosComProblema, setLaboratoriosComProblema] = useState({});
  const [laboratorioSelecionado, setLaboratorioSelecionado] = useState('');
  const laboratoriosFixos = ['Laboratório 1', 'Laboratório 2'];

  // Instâncias do Firebase
  const auth = getAuth();
  
  // Função para obter as informações do usuário logado
  const getUserInfo = async () => {
    const user = auth.currentUser; // Obtém o usuário logado
    if (user) {
      const userDoc = doc(db, 'users', user.uid); // Refere-se ao documento do usuário no Firestore
      const userSnapshot = await getDoc(userDoc); // Obtém o documento
      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        setNome(userData.name || 'Nome não disponível');
        setEmail(userData.email || 'email@example.com');
        setProfileImage(userData.profileImage || null); // Se houver uma URL de imagem, usa, senão, mantém null
      }
    }
  };

  useEffect(() => {
    getUserInfo(); // Chama a função para obter as informações do usuário logado

    const fetchLaboratorios = async () => {
      if (!alunos || alunos.length === 0) {
        console.log('Nenhum aluno encontrado.');
        return;
      }

      const relatosCollection = collection(db, 'relatos');
      const querySnapshot = await getDocs(relatosCollection);

      const problemasPorLab = {};

      laboratoriosFixos.forEach(lab => {
        problemasPorLab[lab] = [];
      });

      querySnapshot.forEach((doc) => {
        const relato = doc.data();
        console.log('Relato encontrado:', relato);

        // Verificar se o aluno do relato pertence ao curso selecionado
        const alunoRelacionado = alunos.find(aluno => aluno.email === relato.nomeCompleto && aluno.course === cursoSelecionado);

        if (alunoRelacionado) {  // Verifica se o aluno pertence ao curso selecionado
          if (relato.laboratorio) {
            const labKey = `Laboratório ${relato.laboratorio}`;
            if (problemasPorLab[labKey]) {
              problemasPorLab[labKey].push(relato);
            }
          }
        }
      });

      setLaboratoriosComProblema(problemasPorLab);
      console.log('Problemas por laboratório:', problemasPorLab);
    };

    fetchLaboratorios();
  }, [alunos, cursoSelecionado]);

  const handleLabSelect = (laboratorio) => {
    setLaboratorioSelecionado(laboratorio);
    const problemas = laboratoriosComProblema[laboratorio];

    if (problemas && problemas.length > 0) {
      console.log('Laboratório selecionado:', laboratorio);
      console.log('Problemas:', problemas);

      // Encontre o aluno relacionado ao laboratório selecionado
      const alunoRelacionado = alunos.find(aluno => aluno.email === problemas[0].nomeCompleto && aluno.course === cursoSelecionado);
      const cursoAluno = alunoRelacionado ? alunoRelacionado.course : cursoSelecionado;  // Captura o curso do aluno ou mantém o curso selecionado

      console.log('Curso do aluno:', cursoAluno);

      // Passa os relatos filtrados e o curso do aluno para a próxima tela
      navigation.navigate('VisualizaProADM', {
        userID,
        laboratorioSelecionado: laboratorio,
        problemas: problemas, // Passa diretamente os relatos filtrados
        cursoAluno: cursoSelecionado, // Passa o curso do aluno ou o curso selecionado
      });
    } else {
      alert(`Nenhum problema encontrado para o ${laboratorio}`);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.profileContainer}>
          {/* Exibe a foto do perfil, se existir */}
          <Image 
            style={styles.profileIcon} 
            source={profileImage ? { uri: profileImage } : require('../../../../assets/icon_momentaneo.png')} 
          />
          <View>
            <Text style={styles.profileName}>{nome}</Text>
            <Text style={styles.profileEmail}>{email}</Text>
          </View>
        </View>
        <Text style={styles.categoriesText}>Visualizar Problemas</Text>
      </View>

      <View style={styles.separator} />

      <LinearGradient colors={['#0056b3', '#000000']} style={styles.boxesContainer}>
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

// Definição dos estilos para os componentes
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
