'use client';

const USER_KEY = 'potansiyel_user_id';

export function setUserId(id: number): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_KEY, String(id));
  }
}

export function getUserId(): number | null {
  if (typeof window === 'undefined') return null;
  const val = localStorage.getItem(USER_KEY);
  return val ? parseInt(val, 10) : null;
}

export function clearSession(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(USER_KEY);
  }
}
