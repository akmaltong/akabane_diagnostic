// KUNGFU MAN · AKABANE RULES
// Единая шкала диагностики Акабане
// 0–5   = Избыток
// 6–7   = Норма
// 8–13  = Недостаток
// 14+   = Выраженный недостаток

window.AKABANE_RULES = {
  classify(value) {
    const n = Number(value);
    if (!Number.isFinite(n)) {
      return { key: 'unmeasured', label: 'Не измерено', className: 'gray' };
    }
    if (n <= 5) {
      return { key: 'excess', label: 'Избыток', className: 'red' };
    }
    if (n <= 7) {
      return { key: 'normal', label: 'Норма', className: 'green' };
    }
    if (n <= 13) {
      return { key: 'deficiency', label: 'Недостаток', className: 'blue' };
    }
    return { key: 'severe_deficiency', label: 'Выраженный недостаток', className: 'purple' };
  },

  count(rows) {
    const c = { excess: 0, normal: 0, deficiency: 0, severe_deficiency: 0, unmeasured: 0 };
    rows.forEach(row => {
      const state = this.classify(row.time).key;
      c[state] = (c[state] || 0) + 1;
    });
    return c;
  }
};
