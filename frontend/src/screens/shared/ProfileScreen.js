import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { userAPI } from '../../services/api';
import { Avatar, Input, Button } from '../../components';
import { colors } from '../../theme/colors';

const ProfileScreen = () => {
  const { user, logout, setUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ nome: user?.nome || '', curso: user?.curso || '', departamento: user?.departamento || '' });
  const [loading, setLoading] = useState(false);

  const roleLabel = { ESTUDANTE: 'Estudante', DOCENTE: 'Docente', ADMIN: 'Administrador' };
  const roleColor = { ESTUDANTE: colors.primary, DOCENTE: colors.success, ADMIN: colors.danger };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data } = await userAPI.updateProfile(form);
      setUser(data);
      setEditing(false);
      Alert.alert('✅ Perfil actualizado!');
    } catch (err) { Alert.alert('Erro', err.message); }
    finally { setLoading(false); }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Avatar name={user?.nome} size={80} color={roleColor[user?.role]} />
        <Text style={styles.name}>{user?.nome}</Text>
        <View style={[styles.roleBadge, { backgroundColor: roleColor[user?.role] + '20' }]}>
          <Text style={[styles.roleText, { color: roleColor[user?.role] }]}>{roleLabel[user?.role]}</Text>
        </View>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Informações Pessoais</Text>
          <TouchableOpacity onPress={() => setEditing(!editing)}>
            <Ionicons name={editing ? 'close-outline' : 'create-outline'} size={22} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {editing ? (
          <>
            <Input label="Nome Completo" value={form.nome} onChangeText={v => setForm(f => ({ ...f, nome: v }))} icon="person-outline" />
            {user?.role === 'ESTUDANTE' && <Input label="Curso" value={form.curso} onChangeText={v => setForm(f => ({ ...f, curso: v }))} icon="book-outline" />}
            {user?.role === 'DOCENTE' && <Input label="Departamento" value={form.departamento} onChangeText={v => setForm(f => ({ ...f, departamento: v }))} icon="business-outline" />}
            <Button title="Guardar Alterações" onPress={handleSave} loading={loading} />
          </>
        ) : (
          <View style={styles.infoList}>
            <View style={styles.infoRow}>
              <Ionicons name="person-outline" size={18} color={colors.textSecondary} />
              <View>
                <Text style={styles.infoLabel}>Nome</Text>
                <Text style={styles.infoValue}>{user?.nome}</Text>
              </View>
            </View>
            {user?.curso && (
              <View style={styles.infoRow}>
                <Ionicons name="book-outline" size={18} color={colors.textSecondary} />
                <View>
                  <Text style={styles.infoLabel}>Curso</Text>
                  <Text style={styles.infoValue}>{user?.curso}</Text>
                </View>
              </View>
            )}
            {user?.departamento && (
              <View style={styles.infoRow}>
                <Ionicons name="business-outline" size={18} color={colors.textSecondary} />
                <View>
                  <Text style={styles.infoLabel}>Departamento</Text>
                  <Text style={styles.infoValue}>{user?.departamento}</Text>
                </View>
              </View>
            )}
          </View>
        )}
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.logoutBtn} onPress={() => Alert.alert('Sair', 'Tem a certeza?', [{ text: 'Cancelar' }, { text: 'Sair', onPress: logout, style: 'destructive' }])}>
          <Ionicons name="log-out-outline" size={20} color={colors.danger} />
          <Text style={styles.logoutText}>Terminar Sessão</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.version}>UniAgenda v1.0 · Universidade Zambeze</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { backgroundColor: colors.white, alignItems: 'center', padding: 32, paddingTop: 64, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  name: { fontSize: 22, fontWeight: '800', color: colors.text, marginTop: 12 },
  roleBadge: { paddingHorizontal: 14, paddingVertical: 5, borderRadius: 20, marginTop: 6 },
  roleText: { fontSize: 13, fontWeight: '700' },
  email: { fontSize: 13, color: colors.textSecondary, marginTop: 6 },
  section: { backgroundColor: colors.white, margin: 16, borderRadius: 16, padding: 16 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
  infoList: { gap: 14 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  infoLabel: { fontSize: 11, color: colors.textSecondary, fontWeight: '600' },
  infoValue: { fontSize: 15, color: colors.text, fontWeight: '500', marginTop: 1 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 4 },
  logoutText: { fontSize: 16, fontWeight: '600', color: colors.danger },
  version: { textAlign: 'center', color: colors.textSecondary, fontSize: 12, padding: 20 },
});

export default ProfileScreen;
