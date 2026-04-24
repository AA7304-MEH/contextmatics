export async function apiClient<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, { ...options, headers: { 'Content-Type': 'application/json', ...options?.headers }});
  if (res.status === 402) {
    const data = await res.json();
    window.dispatchEvent(new CustomEvent('contextmatic:upgrade-required', { detail: data }));
    throw new Error('INSUFFICIENT_CREDITS');
  }
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
