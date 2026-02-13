import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useAuth } from '../stores/useAuth';
import { getStats } from '../db/statsRepo';

const Account: React.FC = () => {
  const { currentUser, currentUserId, logout } = useAuth();
  const [stats, setStats] = React.useState<Array<{ metric: string; value: string }>>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      if (!currentUserId) return;
      setLoading(true);
      try {
        const rows = await getStats(currentUserId);
        if (mounted) setStats(rows || []);
      } catch (e) {
        if (mounted) setStats([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [currentUserId]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Account</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Username</Text>
        <Text style={styles.value}>{currentUser || '-'}</Text>
        <Text style={[styles.label, { marginTop: 12 }]}>User ID</Text>
        <Text style={styles.value}>{currentUserId ?? '-'}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Stored stats (DB)</Text>
        {loading ? (
          <Text style={styles.muted}>Loading…</Text>
        ) : stats.length === 0 ? (
          <Text style={styles.muted}>No stats saved yet.</Text>
        ) : (
          stats.map((s) => (
            <View key={s.metric} style={styles.row}>
              <Text style={styles.metric}>{s.metric}</Text>
              <Text style={styles.metricValue}>{s.value}</Text>
            </View>
          ))
        )}
      </View>

      <TouchableOpacity style={styles.logout} onPress={logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#f7f7fb' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#e5e7eb', marginBottom: 12 },
  cardTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  label: { fontSize: 12, color: '#64748b' },
  value: { fontSize: 16, fontWeight: '600', color: '#0f172a' },
  muted: { color: '#6b7280' },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  metric: { fontWeight: '600', color: '#111827' },
  metricValue: { color: '#1f2937' },
  logout: { alignSelf: 'flex-start', backgroundColor: '#ef4444', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, marginTop: 8 },
  logoutText: { color: 'white', fontWeight: '700' },
});

export default Account;


