import React from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../../src/api/admin';
import { Card } from '../../src/components/ui/Card';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { SkeletonCard } from '../../src/components/ui/Skeleton';
import { Colors } from '../../src/constants/colors';
import { FontSize, FontFamily } from '../../src/constants/typography';
import type { Course } from '../../src/types/admin';

export default function CoursesScreen() {
  const insets = useSafeAreaInsets();
  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['admin', 'courses'],
    queryFn: () => adminApi.getCourses(),
  });
  const courses = data?.data ?? [];

  const renderItem = ({ item }: { item: Course }) => (
    <Card style={styles.card} padding={14}>
      <View style={styles.row}>
        <View>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.code}>{item.code}</Text>
        </View>
        <View style={styles.right}>
          <Text style={styles.dept}>{item.department}</Text>
          <Text style={styles.credits}>{item.credits} credits</Text>
        </View>
      </View>
    </Card>
  );

  return (
    <View style={[styles.flex, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Courses</Text>
        <Text style={styles.count}>{courses.length} courses</Text>
      </View>
      {isLoading ? (
        <View style={styles.list}>{[1, 2, 3].map((k) => <SkeletonCard key={k} />)}</View>
      ) : (
        <FlatList
          data={courses}
          renderItem={renderItem}
          keyExtractor={(c) => c.id}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={styles.sep} />}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
          ListEmptyComponent={<EmptyState icon="book-outline" title="No courses" description="Courses will appear here once added." />}
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
  list: { paddingHorizontal: 16, paddingBottom: 24 },
  sep: { height: 8 },
  card: {},
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontSize: FontSize.base, fontFamily: FontFamily.semibold, color: Colors.text },
  code: { fontSize: FontSize.xs, fontFamily: FontFamily.mono, color: Colors.textMuted, marginTop: 2 },
  right: { alignItems: 'flex-end' },
  dept: { fontSize: FontSize.sm, fontFamily: FontFamily.regular, color: Colors.textSecondary },
  credits: { fontSize: FontSize.xs, fontFamily: FontFamily.medium, color: Colors.textMuted },
});
