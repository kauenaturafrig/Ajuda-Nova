export function gerarDiff<T extends Record<string, any>>(
  antes: T,
  depois: Partial<T>
) {
  const diff: Record<string, { antes: any; depois: any }> = {};

  for (const key of Object.keys(depois)) {
    if (antes[key] !== depois[key]) {
      diff[key] = {
        antes: antes[key],
        depois: depois[key],
      };
    }
  }

  return diff;
}
