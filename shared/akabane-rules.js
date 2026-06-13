// KUNGFU MAN · AKABANE RULES
window.AKABANE_RULES = {
  classify(value) {
    const n = Number(value);
    if (!Number.isFinite(n)) return { key: 'unmeasured', label: 'Не измерено', short: 'Не измерено', className: 'gray' };
    if (n <= 5) return { key: 'excess', label: 'Избыток', short: 'Избыток', className: 'red' };
    if (n <= 7) return { key: 'normal', label: 'Норма', short: 'Норма', className: 'green' };
    if (n <= 13) return { key: 'deficiency', label: 'Недостаток', short: 'Недостаток', className: 'blue' };
    return { key: 'severe_deficiency', label: 'Выраженный недостаток', short: 'Выраженный', className: 'orange' };
  }
};
