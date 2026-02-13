import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInDown, ReduceMotion } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useLanguage } from '../stores/useLanguage';
import AnimatedButton from '../components/AnimatedButton';

const Onboarding: React.FC = () => {
  const { setLanguage } = useLanguage();

  return (
    <View style={styles.container}>
      <Animated.Text
        entering={FadeInDown.delay(100).duration(500).reduceMotion(ReduceMotion.System)}
        style={styles.title}
      >
        Welcome to Dzardzongke Learning!
      </Animated.Text>
      <Animated.Text
        entering={FadeInDown.delay(250).duration(500).reduceMotion(ReduceMotion.System)}
        style={styles.subtitle}
      >
        Learn the beautiful Dzardzongke language through interactive lessons, quizzes, and cultural insights.
      </Animated.Text>
      <Animated.View entering={FadeInDown.delay(400).duration(500).reduceMotion(ReduceMotion.System)}>
        <AnimatedButton
          style={styles.button}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            setLanguage('dz');
          }}
          hapticFeedback="medium"
        >
          <Text style={styles.btnText}>Start Learning Dzardzongke</Text>
        </AnimatedButton>
      </Animated.View>
      <Animated.Text
        entering={FadeInDown.delay(550).duration(500).reduceMotion(ReduceMotion.System)}
        style={styles.hint}
      >
        Quechua content is available in the repository for future development.
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: '700', textAlign: 'center', marginBottom: 16, color: '#1f2937' },
  subtitle: { fontSize: 16, textAlign: 'center', marginBottom: 32, color: '#6b7280', lineHeight: 22 },
  button: { backgroundColor: '#007AFF', paddingVertical: 16, paddingHorizontal: 24, borderRadius: 12, alignSelf: 'center' },
  btnText: { color: 'white', fontWeight: '600', fontSize: 18 },
  hint: { marginTop: 20, textAlign: 'center', color: '#9ca3af', fontSize: 14, fontStyle: 'italic' },
});

export default Onboarding;
