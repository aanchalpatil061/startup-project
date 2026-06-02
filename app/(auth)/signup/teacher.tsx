import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMutation } from '@tanstack/react-query';
import { Picker } from '@react-native-picker/picker';
import { Input } from '../../../src/components/ui/Input';
import { Button } from '../../../src/components/ui/Button';
import { useAuthStore } from '../../../src/store/authStore';
import { authApi } from '../../../src/api/auth';
import { Colors } from '../../../src/constants/colors';
import { FontSize, FontFamily } from '../../../src/constants/typography';
import { DEPARTMENTS } from '../../../src/constants/config';
import { isValidEmail, isStrongPassword, passwordsMatch } from '../../../src/utils/validation';

export default function TeacherSignupScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setAuth } = useAuthStore();

  const [form, setForm] = useState({
    name: '', email: '', employeeId: '',
    department: DEPARTMENTS[0], password: '', confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [agreed, setAgreed] = useState(false);

  const set = (k: keyof typeof form) => (v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const signupMutation = useMutation({
    mutationFn: authApi.signupTeacher,
    onSuccess: async (res) => {
      await setAuth(res.data.user, res.data.tokens.accessToken, res.data.tokens.refreshToken);
      router.replace('/(teacher)');
    },
    onError: (err: any) => {
      Alert.alert('Signup Failed', err?.response?.data?.message ?? 'Could not create account.');
    },
  });

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Full name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!isValidEmail(form.email)) errs.email = 'Enter a valid email';
    if (!form.employeeId.trim()) errs.employeeId = 'Employee ID is required';
    if (!isStrongPassword(form.password)) errs.password = 'Password must be at least 8 characters';
    if (!passwordsMatch(form.password, form.confirmPassword)) errs.confirmPassword = 'Passwords do not match';
    if (!agreed) errs.terms = 'You must agree to the Terms and Privacy Policy';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSignup = () => {
    if (!validate()) return;
    const { confirmPassword, ...payload } = form;
    signupMutation.mutate(payload);
  };

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
          <Text style={styles.title}>Create teacher account</Text>
          <Text style={styles.subtitle}>Takes about 30 seconds</Text>
        </View>

        <View style={styles.form}>
          <Input label="Full Name" placeholder="Dr. / Prof. Your Name" value={form.name} onChangeText={set('name')} leftIcon="person-outline" error={errors.name} />
          <Input label="College Email" placeholder="you@college.ac.in" value={form.email} onChangeText={set('email')} keyboardType="email-address" autoCapitalize="none" leftIcon="mail-outline" error={errors.email} />
          <Input label="Employee ID" placeholder="e.g. EMP2023001" value={form.employeeId} onChangeText={set('employeeId')} autoCapitalize="characters" leftIcon="briefcase-outline" error={errors.employeeId} />

          <View style={styles.field}>
            <Text style={styles.label}>Department</Text>
            <View style={styles.pickerWrapper}>
              <Picker selectedValue={form.department} onValueChange={set('department')} style={styles.picker}>
                {DEPARTMENTS.map((d) => <Picker.Item key={d} label={d} value={d} />)}
              </Picker>
            </View>
          </View>

          <Input label="Create Password" placeholder="Min. 8 characters" value={form.password} onChangeText={set('password')} password leftIcon="lock-closed-outline" error={errors.password} />
          <Input label="Confirm Password" placeholder="Repeat your password" value={form.confirmPassword} onChangeText={set('confirmPassword')} password leftIcon="lock-closed-outline" error={errors.confirmPassword} />

          <TouchableOpacity style={styles.termsRow} onPress={() => setAgreed((v) => !v)} activeOpacity={0.7}>
            <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
              {agreed ? <Text style={styles.checkmark}>✓</Text> : null}
            </View>
            <Text style={styles.termsText}>I agree to the Terms and Privacy Policy</Text>
          </TouchableOpacity>
          {errors.terms ? <Text style={styles.error}>{errors.terms}</Text> : null}

          <Button onPress={handleSignup} fullWidth loading={signupMutation.isPending}>
            Create Account
          </Button>
        </View>

        <View style={styles.signinRow}>
          <Text style={styles.signinText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.replace('/(auth)/login/teacher')}>
            <Text style={styles.signinLink}>Sign in</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  container: { paddingHorizontal: 24, gap: 24 },
  backRow: { alignSelf: 'flex-start' },
  back: { fontSize: FontSize.sm, fontFamily: FontFamily.medium, color: Colors.textSecondary },
  header: { gap: 4 },
  title: { fontSize: FontSize['2xl'], fontFamily: FontFamily.bold, color: Colors.text, letterSpacing: -0.6 },
  subtitle: { fontSize: FontSize.sm, fontFamily: FontFamily.regular, color: Colors.textMuted },
  form: { gap: 14 },
  field: { gap: 6 },
  label: { fontSize: FontSize.sm, fontFamily: FontFamily.medium, color: Colors.text },
  pickerWrapper: {
    borderWidth: 1, borderColor: Colors.border, borderRadius: 10,
    backgroundColor: Colors.surface, overflow: 'hidden', height: 48, justifyContent: 'center',
  },
  picker: { height: 48 },
  termsRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  checkbox: {
    width: 20, height: 20, borderRadius: 5, borderWidth: 1.5,
    borderColor: Colors.border, alignItems: 'center', justifyContent: 'center',
  },
  checkboxChecked: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  checkmark: { color: '#fff', fontSize: 12, fontFamily: FontFamily.bold },
  termsText: { flex: 1, fontSize: FontSize.sm, fontFamily: FontFamily.regular, color: Colors.textSecondary },
  error: { fontSize: FontSize.xs, color: Colors.error, fontFamily: FontFamily.regular },
  signinRow: { flexDirection: 'row', justifyContent: 'center' },
  signinText: { fontSize: FontSize.sm, fontFamily: FontFamily.regular, color: Colors.textSecondary },
  signinLink: { fontSize: FontSize.sm, fontFamily: FontFamily.semibold, color: Colors.text },
});
