import React, { useState, useEffect } from 'react';
import { Text, View, TextInput, TouchableOpacity, StyleSheet, Image, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import { auth, db } from '../config/firebaseConfig'; 
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export default function SignupScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Aluno');
  const [course, setCourse] = useState(null);
  const [courses, setCourses] = useState([]);
  const [identifier, setIdentifier] = useState('');
  const [openRole, setOpenRole] = useState(false);
  const [openCourse, setOpenCourse] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Cursos pré-definidos
    const predefinedCourses = [
      { label: 'Administração', value: 'administracao' },
      { label: 'Automação Industrial', value: 'automacao_industrial' },
      { label: 'Desenvolvimento de Sistemas', value: 'desenvolvimento_de_sistemas' },
    ];
    setCourses(predefinedCourses);
  }, []);

  const handleSignup = async () => {
    setLoading(true);
    try {
      // Criando usuário com email e senha
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Se o usuário for ADM ou Prof, verificar o identificador
      if (role === 'ADM' || role === 'Prof') {
        const docRef = doc(db, 'identificacao_pendentes', identifier);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          Alert.alert('Erro', 'Número de identificação inválido.');
          setLoading(false);
          return;
        }

        const data = docSnap.data();
        if (identifier !== data.identifier) {
          Alert.alert('Erro', 'Número de identificação não corresponde ao esperado.');
          setLoading(false);
          return;
        }
      }

      // Preparando os dados do usuário para o Firestore
      const userData = {
        name,
        email,
        role,
        course: role === 'Aluno' ? course : '',  // Só atribui o curso se o usuário for Aluno
        identifier: (role === 'Prof' || role === 'ADM') ? identifier : '',  // Atribui identificador somente para Prof ou ADM
        password,
        createdAt: new Date(),
      };

      // Gravando os dados do usuário na coleção "users"
      await setDoc(doc(db, 'users', user.uid), userData);

      // Sucesso no cadastro
      Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
      navigation.navigate('Login');
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível cadastrar. Verifique seus dados e tente novamente.');
    }
    setLoading(false);
  };

  return (
    <LinearGradient colors={['#003185', '#000']} style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#87CEEB" />
      </TouchableOpacity>
      <Image style={styles.logo} source={require('../assets/logo.png')} />
      <Text style={styles.title}>Cadastre-se</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome Completo"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
      />

      <DropDownPicker
        open={openRole}
        value={role}
        items={[
          { label: 'Aluno', value: 'Aluno' },
          { label: 'Professor', value: 'Prof' },
          { label: 'Administrador', value: 'ADM' },
        ]}
        setOpen={setOpenRole}
        setValue={setRole}
        containerStyle={styles.pickerContainer}
        style={styles.picker}
        dropDownContainerStyle={styles.dropDownContainer}
      />

      {role === 'Aluno' && (
        <>
          <DropDownPicker
            open={openCourse}
            value={course}
            items={courses}
            setOpen={setOpenCourse}
            setValue={setCourse}
            containerStyle={{ ...styles.pickerContainer, zIndex: 1000 }}
            style={styles.picker}
            dropDownContainerStyle={styles.dropDownContainer}
            placeholder="Selecione seu curso"
          />
          <TextInput
            style={styles.input}
            placeholder="Número de Identificação ou RM"
            value={identifier}
            onChangeText={setIdentifier}
          />
        </>
      )}

      {(role === 'Prof' || role === 'ADM') && (
        <TextInput
          style={styles.input}
          placeholder="Número de Identificação"
          value={identifier}
          onChangeText={setIdentifier}
        />
      )}

      <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Cadastrar</Text>
        )}
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    padding: 10,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  input: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  pickerContainer: {
    width: '80%',
    height: 50,
    marginBottom: 15,
  },
  picker: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
  },
  dropDownContainer: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  button: {
    width: '80%',
    backgroundColor: '#0056b3',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
