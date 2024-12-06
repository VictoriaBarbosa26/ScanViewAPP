import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function ViewProblemsScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Faixa preta superior */}
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

      {/* Linha branca separando a faixa preta do gradiente */}
      <View style={styles.separator} />

      {/* Gradiente com o ícone e texto centralizado */}
      <LinearGradient colors={['#0056b3', '#000000']} style={styles.resolvedContainer}>
        {/* Botão de voltar no canto superior esquerdo da área azul */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Image style={styles.backIcon} source={require('../../../../assets/voltar.png')} />
        </TouchableOpacity>

        {/* Ícone de correto centralizado */}
        <Image 
          style={styles.checkIcon} 
          source={require('../../../../assets/correto.png')} // Substitua pelo caminho correto do ícone
        />
        {/* Texto "Problema Resolvido" abaixo do ícone */}
        <Text style={styles.resolvedText}>Problema Resolvido</Text>
      </LinearGradient>

      {/* Faixa preta inferior com opções não funcionais */}
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
  resolvedContainer: {
    flex: 1,
    justifyContent: 'center', // Centraliza verticalmente
    alignItems: 'center', // Centraliza horizontalmente
  },
  checkIcon: {
    width: 100, // Ajuste o tamanho conforme necessário
    height: 100,
    marginBottom: 20,
  },
  resolvedText: {
    color: '#fff',
    fontSize: 24,
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
