import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { meetingAPI } from '../../services/api';
import { MeetingCard, EmptyState, LoadingScreen } from '../../components';
import { colors } from '../../theme/colors';

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMeetings = useCallback(async () => {
    try {
      const { data } = await meetingAPI.getAll();
      setMeetings(data.slice(0, 5));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchMeetings(); }, []);

  const pendentes = meetings.filter(m => m.status === 'PENDENTE').length;
  const confirmadas = meetings.filter(m => m.status === 'CONFIRMADA').length;

  if (loading) return <LoadingScreen />;

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchMeetings(); }} tintColor={colors.primary} />}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Olá, {user?.nome?.split(' ')[0]} 👋</Text>
          <Text style={styles.subGreeting}>{user?.curso || 'Universidade Zambeze'}</Text>
        </View>
        <TouchableOpacity style={styles.notifBtn}>
          <Ionicons name="notifications-outline" size={24} color={colors.white} />
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: colors.primaryLight }]}>
          <Text style={[styles.statNum, { color: colors.primary }]}>{pendentes}</Text>
          <Text style={[styles.statLabel, { color: colors.primary }]}>Pendentes</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#D1FAE5' }]}>
          <Text style={[styles.statNum, { color: colors.success }]}>{confirmadas}</Text>
          <Text style={[styles.statLabel, { color: colors.success }]}>Confirmadas</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#FEF3C7' }]}>
          <Text style={[styles.statNum, { color: colors.warning }]}>{meetings.length}</Text>
          <Text style={[styles.statLabel, { color: colors.warning }]}>Total</Text>
        </View>
      </View>

      {/* Quick Action */}
      <TouchableOpacity style={styles.newBtn} onPress={() => navigation.navigate('Docentes')} activeOpacity={0.85}>
        <View style={styles.newBtnIcon}>
          <Ionicons name="add-circle" size={24} color={colors.white} />
        </View>
        <View>
          <Text style={styles.newBtnTitle}>Nova Reunião</Text>
          <Text style={styles.newBtnSub}>Agendar com um docente</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.white} style={{ marginLeft: 'auto' }} />
      </TouchableOpacity>

      {/* Recent Meetings */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Reuniões Recentes</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Reunioes')}>
            <Text style={styles.seeAll}>Ver todas</Text>
          </TouchableOpacity>
        </View>
        {meetings.length === 0 ? (
          <EmptyState icon="calendar-outline" title="Sem reuniões" subtitle="Agende a sua primeira reunião com um docente" />
        ) : (
          meetings.map(m => (
            <MeetingCard key={m.id} meeting={m} onPress={() => navigation.navigate('MeetingDetail', { id: m.id })} isDocente={false} />
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { backgroundColor: colors.primary, padding: 24, paddingTop: 56, paddingBottom: 32, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greeting: { fontSize: 22, fontWeight: '800', color: colors.white },
  subGreeting: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  notifBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  statsRow: { flexDirection: 'row', padding: 16, gap: 10, marginTop: -16 },
  statCard: { flex: 1, borderRadius: 14, padding: 14, alignItems: 'center' },
  statNum: { fontSize: 24, fontWeight: '800' },
  statLabel: { fontSize: 11, fontWeight: '600', marginTop: 2 },
  newBtn: { marginHorizontal: 16, backgroundColor: colors.primary, borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  newBtnIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  newBtnTitle: { fontSize: 15, fontWeight: '700', color: colors.white },
  newBtnSub: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  section: { padding: 16 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: colors.text },
  seeAll: { fontSize: 13, color: colors.primary, fontWeight: '600' },
});

export default HomeScreen;
