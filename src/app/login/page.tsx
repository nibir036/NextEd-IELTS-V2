'use client';

import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // আপনার Log In API কল
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ /* email, password */ }),
    });

    if (res.ok) {
      // লগইন সফল হলে সরাসরি মূল ড্যাশবোর্ড / হোম পেজে চলে যাবে
      router.push('/');
    }
  };

  return (
    // আপনার Log In ফর্ম UI
    <form onSubmit={handleLogin}>
      {/* Inputs */}
      <button type="submit">Log In</button>
    </form>
  );
}