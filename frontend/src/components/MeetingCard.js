import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import Avatar from './Avatar';
import StatusBadge from './StatusBadge';

const MeetingCard = ({ meeting, onPress, isDocente }) => {
  const other = isDocente ? meeting.estudante : meeting.docente;
  const date = new Date(meeting.data);
  const dayName = date.toLocaleDateString('pt-PT', { weekday: 'short' });
  const dayNum = date.getDate();
  const month = date.toLocaleDateString('pt-PT', { month: 'short' });

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.dateBox}>
        <Text style={styles.dayName}>{dayName}</Text>
        <Text style={styles.dayNum}>{dayNum}</Text>
        <Text style={styles.month}>{month}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{meeting.titulo}</Text>
        <View style={styles.row}>
          <Avatar name={other?.nome} size={22} />
          <Text style={styles.name} numberOfLines={1}>{other?.nome}</Text>
        </View>
        <View style={styles.row}>
          <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
          <Text style={styles.time}>{meeting.horaInicio} - {meeting.horaFim}</Text>
        </View>
      </View>
      <View style={styles.right}>
        <StatusBadge status={meeting.status} />
        <Ionicons name="chevron-forward" size={18} color={colors.gray400} style={{ marginTop: 8 }} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: { flexDirection: 'row', backgroundColor: colors.white, borderRadius: 16, padding: 14, marginBottom: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
  dateBox: { width: 48, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primaryLight, borderRadius: 12, padding: 6, marginRight: 12 },
  dayName: { fontSize: 11, color: colors.primary, fontWeight: '500', textTransform: 'uppercase' },
  dayNum: { fontSize: 22, fontWeight: '800', color: colors.primary, lineHeight: 26 },
  month: { fontSize: 11, color: colors.primary, fontWeight: '500', textTransform: 'uppercase' },
  content: { flex: 1 },
  title: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 4 },
  row: { flexDirection: 'row', alignItems: 'center', marginTop: 3 },
  name: { fontSize: 13, color: colors.textSecondary, marginLeft: 6, flex: 1 },
  time: { fontSize: 12, color: colors.textSecondary, marginLeft: 4 },
  right: { alignItems: 'flex-end', justifyContent: 'center' },
});

export default MeetingCard;
