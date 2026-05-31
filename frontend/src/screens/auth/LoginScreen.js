import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { Input, Button } from '../../components';
import { colors } from '../../theme/colors';

const LoginScreen = ({ navigation }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!email) e.email = 'Email obrigatório';
    else if (!email.includes('@')) e.email = 'Email inválido';
    if (!password) e.password = 'Palavra-passe obrigatória';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await login(email.trim().toLowerCase(), password);
    } catch (err) {
      Alert.alert('Erro', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <Ionicons name="calendar" size={36} color={colors.primary} />
          </View>
          <Text style={styles.title}>UniAgenda</Text>
          <Text style={styles.subtitle}>Bem-vindo de volta!</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Email Institucional"
            placeholder="nome@unizambeze.ac.mz"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            icon="mail-outline"
            error={errors.email}
          />
          <Input
            label="Palavra-passe"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            icon="lock-closed-outline"
            error={errors.password}
          />

          <View style={styles.demo}>
            <Text style={styles.demoTitle}>Contas de demonstração:</Text>
            <TouchableOpacity onPress={() => { setEmail('estudante@unizambeze.ac.mz'); setPassword('123456'); }}>
              <Text style={styles.demoItem}>👨‍🎓 Estudante</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setEmail('taheer.mitha@unizambeze.ac.mz'); setPassword('123456'); }}>
              <Text style={styles.demoItem}>👨‍🏫 Docente</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setEmail('admin@unizambeze.ac.mz'); setPassword('123456'); }}>
              <Text style={styles.demoItem}>🛡️ Admin</Text>
            </TouchableOpacity>
          </View>

          <Button title="Entrar" onPress={handleLogin} loading={loading} style={styles.btn} />

          <TouchableOpacity style={styles.registerLink} onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerText}>Não tem conta? <Text style={styles.registerBold}>Registar</Text></Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  content: { padding: 24, paddingTop: 60 },
  header: { alignItems: 'center', marginBottom: 36 },
  logoCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  title: { fontSize: 28, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: 15, color: colors.textSecondary, marginTop: 4 },
  form: {},
  demo: { backgroundColor: colors.gray100, borderRadius: 12, padding: 14, marginBottom: 16 },
  demoTitle: { fontSize: 12, fontWeight: '600', color: colors.textSecondary, marginBottom: 8 },
  demoItem: { fontSize: 13, color: colors.primary, paddingVertical: 4, fontWeight: '500' },
  btn: { marginTop: 4 },
  registerLink: { alignItems: 'center', marginTop: 20 },
  registerText: { color: colors.textSecondary, fontSize: 14 },
  registerBold: { color: colors.primary, fontWeight: '700' },
});

export default LoginScreen;
