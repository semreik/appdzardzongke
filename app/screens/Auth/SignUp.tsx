import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../stores/useAuth';

export default function SignUp({ navigation }: any) {
  const { signup, loading } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async () => {
    setError(null);
    try {
      await signup(username.trim(), password, confirm);
    } catch (e: any) {
      setError(e?.message || 'Sign up failed');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create account</Text>
      {!!error && <Text style={styles.error}>{error}</Text>}
      <Text style={styles.helper}>Password must be at least 6 characters.</Text>
      <TextInput 
        placeholder="Username" 
        placeholderTextColor="#9ca3af"
        style={styles.input} 
        autoCapitalize="none" 
        autoCorrect={false} 
        spellCheck={false} 
        value={username} 
        onChangeText={setUsername} 
      />
      <TextInput 
        placeholder="Password" 
        placeholderTextColor="#9ca3af"
        style={styles.input} 
        secureTextEntry 
        autoCorrect={false} 
        spellCheck={false} 
        value={password} 
        onChangeText={setPassword} 
      />
      <TextInput 
        placeholder="Confirm password" 
        placeholderTextColor="#9ca3af"
        style={styles.input} 
        secureTextEntry 
        autoCorrect={false} 
        spellCheck={false} 
        value={confirm} 
        onChangeText={setConfirm} 
      />
      <TouchableOpacity style={styles.button} onPress={onSubmit} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Please wait…' : 'Sign up'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.replace('Login')}>
        <Text style={styles.link}>I have an account</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, gap: 12 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 8 },
  input: { 
    borderWidth: 1, 
    borderColor: '#e5e7eb', 
    borderRadius: 10, 
    paddingHorizontal: 12, 
    paddingVertical: 10,
    color: '#000000',
    backgroundColor: '#ffffff',
    fontSize: 16,
    fontWeight: '400',
  },
  button: { backgroundColor: '#22c55e', borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  buttonText: { color: 'white', fontWeight: '700' },
  link: { color: '#2563eb', textAlign: 'center', marginTop: 8 },
  error: { color: '#b91c1c' },
  helper: { color: '#6b7280' },
});


