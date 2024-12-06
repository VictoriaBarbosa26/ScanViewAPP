import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


// Login, Cadastro, Perfil e Email
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import MainEmail from './screens/ADM/MainEmail';
import MensagemEmail from './screens/ADM/MensagemEmail'
import PerfilADM from './screens/ADM/PerfilADM'; 

// Redirecionamento para as telas de ALUNO
import MainScreenAluno from './screens/ALUNO/MainScreenAluno';
import RelatarPro from './screens/ALUNO/RelatarPro/RelatarPro';
import RegistrarPC from './screens/ALUNO/RegistrarPC/RegistrarPC';
import MainEmailAluno from './screens/ALUNO/MainEmailAluno';
import MensagemAluno from './screens/ALUNO/MensagemAluno';
import PerfilAluno from './screens/ALUNO/PerfilAluno';



// Redirecionamento para as telas de PROFESSOR
import MainScreenProf from './screens/PROF/MainScreenProf';
import RelatarProProf from './screens/PROF/RelatarPro/RelatarPro';
import RegistroAlunos from './screens/PROF/RegistroAluno/RegistroAluno';
import HorarioDispADM from './screens/PROF/HorarioDispADM/HoraDispADM';
import RegistroAula from './screens/PROF/RegistroAula/RegistroAula';
import NovoRegistroAula from './screens/PROF/RegistroAula/NovoRegistroAula';
import PerfilProf from './screens/PROF/PerfilProf';
import MainEmailProf from './screens/PROF/MainEmailProf';
import MensagemProf from './screens/PROF/MensagemProf';



// Redirecionamento para as telas de ADM
import MainScreenADM from './screens/ADM/MainScreenADM'; 
import SelecionarCurso from './screens/ADM/VisualizarPro/SelecionarCurso';
// Visualizar Problemas ADM
import SelecionarLabADM from './screens/ADM/VisualizarPro/LaboratorioADM/SelecionarLabADM';
import VisualizaProADM from './screens/ADM/VisualizarPro/LaboratorioADM/VisualizaProADM';
import VisualizaBoxADM from './screens/ADM/VisualizarPro/LaboratorioADM/VisualizaBoxADM';
import ProblemaResolvidoADM from './screens/ADM/VisualizarPro/LaboratorioADM/ProblemaResolvidoADM';
// Visualizar Problemas AUT
import SelecionarLabAUT from './screens/ADM/VisualizarPro/LaboratorioAUT/SelecionarLabAUT';
import VisualizaProAUT from './screens/ADM/VisualizarPro/LaboratorioAUT/VisualizaProAUT';
import VisualizaBoxAUT from './screens/ADM/VisualizarPro/LaboratorioAUT/VisualizaBoxAUT';
import ProblemaResolvidoAUT from './screens/ADM/VisualizarPro/LaboratorioAUT/ProblemaResolvidoAUT';
// Visualizar Problemas DS
import SelecionarLabDS from './screens/ADM/VisualizarPro/LaboratorioDS/SelecionarLabDS';
import VisualizaProDS from './screens/ADM/VisualizarPro/LaboratorioDS/VisualizaProDS';
import VisualizaBoxDS from './screens/ADM/VisualizarPro/LaboratorioDS/VisualizaBoxDS';
import ProblemaResolvidoDS from './screens/ADM/VisualizarPro/LaboratorioDS/ProblemaResolvidoDS';


// Agendamento para o Curso de ADM
import AgendamentoMT from './screens/ADM/Agendamento/AgendamentoMT';
import EscolhaCurso_ADM from './screens/ADM/Agendamento/ADM_CURSO/AgendamentoLab';
import RecadoMT_ADM from './screens/ADM/Agendamento/ADM_CURSO/RecadoMT';
import UltimaMT_ADM from './screens/ADM/Agendamento/ADM_CURSO/UltimaMT';
import AgendarMT_ADM from './screens/ADM/Agendamento/ADM_CURSO/AgendarMT';
import AgendamentoSucesso_ADM from './screens/ADM/Agendamento/ADM_CURSO/AgendamentoSucesso';
// Agendamento para o Curso de AUT
import EscolhaCurso_AUT from './screens/ADM/Agendamento/AUT_CURSO/AgendamentoLab';
import RecadoMT_AUT from './screens/ADM/Agendamento/AUT_CURSO/RecadoMT';
import UltimaMT_AUT from './screens/ADM/Agendamento/AUT_CURSO/UltimaMT';
import AgendarMT_AUT from './screens/ADM/Agendamento/AUT_CURSO/AgendarMT';
import AgendamentoSucesso_AUT from './screens/ADM/Agendamento/AUT_CURSO/AgendamentoSucesso';
// Agendamento para o Curso de DS
import EscolhaCurso_DS from './screens/ADM/Agendamento/DS_CURSO/AgendamentoLab';
import RecadoMT_DS from './screens/ADM/Agendamento/DS_CURSO/RecadoMT';
import UltimaMT_DS from './screens/ADM/Agendamento/DS_CURSO/UltimaMT';
import AgendarMT_DS from './screens/ADM/Agendamento/DS_CURSO/AgendarMT';
import AgendamentoSucesso_DS from './screens/ADM/Agendamento/DS_CURSO/AgendamentoSucesso';

// Horario de Disponibilidade
import HorarioDPS from './screens/ADM/HorarioDP/HorarioDPS';
import HorarioRS from './screens/ADM/HorarioDP/HorarioRS';



