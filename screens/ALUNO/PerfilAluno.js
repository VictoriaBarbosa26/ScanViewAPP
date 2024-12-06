import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { app } from '../../config/firebaseConfig';
import * as ImagePicker from 'expo-image-picker';

export default function ProfileScreen({ navigation }) {
  const [userData, setUserData] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profileImage, setProfileImage] = useState(null);  // Estado para a imagem de perfil
  const db = getFirestore(app);
  const auth = getAuth(app);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;

      if (user) {
        const userDoc = doc(db, 'users', user.uid);
        const userSnapshot = await getDoc(userDoc);

        if (userSnapshot.exists()) {
          const data = userSnapshot.data();
          setUserData(data);
          setName(data.name); // Preenche o campo de nome
          setEmail(data.email); // Preenche o campo de email
          setProfileImage(data.profileImage || null); // Carrega a imagem de perfil do Firestore, se disponível
        } else {
          console.log('No such document!');
        }
      } else {
        console.log('User not logged in');
      }
    };

    fetchUserData();
  }, [auth]);

  const handleSave = async () => {
    const user = auth.currentUser;

    if (user) {
      const userDoc = doc(db, 'users', user.uid);
      await updateDoc(userDoc, {
        name: name,
        email: email,
        profileImage: profileImage, // Salva a nova imagem de perfil no Firestore
      });
      Alert.alert('Sucesso', 'As informações foram atualizadas com sucesso!');
    } else {
      console.log('User not logged in');
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
    navigation.navigate('Login'); // Altere 'Login' para a tela que deseja navegar após o logout
  };

  // Função para lidar com a escolha da imagem de perfil
  const handleImagePicker = async () => {
    // Solicita permissões para acessar as imagens
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert('Permission to access the camera roll is required!');
      return;
    }

    // Abre o seletor de imagem
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,  // Usando o tipo de mídia correto
      allowsEditing: true,
      aspect: [1, 1],  // Garante a proporção quadrada
      quality: 1,
    });

    if (!pickerResult.canceled) {
      // Atualiza a imagem de perfil com a imagem escolhida
      setProfileImage(pickerResult.assets[0].uri);

      // Salvar a nova imagem de perfil no Firestore imediatamente
      const user = auth.currentUser;
      if (user) {
        const userDoc = doc(db, 'users', user.uid);
        await updateDoc(userDoc, {
          profileImage: pickerResult.assets[0].uri,
        });
      }
    }
  };

  // Função para remover a imagem de perfil
  const removeProfileImage = async () => {
    setProfileImage(null);

    // Atualiza o Firestore para remover a imagem de perfil
    const user = auth.currentUser;
    if (user) {
      const userDoc = doc(db, 'users', user.uid);
      await updateDoc(userDoc, {
        profileImage: null,
      });
    }
  };

  if (!userData) {
    return <Text>Loading...</Text>; // Mostra um loading enquanto busca os dados
  }

  return (
    <View style={styles.container}>
      <View style={styles.separator} />
      <LinearGradient colors={['#003185', '#000000']} style={styles.boxesContainer}>
        <View style={styles.spacing} />
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Image style={styles.backIcon} source={require('../../assets/icon-seta.png')} />
        </TouchableOpacity>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Perfil</Text>
        </View>

        <View style={styles.profileSection}>
          {/* Exibe a imagem de perfil carregada ou a imagem padrão */}
          <Image style={styles.profilePic} source={profileImage ? { uri: profileImage } : require('../../assets/funde.png')} />
          
          {/* Botão para editar a imagem */}
          <TouchableOpacity style={styles.editIconContainer} onPress={handleImagePicker}>
            <Image style={styles.editIcon} source={require('../../assets/lapis.png')} />
          </TouchableOpacity>

          {/* Botão para remover a imagem de perfil */}
          {profileImage && (
            <TouchableOpacity style={styles.removeImageContainer} onPress={removeProfileImage}>
              <Image style={styles.removeImageIcon} source={require('../../assets/lixeira.png')} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <TextInput
              style={styles.infoText}
              value={name}
              onChangeText={setName}
            />
            <Image style={styles.icon} source={require('../../assets/icon-perfil.png')} />
          </View>
          <View style={styles.infoRow}>
            <TextInput
              style={styles.infoText}
              value="Cargo: Aluno" // Título fixo para o professor
              editable={false}
            />
            <Image style={styles.icon} source={require('../../assets/icon-chave.png')} />
          </View>
          <View style={styles.infoRow}>
            <TextInput
              style={styles.infoText}
              value={email}
              onChangeText={setEmail}
            />
            <Image style={styles.icon} source={require('../../assets/icon-email.png')} />
          </View>
          <View style={styles.infoRow}>
            <TextInput
              style={styles.infoText}
              secureTextEntry={true}
              value={password}
              onChangeText={setPassword}
              placeholder="Nova Senha" // Placeholder para nova senha
            />
            <Image style={styles.icon} source={require('../../assets/icon-olho.png')} />
          </View>
        </View>

        <View style={styles.buttonSection}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.buttonText2}>Salvar Modificações</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.exitButton} onPress={handleLogout}>
            <Text style={styles.buttonText}>Sair</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomOption}>
          <Image style={styles.bottomIcon} source={require('../../assets/perfil.png')} />
          <Text style={styles.bottomText}>Perfil</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomOption} onPress={() => navigation.navigate('MainAluno')}>
          <Image style={styles.bottomIcon} source={require('../../assets/inicio.png')} />
          <Text style={styles.bottomText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomOption} onPress={() => navigation.navigate('MainEmailAluno')}>
          <Image style={styles.bottomIcon} source={require('../../assets/email.png')} />
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
  backIcon: {
    width: 25,
    height: 25,
  },
  profileSection: {
    alignItems: 'center',
    marginTop: 20,
  },
  profilePic: {
    width: 175,
    height: 175,
    borderRadius: 87.5, // Garantindo que a imagem seja redonda
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 150,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 5,
  },
  removeImageContainer: {
    position: 'absolute',
    bottom: 0,
    right: 200,
    backgroundColor: '#ff0000',
    borderRadius: 20,
    padding: 5,
  },
  removeImageIcon: {
    width: 20,
    height: 20,
  },
  editIcon: {
    width: 20,
    height: 20,
  },
  infoSection: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
    paddingBottom: 5,
  },
  headerTitle: {
    color: '#00ffff', // Ciano
    fontSize: 25,
    fontWeight: 'bold',
    textAlign:'center',
  },
  infoText: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  icon: {
    width: 20,
    height: 20,
    marginLeft: 10,
  },
  buttonSection: {
    marginTop: 20,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#9AD0D3',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  exitButton: {
    backgroundColor: '#f0ad4e',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonText2: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  boxesContainer: {
    flex: 1,
    padding: 10, // Reduzido para aumentar a proximidade das caixinhas
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
    width: 25, // Tamanho do ícone
    height: 25,
    marginBottom: 5, // Espaçamento entre o ícone e o texto
  },
  bottomText: {
    color: '#fff',
    fontSize: 12,
  },
  spacing: {
    height: 80, // Espaço extra adicionado para descer as caixinhas
  },
});
