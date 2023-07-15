'use client';

import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const checkAuthenticated = async () => {
    const accessToken = localStorage.getItem('access-token');

    if (accessToken === null || accessToken === undefined || accessToken === '') {
      return;
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

    if (responseCode === 200) {
      router.push('/');
    }
  };

  const onFormSubmit = async (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = {
      accountNumber: event.target.account_number.value,
      email: event.target.email.value,
      password: event.target.password.value
    };

    const jsonData = JSON.stringify(data);

    const endpoint = 'http://127.0.0.1:3000/auth/login';

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: jsonData
    };

    const response = await fetch(endpoint, options);

    const result = await response.json();
    const responseCode = response.status;

    if (responseCode !== 200 && responseCode !== 201) {
      document.getElementById('error-message')!.innerText = Array.isArray(result.message) ? result.message[0] : result.message;
    } else {
      document.getElementById('error-message')!.innerText = "";

      localStorage.setItem('access-token', result.access_token);
      router.push('/');
    }
  };

  useEffect(() => {
    checkAuthenticated();
  });

  return (
    <div className="center-hv border p-4 w-96 shadow rounded">
      <div className="text-center text-2xl mb-4">
        Login
      </div>
      <form onSubmit={onFormSubmit}>
        <div className="mb-4">
          <div>
            Account Number
          </div>
          <div>
            <input type="text" name="account_number" id="account-number" className="w-full border-b-2" />
          </div>
        </div>
        <div className="mb-4">
          <div>
            E-mail Address
          </div>
          <div>
            <input type="email" name="email" id="email" className="w-full border-b-2" />
          </div>
        </div>
        <div className="mb-4">
          <div>
            Password
          </div>
          <div>
            <input type="password" name="password" id="password" className="w-full border-b-2" />
          </div>
        </div>
        <div className="error-message mb-4" id="error-message">

        </div>
        <div className="mb-4 text-center">
          <button className="px-4 py-2 font-semibold text-sm bg-cyan-500 text-white rounded-full shadow-sm">Login</button>
        </div>
      </form>
    </div>
  )
}
