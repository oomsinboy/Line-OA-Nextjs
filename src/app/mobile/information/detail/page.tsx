"use client"

import React, { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image';
import axios from 'axios';
import DetailList from '@/components/mobile/information/DetailList';

export interface DetailListx {
    id: number;
    header: string;
    detail: string;
    lastupdate: string;
    image: string[];
}

const DetailInfor = () => {
    const router = useRouter()
    const searchParams = useSearchParams();
    const [header, setHeader] = useState<string | null>(null);
    const [dataDetail, setDataDetail] = useState<DetailListx | null>(null);

    useEffect(() => {
        const fetchDetail = async () => {
            const paramId = searchParams.get('id');
            if (paramId) {
                try {
                    const id = parseInt(paramId);
                    const apicall = process.env.NEXT_PUBLIC_CALLAPI as string;
                    const response = await axios.get<DetailListx>(`${apicall}information/task/${id}`);
                    setHeader(response.data.header);
                    setDataDetail(response.data);
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            }
        };

        fetchDetail();
    }, [searchParams]);

    return (
        <div className='min-h-screen'>
            <div className='z-10 fixed top-0 left-0 right-0 py-2 bg-[#AF88FF] flex justify-center items-center h-12'>
                <div className="flex w-full items-center px-4">
                    <button className='text-white' onClick={() => router.back()}>
                        {/* &lt; */}
                        <Image
                            src={`/image/icon_back_mobile.png`}
                            alt="logo"
                            width={30}
                            height={30}
                        />
                    </button>
                    <div className="flex-1 flex justify-center">
                        <h2 className='w-48 text-white font-bold text-center overflow-hidden whitespace-nowrap text-ellipsis flex-shrink-0'>{header}</h2>
                    </div>
                </div>
            </div>
            <div className='pt-16'>
                {/* <DetailList items={dataDetail}/> */}
                {dataDetail && <DetailList items={dataDetail} />}
            </div>
        </div>
    )
}

export default DetailInfor

