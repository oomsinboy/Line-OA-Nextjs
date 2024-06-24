'use client';

import React from 'react'
import Image from 'next/image';
import Link from 'next/link';
import Swal from 'sweetalert2';

const Navbar = () => {
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
                icon: 'custom-swal2-warning', // ใช้ class ที่กำหนดใน CSS
            },
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'ออกจากระบบ!',
                    text: 'คุณได้ออกจากระบบแล้ว',
                    icon: 'success',
                    confirmButtonText: 'ปิด',
                }).then(() => {
                    window.location.href = '/login';
                });
            }
        });
    };

    return (
        <div className='p-8 pb-2'>
            <div className=' rounded-[15px] bg-white px-2 py-1 flex justify-between'>
                <div className='flex'>
                    <Image
                        src={`/logo_colonoscopy_small.png`}
                        alt="logo"
                        width={80}
                        height={80}
                    />
                    <div className='flex items-center text-xl text-[#9b88c0] font-medium select-none	'>
                        <h1>COLONOSCOPY TUH</h1>
                    </div>
                    <Link href="/home" className='mx-10 text-[#461F78] flex items-center text-xl font-bold select-none'>
                        <div>
                            <Image
                                src={`/icon_home.png`}
                                alt="logo"
                                width={30}
                                height={30}
                            />
                        </div>
                        <h1 className='mx-2'>หน้าหลัก</h1>
                    </Link>
                </div>
                <div className='flex'>
                    <div onClick={handleLogout} className='cursor-pointer mx-16 text-[#461F78] flex items-center text-xl font-bold select-none'>
                        <div>
                            <Image
                                src={`/icon_out.png`}
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
