import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { dispAPI } from '../../services/api';
import { Avatar, Button, LoadingScreen } from '../../components';
import { colors } from '../../theme/colors';

const DIAS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const DocenteDetailScreen = ({ route, navigation }) => {
  const { docente } = route.params;
  const [disps, setDisps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispAPI.getByDocente(docente.id).then(({ data }) => setDisps(data)).finally(() => setLoading(false));
  }, []);

  const grouped = disps.reduce((acc, d) => {
    if (!acc[d.diaSemana]) acc[d.diaSemana] = [];
    acc[d.diaSemana].push(d);
    return acc;
  }, {});

  if (loading) return <LoadingScreen />;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
      </View>

      <View style={styles.profile}>
        <Avatar name={docente.nome} size={80} />
        <Text style={styles.name}>{docente.nome}</Text>
        <Text style={styles.dept}>{docente.departamento || 'Docente'}</Text>
        <View style={styles.emailRow}>
          <Ionicons name="mail-outline" size={14} color={colors.textSecondary} />
          <Text style={styles.email}>{docente.email}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Disponibilidade Semanal</Text>
        {Object.keys(grouped).length === 0 ? (
          <Text style={styles.noDisp}>Sem disponibilidade registada</Text>
        ) : (
          Object.entries(grouped).map(([dia, slots]) => (
            <View key={dia} style={styles.dayCard}>
              <View style={styles.dayHeader}>
                <Text style={styles.dayName}>{DIAS[parseInt(dia)]}</Text>
              </View>
              {slots.map(slot => (
                <View key={slot.id} style={styles.slot}>
                  <Ionicons name="time-outline" size={14} color={colors.primary} />
                  <Text style={styles.slotText}>{slot.horaInicio} - {slot.horaFim}</Text>
                  <Text style={styles.duration}>{slot.duracao} min/reunião</Text>
                </View>
              ))}
            </View>
          ))
        )}
      </View>

      <View style={styles.btnWrap}>
        <Button
          title="Solicitar Reunião"
          onPress={() => navigation.navigate('NovaMeeting', { docente })}
          icon={<Ionicons name="calendar-outline" size={18} color={colors.white} />}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { backgroundColor: colors.primary, height: 100, paddingTop: 56, paddingHorizontal: 20 },
  back: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  profile: { alignItems: 'center', backgroundColor: colors.white, paddingTop: 24, paddingBottom: 24, marginTop: -24, borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  name: { fontSize: 22, fontWeight: '800', color: colors.text, marginTop: 12 },
  dept: { fontSize: 14, color: colors.primary, fontWeight: '600', marginTop: 4 },
  emailRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  email: { fontSize: 13, color: colors.textSecondary },
  section: { margin: 16 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: colors.text, marginBottom: 12 },
  noDisp: { color: colors.textSecondary, fontSize: 14, textAlign: 'center', padding: 20 },
  dayCard: { backgroundColor: colors.white, borderRadius: 14, marginBottom: 10, overflow: 'hidden' },
  dayHeader: { backgroundColor: colors.primaryLight, padding: 10, paddingHorizontal: 14 },
  dayName: { fontSize: 14, fontWeight: '700', color: colors.primary },
  slot: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, paddingHorizontal: 14 },
  slotText: { fontSize: 14, fontWeight: '600', color: colors.text, flex: 1 },
  duration: { fontSize: 12, color: colors.textSecondary },
  btnWrap: { padding: 16, paddingBottom: 32 },
});

export default DocenteDetailScreen;
