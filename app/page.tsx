"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const checkAuthenticated = async () => {
    const accessToken = localStorage.getItem('access-token');

    if (accessToken === null || accessToken === undefined || accessToken === '') {
      router.push('/auth/login');
    }

    const endpoint = 'http://127.0.0.1:3000/auth/check';

    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken
      }
    };

    const response = await fetch(endpoint, options);
    const responseCode = response.status;

    if (responseCode !== 200) {
      router.push('/auth/login');
    }
  };

  useEffect(() => {
    checkAuthenticated();
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      Home page, still in maintenance
    </main>
  )
}
