import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { LoadingScreen } from '../components';
import { colors } from '../theme/colors';

// Auth Screens
import SplashScreen from '../screens/auth/SplashScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// Shared
import MeetingDetailScreen from '../screens/shared/MeetingDetailScreen';
import ReunioeScreen from '../screens/shared/ReunioeScreen';
import ProfileScreen from '../screens/shared/ProfileScreen';

// Estudante
import HomeScreen from '../screens/estudante/HomeScreen';
import DocentesScreen from '../screens/estudante/DocentesScreen';
import DocenteDetailScreen from '../screens/estudante/DocenteDetailScreen';
import NovaMeetingScreen from '../screens/estudante/NovaMeetingScreen';

// Docente
import HomeDocenteScreen from '../screens/docente/HomeDocenteScreen';
import DisponibilidadeScreen from '../screens/docente/DisponibilidadeScreen';

// Admin
import AdminScreen from '../screens/admin/AdminScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const tabBarOptions = {
  headerShown: false,
  tabBarActiveTintColor: colors.primary,
  tabBarInactiveTintColor: colors.gray400,
  tabBarStyle: { backgroundColor: colors.white, borderTopColor: colors.border, paddingBottom: 6, paddingTop: 4, height: 62 },
  tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
};

// Estudante Tabs
const EstudanteTabs = () => (
  <Tab.Navigator screenOptions={tabBarOptions}>
    <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Início', tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} /> }} />
    <Tab.Screen name="Docentes" component={DocentesScreen} options={{ title: 'Docentes', tabBarIcon: ({ color, size }) => <Ionicons name="people-outline" size={size} color={color} /> }} />
    <Tab.Screen name="Reunioes" component={ReunioeScreen} options={{ title: 'Reuniões', tabBarIcon: ({ color, size }) => <Ionicons name="calendar-outline" size={size} color={color} /> }} />
    <Tab.Screen name="Perfil" component={ProfileScreen} options={{ title: 'Perfil', tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} /> }} />
  </Tab.Navigator>
);

// Docente Tabs
const DocenteTabs = () => (
  <Tab.Navigator screenOptions={{ ...tabBarOptions, tabBarActiveTintColor: colors.primaryDark }}>
    <Tab.Screen name="HomeDocente" component={HomeDocenteScreen} options={{ title: 'Início', tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} /> }} />
    <Tab.Screen name="Reunioes" component={ReunioeScreen} options={{ title: 'Reuniões', tabBarIcon: ({ color, size }) => <Ionicons name="calendar-outline" size={size} color={color} /> }} />
    <Tab.Screen name="Perfil" component={ProfileScreen} options={{ title: 'Perfil', tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} /> }} />
  </Tab.Navigator>
);

// Admin Tabs
const AdminTabs = () => (
  <Tab.Navigator screenOptions={{ ...tabBarOptions, tabBarActiveTintColor: colors.danger }}>
    <Tab.Screen name="AdminHome" component={AdminScreen} options={{ title: 'Painel', tabBarIcon: ({ color, size }) => <Ionicons name="grid-outline" size={size} color={color} /> }} />
    <Tab.Screen name="Perfil" component={ProfileScreen} options={{ title: 'Perfil', tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} /> }} />
  </Tab.Navigator>
);

const MainNavigator = () => {
  const { user } = useAuth();
  const TabNav = user?.role === 'DOCENTE' ? DocenteTabs : user?.role === 'ADMIN' ? AdminTabs : EstudanteTabs;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={TabNav} />
      <Stack.Screen name="MeetingDetail" component={MeetingDetailScreen} />
      <Stack.Screen name="DocenteDetail" component={DocenteDetailScreen} />
      <Stack.Screen name="NovaMeeting" component={NovaMeetingScreen} />
      <Stack.Screen name="Disponibilidade" component={DisponibilidadeScreen} />
    </Stack.Navigator>
  );
};

const AppNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          <Stack.Screen name="Main" component={MainNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
