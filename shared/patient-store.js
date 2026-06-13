window.AkabanePatients = {
  key: 'akabane_patients',
  all() {
    try { return JSON.parse(localStorage.getItem(this.key) || '[]'); }
    catch { return []; }
  },
  saveAll(list) {
    localStorage.setItem(this.key, JSON.stringify(list));
  },
  uid() {
    return crypto.randomUUID ? crypto.randomUUID() : 'p_' + Date.now() + '_' + Math.random().toString(16).slice(2);
  },
  upsert(patient) {
    const list = this.all();
    const name = (patient.name || patient.full_name || '').trim();
    if (!name) return null;
    let found = patient.id ? list.find(p => p.id === patient.id) : list.find(p => p.name.toLowerCase() === name.toLowerCase());
    if (found) {
      Object.assign(found, patient, { name, updatedAt: new Date().toISOString() });
    } else {
      found = {
        id: patient.id || this.uid(),
        name,
        phone: patient.phone || '',
        note: patient.note || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      list.unshift(found);
    }
    this.saveAll(list);
    return found;
  },
  get(id) {
    return this.all().find(p => p.id === id) || null;
  },
  remove(id) {
    this.saveAll(this.all().filter(p => p.id !== id));
  }
};
