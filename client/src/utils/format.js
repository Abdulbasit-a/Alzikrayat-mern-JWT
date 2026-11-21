// Date helpers - Arabic locale with Arabic-Indic digits, like the rest of the interface

const LOCALE = 'ar-EG';

export const formatDate = (value) =>
  new Date(value).toLocaleDateString(LOCALE, { year: 'numeric', month: 'long', day: 'numeric' });

export const formatDateTime = (value) =>
  new Date(value).toLocaleString(LOCALE, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

export const formatNumber = (n) => Number(n).toLocaleString(LOCALE);

export const formatFileSize = (bytes) => {
  if (bytes < 1024) return `${formatNumber(bytes)} بايت`;
  if (bytes < 1024 * 1024) return `${formatNumber((bytes / 1024).toFixed(1))} كيلوبايت`;
  return `${formatNumber((bytes / (1024 * 1024)).toFixed(2))} ميغابايت`;
};
