import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMutation } from '@tanstack/react-query';
import { Input } from '../../../src/components/ui/Input';
import { Button } from '../../../src/components/ui/Button';
import { useAuthStore } from '../../../src/store/authStore';
import { authApi } from '../../../src/api/auth';
import { Colors } from '../../../src/constants/colors';
import { FontSize, FontFamily } from '../../../src/constants/typography';
import { isValidEmail, isValidEmployeeId } from '../../../src/utils/validation';

type IdentifierType = 'email' | 'employeeId';

export default function TeacherLoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setAuth } = useAuthStore();

  const [identifierType, setIdentifierType] = useState<IdentifierType>('email');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const loginMutation = useMutation({
    mutationFn: authApi.loginTeacher,
    onSuccess: async (res) => {
      await setAuth(res.data.user, res.data.tokens.accessToken, res.data.tokens.refreshToken);
      router.replace('/(teacher)');
    },
    onError: (err: any) => {
      Alert.alert('Sign In Failed', err?.response?.data?.message ?? 'Invalid credentials.');
    },
  });

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!identifier.trim()) {
      errs.identifier = identifierType === 'email' ? 'Email is required' : 'Employee ID is required';
    } else if (identifierType === 'email' && !isValidEmail(identifier)) {
      errs.identifier = 'Enter a valid email address';
    } else if (identifierType === 'employeeId' && !isValidEmployeeId(identifier)) {
      errs.identifier = 'Enter a valid employee ID';
    }
    if (!password) errs.password = 'Password is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleLogin = () => {
    if (!validate()) return;
    loginMutation.mutate({ identifier, identifierType, password });
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.flex}
        contentContainerStyle={[
          styles.container,
          { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backRow}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>📝  Teacher</Text>
          </View>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Sign in to manage evaluations & analytics</Text>
        </View>

        <View style={styles.tabs}>
          {(['email', 'employeeId'] as IdentifierType[]).map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.tab, identifierType === t && styles.activeTab]}
              onPress={() => { setIdentifierType(t); setIdentifier(''); setErrors({}); }}
            >
              <Text style={[styles.tabText, identifierType === t && styles.activeTabText]}>
                {t === 'email' ? 'College Email' : 'Employee ID'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.form}>
          <Input
            label={identifierType === 'email' ? 'College Email' : 'Employee ID'}
            placeholder={identifierType === 'email' ? 'you@college.ac.in' : 'e.g. EMP2023001'}
            value={identifier}
            onChangeText={setIdentifier}
            keyboardType={identifierType === 'email' ? 'email-address' : 'default'}
            autoCapitalize="none"
            leftIcon={identifierType === 'email' ? 'mail-outline' : 'briefcase-outline'}
            error={errors.identifier}
          />

          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            password
            leftIcon="lock-closed-outline"
            error={errors.password}
          />

          <TouchableOpacity
            onPress={() => router.push('/(auth)/forgot-password')}
            style={styles.forgotRow}
          >
            <Text style={styles.forgot}>Forgot password?</Text>
          </TouchableOpacity>

          <Button onPress={handleLogin} fullWidth loading={loginMutation.isPending}>
            Sign In
          </Button>
        </View>

        <View style={styles.signupRow}>
          <Text style={styles.signupText}>New faculty member? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/signup/teacher')}>
            <Text style={styles.signupLink}>Create account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  container: { paddingHorizontal: 24, gap: 28 },
  backRow: { alignSelf: 'flex-start' },
  back: { fontSize: FontSize.sm, fontFamily: FontFamily.medium, color: Colors.textSecondary },
  header: { gap: 8 },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.skeleton,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: { fontSize: FontSize.sm, fontFamily: FontFamily.medium, color: Colors.text },
  title: {
    fontSize: FontSize['3xl'],
    fontFamily: FontFamily.bold,
    color: Colors.text,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.regular,
    color: Colors.textSecondary,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: Colors.skeleton,
    borderRadius: 10,
    padding: 4,
  },
  tab: { flex: 1, paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  activeTab: { backgroundColor: Colors.surface },
  tabText: { fontSize: FontSize.sm, fontFamily: FontFamily.medium, color: Colors.textMuted },
  activeTabText: { color: Colors.text },
  form: { gap: 16 },
  forgotRow: { alignSelf: 'flex-end' },
  forgot: { fontSize: FontSize.sm, fontFamily: FontFamily.medium, color: Colors.text },
  signupRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  signupText: { fontSize: FontSize.sm, fontFamily: FontFamily.regular, color: Colors.textSecondary },
  signupLink: { fontSize: FontSize.sm, fontFamily: FontFamily.semibold, color: Colors.text },
});
