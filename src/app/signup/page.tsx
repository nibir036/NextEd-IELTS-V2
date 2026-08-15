'use client';

import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    // আপনার Sign Up API কল (যেমন: Firebase, NextAuth, বা Custom API)
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ /* email, password, name */ }),
    });

    if (res.ok) {
      // অ্যাকাউন্ট তৈরি সফল হলে ইউজার ডায়াগনস্টিক টেস্টে যাবে
      router.push('/diagnostic-test');
    }
  };

  return (
    // আপনার Sign Up ফর্ম UI
    <form onSubmit={handleSignUp}>
      {/* Inputs */}
      <button type="submit">Create Account</button>
    </form>
  );
}