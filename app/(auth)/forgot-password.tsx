import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMutation } from '@tanstack/react-query';
import { Input } from '../../src/components/ui/Input';
import { Button } from '../../src/components/ui/Button';
import { authApi } from '../../src/api/auth';
import { Colors } from '../../src/constants/colors';
import { FontSize, FontFamily } from '../../src/constants/typography';
import { isValidEmail } from '../../src/utils/validation';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const mutation = useMutation({
    mutationFn: () => authApi.forgotPassword(email, 'student'),
    onSuccess: () => setSent(true),
    onError: (err: any) => {
      Alert.alert('Error', err?.response?.data?.message ?? 'Could not send reset email.');
    },
  });

  const handle = () => {
    if (!email.trim()) { setError('Email is required'); return; }
    if (!isValidEmail(email)) { setError('Enter a valid email address'); return; }
    setError('');
    mutation.mutate();
  };

  if (sent) {
    return (
      <View style={[styles.container, { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 20 }]}>
        <View style={styles.successBox}>
          <Text style={styles.successEmoji}>📬</Text>
          <Text style={styles.successTitle}>Check your email</Text>
          <Text style={styles.successDesc}>
            We've sent a password reset link to {email}. Check your inbox and follow the instructions.
          </Text>
          <Button onPress={() => router.back()} variant="outline" fullWidth style={{ marginTop: 24 }}>
            Back to Sign In
          </Button>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={[styles.container, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }]}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backRow}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.header}>
          <Text style={styles.title}>Reset password</Text>
          <Text style={styles.subtitle}>Enter your email and we'll send you a reset link.</Text>
        </View>
        <View style={styles.form}>
          <Input
            label="Email Address"
            placeholder="you@college.ac.in"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon="mail-outline"
            error={error}
          />
          <Button onPress={handle} fullWidth loading={mutation.isPending}>
            Send Reset Link
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1, paddingHorizontal: 24, gap: 28 },
  backRow: { alignSelf: 'flex-start' },
  back: { fontSize: FontSize.sm, fontFamily: FontFamily.medium, color: Colors.textSecondary },
  header: { gap: 8 },
  title: { fontSize: FontSize['2xl'], fontFamily: FontFamily.bold, color: Colors.text, letterSpacing: -0.6 },
  subtitle: { fontSize: FontSize.base, fontFamily: FontFamily.regular, color: Colors.textSecondary, lineHeight: 22 },
  form: { gap: 16 },
  successBox: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, paddingHorizontal: 8 },
  successEmoji: { fontSize: 56, marginBottom: 8 },
  successTitle: { fontSize: FontSize['2xl'], fontFamily: FontFamily.bold, color: Colors.text, textAlign: 'center', letterSpacing: -0.6 },
  successDesc: { fontSize: FontSize.base, fontFamily: FontFamily.regular, color: Colors.textSecondary, textAlign: 'center', lineHeight: 24 },
});
