export function normalizeListResponse<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) {
    return payload as T[];
  }

  if (payload && typeof payload === "object") {
    const candidate = payload as {
      results?: unknown;
      data?: unknown;
      items?: unknown;
    };

    if (Array.isArray(candidate.results)) {
      return candidate.results as T[];
    }

    if (Array.isArray(candidate.data)) {
      return candidate.data as T[];
    }

    if (Array.isArray(candidate.items)) {
      return candidate.items as T[];
    }
  }

  return [];
}
