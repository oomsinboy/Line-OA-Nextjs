
// export default function Home() {
//   return (
//     <main className="flex min-h-screen flex-col items-center justify-between p-24">

//     </main>
//   );
// }

'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import LoginComponent from '@/components/login/Login';

function LoginPage() {
  return (
    <div className='p-20 px-40 flex items-center justify-center min-h-screen'>
      <div className='h-[80dvh] w-full rounded-[40px] bg-white p-20 py-40'>
        <div className='h-full flex'>
          <div className='w-1/2 flex items-center justify-center'>
            <Image
              src={`/image/logo_colonoscopy.png`}
              alt="logo"
              width={500}
              height={500}
            />
          </div>
          <LoginComponent />
        </div>
      </div>
    </div>
  );
}

export default LoginPage

