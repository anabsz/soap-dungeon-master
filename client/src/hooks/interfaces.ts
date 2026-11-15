export interface ServiceCallState<A extends unknown[], R> {
  result: R | null;
  error: string | null;
  loading: boolean;
  run: (...args: A) => Promise<void>;
}
