// VISUALIZA OS PROBLEMAS REPORTADOS POR PESSOA ESPECIFICA.
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView, Modal, TextInput, Platform } from 'react-native';  // Adicionando o TextInput aqui
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { db } from '../../../../config/firebaseConfig';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';

const ViewProblemsScreen = ({ route, navigation }) => {
  const { problemas = [], nomeCompleto, cursoAluno, laboratorioSelecionado, computadorUsado } = route.params || {}; 
  const [loading, setLoading] = useState(true);
  const [checkedProblems, setCheckedProblems] = useState(new Array(problemas.length).fill(false));
  const [modalVisible, setModalVisible] = useState(false);
  const [description, setDescription] = useState('');
  const [dateResolved, setDateResolved] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Verifica se todos os problemas foram marcados
  const allProblemsChecked = checkedProblems.every((checked) => checked);

  // Simulação de carregamento dos relatos
  const fetchRelatos = async () => {
    setLoading(false); // Após "carregar", desativa o estado de loading
  };

  useEffect(() => {
    fetchRelatos(); // Carrega os relatos ao inicializar o componente

    // Log para exibir o número do computador recebido
    console.log("Número do computador recebido:", computadorUsado);
  }, []);

  const toggleCheckbox = (index) => {
    const updatedChecked = [...checkedProblems];
    updatedChecked[index] = !updatedChecked[index];
    setCheckedProblems(updatedChecked);
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setDescription('');
    setDateResolved(new Date());
  };

// Função para enviar o problema resolvido para o banco de dados
const submitResolvedProblem = async () => {
  if (description.trim() === '') { // Verifica se a descrição está vazia
    alert('A descrição da solução é obrigatória!');
    return; // Impede o envio se a descrição estiver vazia
  }

  try {
    // Log para verificar todos os dados que serão enviados
    console.log("Enviando dados: ", {
      curso: cursoAluno,
      laboratorio: laboratorioSelecionado,
      problemas: problemas.filter((_, index) => checkedProblems[index]),
      descricao: description,
      dataResolucao: dateResolved,
      computadorUsado: computadorUsado // Incluindo o número do computador
    });

    await addDoc(collection(db, 'problema_resolvido'), {
      curso: cursoAluno,  // Curso do aluno
      laboratorio: laboratorioSelecionado,  // Nome do laboratório selecionado
      problemas: problemas.filter((_, index) => checkedProblems[index]),  // Lista de problemas resolvidos
      descricao: description,  // Descrição da solução fornecida
      dataResolucao: dateResolved,  // Data selecionada para resolução
      computadorUsado: computadorUsado, // Número do computador
      timestamp: Timestamp.now(),  // Timestamp de quando o documento foi enviado
    });

    alert('Problema Resolvido Enviado com Sucesso!');
    
    // Resetando as checkboxes
    setCheckedProblems(new Array(problemas.length).fill(false));

    // Redirecionando para a tela "ProblemaResolvidoDS" após o envio bem-sucedido
    navigation.navigate('ProblemaResolvidoDS');
  } catch (error) {
    console.error("Erro ao enviar o problema resolvido:", error);
    alert('Erro ao enviar o problema resolvido');
  }
};


  // Função para mostrar o DatePicker
  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  // Função para manipular a seleção de data
  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios' ? true : false);  // Fechar o picker para Android
    if (selectedDate) {
      setDateResolved(selectedDate);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.profileContainer}>
          <Image style={styles.profileIcon} source={require('../../../../assets/icon_momentaneo.png')} />
          <View>
            <Text style={styles.profileName}>Nome da Pessoa</Text>
            <Text style={styles.profileEmail}>email@example.com</Text>
          </View>
        </View>
        <Text style={styles.categoriesText}>Visualizar Problemas</Text>
      </View>
      <View style={styles.separator} />
      <LinearGradient colors={['#0056b3', '#000000']} style={styles.problemsContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Image style={styles.backIcon} source={require('../../../../assets/voltar.png')} />
        </TouchableOpacity>
        <View style={styles.spacingContainer} />

        {loading ? (
          <Text style={styles.loadingText}>Carregando...</Text>
        ) : (
          <ScrollView style={styles.scrollView}>
            <Text style={styles.problemOwnerText}>{`Problemas reportados por: ${nomeCompleto}`}</Text>
            {problemas.length > 0 ? (
              problemas.map((problema, index) => (
                <View key={index} style={styles.problemItem}>
                  <TouchableOpacity
                    style={styles.checkboxContainer}
                    onPress={() => toggleCheckbox(index)}
                  >
                    <View
                      style={[styles.checkbox, checkedProblems[index] && styles.checkboxChecked]}
                    ></View>
                    <Text style={styles.problemText}>{problema}</Text>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text style={styles.noRecordsText}>Nenhum problema encontrado.</Text>
            )}
          </ScrollView>
        )}
        <TouchableOpacity
          style={[styles.resolveButton, !allProblemsChecked && styles.resolveButtonDisabled]}
          onPress={openModal}
          disabled={!allProblemsChecked} // Desativa o botão se não todos os problemas estiverem marcados
        >
          <Text style={styles.resolveButtonText}>Problema Resolvido</Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* Modal para resolução do problema */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Detalhes do Problema Resolvido</Text>

          {/* Campo de descrição mais compacto */}
          <TextInput
            style={styles.input}
            placeholder="Descrição da solução"
            placeholderTextColor="#aaa"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3} // Diminuindo o número de linhas visíveis
          />

          {/* Seletor de data */}
          <TouchableOpacity
            style={[styles.input, styles.datePickerButton]}
            onPress={showDatePickerModal}
          >
            <Text style={styles.inputText}>{dateResolved.toLocaleDateString()}</Text>
          </TouchableOpacity>

          {/* Exibe o DatePicker quando solicitado */}
          {showDatePicker && (
            <DateTimePicker
              value={dateResolved}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}

          <TouchableOpacity style={styles.modalButton} onPress={submitResolvedProblem}>
            <Text style={styles.modalButtonText}>Enviar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
            <Text style={styles.modalButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>

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
  problemsContainer: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    width: '100%',
  },
  problemOwnerText: {
    color: '#00ffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  problemItem: {
    padding: 10,
    marginBottom: 5,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 4,
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: '#00ffff',
  },
  problemText: {
    color: '#fff',
  },
  noRecordsText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
  },
  loadingText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
  },
  resolveButton: {
    backgroundColor: '#fad541',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 20,
    alignSelf: 'center',
  },
  resolveButtonDisabled: {
    backgroundColor: '#888',
  },
  resolveButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
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
  spacingContainer: {
    height: 50,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'stretch', // Faz com que os elementos se alinhem bem
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    fontSize: 14,
    textAlignVertical: 'top',
  },
  
  inputText: {
    fontSize: 14,
    color: '#000',
  },

  // Ajustando a altura do TextInput para a descrição
  inputMultiline: {
    height: 80, // Tamanho compacto
  },

  // Tamanho do botão de data
  datePickerButton: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50, // Ajusta a altura para ser mais compacta
    marginBottom: 10,
  },


  modalButton: {
    backgroundColor: '#fad541',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
    alignSelf: 'center',
  },
  
  modalButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ViewProblemsScreen;