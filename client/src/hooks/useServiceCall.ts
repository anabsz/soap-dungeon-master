import { useCallback, useState } from "react";
import type { ServiceCallState } from "./interfaces";

export function useServiceCall<A extends unknown[], R>(
  service: (...args: A) => Promise<R>
): ServiceCallState<A, R> {
  const [result, setResult] = useState<R | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const run = useCallback(
    async (...args: A) => {
      setLoading(true);
      setError(null);

      try {
        setResult(await service(...args));
      } catch (err) {
        setResult(null);
        setError(
          err instanceof Error ? err.message : "Não foi possível concluir a operação."
        );
      } finally {
        setLoading(false);
      }
    },
    [service]
  );

  return { result, error, loading, run };
}
