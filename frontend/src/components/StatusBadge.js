import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

const statusMap = {
  PENDENTE: { label: 'Pendente', color: colors.statusPendente },
  CONFIRMADA: { label: 'Confirmada', color: colors.statusConfirmada },
  RECUSADA: { label: 'Recusada', color: colors.statusRecusada },
  CANCELADA: { label: 'Cancelada', color: colors.statusCancelada },
  CONCLUIDA: { label: 'Concluída', color: colors.statusConcluida },
};

const StatusBadge = ({ status }) => {
  const s = statusMap[status] || { label: status, color: colors.gray500 };
  return (
    <View style={[styles.badge, { backgroundColor: s.color + '20' }]}>
      <View style={[styles.dot, { backgroundColor: s.color }]} />
      <Text style={[styles.text, { color: s.color }]}>{s.label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  dot: { width: 6, height: 6, borderRadius: 3, marginRight: 5 },
  text: { fontSize: 12, fontWeight: '600' },
});

export default StatusBadge;
