import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { dispAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Button, Input, LoadingScreen } from '../../components';
import { colors } from '../../theme/colors';

const DIAS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const DisponibilidadeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [disps, setDisps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ diaSemana: 1, horaInicio: '08:00', horaFim: '12:00', duracao: '30' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    dispAPI.getByDocente(user.id).then(({ data }) => setDisps(data)).finally(() => setLoading(false));
  }, []);

  const handleAdd = async () => {
    setSaving(true);
    try {
      const { data } = await dispAPI.create(form);
      setDisps(prev => [...prev, data]);
      setShowModal(false);
    } catch (err) { Alert.alert('Erro', err.message); }
    finally { setSaving(false); }
  };

  const handleDelete = (id) => {
    Alert.alert('Remover', 'Remover esta disponibilidade?', [
      { text: 'Cancelar' },
      { text: 'Remover', style: 'destructive', onPress: async () => {
        await dispAPI.delete(id);
        setDisps(prev => prev.filter(d => d.id !== id));
      }},
    ]);
  };

  if (loading) return <LoadingScreen />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Minha Disponibilidade</Text>
      </View>

      <FlatList
        data={disps}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="calendar-outline" size={48} color={colors.gray400} />
            <Text style={styles.emptyText}>Nenhuma disponibilidade adicionada</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.dispCard}>
            <View style={styles.dispDay}>
              <Text style={styles.dispDayText}>{DIAS[item.diaSemana]}</Text>
            </View>
            <View style={styles.dispInfo}>
              <Text style={styles.dispTime}>{item.horaInicio} - {item.horaFim}</Text>
              <Text style={styles.dispDur}>{item.duracao} min por reunião</Text>
            </View>
            <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteBtn}>
              <Ionicons name="trash-outline" size={18} color={colors.danger} />
            </TouchableOpacity>
          </View>
        )}
        ListFooterComponent={
          <Button title="Adicionar Disponibilidade" onPress={() => setShowModal(true)} icon={<Ionicons name="add" size={18} color="white" />} style={{ margin: 16 }} />
        }
      />

      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Nova Disponibilidade</Text>
            <Text style={styles.modalLabel}>Dia da Semana</Text>
            <View style={styles.daysRow}>
              {DIAS.slice(1, 6).map((d, i) => (
                <TouchableOpacity key={i} style={[styles.dayBtn, form.diaSemana === i + 1 && styles.dayBtnActive]} onPress={() => setForm(f => ({ ...f, diaSemana: i + 1 }))}>
                  <Text style={[styles.dayBtnText, form.diaSemana === i + 1 && styles.dayBtnTextActive]}>{d}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Input label="Hora Início" value={form.horaInicio} onChangeText={v => setForm(f => ({ ...f, horaInicio: v }))} placeholder="08:00" icon="time-outline" />
            <Input label="Hora Fim" value={form.horaFim} onChangeText={v => setForm(f => ({ ...f, horaFim: v }))} placeholder="12:00" icon="time-outline" />
            <Input label="Duração por Reunião (minutos)" value={form.duracao} onChangeText={v => setForm(f => ({ ...f, duracao: v }))} keyboardType="numeric" placeholder="30" icon="hourglass-outline" />
            <Button title="Adicionar" onPress={handleAdd} loading={saving} />
            <Button title="Cancelar" variant="outline" onPress={() => setShowModal(false)} style={{ marginTop: 8 }} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { backgroundColor: colors.primaryDark, flexDirection: 'row', alignItems: 'center', gap: 14, padding: 20, paddingTop: 56 },
  back: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: colors.white },
  list: { padding: 16 },
  dispCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, borderRadius: 14, padding: 14, marginBottom: 10, gap: 12, elevation: 2 },
  dispDay: { width: 52, height: 52, borderRadius: 12, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  dispDayText: { fontSize: 14, fontWeight: '800', color: colors.primary },
  dispInfo: { flex: 1 },
  dispTime: { fontSize: 15, fontWeight: '700', color: colors.text },
  dispDur: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  deleteBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FEE2E2', alignItems: 'center', justifyContent: 'center' },
  empty: { alignItems: 'center', padding: 40, gap: 12 },
  emptyText: { color: colors.textSecondary, fontSize: 14 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
  modalTitle: { fontSize: 20, fontWeight: '800', color: colors.text, marginBottom: 20 },
  modalLabel: { fontSize: 13, fontWeight: '600', color: colors.gray700, marginBottom: 10 },
  daysRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  dayBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, borderWidth: 1.5, borderColor: colors.border, alignItems: 'center' },
  dayBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  dayBtnText: { fontSize: 13, fontWeight: '700', color: colors.textSecondary },
  dayBtnTextActive: { color: colors.white },
});

export default DisponibilidadeScreen;
