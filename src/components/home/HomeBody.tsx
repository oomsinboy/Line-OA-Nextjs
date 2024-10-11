import React from 'react'
import Link from 'next/link';
import Image from 'next/image';

const HomeBody = () => {
    return (
        <div className='px-8'>
            <div className='h-full w-full rounded-[15px] bg-white px-14 py-10'>
                <div className='min-h-[78dvh] flex justify-center'>
                    <div>
                        <div className='select-none mb-8 2xl:my-8 2xl:mb-12 flex items-center justify-center text-[#461F78] text-4xl font-bold'>
                            Menu
                        </div>
                        <div className='flex h-[60dvh] gap-4 2xl:gap-8'>
                            <Link href={`${process.env.NEXT_PUBLIC_BASEROUTE}home/patient`} className="hover:bg-[#C5ABFB] cursor-pointer rounded-lg w-80 bg-base-100  border-4 border-[#AF88FF] ">
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
                            <Link href={`${process.env.NEXT_PUBLIC_BASEROUTE}home/notification`} className="hover:bg-[#C5ABFB] cursor-pointer rounded-lg w-80 bg-base-100 border-4 border-[#AF88FF] ">
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
                            <Link href={`${process.env.NEXT_PUBLIC_BASEROUTE}home/informations`} className="hover:bg-[#C5ABFB] cursor-pointer rounded-lg w-80 bg-base-100 border-4 border-[#AF88FF] ">
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
