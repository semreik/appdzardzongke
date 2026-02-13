import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useSaved } from '../stores/useSaved';

const Profile: React.FC = () => {
  const { items, loadSaved, removeItem, clearAll } = useSaved();

  useEffect(() => {
    loadSaved();
  }, [loadSaved]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Saved Items</Text>
      <View style={styles.actions}>
        <TouchableOpacity style={[styles.btn, styles.clear]} onPress={clearAll}>
          <Text style={styles.btnText}>Clear All</Text>
        </TouchableOpacity>
      </View>
      {items.length === 0 ? (
        <Text style={styles.placeholder}>No saved items yet. Save words during study or in the dictionary.</Text>
      ) : (
        <FlatList
          data={items}
          keyExtractor={i => i.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.lang}>{item.language === 'qu' ? 'Quechua' : 'Dzardzongke'}</Text>
              <Text style={styles.prompt}>English: {item.prompt}</Text>
              <Text style={styles.answer}>Answer: {item.answer}</Text>
              {item.notes ? <Text style={styles.notes}>Notes: {item.notes}</Text> : null}
              <Text style={styles.explTitle}>Explanation</Text>
              <Text style={styles.expl}>{item.explanation}</Text>
              <View style={styles.row}>
                <Text style={styles.meta}>Source: {item.source}</Text>
                <Text style={styles.meta}>Saved: {new Date(item.createdAt).toLocaleString()}</Text>
              </View>
              <TouchableOpacity style={[styles.btn, styles.remove]} onPress={() => removeItem(item.id)}>
                <Text style={styles.btnText}>Remove</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  actions: { flexDirection: 'row', marginBottom: 12 },
  btn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  clear: { backgroundColor: '#6b7280', marginRight: 8 },
  remove: { backgroundColor: '#ef4444', marginTop: 8, alignSelf: 'flex-start' },
  btnText: { color: 'white', fontWeight: '600' },
  placeholder: { color: '#6b7280' },
  card: { backgroundColor: 'white', borderRadius: 12, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: '#e5e7eb' },
  lang: { color: '#374151', fontWeight: '600', marginBottom: 4 },
  prompt: { fontSize: 16, color: '#111827' },
  answer: { fontSize: 16, color: '#111827', fontWeight: '600', marginTop: 4 },
  notes: { fontSize: 14, color: '#6b7280', marginTop: 4 },
  explTitle: { fontWeight: '600', marginTop: 8 },
  expl: { color: '#374151' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  meta: { color: '#6b7280', fontSize: 12 },
});

export default Profile;


