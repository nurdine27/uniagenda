import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { meetingAPI } from '../../services/api';
import { MeetingCard, EmptyState, LoadingScreen } from '../../components';
import { colors } from '../../theme/colors';

const HomeDocenteScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetch = useCallback(async () => {
    try {
      const { data } = await meetingAPI.getAll();
      setMeetings(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => { fetch(); }, []);

  const pendentes = meetings.filter(m => m.status === 'PENDENTE');
  const confirmadas = meetings.filter(m => m.status === 'CONFIRMADA');

  if (loading) return <LoadingScreen />;

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetch(); }} tintColor={colors.white} />}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Olá, Prof. {user?.nome?.split(' ').slice(-1)[0]} 👋</Text>
          <Text style={styles.subGreeting}>{user?.departamento || 'Universidade Zambeze'}</Text>
        </View>
        <TouchableOpacity style={styles.dispBtn} onPress={() => navigation.navigate('Disponibilidade')}>
          <Ionicons name="settings-outline" size={22} color={colors.white} />
        </TouchableOpacity>
      </View>

      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: '#FEF3C7' }]}>
          <Ionicons name="hourglass-outline" size={22} color={colors.warning} />
          <Text style={[styles.statNum, { color: colors.warning }]}>{pendentes.length}</Text>
          <Text style={[styles.statLabel, { color: colors.warning }]}>Pendentes</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#D1FAE5' }]}>
          <Ionicons name="checkmark-circle-outline" size={22} color={colors.success} />
          <Text style={[styles.statNum, { color: colors.success }]}>{confirmadas.length}</Text>
          <Text style={[styles.statLabel, { color: colors.success }]}>Confirmadas</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.primaryLight }]}>
          <Ionicons name="calendar-outline" size={22} color={colors.primary} />
          <Text style={[styles.statNum, { color: colors.primary }]}>{meetings.length}</Text>
          <Text style={[styles.statLabel, { color: colors.primary }]}>Total</Text>
        </View>
      </View>

      {pendentes.length > 0 && (
        <View style={styles.section}>
          <View style={styles.alertBanner}>
            <Ionicons name="alert-circle" size={18} color={colors.warning} />
            <Text style={styles.alertText}>{pendentes.length} pedido(s) aguardam a sua resposta</Text>
          </View>
          <Text style={styles.sectionTitle}>Pedidos Pendentes</Text>
          {pendentes.slice(0, 3).map(m => (
            <MeetingCard key={m.id} meeting={m} onPress={() => navigation.navigate('MeetingDetail', { id: m.id })} isDocente={true} />
          ))}
        </View>
      )}

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Próximas Reuniões</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Reunioes')}>
            <Text style={styles.seeAll}>Ver todas</Text>
          </TouchableOpacity>
        </View>
        {confirmadas.length === 0 ? (
          <EmptyState icon="calendar-outline" title="Sem reuniões confirmadas" subtitle="Confirme pedidos pendentes para aparecerem aqui" />
        ) : (
          confirmadas.slice(0, 3).map(m => (
            <MeetingCard key={m.id} meeting={m} onPress={() => navigation.navigate('MeetingDetail', { id: m.id })} isDocente={true} />
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { backgroundColor: colors.primaryDark, padding: 24, paddingTop: 56, paddingBottom: 32, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greeting: { fontSize: 22, fontWeight: '800', color: colors.white },
  subGreeting: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  dispBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  statsRow: { flexDirection: 'row', padding: 16, gap: 10, marginTop: -16 },
  statCard: { flex: 1, borderRadius: 14, padding: 12, alignItems: 'center', gap: 4 },
  statNum: { fontSize: 22, fontWeight: '800' },
  statLabel: { fontSize: 11, fontWeight: '600' },
  section: { padding: 16, paddingTop: 8 },
  alertBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#FEF3C7', borderRadius: 12, padding: 12, marginBottom: 14 },
  alertText: { fontSize: 13, fontWeight: '600', color: colors.warning, flex: 1 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: colors.text, marginBottom: 12 },
  seeAll: { fontSize: 13, color: colors.primary, fontWeight: '600' },
});

export default HomeDocenteScreen;
