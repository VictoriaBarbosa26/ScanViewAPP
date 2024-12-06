import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function MainScreen({ navigation }) {
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
        <Text style={styles.categoriesText}>Agendamento de Manutenção</Text>
      </View>

      {/* Linha branca separando a faixa preta do gradiente */}
      <View style={styles.separator} />

      {/* Gradiente com as caixinhas */}
      <LinearGradient colors={['#0056b3', '#000000']} style={styles.boxesContainer}>
        
        {/* Botão de voltar no canto superior esquerdo da área azul */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Image style={styles.backIcon} source={require('../../../../assets/voltar.png')} />
        </TouchableOpacity>

        {/* Espaço extra adicionado acima das caixinhas */}
        <View style={styles.spacing} />

        {/* NOVO CONTEÚDO CENTRALIZADO */}
        <Text style={styles.deviceText}>Computador</Text>

        {/* Número do dispositivo */}
        <View style={styles.deviceNumberContainer}>
          <Text style={styles.deviceNumberText}>1</Text>
        </View>

        {/* Caixa com descrição da manutenção */}
        <View style={styles.maintenanceBox}>
          <Text style={styles.maintenanceText}>
            Foi feito a manutenção do SSD de 480GB para um SSD NVME de 1TB
          </Text>
        </View>

        {/* Botão amarelo de agendar nova manutenção */}
        <TouchableOpacity style={styles.scheduleButton} onPress={() => navigation.navigate('AgendarMT_DS')}>
          <Text style={styles.scheduleButtonText}>Agendar nova manutenção</Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* Faixa preta inferior com opções de navegação */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomOption} onPress={() => navigation.navigate('PerfilADM')}>
          <Image style={styles.bottomIcon} source={require('../../../../assets/perfil.png')} />
          <Text style={styles.bottomText}>Perfil</Text>
        </TouchableOpacity>
        
        {/* Opção de Home */}
        <TouchableOpacity style={styles.bottomOption} onPress={() => navigation.navigate('MainScreenDS')}>
          <Image style={styles.bottomIcon} source={require('../../../../assets/inicio.png')} />
          <Text style={styles.bottomText}>Home</Text>
        </TouchableOpacity>
        {/* Opção de Inbox */}
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
    textAlign: 'center',
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
