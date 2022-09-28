export function forceArray<A>(data: A | Array<A> | undefined): Array<A>;
export function forceArray<A>(
  data: A | ReadonlyArray<A> | undefined
): ReadonlyArray<A>;
export function forceArray<A>(
  data: A | Array<A> | undefined
): ReadonlyArray<A> {
  data = data || [];
  return Array.isArray(data) ? data : [data];
}

export function notEmpty<TValue>(value: TValue): value is NonNullable<TValue> {
  return value !== null && value !== undefined;
}
