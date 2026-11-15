
export function parseIntInput(value: string): number | null {
  const text = value.trim();
  if (!/^-?\d+$/.test(text)) return null;
  return Number(text);
}
