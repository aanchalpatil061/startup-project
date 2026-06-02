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
import { isValidEmail } from '../../../src/utils/validation';

export default function AdminLoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setAuth } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const loginMutation = useMutation({
    mutationFn: authApi.loginAdmin,
    onSuccess: async (res) => {
      await setAuth(res.data.user, res.data.tokens.accessToken, res.data.tokens.refreshToken);
      router.replace('/(admin)');
    },
    onError: (err: any) => {
      Alert.alert('Access Denied', err?.response?.data?.message ?? 'Invalid admin credentials.');
    },
  });

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!email.trim()) errs.email = 'Email is required';
    else if (!isValidEmail(email)) errs.email = 'Enter a valid email address';
    if (!password) errs.password = 'Password is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleLogin = () => {
    if (!validate()) return;
    loginMutation.mutate({ email, password });
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
            <Text style={styles.badgeText}>🏛️  Admin</Text>
          </View>
          <Text style={styles.title}>Admin Access</Text>
          <Text style={styles.subtitle}>Academic management system sign in</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Admin Email"
            placeholder="admin@college.ac.in"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon="mail-outline"
            error={errors.email}
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

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            Admin accounts are provisioned by the system administrator. Contact support if you need access.
          </Text>
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
  form: { gap: 16 },
  forgotRow: { alignSelf: 'flex-end' },
  forgot: { fontSize: FontSize.sm, fontFamily: FontFamily.medium, color: Colors.text },
  infoBox: {
    backgroundColor: Colors.infoLight,
    borderRadius: 10,
    padding: 14,
  },
  infoText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    color: Colors.info,
    lineHeight: 20,
  },
});
