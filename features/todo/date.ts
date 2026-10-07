const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const pad = (n: number): string => String(n).padStart(2, '0');

/** "1 Sep 2021" — для підпису "Created at" */
export const formatCreated = (iso: string): string => {
  const d = new Date(iso);
  return `${d.getDate()} ${MONTHS[d.getMonth()].slice(0, 3)} ${d.getFullYear()}`;
};

/** "3 September 2021" з рядка YYYY-MM-DD */
export const formatDeadline = (deadline: string): string => {
  const [y, m, d] = deadline.split('-').map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
};

/** YYYY-MM-DD -> DD.MM.YYYY (для поля вводу) */
export const deadlineToInput = (deadline: string): string => {
  const [y, m, d] = deadline.split('-');
  return `${d}.${m}.${y}`;
};

/**
 * DD.MM.YYYY -> YYYY-MM-DD.
 * Порожній рядок -> null (дедлайн необов'язковий), некоректна дата -> 'invalid'.
 */
export const parseDeadlineInput = (text: string): string | null | 'invalid' => {
  const value = text.trim();
  if (value === '') return null;
  const match = /^(\d{1,2})[./-](\d{1,2})[./-](\d{4})$/.exec(value);
  if (!match) return 'invalid';
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(year, month - 1, day);
  const valid =
    date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
  return valid ? `${year}-${pad(month)}-${pad(day)}` : 'invalid';
};
