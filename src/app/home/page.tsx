"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar'
import HomeBody from '@/components/home/HomeBody'
import React from 'react'
import Cookies from 'js-cookie';

function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const user = Cookies.get('__user');
    if (!user) {
      router.push('/');
    }
  }, [router]);

  return (
    <div className='min-h-screen'>
      <Navbar />
      <HomeBody/>
    </div>
  )
}

export default HomePage
