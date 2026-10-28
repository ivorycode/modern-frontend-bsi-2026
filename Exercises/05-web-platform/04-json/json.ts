export function serialize(value: unknown): string {
  return JSON.stringify(value);
}

export function deserialize(json: string): unknown {
  return JSON.parse(json);
}
