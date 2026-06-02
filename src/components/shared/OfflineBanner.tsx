import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import Animated, { useAnimatedStyle, withTiming, useSharedValue } from 'react-native-reanimated';
import { Colors } from '../../constants/colors';
import { FontSize, FontFamily } from '../../constants/typography';
import { useNetwork } from '../../hooks/useNetwork';

export const OfflineBanner: React.FC = () => {
  const { isOnline } = useNetwork();
  const translateY = useSharedValue(-50);

  useEffect(() => {
    translateY.value = withTiming(isOnline ? -50 : 0, { duration: 300 });
  }, [isOnline]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.banner, animStyle]} pointerEvents="none">
      <Ionicons name="cloud-offline-outline" size={14} color="#FFFFFF" />
      <Text style={styles.text}>No internet connection</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 999,
    backgroundColor: Colors.error,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 6,
  },
  text: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.medium,
    color: '#FFFFFF',
  },
});
