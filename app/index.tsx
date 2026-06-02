import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '../src/store/authStore';
import { storage } from '../src/utils/storage';
import { Colors } from '../src/constants/colors';
import { FontSize, FontFamily } from '../src/constants/typography';
import type { UserRole } from '../src/constants/config';

const { width } = Dimensions.get('window');

const ROLES: { role: UserRole; label: string; desc: string; emoji: string }[] = [
  { role: 'student', label: 'Student', desc: 'View scripts & results', emoji: '🎓' },
  { role: 'teacher', label: 'Teacher', desc: 'Evaluate & analyse', emoji: '📝' },
  { role: 'admin', label: 'Admin', desc: 'Manage institution', emoji: '🏛️' },
];

export default function RoleSelectionScreen() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const insets = useSafeAreaInsets();

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(24);

  useEffect(() => {
    const redirect = async () => {
      const onboarded = await storage.getOnboarded();
      if (!onboarded) {
        router.replace('/onboarding');
        return;
      }
      if (isAuthenticated && user) {
        router.replace(`/(${user.role})`);
      }
    };
    redirect();

    opacity.value = withDelay(100, withTiming(1, { duration: 500 }));
    translateY.value = withDelay(100, withTiming(0, { duration: 500 }));
  }, [isAuthenticated, user]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const handleRoleSelect = (role: UserRole) => {
    router.push(`/(auth)/login/${role}`);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 20 }]}>
      <Animated.View style={[styles.header, animStyle]}>
        <View style={styles.logoMark}>
          <Text style={styles.logoText}>A</Text>
        </View>
        <Text style={styles.brand}>Askd</Text>
        <Text style={styles.tagline}>AI Answer Evaluation</Text>
        <Text style={styles.subtitle}>
          Handwritten exams evaluated in hours, not months.
        </Text>
      </Animated.View>

      <Animated.View style={[styles.rolesSection, animStyle]}>
        <Text style={styles.chooseLabel}>Choose your role to sign in</Text>
        {ROLES.map((r) => (
          <TouchableOpacity
            key={r.role}
            style={styles.roleCard}
            onPress={() => handleRoleSelect(r.role)}
            activeOpacity={0.8}
          >
            <View style={styles.roleEmoji}>
              <Text style={styles.emoji}>{r.emoji}</Text>
            </View>
            <View style={styles.roleInfo}>
              <Text style={styles.roleLabel}>{r.label}</Text>
              <Text style={styles.roleDesc}>{r.desc}</Text>
            </View>
            <Text style={styles.arrow}>→</Text>
          </TouchableOpacity>
        ))}
      </Animated.View>

      <Animated.View style={[styles.footer, animStyle]}>
        <Text style={styles.footerText}>
          Trusted by institutions across India · ₹1.5 per script
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  header: { alignItems: 'center', gap: 8 },
  logoMark: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  logoText: {
    fontSize: 28,
    fontFamily: FontFamily.bold,
    color: Colors.textInverse,
    letterSpacing: -1,
  },
  brand: {
    fontSize: FontSize['3xl'],
    fontFamily: FontFamily.bold,
    color: Colors.text,
    letterSpacing: -1,
  },
  tagline: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
    color: Colors.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.regular,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 4,
    paddingHorizontal: 16,
  },
  rolesSection: { gap: 12 },
  chooseLabel: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    gap: 14,
  },
  roleEmoji: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.skeleton,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: { fontSize: 22 },
  roleInfo: { flex: 1 },
  roleLabel: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.semibold,
    color: Colors.text,
    letterSpacing: -0.2,
  },
  roleDesc: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  arrow: {
    fontSize: FontSize.lg,
    color: Colors.textMuted,
  },
  footer: { alignItems: 'center' },
  footerText: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});
