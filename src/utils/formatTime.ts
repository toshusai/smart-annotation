export function formatTime(_date: Date) {
  const date = new Date(_date.getTime());
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().replace(/T/, " ").replace(/\..+/, "");
}
