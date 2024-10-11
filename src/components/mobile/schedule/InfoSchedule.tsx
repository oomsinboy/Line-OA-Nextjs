import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import moment from 'moment';
import 'moment/locale/th';
import { propsItemSchedule } from './ScheduleComponents';

moment.locale('th');

interface InfoScheduleProps extends propsItemSchedule {
    selectedDate: string | null;
}

const InfoSchedule = ({ items, selectedDate }: InfoScheduleProps) => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    useEffect(() => {
        if (selectedDate && items) {
          const index = items.daily_details.findIndex(
            item => item.date_before_appointment === selectedDate
          );
          setOpenIndex(index !== -1 ? index : null);
        }
      }, [selectedDate, items]);

    const handleToggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const hasDatePassed = (date: string) => {
        return moment(date).isBefore(moment(), 'day');
    };

    const labels = [
        'วันลงทะเบียนนัดส่องกล้อง',
        'ข้อควรปฏิบัติ',
        'ข้อควรปฏิบัติ',
        'วันที่นัดส่องกล้อง',
    ];

    const renderSkeleton = () => (
        <div className="flex flex-col px-4">
            <div className="skeleton h-[74px] mb-2 w-full bg-gray-200"></div>
            <div className="skeleton h-[74px] mb-2 w-full bg-gray-200"></div>
            <div className="skeleton h-[74px] mb-2 w-full bg-gray-200"></div>
            <div className="skeleton h-[74px] mb-2 w-full bg-gray-200"></div>
        </div>
    );

    //1 ? 'min-h-[65vh]' : 'min-h-[50vh]'} ${openIndex === 0 || openIndex === 

    return (
        <div className={`${openIndex === 0 || openIndex === 1 ? 'min-h-[65vh]' : 'min-h-[50vh]'} pt-5 pb-1 rounded-t-3xl bg-[#F9F2FB]`}>
            <div className={`max-w-2xl mx-auto`}>
                <h3 className="text-xl font-bold mb-3 mx-5">รายการแจ้งเตือนทั้งหมด</h3>
                {items ? (
                    items?.daily_details.map((item, index) => {
                        const isPastDate = hasDatePassed(item.date_before_appointment);

                        const borderColor = index === 0 || index === items.daily_details.length - 1
                            ? (isPastDate ? 'border-gray-400' : 'border-[#AF88FF]')
                            : (isPastDate ? 'border-gray-400' : 'border-[#F5C725]');

                        const circleColor = index === 0 || index === items.daily_details.length - 1
                            ? (isPastDate ? 'bg-[#C3C3C3]' : 'bg-[#AF88FF]')
                            : (isPastDate ? 'bg-[#C3C3C3]' : 'bg-[#F5C725]');

                        const textColor = index === 0 || index === items.daily_details.length - 1
                            ? (isPastDate ? 'text-[#C3C3C3]' : 'text-[#AF88FF]')
                            : (isPastDate ? 'text-[#C3C3C3]' : 'text-[#F5C725]');

                        const textDate = isPastDate ? 'text-[#C3C3C3]' : '';

                        return (
                            <div key={index} className="mb-2 px-4">
                                <div
                                    className={`flex items-center justify-between cursor-pointer bg-white ${openIndex === index
                                        ? `${borderColor} border-t border-l border-r rounded-t-lg px-3 pt-3`
                                        : 'border rounded-lg p-3'
                                        } ${openIndex === index && isPastDate ? 'border-gray-400' : ''}`}
                                    onClick={() => handleToggle(index)}
                                >
                                    <div className="flex items-center">
                                        <div
                                            className={`w-4 h-4 rounded-full mr-2 ${circleColor}`}
                                        ></div>
                                        <div>
                                            <p className={`font-bold ${textColor}`}>
                                                {labels[index % labels.length]}
                                            </p>
                                            <p className={` ${textDate}`}>
                                                {moment(item.date_before_appointment).format('D MMMM YYYY')}
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        {openIndex === index ? (
                                            <Image
                                                className="gap-2"
                                                src="/image/icon_up.png"
                                                alt="icon up"
                                                width={30}
                                                height={30}
                                            />
                                        ) : (
                                            <Image
                                                className="gap-2"
                                                src="/image/icon_down.png"
                                                alt="icon down"
                                                width={30}
                                                height={30}
                                            />
                                        )}
                                    </div>
                                </div>
                                <div className={`transition-max-height duration-500 ease-in-out ${openIndex === index ? 'opacity-100' : 'max-h-0'} overflow-hidden`}>
                                    {openIndex === index && (
                                        <div className={`p-3 bg-white border-l border-r border-b rounded-b-lg ${borderColor}`}>
                                            <div className='border mb-3'></div>
                                            <div className={`break-words `} dangerouslySetInnerHTML={{ __html: item.noti_detail }} />
                                        </div>
                                    )}
                                </div>
                                {/* <div className={`transition-all duration-500 ease-in-out ${openIndex === index ? 'max-h-[700px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                                    <div className={`p-3 bg-white border-l border-r border-b rounded-b-lg ${borderColor}`}>
                                        <div className='border mb-3'></div>
                                        <div className={`break-words ${isPastDate ? 'text-[#C3C3C3]' : ''}`} dangerouslySetInnerHTML={{ __html: item.noti_detail }} />
                                    </div>
                                </div> */}
                            </div>
                        );
                    })
                ) : (
                    renderSkeleton()
                )}
            </div>
        </div>
    );
};

export default InfoSchedule;
