import React, { useEffect } from 'react';
import { StyleSheet, type ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import { Colors } from '../../constants/colors';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 16,
  borderRadius = 8,
  style,
}) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(withTiming(1, { duration: 900 }), -1, true);
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [Colors.skeleton, Colors.skeletonHighlight],
    ),
  }));

  return (
    <Animated.View
      style={[
        animStyle,
        { width: width as number, height, borderRadius },
        style,
      ]}
    />
  );
};

export const SkeletonCard: React.FC = () => (
  <Animated.View style={skStyles.card}>
    <Skeleton height={14} width="60%" />
    <Skeleton height={12} width="40%" style={{ marginTop: 8 }} />
    <Skeleton height={12} width="80%" style={{ marginTop: 6 }} />
  </Animated.View>
);

const skStyles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    gap: 0,
  },
});
