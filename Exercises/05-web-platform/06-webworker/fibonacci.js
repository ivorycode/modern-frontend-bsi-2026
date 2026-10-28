// Absichtlich langsam: rechnet jeden Teilwert immer wieder neu (exponentielle Laufzeit).
export function fibonacci(n) {
  return n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2);
}
