import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { adminApi } from '../../../src/api/admin';
import { Card } from '../../../src/components/ui/Card';
import { Badge } from '../../../src/components/ui/Badge';
import { EmptyState } from '../../../src/components/ui/EmptyState';
import { SkeletonCard } from '../../../src/components/ui/Skeleton';
import { Colors } from '../../../src/constants/colors';
import { FontSize, FontFamily } from '../../../src/constants/typography';
import { getStatusColor, getStatusLabel } from '../../../src/utils/format';
import type { AdminStudent } from '../../../src/types/admin';

export default function AdminStudentsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['admin', 'students', search],
    queryFn: () => adminApi.getStudents(1, search || undefined),
    staleTime: 1000 * 30,
  });

  const students = data?.data ?? [];

  const renderItem = ({ item }: { item: AdminStudent }) => (
    <TouchableOpacity onPress={() => router.push(`/(admin)/students/${item.id}`)}>
      <Card style={styles.card} padding={14}>
        <View style={styles.row}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{item.name[0]}</Text>
          </View>
          <View style={styles.info}>
            <Text style={styles.studentName}>{item.name}</Text>
            <Text style={styles.studentMeta}>{item.rollNumber} · {item.branch}</Text>
            <Text style={styles.studentMeta2}>{item.year} · Section {item.section}</Text>
          </View>
          <Badge label={getStatusLabel(item.status)} color={getStatusColor(item.status)} bgColor={`${getStatusColor(item.status)}18`} size="sm" />
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.flex, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Students</Text>
        <Text style={styles.count}>{data?.pagination.total ?? 0} enrolled</Text>
      </View>

      <View style={styles.searchWrapper}>
        <Ionicons name="search-outline" size={18} color={Colors.textMuted} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or roll number..."
          value={search}
          onChangeText={setSearch}
          placeholderTextColor={Colors.textMuted}
          returnKeyType="search"
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {isLoading ? (
        <View style={styles.list}>{[1, 2, 3, 4].map((k) => <SkeletonCard key={k} />)}</View>
      ) : (
        <FlatList
          data={students}
          renderItem={renderItem}
          keyExtractor={(s) => s.id}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={styles.sep} />}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
          ListEmptyComponent={<EmptyState icon="people-outline" title="No students found" description={search ? `No results for "${search}"` : 'No students enrolled yet.'} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: 16, paddingVertical: 16, gap: 2 },
  title: { fontSize: FontSize['2xl'], fontFamily: FontFamily.bold, color: Colors.text, letterSpacing: -0.6 },
  count: { fontSize: FontSize.sm, fontFamily: FontFamily.regular, color: Colors.textMuted },
  searchWrapper: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginBottom: 12, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderRadius: 10, paddingHorizontal: 12, height: 44 },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: FontSize.base, fontFamily: FontFamily.regular, color: Colors.text },
  list: { paddingHorizontal: 16, paddingBottom: 24 },
  sep: { height: 8 },
  card: {},
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.skeleton, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: FontSize.md, fontFamily: FontFamily.bold, color: Colors.text },
  info: { flex: 1 },
  studentName: { fontSize: FontSize.base, fontFamily: FontFamily.semibold, color: Colors.text },
  studentMeta: { fontSize: FontSize.xs, fontFamily: FontFamily.regular, color: Colors.textSecondary, marginTop: 2 },
  studentMeta2: { fontSize: FontSize.xs, fontFamily: FontFamily.regular, color: Colors.textMuted },
});
