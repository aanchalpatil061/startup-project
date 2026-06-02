import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Modal, TextInput, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { adminApi } from '../../src/api/admin';
import { Card } from '../../src/components/ui/Card';
import { Button } from '../../src/components/ui/Button';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { SkeletonCard } from '../../src/components/ui/Skeleton';
import { Colors } from '../../src/constants/colors';
import { FontSize, FontFamily } from '../../src/constants/typography';
import { formatDateTime } from '../../src/utils/format';
import type { Communication } from '../../src/types/admin';

export default function CommunicationsScreen() {
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({ title: '', body: '', targetRole: 'all' as 'all' | 'student' | 'teacher' });

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'communications'],
    queryFn: adminApi.getCommunications,
  });

  const sendMutation = useMutation({
    mutationFn: () => adminApi.sendCommunication(form),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin', 'communications'] });
      setModalVisible(false);
      setForm({ title: '', body: '', targetRole: 'all' });
      Alert.alert('Sent', 'Announcement sent successfully.');
    },
    onError: (err: any) => Alert.alert('Error', err?.response?.data?.message ?? 'Failed to send.'),
  });

  const communications = data?.data ?? [];

  const renderItem = ({ item }: { item: Communication }) => (
    <Card style={styles.card} padding={16}>
      <View style={styles.top}>
        <Text style={styles.commTitle}>{item.title}</Text>
        <View style={styles.targetBadge}>
          <Text style={styles.targetText}>{item.targetRole === 'all' ? 'Everyone' : item.targetRole === 'student' ? 'Students' : 'Teachers'}</Text>
        </View>
      </View>
      <Text style={styles.body} numberOfLines={3}>{item.body}</Text>
      <Text style={styles.meta}>Sent by {item.sentBy} · {formatDateTime(item.sentAt)}</Text>
    </Card>
  );

  return (
    <View style={[styles.flex, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Communications</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addBtn}>
          <Ionicons name="add" size={22} color={Colors.textInverse} />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.list}>{[1, 2].map((k) => <SkeletonCard key={k} />)}</View>
      ) : (
        <FlatList
          data={communications}
          renderItem={renderItem}
          keyExtractor={(c) => c.id}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={styles.sep} />}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<EmptyState icon="megaphone-outline" title="No announcements" description="Send your first announcement to students or teachers." action={{ label: 'Send Announcement', onPress: () => setModalVisible(true) }} />}
        />
      )}

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>New Announcement</Text>
            <TextInput style={styles.modalInput} placeholder="Title" value={form.title} onChangeText={(v) => setForm((f) => ({ ...f, title: v }))} placeholderTextColor={Colors.textMuted} />
            <TextInput style={[styles.modalInput, styles.textArea]} placeholder="Message body..." value={form.body} onChangeText={(v) => setForm((f) => ({ ...f, body: v }))} placeholderTextColor={Colors.textMuted} multiline numberOfLines={4} textAlignVertical="top" />

            <Text style={styles.targetLabel}>Send to</Text>
            <View style={styles.targetRow}>
              {(['all', 'student', 'teacher'] as const).map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[styles.targetBtn, form.targetRole === t && styles.targetBtnActive]}
                  onPress={() => setForm((f) => ({ ...f, targetRole: t }))}
                >
                  <Text style={[styles.targetBtnText, form.targetRole === t && styles.targetBtnTextActive]}>
                    {t === 'all' ? 'Everyone' : t === 'student' ? 'Students' : 'Teachers'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalActions}>
              <Button variant="ghost" onPress={() => setModalVisible(false)}>Cancel</Button>
              <Button onPress={() => sendMutation.mutate()} loading={sendMutation.isPending} style={{ flex: 1 }}>Send</Button>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 16 },
  title: { fontSize: FontSize['2xl'], fontFamily: FontFamily.bold, color: Colors.text, letterSpacing: -0.6 },
  addBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  list: { paddingHorizontal: 16, paddingBottom: 24 },
  sep: { height: 10 },
  card: {},
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  commTitle: { flex: 1, fontSize: FontSize.base, fontFamily: FontFamily.semibold, color: Colors.text, marginRight: 10 },
  targetBadge: { backgroundColor: Colors.skeleton, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  targetText: { fontSize: FontSize.xs, fontFamily: FontFamily.medium, color: Colors.text },
  body: { fontSize: FontSize.sm, fontFamily: FontFamily.regular, color: Colors.textSecondary, lineHeight: 20, marginBottom: 10 },
  meta: { fontSize: FontSize.xs, fontFamily: FontFamily.regular, color: Colors.textMuted },
  modalOverlay: { flex: 1, backgroundColor: Colors.overlay, justifyContent: 'flex-end' },
  modalCard: { backgroundColor: Colors.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, gap: 14 },
  modalTitle: { fontSize: FontSize.xl, fontFamily: FontFamily.bold, color: Colors.text, letterSpacing: -0.4 },
  modalInput: { borderWidth: 1, borderColor: Colors.border, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: FontSize.base, fontFamily: FontFamily.regular, color: Colors.text },
  textArea: { height: 100 },
  targetLabel: { fontSize: FontSize.sm, fontFamily: FontFamily.medium, color: Colors.text },
  targetRow: { flexDirection: 'row', gap: 8 },
  targetBtn: { flex: 1, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: Colors.border, alignItems: 'center' },
  targetBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  targetBtnText: { fontSize: FontSize.sm, fontFamily: FontFamily.medium, color: Colors.text },
  targetBtnTextActive: { color: Colors.textInverse },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 4 },
});
