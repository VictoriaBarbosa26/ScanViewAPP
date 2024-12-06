import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'; 
import { LinearGradient } from 'expo-linear-gradient'; // Importa o componente de gradiente do Expo

// Função principal que renderiza a tela principal (MainScreen)
export default function MainScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Faixa preta superior com perfil e título */}
      <View style={styles.topBar}>
        <View style={styles.profileContainer}>
          {/* Ícone do perfil */}
          <Image style={styles.profileIcon} source={require('../../../../assets/icon_momentaneo.png')} />
          <View>
            {/* Nome da pessoa e email */}
            <Text style={styles.profileName}>Nome da Pessoa</Text>
            <Text style={styles.profileEmail}>email@example.com</Text>
          </View>
        </View>
        {/* Título da página */}
        <Text style={styles.categoriesText}>Agendamento de Manutenção</Text>
      </View>

      {/* Linha separadora branca */}
      <View style={styles.separator} />

      {/* Área do gradiente contendo as caixinhas de opções */}
      <LinearGradient colors={['#0056b3', '#000000']} style={styles.boxesContainer}>

        {/* Botão de voltar no canto superior esquerdo */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Image style={styles.backIcon} source={require('../../../../assets/voltar.png')} />
        </TouchableOpacity>
        
        {/* Espaço extra acima das caixinhas */}
        <View style={styles.spacing} />

        {/* Container que alinha os contêineres em coluna */}
        <View style={styles.columnContainer}>
          {/* Container para os três blocos de laboratório na parte superior */}
          <View style={styles.topRowContainer}>
            {[1, 2, 3].map(number => (
              <View key={number} style={styles.boxContainerTop}>
                <Text style={styles.boxText}>Laboratório</Text>
                <TouchableOpacity 
                  style={styles.box} 
                  onPress={() => navigation.navigate('RecadoMT_DS')}>
                  <Text style={styles.numberText}>{number}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
          {/* Container para os dois blocos de laboratório na parte inferior */}
          <View style={styles.bottomRowContainer}>
            {[4, 5].map(number => (
              <View key={number} style={styles.boxContainerBottom}>
                <Text style={styles.boxText}>Laboratório</Text>
                <TouchableOpacity 
                  style={styles.box} 
                  onPress={() => navigation.navigate('RecadoMT_DS')}>
                  <Text style={styles.numberText}>{number}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      </LinearGradient>

      {/* Faixa preta inferior com opções de navegação */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomOption} onPress={() => navigation.navigate('PerfilADM')}>
          <Image style={styles.bottomIcon} source={require('../../../../assets/perfil.png')} />
          <Text style={styles.bottomText}>Perfil</Text>
        </TouchableOpacity>

        {/* Botão de navegação para a tela principal do administrador */}
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
    backgroundColor: '#000',  // Faixa preta superior
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
    fontWeight: 'bold',  // Texto em negrito
  },
  profileEmail: {
    color: '#ccc',  // Cor do texto cinza
    fontSize: 14,  // Tamanho da fonte
  },
  categoriesText: {
    color: '#00ffff',  // Cor do texto ciano
    fontSize: 20,  // Tamanho da fonte
    fontWeight: 'bold',  // Texto em negrito
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
  columnContainer: {
    flexDirection: 'column',  // Alinha os containers em coluna
    justifyContent: 'center',  // Centraliza verticalmente
    width: '100%',  // Largura total da tela
    alignItems: 'center',  // Centraliza os containers horizontalmente
  },
  topRowContainer: {
    flexDirection: 'row',  // Alinha os itens horizontalmente
    justifyContent: 'space-between',  // Espaçamento igual entre os itens
    width: '100%',  // Largura total da tela
    marginBottom: 10,  // Espaço entre as linhas
  },
  bottomRowContainer: {
    flexDirection: 'row',  // Alinha os itens horizontalmente
    justifyContent: 'space-between',  // Espaçamento igual entre os itens
    width: '100%',  // Largura total da tela
  },
  boxContainerTop: {
    alignItems: 'center',  // Centraliza o texto e o botão
    width: '30%',  // Cada caixa ocupa 30% da largura disponível
  },
  boxContainerBottom: {
    alignItems: 'center',  // Centraliza o texto e o botão
    width: '45%',  // Cada caixa ocupa 45% da largura disponível
  },
  box: {
    backgroundColor: '#fff',  // Cor de fundo branca para a caixa
    borderRadius: 5,  // Bordas arredondadas
    borderColor: '#fff',  // Cor da borda branca
    borderWidth: 1,  // Largura da borda
    padding: 20,  // Espaçamento interno
    alignItems: 'center',  // Centraliza o texto dentro da caixa
    justifyContent: 'center',  // Centraliza verticalmente
  },
  boxText: {
    color: '#fad541',  // Cor do texto amarela
    textAlign: 'center',  // Texto centralizado
    marginBottom: 5,  // Margem inferior
    fontWeight: 'bold',  // Texto em negrito
  },
  numberText: {
    color: 'black',  // Cor do número preto
    textAlign: 'center',  // Texto centralizado
    fontWeight: 'bold',  // Texto em negrito
    fontSize: 18,  // Tamanho da fonte
  },
  bottomBar: {
    backgroundColor: '#000',  // Faixa preta inferior
    flexDirection: 'row',  // Botões dispostos horizontalmente
    justifyContent: 'space-around',  // Espaçamento igual entre os botões
    padding: 10,  // Espaçamento interno
  },
  bottomOption: {
    alignItems: 'center',  // Centraliza o texto e o ícone
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
  spacing: {
    width: 20,  // Espaçamento entre as caixas
  },
  backButton: {
    position: 'absolute',  // Posição absoluta para sobrepor o botão
    top: 10,  // Posição a partir do topo
    left: 20,  // Posição a partir da esquerda
    zIndex: 1,  // Garante que o botão fique sobre os outros componentes
  },
  backIcon: {
    width: 25,
    height: 25,  // Dimensões do ícone de voltar
  },
});
