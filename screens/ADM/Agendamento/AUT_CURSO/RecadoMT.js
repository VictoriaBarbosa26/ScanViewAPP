import React from 'react'; 
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; 

export default function MainScreen({ navigation }) { 
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
        <Text style={styles.categoriesText}>Agendamento de Manutenção</Text>
      </View>

      <View style={styles.separator} />

      <LinearGradient colors={['#0056b3', '#000000']} style={styles.boxesContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Image style={styles.backIcon} source={require('../../../../assets/voltar.png')} />
        </TouchableOpacity>

        <View style={styles.spacing} />

        <View style={styles.verticalContainer}>
          <View style={styles.boxContainer}>
            <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('UltimaMT_AUT')}>
              <Text style={styles.numberText}>1</Text>
              <Text style={styles.lastMaintenanceText}>Última manutenção: 12/02/2024</Text>
              <Image style={styles.eyeIcon} source={require('../../../../assets/visao.png')} />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomOption} onPress={() => navigation.navigate('PerfilADM')}>
          <Image style={styles.bottomIcon} source={require('../../../../assets/perfil.png')} />
          <Text style={styles.bottomText}>Perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.bottomOption} onPress={() => navigation.navigate('MainScreenAUT')}>
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
    flex: 1, // O contêiner ocupa todo o espaço disponível.
    backgroundColor: '#000', // Cor de fundo preta.
  },
  topBar: {
    backgroundColor: '#000', // Cor de fundo preta.
    padding: 20, // Espaçamento interno da barra superior.
  },
  profileContainer: {
    flexDirection: 'row', // Layout em linha.
    alignItems: 'center', // Alinha itens ao centro verticalmente.
    marginBottom: 10, // Espaçamento inferior.
  },
  profileIcon: {
    width: 75, // Largura do ícone do perfil.
    height: 75, // Altura do ícone do perfil.
    marginRight: 10, // Espaçamento à direita do ícone.
  },
  profileName: {
    color: '#fff', // Cor do texto do nome.
    fontSize: 18, // Tamanho da fonte do nome.
    fontWeight: 'bold', // Peso da fonte do nome.
  },
  profileEmail: {
    color: '#ccc', // Cor do texto do email.
    fontSize: 14, // Tamanho da fonte do email.
  },
  categoriesText: {
    color: '#00ffff', // Cor do texto das categorias.
    fontSize: 20, // Tamanho da fonte das categorias.
    fontWeight: 'bold', // Peso da fonte das categorias.
    textAlign: 'center', // Alinha o texto ao centro.
  },
  separator: {
    height: 2, // Altura da linha separadora.
    backgroundColor: '#fff', // Cor da linha separadora.
  },
  boxesContainer: {
    flex: 1, // O contêiner ocupa todo o espaço disponível.
    padding: 10, // Espaçamento interno.
    justifyContent: 'center', // Alinha conteúdo ao centro verticalmente.
    alignItems: 'center', // Alinha conteúdo ao centro horizontalmente.
  },
  verticalContainer: {
    justifyContent: 'space-between', // Alinha os itens da caixinha verticalmente.
    alignItems: 'center', // Alinha itens ao centro horizontalmente.
  },
  boxContainer: {
    marginBottom: 30, // Margem inferior entre as caixinhas.
  },
  box: {
    backgroundColor: '#fff', // Cor de fundo da caixinha.
    borderRadius: 5, // Bordas arredondadas.
    borderColor: '#fff', // Cor da borda da caixinha.
    borderWidth: 1, // Largura da borda da caixinha.
    padding: 20, // Espaçamento interno da caixinha.
    width: 300, // Largura da caixinha.
    flexDirection: 'row', // Layout em linha.
    alignItems: 'center', // Alinha itens ao centro verticalmente.
    justifyContent: 'space-between', // Espaço igual entre os elementos da caixinha.
  },
  numberText: {
    color: '#000', // Cor do texto do número.
    fontWeight: 'bold', // Peso da fonte do número.
    fontSize: 20, // Tamanho da fonte do número.
  },
  lastMaintenanceText: {
    color: '#000', // Cor do texto da última manutenção.
    fontSize: 12, // Tamanho da fonte da última manutenção.
  },
  eyeIcon: {
    width: 25, // Largura do ícone de visão.
    height: 25, // Altura do ícone de visão.
  },
  bottomBar: {
    backgroundColor: '#000', // Cor de fundo preta.
    flexDirection: 'row', // Layout em linha.
    justifyContent: 'space-around', // Espaço igual entre as opções.
    padding: 10, // Espaçamento interno.
  },
  bottomOption: {
    alignItems: 'center', // Alinha itens ao centro horizontalmente.
  },
  bottomIcon: {
    width: 25, // Largura dos ícones na barra inferior.
    height: 25, // Altura dos ícones na barra inferior.
    marginBottom: 5, // Espaçamento inferior dos ícones.
  },
  bottomText: {
    color: '#fff', // Cor do texto das opções na barra inferior.
    fontSize: 12, // Tamanho da fonte das opções.
  },
  spacing: {
    height: 20, // Altura do espaço extra acima das caixinhas.
  },
  backButton: {
    position: 'absolute', // Posição absoluta para o botão de voltar.
    top: 10, // Distância do topo.
    left: 20, // Distância da esquerda.
    zIndex: 1, // Coloca o botão acima dos outros elementos.
  },
  backIcon: {
    width: 25, // Largura do ícone de voltar.
    height: 25, // Altura do ícone de voltar.
  },
});
