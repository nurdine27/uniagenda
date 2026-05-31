import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { meetingAPI } from '../../services/api';
import { MeetingCard, EmptyState, LoadingScreen } from '../../components';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../theme/colors';

const FILTERS = ['TODAS', 'PENDENTE', 'CONFIRMADA', 'RECUSADA', 'CONCLUIDA', 'CANCELADA'];

const ReunioeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [meetings, setMeetings] = useState([]);
  const [filter, setFilter] = useState('TODAS');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetch = useCallback(async () => {
    try {
      const params = filter !== 'TODAS' ? { status: filter } : {};
      const { data } = await meetingAPI.getAll(params);
      setMeetings(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); setRefreshing(false); }
  }, [filter]);

  useEffect(() => { fetch(); }, [fetch]);

  if (loading) return <LoadingScreen />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Reuniões</Text>
        <Text style={styles.subtitle}>{meetings.length} reunião(ões)</Text>
      </View>

      <View style={styles.filtersWrap}>
        <FlatList
          horizontal
          data={FILTERS}
          showsHorizontalScrollIndicator={false}
          keyExtractor={i => i}
          contentContainerStyle={styles.filters}
          renderItem={({ item }) => (
            <TouchableOpacity style={[styles.chip, filter === item && styles.chipActive]} onPress={() => setFilter(item)}>
              <Text style={[styles.chipText, filter === item && styles.chipTextActive]}>
                {item === 'TODAS' ? 'Todas' : item.charAt(0) + item.slice(1).toLowerCase()}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <FlatList
        data={meetings}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetch(); }} tintColor={colors.primary} />}
        ListEmptyComponent={<EmptyState icon="calendar-outline" title="Sem reuniões" subtitle="Nenhuma reunião encontrada para este filtro" />}
        renderItem={({ item }) => (
          <MeetingCard meeting={item} onPress={() => navigation.navigate('MeetingDetail', { id: item.id })} isDocente={user?.role === 'DOCENTE'} />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { backgroundColor: colors.white, padding: 20, paddingTop: 56, borderBottomWidth: 1, borderBottomColor: colors.border },
  title: { fontSize: 24, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  filtersWrap: { backgroundColor: colors.white },
  filters: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: colors.gray100, borderWidth: 1, borderColor: colors.border },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
  chipTextActive: { color: colors.white },
  list: { padding: 16 },
});

export default ReunioeScreen;
