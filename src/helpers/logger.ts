// Timestamps console output. Useful when reading CI logs line by line.

export function logStep(context: string, message: string): void {
  const time = new Date().toISOString().substring(11, 19);
  console.log(`[${time}] [${context}] ${message}`);
}
