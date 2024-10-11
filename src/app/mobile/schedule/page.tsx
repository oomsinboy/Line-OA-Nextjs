'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import axios from 'axios';
import ScheduleComponents from '@/components/mobile/schedule/ScheduleComponents';

interface DailyDetail {
    date_before_appointment: string;
    noti_detail: string;
}

export interface ItemSchedule {
    patient_name: string;
    daily_details: DailyDetail[];
}

const Schedulemain = () => {
    const searchParams = useSearchParams()
    const [dataSchedule, setDataSchedule] = useState<ItemSchedule | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const userId = searchParams.get('userId');
        if (userId) {
            const fetchData = async () => {
                try {
                    const response = await axios.get(`${process.env.NEXT_PUBLIC_CALLAPI}user/appointments?userId=${userId}`);
                    setDataSchedule(response.data);
                } catch (err) {
                    setError('Error fetching data');
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        } else {
            setLoading(false);
        }
    }, [searchParams]);

    return (
        <div className='min-h-screen'>
            <div className='z-10 fixed top-0 left-0 right-0 py-2 bg-[#AF88FF] flex justify-center items-center h-12'>
                <div className='text-white text-center'>
                    <span>กำหนดการของฉัน (Schedule)</span>
                </div>
            </div>
            <div className='pt-16'>
                <ScheduleComponents items={dataSchedule}/>
            </div>
        </div>
    )
}

export default Schedulemain
