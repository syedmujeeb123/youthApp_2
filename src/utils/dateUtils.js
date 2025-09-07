export const formatDate = (date) => date.toISOString().split('T')[0];

export const getLastNDates = (n) => {
  const dates = [];
  for (let i = 0; i < n; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(formatDate(d));
  }
  return dates;
};

export const getDateRange = (start, end) => {
  const result = [];
  const current = new Date(start);
  while (current <= new Date(end)) {
    result.push(formatDate(current));
    current.setDate(current.getDate() + 1);
  }
  return result;
};
