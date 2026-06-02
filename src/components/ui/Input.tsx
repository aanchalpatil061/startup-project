import React, { useState, forwardRef } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { FontSize, FontFamily } from '../../constants/typography';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
  password?: boolean;
}

export const Input = forwardRef<TextInput, InputProps>(
  (
    {
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      onRightIconPress,
      containerStyle,
      password = false,
      multiline,
      ...props
    },
    ref,
  ) => {
    const [focused, setFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = password;
    const secureTextEntry = isPassword && !showPassword;

    return (
      <View style={[styles.container, containerStyle]}>
        {label ? <Text style={styles.label}>{label}</Text> : null}
        <View
          style={[
            styles.inputWrapper,
            multiline && styles.inputWrapperMultiline,
            focused && styles.focused,
            error ? styles.errorBorder : null,
          ]}
        >
          {leftIcon ? (
            <Ionicons name={leftIcon} size={18} color={focused ? Colors.primary : Colors.textMuted} style={styles.leftIcon} />
          ) : null}
          <TextInput
            ref={ref}
            style={[styles.input, leftIcon ? styles.inputWithLeft : null, multiline && styles.inputMultiline]}
            placeholderTextColor={Colors.textMuted}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            secureTextEntry={secureTextEntry}
            autoCapitalize={isPassword ? 'none' : props.autoCapitalize}
            multiline={multiline}
            {...props}
          />
          {isPassword ? (
            <TouchableOpacity onPress={() => setShowPassword((v) => !v)} style={styles.rightIcon}>
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={18}
                color={Colors.textMuted}
              />
            </TouchableOpacity>
          ) : rightIcon ? (
            <TouchableOpacity onPress={onRightIconPress} style={styles.rightIcon}>
              <Ionicons name={rightIcon} size={18} color={Colors.textMuted} />
            </TouchableOpacity>
          ) : null}
        </View>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {hint && !error ? <Text style={styles.hint}>{hint}</Text> : null}
      </View>
    );
  },
);

Input.displayName = 'Input';

const styles = StyleSheet.create({
  container: { gap: 6 },
  label: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
    color: Colors.text,
    letterSpacing: -0.1,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    height: 48,
    paddingHorizontal: 14,
  },
  inputWrapperMultiline: {
    height: undefined,
    minHeight: 48,
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  inputMultiline: {
    height: undefined,
    minHeight: 80,
  },
  focused: { borderColor: Colors.primary },
  errorBorder: { borderColor: Colors.error },
  leftIcon: { marginRight: 8 },
  rightIcon: { padding: 4 },
  input: {
    flex: 1,
    fontSize: FontSize.base,
    fontFamily: FontFamily.regular,
    color: Colors.text,
    height: '100%',
  },
  inputWithLeft: { paddingLeft: 0 },
  error: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
    color: Colors.error,
  },
  hint: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
    color: Colors.textMuted,
  },
});
