import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { meetingAPI } from '../../services/api';
import { Input, Button, Avatar } from '../../components';
import { colors } from '../../theme/colors';

const NovaMeetingScreen = ({ route, navigation }) => {
  const { docente } = route.params;
  const [form, setForm] = useState({ titulo: '', descricao: '', data: '', horaInicio: '', horaFim: '', local: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.titulo.trim()) e.titulo = 'Título obrigatório';
    if (!form.data) e.data = 'Data obrigatória (AAAA-MM-DD)';
    if (!form.horaInicio) e.horaInicio = 'Hora de início obrigatória (HH:MM)';
    if (!form.horaFim) e.horaFim = 'Hora de fim obrigatória (HH:MM)';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await meetingAPI.create({ ...form, docenteId: docente.id });
      Alert.alert('✅ Pedido enviado!', 'O docente irá confirmar em breve.', [
        { text: 'OK', onPress: () => navigation.navigate('Reunioes') }
      ]);
    } catch (err) {
      Alert.alert('Erro', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
            <Ionicons name="arrow-back" size={24} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Nova Reunião</Text>
        </View>

        <View style={styles.docenteCard}>
          <Avatar name={docente.nome} size={48} />
          <View style={styles.docenteInfo}>
            <Text style={styles.docenteName}>{docente.nome}</Text>
            <Text style={styles.docenteDept}>{docente.departamento}</Text>
          </View>
        </View>

        <View style={styles.form}>
          <Text style={styles.formTitle}>Detalhes da Reunião</Text>
          <Input label="Título / Assunto" placeholder="Ex: Dúvidas sobre MD02" value={form.titulo} onChangeText={v => set('titulo', v)} icon="document-text-outline" error={errors.titulo} />
          <Input label="Descrição (opcional)" placeholder="Descreva o motivo da reunião..." value={form.descricao} onChangeText={v => set('descricao', v)} icon="chatbubble-outline" multiline numberOfLines={3} />
          <Input label="Data" placeholder="AAAA-MM-DD (ex: 2024-03-15)" value={form.data} onChangeText={v => set('data', v)} icon="calendar-outline" error={errors.data} />
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Input label="Hora Início" placeholder="HH:MM" value={form.horaInicio} onChangeText={v => set('horaInicio', v)} icon="time-outline" error={errors.horaInicio} />
            </View>
            <View style={{ width: 12 }} />
            <View style={{ flex: 1 }}>
              <Input label="Hora Fim" placeholder="HH:MM" value={form.horaFim} onChangeText={v => set('horaFim', v)} icon="time-outline" error={errors.horaFim} />
            </View>
          </View>
          <Input label="Local (opcional)" placeholder="Ex: Gabinete 2B, Bloco A" value={form.local} onChangeText={v => set('local', v)} icon="location-outline" />

          <View style={styles.infoBox}>
            <Ionicons name="information-circle-outline" size={18} color={colors.primary} />
            <Text style={styles.infoText}>O docente receberá a sua solicitação e irá confirmar ou recusar com uma justificativa.</Text>
          </View>

          <Button title="Enviar Pedido" onPress={handleSubmit} loading={loading} icon={<Ionicons name="send-outline" size={18} color={colors.white} />} />
          <Button title="Cancelar" onPress={() => navigation.goBack()} variant="outline" style={{ marginTop: 10 }} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { backgroundColor: colors.primary, flexDirection: 'row', alignItems: 'center', gap: 14, padding: 20, paddingTop: 56 },
  back: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: colors.white },
  docenteCard: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: colors.white, margin: 16, borderRadius: 16, padding: 16 },
  docenteInfo: { flex: 1 },
  docenteName: { fontSize: 16, fontWeight: '700', color: colors.text },
  docenteDept: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  form: { backgroundColor: colors.white, margin: 16, marginTop: 0, borderRadius: 16, padding: 16, paddingBottom: 24 },
  formTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 16 },
  row: { flexDirection: 'row' },
  infoBox: { flexDirection: 'row', gap: 10, backgroundColor: colors.primaryLight, borderRadius: 12, padding: 14, marginBottom: 16 },
  infoText: { flex: 1, fontSize: 13, color: colors.primary, lineHeight: 18 },
});

export default NovaMeetingScreen;
