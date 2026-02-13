import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const Settings: React.FC = () => {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <MaterialCommunityIcons name="cog" size={20} color="#64748b" />
        <Text style={styles.title}>Settings</Text>
      </View>
      
      <Text style={styles.info}>This app is configured for Dzardzongke language learning.</Text>
      <Text style={styles.note}>Quechua content is preserved in the repository for future development.</Text>

      <TouchableOpacity style={[styles.button, { backgroundColor: '#0ea5e9' }]} onPress={() => navigation.navigate('Account')}>
        <Text style={styles.btnText}>Account</Text>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f7f7fb' },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 24 },
  title: { fontSize: 20, fontWeight: '700' },
  info: { fontSize: 16, color: '#374151', marginBottom: 8, textAlign: 'center' },
  note: { fontSize: 14, color: '#6b7280', marginBottom: 32, textAlign: 'center', fontStyle: 'italic' },
  button: { backgroundColor: '#007AFF', padding: 12, borderRadius: 8, marginTop: 10 },
  btnText: { color: 'white', fontWeight: '600' },
});

export default Settings;


