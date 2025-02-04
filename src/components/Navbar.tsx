'use client';

import React from 'react'
import Image from 'next/image';
import Link from 'next/link';
import Swal from 'sweetalert2';
import { usePathname,useRouter } from 'next/navigation'
import Cookies from 'js-cookie';

const Navbar = () => {
    const router = useRouter()
    const pathname = usePathname();
    const handleLogout = (e: any) => {
        e.preventDefault();
        Swal.fire({
            title: 'ยืนยันการออกจากระบบ',
            text: "คุณกำลังออกจากระบบ ต้องการดำเนินการต่อหรือไม่ ?",
            icon: 'warning',
            showCancelButton: true,
            cancelButtonText: 'ยกเลิก',
            confirmButtonText: 'ยืนยัน',
            reverseButtons: false,
            customClass: {
                icon: 'custom-swal2-warning', 
            },
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'ออกจากระบบ!',
                    text: 'คุณได้ออกจากระบบแล้ว',
                    icon: 'success',
                    confirmButtonText: 'ปิด',
                }).then(() => {
                    Cookies.remove('__user');
                    window.location.href = `${process.env.NEXT_PUBLIC_BASEROUTE}`;
                });
            }
        });
    };

    return (
        <div className='p-8 pt-3 2xl:pt-8 pb-2'>
            <div className=' rounded-[15px] bg-white px-2 py-1 flex justify-between'>
                <div className='flex'>
                    <Image
                        src={`/image/logo_colonoscopy_small.png`}
                        alt="logo"
                        width={64}
                        height={64}
                        className='2xl:w-20'
                    />
                    <div className='flex items-center text-xl text-[#9b88c0] font-medium select-none	'>
                        <h1>COLONOSCOPY TUH</h1>
                    </div>
                    <Link href={`${process.env.NEXT_PUBLIC_BASEROUTE}home`} className='ml-10 text-[#461F78] flex items-center text-xl font-bold select-none'>
                        <div>
                            <Image
                                src={`/image/icon_home.png`}
                                alt="logo"
                                width={30}
                                height={30}
                            />
                        </div>
                        <h1 className='mx-2'>หน้าหลัก</h1>
                    </Link>
                    <Link href="#" onClick={(e) => {
                        e.preventDefault();
                        if (pathname === '/home/') {
                            router.push('/home/');
                        } else {
                            router.back();
                        }
                    }} className='mx-5 text-[#461F78] flex items-center text-xl font-bold select-none'>
                        <div>
                            <Image
                                src={`/image/icon_back.png`}
                                alt="logo"
                                width={30}
                                height={30}
                            />
                        </div>
                        <h1 className='mx-2'>ย้อนกลับ</h1>
                    </Link>
                </div>
                <div className='flex'>
                    <div onClick={handleLogout} className='cursor-pointer mx-16 text-[#461F78] flex items-center text-xl font-bold select-none'>
                        <div>
                            <Image
                                src={`/image/icon_out.png`}
                                alt="logo"
                                width={30}
                                height={30}
                            />
                        </div>
                        <h1 className='mx-2'>ออกจากระบบ</h1>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar
