import React, { useState } from 'react';
import moment from 'moment';
import 'moment/locale/th';
import Image from 'next/image';
import ModalPatient from './ModalPatient';

moment.locale('th');

interface CalendarProps {
    dailyDetail: any[];
}

const Calendar = ({ dailyDetail }: CalendarProps) => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [modalContent, setModalContent] = useState<any>(null);

    const [currentMonth, setCurrentMonth] = useState(moment());
    const startDay = currentMonth.clone().startOf('month').startOf('week');
    const endDay = currentMonth.clone().endOf('month').endOf('week');
    const date = startDay.clone().subtract(1, 'day');
    const days: moment.Moment[][] = [];

    while (date.isBefore(endDay, 'day')) {
        days.push(
            Array(7)
                .fill(0)
                .map(() => date.add(1, 'day').clone())
        );
    }

    const nextMonth = () => {
        setCurrentMonth(currentMonth.clone().add(1, 'month'));
    };

    const prevMonth = () => {
        setCurrentMonth(currentMonth.clone().subtract(1, 'month'));
    };

    const isSameMonth = (day: any) => {
        return day.isSame(currentMonth, 'month');
    };

    const renderDays = () => {
        // const dayNames = moment.weekdaysMin(true);
        const dayNames = moment.weekdays(true);
        return (
            <div className="grid grid-cols-7 bg-[#B498F0] text-white rounded mt-4">
                {dayNames.map((day) => (
                    <div className="text-center py-2" key={day}>
                        {day}
                    </div>
                ))}
            </div>
        );
    };

    const handleButtonClick = (detail: any) => {

        console.log(detail);

        setModalContent(detail);
        setShowModal(true);
    };

    return (
        <div className='pl-8 pt-10'>
            <div className="flex justify-between items-center ">
                <button onClick={prevMonth}>
                    {/* &lt; */}
                    <Image
                        src={`/image/icon_left.png`}
                        alt="logo"
                        width={15}
                        height={15}
                    />
                </button>
                <span className="text-lg font-semibold text-[#BE77F1]">
                    {currentMonth.format('MMMM YYYY')}
                </span>
                <button onClick={nextMonth}>
                    {/* &gt; */}
                    <Image
                        src={`/image/icon_right.png`}
                        alt="logo"
                        width={15}
                        height={15}
                    />
                </button>
            </div>
            {renderDays()}
            {/* <div className="grid grid-cols-7">
                {days.map((week, i) => (
                    <div className="contents" key={i}>
                        {week.map((day, j) => (
                            <div
                                className={`relative flex justify-end items-end text-center h-24 p-2 w-full border ${isSameMonth(day) ? '' : 'text-gray-400'}`}
                                key={j}
                            >
                                {dailyDetail.map((detail, index) => {
                                    const detailDate = moment(detail.date_before_appointment);
                                    if (detailDate.isSame(day, 'day')) {
                                        const isFirst = index === 0;
                                        const isLast = index === dailyDetail.length - 1;
                                        const isPast = day.isSameOrBefore(moment(), 'day');
                                        const lastDayBgColor = isPast ? 'bg-[#AEB2B5]' : 'bg-[#BE77F1]';

                                        return (
                                            <div key={detail.date_before_appointment}>
                                                {isFirst && (
                                                    <div className=" w-[calc(100%-8px)] absolute top-1 left-1 text-white bg-[#BE77F1] p-1 rounded">
                                                        ลงทะเบียน
                                                    </div>
                                                )}
                                                {isLast ? (
                                                    <div className={`h-[calc(100%-8px)] w-[calc(100%-8px)] absolute top-1 left-1 text-center text-white p-1 rounded ${lastDayBgColor}`}>
                                                        ส่องกล้อง
                                                    </div>
                                                ) : (
                                                    <button
                                                        className={`absolute bottom-2 left-2 rounded text-white w-7 h-7 font-light flex justify-center items-center ${isPast ? 'bg-[#AEB2B5] hover:bg-[#e5e7eb]' : 'bg-[#705396] hover:bg-[#BE77F1]'}`}
                                                    >
                                                        <Image
                                                            className='gap-2'
                                                            src={isPast ? `/image/icon_edit_pass.png` : `/image/icon_edit.png`}
                                                            alt="logo"
                                                            width={20}
                                                            height={20}
                                                        />
                                                    </button>
                                                )}
                                            </div>
                                        );
                                    }
                                    return null;
                                })}
                                <div className="absolute bottom-2 right-3">
                                    {day.format('D')}
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div> */}
            <div className="grid grid-cols-7">
                {days.map((week, i) => (
                    <div className="contents" key={i}>
                        {week.map((day, j) => {
                            const isLast = dailyDetail.some((detail, index) => {
                                const detailDate = moment(detail.date_before_appointment);
                                return detailDate.isSame(day, 'day') && index === dailyDetail.length - 1;
                            });
                            return (
                                <div
                                    className={`relative flex justify-end items-end text-center h-24 p-2 w-full border ${isSameMonth(day) ? '' : 'text-gray-400'}`}
                                    key={j}
                                >
                                    {dailyDetail.map((detail, index) => {
                                        const detailDate = moment(detail.date_before_appointment);
                                        if (detailDate.isSame(day, 'day')) {
                                            const isFirst = index === 0;
                                            const isToday = moment().isSame(day, 'day');
                                            const isPast = day.isBefore(moment(), 'day');
                                            const lastDayBgColor = (isToday || !isPast) ? 'bg-[#BE77F1]' : 'bg-[#AEB2B5]';

                                            return (
                                                <div key={detail.date_before_appointment}>
                                                    {isFirst && (
                                                        <div className="w-[calc(100%-8px)] absolute top-1 left-1 text-white bg-[#BE77F1] p-1 rounded">
                                                            ลงทะเบียน
                                                        </div>
                                                    )}
                                                    {index === dailyDetail.length - 1 ? (
                                                        <div className={`h-[calc(100%-8px)] w-[calc(100%-8px)] absolute top-1 left-1 text-center text-white p-1 rounded ${lastDayBgColor}`}>
                                                            ส่องกล้อง
                                                        </div>
                                                    ) : (
                                                        // <button
                                                        //     className={`absolute bottom-2 left-2 rounded text-white w-7 h-7 font-light flex justify-center items-center ${isToday || !isPast ? 'bg-[#705396] hover:bg-[#BE77F1]' : 'bg-[#AEB2B5] hover:bg-[#e5e7eb]'}`}
                                                        // >
                                                        //     <Image
                                                        //         className='gap-2'
                                                        //         src={isToday || !isPast ? `/image/icon_edit.png` : `/image/icon_edit_pass.png`}
                                                        //         alt="logo"
                                                        //         width={20}
                                                        //         height={20}
                                                        //     />
                                                        // </button>
                                                        <button
                                                            className={`absolute bottom-2 left-2 rounded text-white w-7 h-7 font-light flex justify-center items-center ${isFirst ? 'bg-[#AEB2B5] hover:bg-[#e5e7eb]' : isToday || !isPast ? 'bg-[#705396] hover:bg-[#BE77F1]' : 'bg-[#AEB2B5] hover:bg-[#e5e7eb]'}`}
                                                            onClick={() => handleButtonClick(detail)}
                                                        >
                                                            <Image
                                                                className='gap-2'
                                                                src={isFirst ? `/image/icon_edit_pass.png` : isToday || !isPast ? `/image/icon_edit.png` : `/image/icon_edit_pass.png`}
                                                                alt="logo"
                                                                width={20}
                                                                height={20}
                                                            />
                                                        </button>
                                                    )}
                                                </div>
                                            );
                                        }
                                        return null;
                                    })}
                                    <div className={`absolute bottom-2 right-3 ${isLast ? 'text-white' : ''}`}>
                                        {day.format('D')}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>

            <ModalPatient isVisible={showModal} onClose={() => setShowModal(false)} title="รายละเอียดการแจ้งเตือน">
                {modalContent && (
                    <div className='p-5'>
                        <div className='text-2xl text-[#5955B3] font-semibold'>แจ้งเตือนคุณ {modalContent.ptname}</div>
                        <div className='text-2xl text-[#5955B3] font-semibold'>วันที่ {modalContent.date_before_appointment}</div>
                        <div className='rounded bg-[#E8DBF5] min-h-[48dvh] p-3 mt-4 text-xl'>
                            <span className='my-2'>ข้อควรปฏิบัติก่อนรับการตรวจส่องกล้องลำไส้ใหญ่</span>
                            <div className='break-words max-h-[460px] ' dangerouslySetInnerHTML={{ __html: modalContent.noti_detail || '' }} />
                        </div>
                        {/* <p><strong>วันที่ก่อนนัด:</strong> {modalContent.date_before_appointment}</p>
                        <div dangerouslySetInnerHTML={{ __html: modalContent.noti_detail }} />
                        <div className="mt-4">
                            {modalContent.noti_image && modalContent.noti_image.map((image: string, idx: number) => (
                                <Image
                                    key={idx}
                                    src={image}
                                    width={80}
                                    height={80}
                                    alt={`notification image ${idx}`}
                                    className='max-w-[80px] h-[80px] object-cover rounded-lg mr-3'
                                />
                            ))}
                        </div> */}
                    </div>
                )}
            </ModalPatient>
        </div>
    );
};

export default Calendar;
