// In-memory cache for the routes that scrape Athinorama or Filmy on each request.
// Many requests in a row then cost one scrape, so spamming them can't overload the Pi
// or get the home IP blocked by those sites (which would also break the weekly scrape).

const TTL_MS = 30 * 60 * 1000;
// Upper limit of cached entries, so many different filmy URLs can't fill the memory.
const MAX_ENTRIES = 200;

type Entry = { promise: Promise<unknown>; expires: number };
const entries = new Map<string, Entry>();

// Returns the cached result for `key`, or runs `load` and caches it.
// The promise itself is stored, so requests that arrive during a scrape wait for it
// instead of starting their own. A failed load is removed, so the next request tries again.
const cached = <T>(key: string, load: () => Promise<T>): Promise<T> => {
    const now = Date.now();
    const hit = entries.get(key);
    if (hit && hit.expires > now) return hit.promise as Promise<T>;
    entries.delete(key);

    const promise = load();
    entries.set(key, { promise, expires: now + TTL_MS });
    promise.catch(() => {
        if (entries.get(key)?.promise === promise) entries.delete(key);
    });

    // A Map keeps insertion order, so the first key is the oldest.
    if (entries.size > MAX_ENTRIES) entries.delete(entries.keys().next().value!);
    return promise;
};

export { cached };
