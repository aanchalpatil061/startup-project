import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Modal, TextInput, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { adminApi } from '../../src/api/admin';
import { Card } from '../../src/components/ui/Card';
import { Badge } from '../../src/components/ui/Badge';
import { Button } from '../../src/components/ui/Button';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { SkeletonCard } from '../../src/components/ui/Skeleton';
import { Colors } from '../../src/constants/colors';
import { FontSize, FontFamily } from '../../src/constants/typography';
import { formatDate, getStatusColor, getStatusLabel } from '../../src/utils/format';
import type { Semester } from '../../src/types/admin';

export default function SemestersScreen() {
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({ name: '', startDate: '', endDate: '' });

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['admin', 'semesters'],
    queryFn: adminApi.getSemesters,
  });

  const createMutation = useMutation({
    mutationFn: () => adminApi.createSemester({ ...form, status: 'upcoming' }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin', 'semesters'] });
      setModalVisible(false);
      setForm({ name: '', startDate: '', endDate: '' });
    },
    onError: (err: any) => Alert.alert('Error', err?.response?.data?.message ?? 'Failed.'),
  });

  const semesters = data?.data ?? [];

  const renderItem = ({ item }: { item: Semester }) => (
    <Card style={styles.card} padding={16}>
      <View style={styles.top}>
        <View style={styles.left}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.dates}>{formatDate(item.startDate)} – {formatDate(item.endDate)}</Text>
        </View>
        <Badge label={getStatusLabel(item.status)} color={getStatusColor(item.status)} bgColor={`${getStatusColor(item.status)}18`} />
      </View>
      <View style={styles.footer}>
        <Text style={styles.meta}>{item.totalCourses} courses · {item.totalStudents} students</Text>
      </View>
    </Card>
  );

  return (
    <View style={[styles.flex, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Semesters</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addBtn}>
          <Ionicons name="add" size={22} color={Colors.textInverse} />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.list}>{[1, 2, 3].map((k) => <SkeletonCard key={k} />)}</View>
      ) : (
        <FlatList
          data={semesters}
          renderItem={renderItem}
          keyExtractor={(s) => s.id}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={styles.sep} />}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
          ListEmptyComponent={<EmptyState icon="calendar-outline" title="No semesters" description="Create a semester to get started." action={{ label: 'Add Semester', onPress: () => setModalVisible(true) }} />}
        />
      )}

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>New Semester</Text>
            <TextInput style={styles.modalInput} placeholder="e.g. Autumn 2025" value={form.name} onChangeText={(v) => setForm((f) => ({ ...f, name: v }))} placeholderTextColor={Colors.textMuted} />
            <TextInput style={styles.modalInput} placeholder="Start date (YYYY-MM-DD)" value={form.startDate} onChangeText={(v) => setForm((f) => ({ ...f, startDate: v }))} placeholderTextColor={Colors.textMuted} />
            <TextInput style={styles.modalInput} placeholder="End date (YYYY-MM-DD)" value={form.endDate} onChangeText={(v) => setForm((f) => ({ ...f, endDate: v }))} placeholderTextColor={Colors.textMuted} />
            <View style={styles.modalActions}>
              <Button variant="ghost" onPress={() => setModalVisible(false)}>Cancel</Button>
              <Button onPress={() => createMutation.mutate()} loading={createMutation.isPending} style={styles.flex2}>Create</Button>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  flex2: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 16 },
  title: { fontSize: FontSize['2xl'], fontFamily: FontFamily.bold, color: Colors.text, letterSpacing: -0.6 },
  addBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  list: { paddingHorizontal: 16, paddingBottom: 24 },
  sep: { height: 10 },
  card: {},
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  left: { flex: 1, marginRight: 12 },
  name: { fontSize: FontSize.base, fontFamily: FontFamily.semibold, color: Colors.text },
  dates: { fontSize: FontSize.xs, fontFamily: FontFamily.regular, color: Colors.textMuted, marginTop: 3 },
  footer: {},
  meta: { fontSize: FontSize.sm, fontFamily: FontFamily.regular, color: Colors.textSecondary },
  modalOverlay: { flex: 1, backgroundColor: Colors.overlay, justifyContent: 'flex-end' },
  modalCard: { backgroundColor: Colors.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, gap: 14 },
  modalTitle: { fontSize: FontSize.xl, fontFamily: FontFamily.bold, color: Colors.text, letterSpacing: -0.4, marginBottom: 4 },
  modalInput: { borderWidth: 1, borderColor: Colors.border, borderRadius: 10, paddingHorizontal: 14, height: 48, fontSize: FontSize.base, fontFamily: FontFamily.regular, color: Colors.text, backgroundColor: Colors.surface },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 8 },
});
