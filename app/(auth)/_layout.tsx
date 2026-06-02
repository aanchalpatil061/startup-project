import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="login/student" />
      <Stack.Screen name="login/teacher" />
      <Stack.Screen name="login/admin" />
      <Stack.Screen name="signup/student" />
      <Stack.Screen name="signup/teacher" />
      <Stack.Screen name="forgot-password" />
    </Stack>
  );
}
