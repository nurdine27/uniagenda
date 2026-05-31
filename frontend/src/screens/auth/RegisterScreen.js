import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { Input, Button } from '../../components';
import { colors } from '../../theme/colors';

const RegisterScreen = ({ navigation }) => {
  const { register } = useAuth();
  const [form, setForm] = useState({ nome: '', email: '', password: '', confirmPassword: '', role: 'ESTUDANTE', curso: '', departamento: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const validate = () => {
    const e = {};
    if (!form.nome.trim()) e.nome = 'Nome obrigatório';
    if (!form.email) e.email = 'Email obrigatório';
    else if (!form.email.includes('@')) e.email = 'Email inválido';
    if (!form.password || form.password.length < 6) e.password = 'Mínimo 6 caracteres';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Palavras-passe não coincidem';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const { confirmPassword, ...data } = form;
      await register(data);
    } catch (err) {
      Alert.alert('Erro', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Criar Conta</Text>
          <Text style={styles.subtitle}>Junte-se ao UniAgenda</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.roleRow}>
            {['ESTUDANTE', 'DOCENTE'].map(r => (
              <TouchableOpacity key={r} style={[styles.roleBtn, form.role === r && styles.roleBtnActive]} onPress={() => set('role', r)}>
                <Ionicons name={r === 'ESTUDANTE' ? 'school-outline' : 'person-outline'} size={18} color={form.role === r ? colors.white : colors.primary} />
                <Text style={[styles.roleText, form.role === r && styles.roleTextActive]}>{r === 'ESTUDANTE' ? 'Estudante' : 'Docente'}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Input label="Nome Completo" placeholder="Seu nome completo" value={form.nome} onChangeText={v => set('nome', v)} icon="person-outline" error={errors.nome} />
          <Input label="Email Institucional" placeholder="nome@unizambeze.ac.mz" value={form.email} onChangeText={v => set('email', v)} keyboardType="email-address" autoCapitalize="none" icon="mail-outline" error={errors.email} />

          {form.role === 'ESTUDANTE' ? (
            <Input label="Curso" placeholder="Ex: Engenharia de Software" value={form.curso} onChangeText={v => set('curso', v)} icon="book-outline" />
          ) : (
            <Input label="Departamento" placeholder="Ex: Engenharia de Software" value={form.departamento} onChangeText={v => set('departamento', v)} icon="business-outline" />
          )}

          <Input label="Palavra-passe" placeholder="Mínimo 6 caracteres" value={form.password} onChangeText={v => set('password', v)} secureTextEntry icon="lock-closed-outline" error={errors.password} />
          <Input label="Confirmar Palavra-passe" placeholder="Repita a palavra-passe" value={form.confirmPassword} onChangeText={v => set('confirmPassword', v)} secureTextEntry icon="lock-closed-outline" error={errors.confirmPassword} />

          <Button title="Criar Conta" onPress={handleRegister} loading={loading} style={styles.btn} />

          <TouchableOpacity style={styles.loginLink} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginText}>Já tem conta? <Text style={styles.loginBold}>Entrar</Text></Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  header: { padding: 24, paddingTop: 56 },
  back: { marginBottom: 16 },
  title: { fontSize: 28, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: 15, color: colors.textSecondary, marginTop: 4 },
  form: { padding: 24, paddingTop: 8 },
  roleRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  roleBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 14, borderRadius: 12, borderWidth: 1.5, borderColor: colors.primary },
  roleBtnActive: { backgroundColor: colors.primary },
  roleText: { fontSize: 14, fontWeight: '600', color: colors.primary },
  roleTextActive: { color: colors.white },
  btn: { marginTop: 8 },
  loginLink: { alignItems: 'center', marginTop: 20 },
  loginText: { color: colors.textSecondary, fontSize: 14 },
  loginBold: { color: colors.primary, fontWeight: '700' },
});

export default RegisterScreen;
