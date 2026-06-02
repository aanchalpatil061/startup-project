import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  type ListRenderItem,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Button } from '../src/components/ui/Button';
import { storage } from '../src/utils/storage';
import { Colors } from '../src/constants/colors';
import { FontSize, FontFamily } from '../src/constants/typography';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    emoji: '✍️',
    title: 'Upload Handwritten Exams',
    description:
      'Students write exams as usual. Teachers scan and upload answer sheets — AI handles the rest.',
    stat: '292M students',
    statLabel: 'across India',
  },
  {
    id: '2',
    emoji: '🤖',
    title: 'AI Evaluates in Hours',
    description:
      'Our Gemini-powered engine reads Indian handwriting and evaluates with confidence ratings — zero bias, zero favouritism.',
    stat: '< 24 hours',
    statLabel: 'turnaround time',
  },
  {
    id: '3',
    emoji: '📊',
    title: 'Full Transparency',
    description:
      "Students see every mark, every question's feedback, and blockchain-verified results. Disputes handled in one platform.",
    stat: '₹1.5 / script',
    statLabel: 'vs ₹30 manual',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<FlatList>(null);

  const handleNext = async () => {
    if (activeIndex < SLIDES.length - 1) {
      listRef.current?.scrollToIndex({ index: activeIndex + 1, animated: true });
    } else {
      await storage.setOnboarded();
      router.replace('/');
    }
  };

  const handleSkip = async () => {
    await storage.setOnboarded();
    router.replace('/');
  };

  const renderSlide: ListRenderItem<typeof SLIDES[0]> = ({ item }) => (
    <View style={[styles.slide, { width }]}>
      <View style={styles.emojiBox}>
        <Text style={styles.emoji}>{item.emoji}</Text>
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <View style={styles.statBox}>
        <Text style={styles.stat}>{item.stat}</Text>
        <Text style={styles.statLabel}>{item.statLabel}</Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom + 20 }]}>
      <View style={styles.topBar}>
        <View style={styles.logoRow}>
          <View style={styles.logoMark}>
            <Text style={styles.logoText}>A</Text>
          </View>
          <Text style={styles.brand}>Askd</Text>
        </View>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skip}>Skip</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={listRef}
        data={SLIDES}
        renderItem={renderSlide}
        keyExtractor={(i) => i.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const idx = Math.round(e.nativeEvent.contentOffset.x / width);
          setActiveIndex(idx);
        }}
        style={styles.list}
      />

      <View style={styles.footer}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === activeIndex && styles.activeDot]}
            />
          ))}
        </View>
        <Button
          onPress={handleNext}
          fullWidth
          style={styles.btn}
        >
          {activeIndex === SLIDES.length - 1 ? 'Get Started' : 'Next'}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoMark: {
    width: 32,
    height: 32,
    borderRadius: 9,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 16,
    fontFamily: FontFamily.bold,
    color: Colors.textInverse,
  },
  brand: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.bold,
    color: Colors.text,
    letterSpacing: -0.5,
  },
  skip: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
    color: Colors.textSecondary,
  },
  list: { flex: 1 },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 20,
  },
  emojiBox: {
    width: 100,
    height: 100,
    borderRadius: 28,
    backgroundColor: Colors.skeleton,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  emoji: { fontSize: 48 },
  title: {
    fontSize: FontSize['2xl'],
    fontFamily: FontFamily.bold,
    color: Colors.text,
    textAlign: 'center',
    letterSpacing: -0.6,
    lineHeight: 32,
  },
  description: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.regular,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  statBox: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'center',
  },
  stat: {
    fontSize: FontSize['2xl'],
    fontFamily: FontFamily.bold,
    color: Colors.textInverse,
    letterSpacing: -0.6,
  },
  statLabel: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.medium,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  footer: { paddingHorizontal: 24, gap: 20 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6 },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.border,
  },
  activeDot: {
    width: 20,
    backgroundColor: Colors.primary,
  },
  btn: {},
});
