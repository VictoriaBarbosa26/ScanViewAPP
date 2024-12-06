import React, { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { auth, db } from '../config/firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      // Autenticar com Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Log para verificar o usuário autenticado
      console.log('Usuário autenticado:', user);

      // Pegar dados do usuário do Firestore
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);

      // Verificando se o documento do usuário existe
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        console.log('Dados do usuário:', userData);

        // Navegar para a tela apropriada com base no papel
        if (userData.role === 'ADM') {
          navigation.navigate('MainScreenADM');
        } else if (userData.role === 'Prof') {
          navigation.navigate('MainProf');
        } else if (userData.role === 'Aluno') {
          navigation.navigate('MainAluno');
        } else {
          Alert.alert('Erro', 'Tipo de usuário desconhecido.');
        }
      } else {
        Alert.alert('Erro', 'Usuário não encontrado no Firestore.');
      }
    } catch (error) {
      console.error('Erro no login:', error); // Log do erro
      Alert.alert('Erro', 'Email ou senha incorretos.');
    }
  };

  return (
    <LinearGradient colors={['#003185', '#000']} style={styles.container}>
      <Image style={styles.logo} source={require('../assets/logo.png')} />
      <Text style={styles.title}>Bem-vindo</Text>
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
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.forgotPassword}>Esqueceu sua senha?</Text>
      </TouchableOpacity>
      <View style={styles.signupContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.signupText}>Criar uma conta</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  signupContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    alignItems: 'flex-end',
    width: '80%',
  },
  signupText: {
    color: '#87CEEB',
    fontSize: 16,
    textAlign: 'right',
    textDecorationLine: 'underline',
  },
  forgotPassword: {
    color: '#87CEEB',
    textDecorationLine: 'underline',
    marginTop: 10,
  },
});
