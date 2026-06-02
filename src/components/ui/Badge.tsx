import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontSize, FontFamily } from '../../constants/typography';

interface BadgeProps {
  label: string;
  color?: string;
  bgColor?: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  color = '#09090B',
  bgColor = '#F4F4F5',
  size = 'md',
}) => (
  <View style={[styles.badge, { backgroundColor: bgColor }, size === 'sm' && styles.sm]}>
    <Text style={[styles.text, { color }, size === 'sm' && styles.smText]}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  badge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  sm: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  text: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.medium,
    letterSpacing: 0.2,
  },
  smText: { fontSize: 10 },
});
