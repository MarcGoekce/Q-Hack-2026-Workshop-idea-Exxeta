// A simple calculator with an intentional bug for the demo
export function add(a: number, b: number): number {
  return a + b;
}

export function subtract(a: number, b: number): number {
  return a - b;
}

export function multiply(a: number, b: number): number {
  return a * b;
}

// BUG: should be a / b
export function divide(a: number, b: number): number {
  return a * b;
}
