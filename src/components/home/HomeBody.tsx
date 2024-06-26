import React from 'react'
import Link from 'next/link';
import Image from 'next/image';

const HomeBody = () => {
    return (
        <div className='px-8'>
            <div className='h-full w-full rounded-[15px] bg-white px-14 py-10'>
                <div className='min-h-[78dvh] flex justify-center'>
                    <div>
                        <div className='select-none my-8 mb-12 flex items-center justify-center text-[#461F78] text-4xl font-bold'>
                            Menu
                        </div>
                        <div className='flex h-[60dvh]'>
                            <Link href='/home/patient' className="hover:bg-[#C5ABFB] cursor-pointer rounded-lg w-80 bg-base-100  border-4 border-[#AF88FF] mx-4">
                                <div className="card-body flex items-center justify-center">
                                    <div className='my-14'>
                                        <Image
                                            src={`/image/icon_patient.png`}
                                            alt="logo"
                                            width={200}
                                            height={200}
                                        />
                                    </div>
                                    <span className='text-4xl font-semibold text-[#461F78]'>Patient</span>
                                </div>
                            </Link>
                            <Link href='/home/notification' className="hover:bg-[#C5ABFB] cursor-pointer rounded-lg w-80 bg-base-100 border-4 border-[#AF88FF] mx-4">
                                <div className="card-body flex items-center justify-center">
                                    <div className='my-14'>
                                        <Image
                                            src={`/image/icon_notifications.png`}
                                            alt="logo"
                                            width={200}
                                            height={200}
                                        />
                                    </div>
                                    <span className='text-4xl font-semibold text-[#461F78] text-center'>Notifications Message</span>
                                </div>
                            </Link>
                            <Link href='/home/informations' className="hover:bg-[#C5ABFB] cursor-pointer rounded-lg w-80 bg-base-100 border-4 border-[#AF88FF] mx-4">
                                <div className="card-body flex items-center justify-center">
                                    <div className='my-14'>
                                        <Image
                                            src={`/image/icon_informations.png`}
                                            alt="logo"
                                            width={200}
                                            height={200}
                                        />
                                    </div>
                                    <span className='text-4xl font-semibold text-[#461F78]'>Informations</span>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomeBody
