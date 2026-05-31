import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { adminAPI } from '../../services/api';
import { Avatar, LoadingScreen } from '../../components';
import { colors } from '../../theme/colors';

const AdminScreen = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([adminAPI.getStats(), adminAPI.getAllUsers()])
      .then(([s, u]) => { setStats(s.data); setUsers(u.data); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingScreen />;

  const roleLabel = { ESTUDANTE: 'Estudante', DOCENTE: 'Docente', ADMIN: 'Admin' };
  const roleColor = { ESTUDANTE: colors.primary, DOCENTE: colors.success, ADMIN: colors.danger };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Painel Admin</Text>
        <Text style={styles.subtitle}>Universidade Zambeze</Text>
      </View>

      <View style={styles.statsGrid}>
        {[
          { label: 'Utilizadores', value: stats?.totalUsers, icon: 'people-outline', color: colors.primary },
          { label: 'Total Reuniões', value: stats?.totalMeetings, icon: 'calendar-outline', color: colors.success },
          { label: 'Pendentes', value: stats?.pendentes, icon: 'hourglass-outline', color: colors.warning },
          { label: 'Confirmadas', value: stats?.confirmadas, icon: 'checkmark-circle-outline', color: colors.success },
        ].map((s, i) => (
          <View key={i} style={[styles.statCard, { borderLeftColor: s.color }]}>
            <Ionicons name={s.icon} size={22} color={s.color} />
            <Text style={[styles.statNum, { color: s.color }]}>{s.value || 0}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Todos os Utilizadores ({users.length})</Text>
        {users.map(u => (
          <View key={u.id} style={styles.userCard}>
            <Avatar name={u.nome} size={44} color={roleColor[u.role]} />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{u.nome}</Text>
              <Text style={styles.userEmail}>{u.email}</Text>
            </View>
            <View style={[styles.rolePill, { backgroundColor: roleColor[u.role] + '20' }]}>
              <Text style={[styles.roleText, { color: roleColor[u.role] }]}>{roleLabel[u.role]}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { backgroundColor: colors.danger, padding: 24, paddingTop: 56, paddingBottom: 28 },
  title: { fontSize: 26, fontWeight: '800', color: colors.white },
  subtitle: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 12, gap: 10 },
  statCard: { width: '47%', backgroundColor: colors.white, borderRadius: 14, padding: 14, borderLeftWidth: 4, elevation: 2 },
  statNum: { fontSize: 28, fontWeight: '800', marginTop: 8 },
  statLabel: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  section: { backgroundColor: colors.white, margin: 16, borderRadius: 16, padding: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 14 },
  userCard: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border },
  userInfo: { flex: 1 },
  userName: { fontSize: 14, fontWeight: '700', color: colors.text },
  userEmail: { fontSize: 12, color: colors.textSecondary, marginTop: 1 },
  rolePill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  roleText: { fontSize: 11, fontWeight: '700' },
});

export default AdminScreen;
