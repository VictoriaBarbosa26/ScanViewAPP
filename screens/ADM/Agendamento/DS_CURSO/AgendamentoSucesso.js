// TELA PARA AGENDAMENTO CONCLUÍDO COM SUCESSO
import React, { useState } from 'react'; 
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native'; 
import { LinearGradient } from 'expo-linear-gradient';

// Componente principal da tela
export default function MainScreen({ navigation }) {
  // Definição de estados para armazenar informações da data, laboratório e horário
  const [data, setData] = useState(''); 
  const [lab, setLab] = useState('');
  const [horario, setHorario] = useState('');

  // Função para limpar os estados (data, lab, horario)
  const clearData = () => {
    setData('');
    setLab('');
    setHorario('');
  };

  // Função para enviar os dados e navegar para a tela "AgendarCN"
  const handleSubmit = () => {
    navigation.navigate('AgendarCN');
  };

  return (
    <View style={styles.container}>
      {/* Faixa preta superior */}
      <View style={styles.topBar}>
        {/* Container com as informações do perfil */}
        <View style={styles.profileContainer}>
          {/* Ícone de perfil */}
          <Image style={styles.profileIcon} source={require('../../../../assets/icon_momentaneo.png')} />
          <View>
            {/* Nome e email da pessoa logada */}
            <Text style={styles.profileName}>Nome da Pessoa</Text>
            <Text style={styles.profileEmail}>email@example.com</Text>
          </View>
        </View>
        {/* Texto de título "Agendamento de Manutenção" */}
        <Text style={styles.categoriesText}>Agendamento de Manutenção</Text>
      </View>

      {/* Linha branca separando a faixa preta do gradiente */}
      <View style={styles.separator} />

      {/* Gradiente azul com preto para a mensagem de sucesso */}
      <LinearGradient colors={['#0056b3', '#000000']} style={styles.boxesContainer}>
        
        {/* Botão de voltar no canto superior esquerdo */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Image style={styles.backIcon} source={require('../../../../assets/voltar.png')} />
        </TouchableOpacity>

        {/* Mensagem de sucesso centralizada */}
        <View style={styles.successContainer}>
          {/* Ícone de sucesso */}
          <Image style={styles.successIcon} source={require('../../../../assets/correto.png')} />
          <Text style={styles.successText}>Manutenção agendada com sucesso!</Text>
          {/* Subtexto informativo */}
          <Text style={styles.subText}>Um dia antes da manutenção ser realizada você será notificado.</Text>
        </View>
      </LinearGradient>

      {/* Faixa preta inferior com opções de navegação */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomOption} onPress={() => navigation.navigate('PerfilADM')}>
          <Image style={styles.bottomIcon} source={require('../../../../assets/perfil.png')} />
          <Text style={styles.bottomText}>Perfil</Text>
        </TouchableOpacity>

        {/* Botão de navegação para a tela principal de administrador */}
        <TouchableOpacity style={styles.bottomOption} onPress={() => navigation.navigate('MainScreenADM')}>
          <Image style={styles.bottomIcon} source={require('../../../../assets/inicio.png')} />
          <Text style={styles.bottomText}>Home</Text>
        </TouchableOpacity>

        {/* Botão de navegação para a caixa de entrada */}
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
    flex: 1,  // O container ocupa toda a tela
    backgroundColor: '#000',  // Cor de fundo preta
  },
  topBar: {
    backgroundColor: '#000',  // Fundo preto para a faixa superior
    padding: 20,  // Espaçamento interno
  },
  profileContainer: {
    flexDirection: 'row',  // Coloca os elementos (imagem e textos) em linha
    alignItems: 'center',  // Alinha os elementos no centro verticalmente
    marginBottom: 10,  // Espaçamento abaixo do container
  },
  profileIcon: {
    width: 75,
    height: 75,  // Dimensões do ícone de perfil
    marginRight: 10,  // Espaçamento à direita do ícone
  },
  profileName: {
    color: '#fff',  // Cor do texto branco
    fontSize: 18,  // Tamanho da fonte
    fontWeight: 'bold',  // Negrito
  },
  profileEmail: {
    color: '#ccc',  // Cor do texto cinza
    fontSize: 14,  // Tamanho da fonte
  },
  categoriesText: {
    color: '#00ffff',  // Cor do texto ciano
    fontSize: 20,  // Tamanho da fonte
    fontWeight: 'bold',  // Negrito
    textAlign: 'center',  // Centraliza o texto
  },
  separator: {
    height: 2,  // Altura da linha separadora
    backgroundColor: '#fff',  // Cor branca
  },
  boxesContainer: {
    flex: 1,  // O gradiente ocupa o restante da tela
    padding: 10,  // Espaçamento interno
    justifyContent: 'center',  // Centraliza verticalmente
    alignItems: 'center',  // Centraliza horizontalmente
  },
  successContainer: {
    justifyContent: 'center',  // Centraliza verticalmente
    alignItems: 'center',  // Centraliza horizontalmente
    marginTop: 50,  // Margem superior
  },
  successIcon: {
    width: 100,
    height: 100,  // Dimensões do ícone de sucesso
    marginBottom: 20,  // Espaçamento abaixo do ícone
  },
  successText: {
    color: 'white',  // Cor do texto branco
    fontSize: 18,  // Tamanho da fonte
    marginBottom: 10,  // Espaçamento inferior
    fontWeight: 'bold',  // Negrito
    textAlign: 'center',  // Centraliza o texto
  },
  subText: {
    color: '#fff',  // Cor do texto branco
    fontSize: 14,  // Tamanho da fonte
    textAlign: 'center',  // Centraliza o texto
    marginHorizontal: 20,  // Espaçamento nas laterais
  },
  backButton: {
    position: 'absolute',  // Posição absoluta para sobrepor o botão
    top: 10,  // Posição a partir do topo
    left: 20,  // Posição a partir da esquerda
    zIndex: 1,  // Garante que o botão apareça acima de outros componentes
  },
  backIcon: {
    width: 25,
    height: 25,  // Dimensões do ícone de voltar
  },
  bottomBar: {
    backgroundColor: '#000',  // Fundo preto para a faixa inferior
    flexDirection: 'row',  // Coloca os botões em linha
    justifyContent: 'space-around',  // Espaça igualmente os botões
    padding: 10,  // Espaçamento interno
  },
  bottomOption: {
    alignItems: 'center',  // Centraliza o conteúdo de cada botão
  },
  bottomIcon: {
    width: 25,
    height: 25,  // Dimensões dos ícones da barra inferior
    marginBottom: 5,  // Espaçamento abaixo do ícone
  },
  bottomText: {
    color: '#fff',  // Cor do texto branco
    fontSize: 12,  // Tamanho da fonte
  },
});
