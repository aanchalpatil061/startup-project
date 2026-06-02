import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMutation } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '../../src/components/ui/Input';
import { Button } from '../../src/components/ui/Button';
import { Card } from '../../src/components/ui/Card';
import { teacherApi } from '../../src/api/teacher';
import { Colors } from '../../src/constants/colors';
import { FontSize, FontFamily } from '../../src/constants/typography';

export default function TeacherSettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [pushEnabled, setPushEnabled] = useState(true);
  const [showChangePass, setShowChangePass] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNew, setConfirmNew] = useState('');

  const changePwMutation = useMutation({
    mutationFn: teacherApi.changePassword,
    onSuccess: () => {
      Alert.alert('Password Changed', 'Your password has been updated.');
      setCurrentPassword(''); setNewPassword(''); setConfirmNew('');
      setShowChangePass(false);
    },
    onError: (err: any) => Alert.alert('Error', err?.response?.data?.message ?? 'Failed.'),
  });

  const handleChangePassword = () => {
    if (!currentPassword || newPassword.length < 8 || newPassword !== confirmNew) {
      Alert.alert('Validation', 'Check all fields. New password must be 8+ chars and match.');
      return;
    }
    changePwMutation.mutate({ currentPassword, newPassword });
  };

  return (
    <View style={[styles.flex, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionLabel}>Notifications</Text>
        <Card padding={0}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Push Notifications</Text>
            <Switch value={pushEnabled} onValueChange={setPushEnabled} trackColor={{ true: Colors.primary }} />
          </View>
        </Card>

        <Text style={styles.sectionLabel}>Security</Text>
        <Card padding={0}>
          <TouchableOpacity style={styles.row} onPress={() => setShowChangePass((v) => !v)}>
            <Ionicons name="lock-closed-outline" size={20} color={Colors.text} />
            <Text style={styles.rowLabel}>Change Password</Text>
            <Ionicons name={showChangePass ? 'chevron-up' : 'chevron-down'} size={16} color={Colors.textMuted} />
          </TouchableOpacity>
          {showChangePass && (
            <View style={styles.changePassForm}>
              <Input label="Current Password" value={currentPassword} onChangeText={setCurrentPassword} password leftIcon="lock-closed-outline" />
              <Input label="New Password" value={newPassword} onChangeText={setNewPassword} password leftIcon="lock-open-outline" />
              <Input label="Confirm New" value={confirmNew} onChangeText={setConfirmNew} password leftIcon="lock-open-outline" />
              <Button onPress={handleChangePassword} fullWidth size="sm" loading={changePwMutation.isPending}>Update Password</Button>
            </View>
          )}
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.border },
  backBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.skeleton, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: FontSize.md, fontFamily: FontFamily.semibold, color: Colors.text },
  content: { paddingHorizontal: 16, paddingTop: 20, gap: 12 },
  sectionLabel: { fontSize: FontSize.xs, fontFamily: FontFamily.semibold, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, marginTop: 8 },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 12 },
  rowLabel: { flex: 1, fontSize: FontSize.base, fontFamily: FontFamily.regular, color: Colors.text },
  changePassForm: { paddingHorizontal: 16, paddingBottom: 16, gap: 14 },
});
