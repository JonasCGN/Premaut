export function parseToDate(value: any): Date | null {
  if (!value && value !== 0) return null;
  try {
    // Date directly
    const d = new Date(value);
    if (!isNaN(d.getTime())) return d;

    // number as seconds -> ms
    const n = Number(value);
    if (!isNaN(n)) {
      const ms = n < 1e12 ? n * 1000 : n;
      const d2 = new Date(ms);
      if (!isNaN(d2.getTime())) return d2;
    }

    // replace space with T for loose ISO
    const isoTry = new Date(String(value).replace(' ', 'T'));
    if (!isNaN(isoTry.getTime())) return isoTry;
  } catch (e) {
    // fallthrough
  }
  return null;
}

export function formatDateSafe(value: any, fallback = 'Data desconhecida', options?: Intl.DateTimeFormatOptions) {
  const d = parseToDate(value);
  if (!d) return fallback;
  try {
    return d.toLocaleDateString('pt-BR', options || { day: 'numeric', month: 'long', year: 'numeric' });
  } catch (e) {
    return fallback;
  }
}

export function formatDateShort(value: any) {
  return formatDateSafe(value, '', { day: '2-digit', month: '2-digit' });
}

export function toISODate(value: any) {
  const d = parseToDate(value);
  if (!d) return '';
  try {
    return d.toISOString().split('T')[0];
  } catch (e) {
    return '';
  }
}

export function calculateAge(value: any) {
  const d = parseToDate(value);
  if (!d) return null;
  const hoje = new Date();
  let idade = hoje.getFullYear() - d.getFullYear();
  const m = hoje.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < d.getDate())) idade--;
  return idade;
}
