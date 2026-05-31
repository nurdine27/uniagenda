import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { userAPI } from '../../services/api';
import { Avatar, LoadingScreen, EmptyState } from '../../components';
import { colors } from '../../theme/colors';

const DocentesScreen = ({ navigation }) => {
  const [docentes, setDocentes] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userAPI.getDocentes().then(({ data }) => { setDocentes(data); setFiltered(data); }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(docentes.filter(d => d.nome.toLowerCase().includes(q) || d.departamento?.toLowerCase().includes(q)));
  }, [search, docentes]);

  if (loading) return <LoadingScreen />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Docentes</Text>
        <Text style={styles.subtitle}>{filtered.length} docente(s) disponível(is)</Text>
        <View style={styles.searchWrap}>
          <Ionicons name="search-outline" size={18} color={colors.gray500} style={styles.searchIcon} />
          <TextInput style={styles.search} placeholder="Pesquisar por nome ou departamento..." value={search} onChangeText={setSearch} placeholderTextColor={colors.gray400} />
          {search ? <TouchableOpacity onPress={() => setSearch('')}><Ionicons name="close-circle" size={18} color={colors.gray400} /></TouchableOpacity> : null}
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<EmptyState icon="person-outline" title="Nenhum docente encontrado" subtitle="Tente outro termo de pesquisa" />}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('DocenteDetail', { docente: item })} activeOpacity={0.8}>
            <Avatar name={item.nome} size={52} />
            <View style={styles.info}>
              <Text style={styles.name}>{item.nome}</Text>
              <Text style={styles.dept}>{item.departamento || 'Sem departamento'}</Text>
              <View style={styles.badge}>
                <Ionicons name="calendar-outline" size={12} color={colors.primary} />
                <Text style={styles.badgeText}>Ver disponibilidade</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.gray400} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { backgroundColor: colors.white, padding: 20, paddingTop: 56, borderBottomWidth: 1, borderBottomColor: colors.border },
  title: { fontSize: 24, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: 13, color: colors.textSecondary, marginTop: 2, marginBottom: 14 },
  searchWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.gray100, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10 },
  searchIcon: { marginRight: 8 },
  search: { flex: 1, fontSize: 14, color: colors.text },
  list: { padding: 16 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, borderRadius: 16, padding: 16, marginBottom: 10, gap: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  info: { flex: 1 },
  name: { fontSize: 15, fontWeight: '700', color: colors.text },
  dept: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  badgeText: { fontSize: 12, color: colors.primary, fontWeight: '600' },
});

export default DocentesScreen;
