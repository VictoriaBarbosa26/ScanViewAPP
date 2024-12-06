// AGENDAR A MANUTENÇÃO EM SI, PREENCHIMENTO DE CAMPOS
import React, { useState } from 'react'; 
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native'; 
import { LinearGradient } from 'expo-linear-gradient'; 

export default function MainScreen({ navigation }) { 
  const [data, setData] = useState(''); 
  const [lab, setLab] = useState(''); 
  const [horario, setHorario] = useState(''); 

  const clearData = () => { 
    setData(''); 
    setLab(''); 
    setHorario(''); 
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
        <Text style={styles.categoriesText}>Agendamento de Manutenção</Text>
      </View>

      <View style={styles.separator} />

      <LinearGradient colors={['#0056b3', '#000000']} style={styles.boxesContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Image style={styles.backIcon} source={require('../../../../assets/voltar.png')} />
        </TouchableOpacity>

        <View style={styles.spacing} />
        <Text style={styles.deviceText}>Computador</Text>

        <View style={styles.deviceNumberContainer}>
          <Text style={styles.deviceNumberText}>1</Text>
        </View>

        <View style={styles.inputRow}>
          <View style={styles.inputContainer}>
            <Image style={styles.icon} source={require('../../../../assets/calendario.png')} />
            <Text style={styles.label}>Data</Text>
            <TextInput 
              style={styles.input} 
              placeholder="__/__/____" 
              value={data} 
              onChangeText={setData} 
            />
          </View>

          <View style={styles.inputContainer}>
            <Image style={styles.icon} source={require('../../../../assets/porta.png')} />
            <Text style={styles.label}>Laboratório</Text>
            <TextInput 
              style={styles.input} 
              placeholder="___" 
              value={lab} 
              onChangeText={setLab} 
            />
          </View>

          <View style={styles.inputContainer}>
            <Image style={styles.icon} source={require('../../../../assets/relog.png')} />
            <Text style={styles.label}>Horário</Text>
            <TextInput 
              style={styles.input} 
              placeholder="__:__" 
              value={horario} 
              onChangeText={setHorario} 
            />
          </View>
        </View>

        <TouchableOpacity onPress={clearData}>
          <Image style={styles.trashIcon} source={require('../../../../assets/lixeira.png')} />
        </TouchableOpacity>

        {/* Botão amarelo de enviar */}
        <TouchableOpacity style={styles.bottomOption} onPress={() => navigation.navigate('AgendamentoSucesso_AUT')}>
          <Text style={styles.sendButtonText}>Enviar</Text>
        </TouchableOpacity>
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

const styles = StyleSheet.create({ // Cria os estilos para o componente.
  container: {
    flex: 1, // O contêiner ocupa todo o espaço disponível.
    backgroundColor: '#000', // Cor de fundo preta.
  },
  topBar: {
    backgroundColor: '#000', // Cor de fundo preta.
    padding: 20, // Espaçamento interno.
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
  deviceText: {
    color: '#ffff00', // Cor do texto do dispositivo.
    fontSize: 18, // Tamanho da fonte do dispositivo.
    marginBottom: 10, // Espaçamento inferior.
    fontWeight: 'bold', // Peso da fonte do dispositivo.
  },
  deviceNumberContainer: {
    backgroundColor: '#fff', // Cor de fundo do número do dispositivo.
    borderRadius: 50, // Bordas arredondadas.
    width: 40, // Largura do contêiner.
    height: 40, // Altura do contêiner.
    justifyContent: 'center', // Alinha conteúdo ao centro verticalmente.
    alignItems: 'center', // Alinha conteúdo ao centro horizontalmente.
    marginBottom: 20, // Espaçamento inferior.
  },
  deviceNumberText: {
    color: '#000', // Cor do texto do número do dispositivo.
    fontWeight: 'bold', // Peso da fonte do número do dispositivo.
    fontSize: 20, // Tamanho da fonte do número do dispositivo.
  },
  inputRow: {
    flexDirection: 'row', // Layout em linha.
    justifyContent: 'space-around', // Espaço igual entre os campos de entrada.
    marginBottom: 20, // Espaçamento inferior.
  },
  inputContainer: {
    alignItems: 'center', // Alinha itens ao centro horizontalmente.
  },
  icon: {
    width: 30, // Largura do ícone dos campos de entrada.
    height: 30, // Altura do ícone dos campos de entrada.
    marginBottom: 5, // Espaçamento inferior do ícone.
  },
  label: {
    color: '#fff', // Cor do rótulo dos campos de entrada.
    fontSize: 14, // Tamanho da fonte dos rótulos.
  },
  input: {
    borderBottomWidth: 1, // Largura da borda inferior.
    borderBottomColor: '#fff', // Cor da borda inferior.
    width: 60, // Largura do campo de entrada.
    textAlign: 'center', // Alinha o texto ao centro.
    color: '#fff', // Cor do texto.
  },
  trashIcon: {
    width: 40, // Largura do ícone de lixeira.
    height: 40, // Altura do ícone de lixeira.
    marginBottom: 30, // Espaçamento inferior.
  },
  sendButtonText: {
    backgroundColor: '#ffd700',
    color: '#000000 ',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginTop: 20
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
    zIndex: 1, // Z-index para garantir que o botão esteja sobre outros elementos.
  },
  backIcon: {
    width: 25, // Largura do ícone de voltar.
    height: 25, // Altura do ícone de voltar.
  },
});
