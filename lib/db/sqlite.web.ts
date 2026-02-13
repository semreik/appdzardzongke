type Row = Record<string, any>;

class MemoryDB {
  users: Row[] = [];
  stats: Row[] = [];
  async execAsync(_: string) {}
  async runAsync(sql: string, params: any[] = []) {
    if (sql.startsWith('INSERT INTO users')) {
      const [username, password_hash, salt, iters, created_at] = params;
      if (this.users.find(u => u.username === username)) throw new Error('exists');
      this.users.push({ username, password_hash, salt, iters, created_at });
      return;
    }
    if (sql.startsWith('INSERT INTO stats')) {
      const [username, key, value, updated_at] = params;
      const idx = this.stats.findIndex(s => s.username === username && s.key === key);
      if (idx === -1) this.stats.push({ username, key, value, updated_at });
      else this.stats[idx] = { username, key, value, updated_at };
      return;
    }
  }
  async getFirstAsync<T = any>(sql: string, params: any[]): Promise<T | undefined> {
    if (sql.includes('FROM users')) {
      const [username] = params;
      return this.users.find(u => u.username === username);
    }
    if (sql.includes('FROM stats')) {
      const [username, key] = params;
      return this.stats.find(s => s.username === username && s.key === key);
    }
  }
}

let dbInstance: any = null;
export async function openDb(): Promise<any> {
  if (dbInstance) return dbInstance;
  dbInstance = new MemoryDB();
  return dbInstance;
}