// Configurando o Stack Navigator
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {/* Telas de Login, Cadastro, Email e Perfil */}
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="PerfilADM" 
          component={PerfilADM} 
          options={{ headerShown: false }} // Oculta o cabeçalho se desejado
        />
        <Stack.Screen 
          name="Signup" 
          component={SignupScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="MainEmail" 
          component={MainEmail} 
          options={{ headerShown: false }} // Oculta o cabeçalho se desejado
        />
        <Stack.Screen 
        name="MensagemEmail" 
        component={MensagemEmail} 
         options={{ headerShown: false }}
         />

        {/* Email e Perfil - Aluno */}
        <Stack.Screen 
          name="MainEmailAluno" 
          component={MainEmailAluno} 
          options={{ headerShown: false }} // Oculta o cabeçalho se desejado
        />
        <Stack.Screen 
        name="MensagemAluno" 
        component={MensagemAluno} 
         options={{ headerShown: false }}
         />
        <Stack.Screen 
        name="PerfilAluno" 
        component={PerfilAluno} 
         options={{ headerShown: false }}
         />


        {/* Telas de ADM */}
        <Stack.Screen 
          name="MainScreenADM" 
          component={MainScreenADM} 
          options={{ headerShown: false }} 
        />
        
        {/*VISUALIZAR PROBLEMA*/}
         <Stack.Screen 
          name="SelecionarCurso" 
          component={SelecionarCurso} 
          options={{ headerShown: false }} 
        />

        {/*VISUALIZAR PROBLEMA ADM*/}
        <Stack.Screen 
          name="SelecionarLabADM" 
          component={SelecionarLabADM} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="VisualizaProADM" 
          component={VisualizaProADM} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="BoxADM" 
          component={VisualizaBoxADM} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="ProblemaResolvidoADM" 
          component={ProblemaResolvidoADM} 
          options={{ headerShown: false }} 
        />
        

        {/*VISUALIZAR PROBLEMA AUT*/}
        <Stack.Screen 
          name="SelecionarLabAUT" 
          component={SelecionarLabAUT} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="VisualizaProAUT" 
          component={VisualizaProAUT} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="BoxAUT" 
          component={VisualizaBoxAUT} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="ProblemaResolvidoAUT" 
          component={ProblemaResolvidoAUT} 
          options={{ headerShown: false }} 
        />

        {/*VISUALIZAR PROBLEMA DS*/}
        <Stack.Screen 
          name="SelecionarLabDS" 
          component={SelecionarLabDS} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="VisualizaProDS" 
          component={VisualizaProDS} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="BoxDS" 
          component={VisualizaBoxDS} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="ProblemaResolvidoDS" 
          component={ProblemaResolvidoDS} 
          options={{ headerShown: false }} 
        />


        {/*AGENDAMENTO ADM*/}
        <Stack.Screen 
          name="AgendamentoMT" 
          component={AgendamentoMT} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="EscolhaCurso_ADM" 
          component={EscolhaCurso_ADM} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="RecadoMT_ADM" 
          component={RecadoMT_ADM} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="UltimaMT_ADM" 
          component={UltimaMT_ADM} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="AgendarMT_ADM" 
          component={AgendarMT_ADM} 
          options={{ headerShown: false }} 
        />
        
        <Stack.Screen 
          name="AgendamentoSucesso_ADM" 
          component={AgendamentoSucesso_ADM} 
          options={{ headerShown: false }} 
        />

        {/*AGENDAMENTO AUT*/}
        <Stack.Screen 
          name="EscolhaCurso_AUT" 
          component={EscolhaCurso_AUT} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="RecadoMT_AUT" 
          component={RecadoMT_AUT} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="UltimaMT_AUT" 
          component={UltimaMT_AUT} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="AgendarMT_AUT" 
          component={AgendarMT_AUT} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="AgendamentoSucesso_AUT" 
          component={AgendamentoSucesso_AUT} 
          options={{ headerShown: false }} 
        />

        {/*AGENDAMENTO DS*/}
        <Stack.Screen 
          name="EscolhaCurso_DS" 
          component={EscolhaCurso_DS} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="RecadoMT_DS" 
          component={RecadoMT_DS} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="UltimaMT_DS" 
          component={UltimaMT_DS} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="AgendarMT_DS" 
          component={AgendarMT_DS} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="AgendamentoSucesso_DS" 
          component={AgendamentoSucesso_DS} 
          options={{ headerShown: false }} 
        />


        {/*HORÁRIO DE DISPONIBILIDADE*/}
        <Stack.Screen 
          name="HorarioDPS" 
          component={HorarioDPS} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="HorarioRS" 
          component={HorarioRS} 
          options={{ headerShown: false }} 
        />






        {/* Telas de ALUNO */}
        <Stack.Screen 
          name="MainAluno" 
          component={MainScreenAluno} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="RegistrarPC" 
          component={RegistrarPC} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="RelatarPro" 
          component={RelatarPro} 
          options={{ headerShown: false }} 
        />





        {/* Telas de PROFESSOR */}
        <Stack.Screen 
          name="MainProf" 
          component={MainScreenProf} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="RelatarProProf" 
          component={RelatarProProf} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="RegistroAlunos" 
          component={RegistroAlunos} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="HorarioDispADM" 
          component={HorarioDispADM} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="RegistroAula" 
          component={RegistroAula} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="NovoRegistroAula" 
          component={NovoRegistroAula} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
        name="PerfilProf" 
        component={PerfilProf} 
         options={{ headerShown: false }}
         />
        <Stack.Screen 
        name="MensagemProf" 
        component={MensagemProf} 
         options={{ headerShown: false }}
         />
        <Stack.Screen 
        name="MainEmailProf" 
        component={MainEmailProf} 
         options={{ headerShown: false }}
         />

      </Stack.Navigator>
    </NavigationContainer>
  );
}