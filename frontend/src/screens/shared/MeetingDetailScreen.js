import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { meetingAPI, messageAPI } from '../../services/api';
import { Avatar, StatusBadge, Button, LoadingScreen } from '../../components';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../theme/colors';

const MeetingDetailScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const { user } = useAuth();
  const [meeting, setMeeting] = useState(null);
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showRecuse, setShowRecuse] = useState(false);
  const [motivoRecusa, setMotivoRecusa] = useState('');
  const scrollRef = useRef();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data } = await meetingAPI.getById(id);
      setMeeting(data);
      setMessages(data.mensagens || []);
    } catch (err) { Alert.alert('Erro', err.message); }
    finally { setLoading(false); }
  };

  const handleSend = async () => {
    if (!msg.trim()) return;
    setSending(true);
    try {
      const { data } = await messageAPI.send(id, { texto: msg.trim() });
      setMessages(prev => [...prev, data]);
      setMsg('');
    } catch (err) { Alert.alert('Erro', err.message); }
    finally { setSending(false); }
  };

  const handleStatus = async (status, motivo) => {
    try {
      const { data } = await meetingAPI.updateStatus(id, { status, motivoRecusa: motivo });
      setMeeting(data);
      setShowRecuse(false);
      Alert.alert('✅ Sucesso', `Reunião ${status === 'CONFIRMADA' ? 'confirmada' : 'recusada'}!`);
    } catch (err) { Alert.alert('Erro', err.message); }
  };

  const handleCancel = () => {
    Alert.alert('Cancelar Reunião', 'Tem a certeza?', [
      { text: 'Não', style: 'cancel' },
      { text: 'Sim', onPress: async () => {
        await meetingAPI.cancel(id);
        loadData();
      }},
    ]);
  };

  if (loading) return <LoadingScreen />;
  if (!meeting) return null;

  const isDocente = user?.role === 'DOCENTE';
  const other = isDocente ? meeting.estudante : meeting.docente;
  const canAct = isDocente && meeting.status === 'PENDENTE';
  const canCancel = meeting.status === 'PENDENTE' || meeting.status === 'CONFIRMADA';

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} ref={scrollRef} onContentSizeChange={() => scrollRef.current?.scrollToEnd()}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
            <Ionicons name="arrow-back" size={24} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>{meeting.titulo}</Text>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.personRow}>
            <Avatar name={other?.nome} size={48} />
            <View style={styles.personInfo}>
              <Text style={styles.personName}>{other?.nome}</Text>
              <Text style={styles.personRole}>{isDocente ? meeting.estudante?.curso : meeting.docente?.departamento}</Text>
            </View>
            <StatusBadge status={meeting.status} />
          </View>

          <View style={styles.divider} />

          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Ionicons name="calendar-outline" size={16} color={colors.primary} />
              <Text style={styles.detailText}>{new Date(meeting.data).toLocaleDateString('pt-PT', { day: '2-digit', month: 'long', year: 'numeric' })}</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="time-outline" size={16} color={colors.primary} />
              <Text style={styles.detailText}>{meeting.horaInicio} - {meeting.horaFim}</Text>
            </View>
            {meeting.local && (
              <View style={styles.detailItem}>
                <Ionicons name="location-outline" size={16} color={colors.primary} />
                <Text style={styles.detailText}>{meeting.local}</Text>
              </View>
            )}
          </View>

          {meeting.descricao && (
            <View style={styles.descBox}>
              <Text style={styles.descLabel}>Motivo:</Text>
              <Text style={styles.descText}>{meeting.descricao}</Text>
            </View>
          )}

          {meeting.motivoRecusa && (
            <View style={[styles.descBox, { backgroundColor: '#FEE2E2' }]}>
              <Text style={[styles.descLabel, { color: colors.danger }]}>Motivo da recusa:</Text>
              <Text style={[styles.descText, { color: colors.danger }]}>{meeting.motivoRecusa}</Text>
            </View>
          )}
        </View>

        {/* Docente Actions */}
        {canAct && (
          <View style={styles.actionsCard}>
            <Text style={styles.actionsTitle}>Acções</Text>
            <View style={styles.actionsRow}>
              <Button title="Confirmar" variant="success" onPress={() => handleStatus('CONFIRMADA')} style={{ flex: 1 }} icon={<Ionicons name="checkmark" size={18} color="white" />} />
              <View style={{ width: 10 }} />
              <Button title="Recusar" variant="danger" onPress={() => setShowRecuse(true)} style={{ flex: 1 }} icon={<Ionicons name="close" size={18} color="white" />} />
            </View>
          </View>
        )}

        {canCancel && !isDocente && (
          <View style={styles.actionsCard}>
            <Button title="Cancelar Pedido" variant="outline" onPress={handleCancel} />
          </View>
        )}

        {/* Chat */}
        <View style={styles.chatSection}>
          <Text style={styles.chatTitle}>Chat da Reunião</Text>
          {messages.length === 0 ? (
            <Text style={styles.noMsg}>Nenhuma mensagem ainda. Inicie a conversa!</Text>
          ) : (
            messages.map(m => {
              const isMine = m.userId === user?.id;
              return (
                <View key={m.id} style={[styles.bubble, isMine ? styles.myBubble : styles.theirBubble]}>
                  {!isMine && <Text style={styles.senderName}>{m.user?.nome}</Text>}
                  <Text style={[styles.bubbleText, isMine && styles.myBubbleText]}>{m.texto}</Text>
                  <Text style={[styles.bubbleTime, isMine && { color: 'rgba(255,255,255,0.7)' }]}>{new Date(m.createdAt).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}</Text>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* Message Input */}
      {(meeting.status === 'CONFIRMADA' || meeting.status === 'PENDENTE') && (
        <View style={styles.inputRow}>
          <TextInput style={styles.msgInput} placeholder="Escreva uma mensagem..." value={msg} onChangeText={setMsg} placeholderTextColor={colors.gray400} multiline />
          <TouchableOpacity style={[styles.sendBtn, !msg.trim() && { opacity: 0.4 }]} onPress={handleSend} disabled={!msg.trim() || sending}>
            <Ionicons name="send" size={20} color={colors.white} />
          </TouchableOpacity>
        </View>
      )}

      {/* Recuse Modal */}
      <Modal visible={showRecuse} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Motivo da Recusa</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Explique o motivo..."
              value={motivoRecusa}
              onChangeText={setMotivoRecusa}
              multiline
              numberOfLines={4}
              placeholderTextColor={colors.gray400}
            />
            <Button title="Confirmar Recusa" variant="danger" onPress={() => handleStatus('RECUSADA', motivoRecusa)} />
            <Button title="Cancelar" variant="outline" onPress={() => setShowRecuse(false)} style={{ marginTop: 8 }} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { backgroundColor: colors.primary, flexDirection: 'row', alignItems: 'center', gap: 14, padding: 20, paddingTop: 56 },
  back: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, fontSize: 17, fontWeight: '700', color: colors.white },
  infoCard: { backgroundColor: colors.white, margin: 16, borderRadius: 16, padding: 16 },
  personRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  personInfo: { flex: 1 },
  personName: { fontSize: 16, fontWeight: '700', color: colors.text },
  personRole: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 14 },
  detailsGrid: { gap: 8 },
  detailItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  detailText: { fontSize: 14, color: colors.text },
  descBox: { backgroundColor: colors.primaryLight, borderRadius: 10, padding: 12, marginTop: 12 },
  descLabel: { fontSize: 12, fontWeight: '700', color: colors.primary, marginBottom: 4 },
  descText: { fontSize: 14, color: colors.primary, lineHeight: 20 },
  actionsCard: { backgroundColor: colors.white, marginHorizontal: 16, marginBottom: 12, borderRadius: 16, padding: 16 },
  actionsTitle: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 12 },
  actionsRow: { flexDirection: 'row' },
  chatSection: { backgroundColor: colors.white, margin: 16, borderRadius: 16, padding: 16, marginBottom: 8 },
  chatTitle: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 12 },
  noMsg: { color: colors.textSecondary, fontSize: 13, textAlign: 'center', padding: 16 },
  bubble: { maxWidth: '80%', borderRadius: 14, padding: 10, paddingHorizontal: 14, marginBottom: 8 },
  myBubble: { alignSelf: 'flex-end', backgroundColor: colors.primary, borderBottomRightRadius: 4 },
  theirBubble: { alignSelf: 'flex-start', backgroundColor: colors.gray100, borderBottomLeftRadius: 4 },
  senderName: { fontSize: 11, fontWeight: '700', color: colors.primary, marginBottom: 3 },
  bubbleText: { fontSize: 14, color: colors.text, lineHeight: 20 },
  myBubbleText: { color: colors.white },
  bubbleTime: { fontSize: 11, color: colors.textSecondary, marginTop: 3, textAlign: 'right' },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', padding: 12, backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: colors.border, gap: 10 },
  msgInput: { flex: 1, backgroundColor: colors.gray100, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, fontSize: 14, color: colors.text, maxHeight: 100 },
  sendBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 16 },
  modalInput: { borderWidth: 1.5, borderColor: colors.border, borderRadius: 12, padding: 14, fontSize: 14, color: colors.text, minHeight: 100, marginBottom: 16, textAlignVertical: 'top' },
});

export default MeetingDetailScreen;
