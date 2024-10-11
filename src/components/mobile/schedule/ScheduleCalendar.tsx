// import React, { useState } from 'react'
// import { propsItemSchedule } from './ScheduleComponents'
// import Image from 'next/image';
// import moment from 'moment';
// import 'moment/locale/th';
// import { useSwipeable } from 'react-swipeable';

// moment.locale('th');

// interface ScheduleCalendarProps extends propsItemSchedule {
//     selectedDate: string | null;
//     onDateSelect: (date: string) => void;
// }

// const ScheduleCalendar = ({ items, selectedDate, onDateSelect }: ScheduleCalendarProps) => {
//     const [currentDate, setCurrentDate] = useState(moment());

//     const handlers = useSwipeable({
//         onSwipedLeft: () => setCurrentDate(prevDate => prevDate.clone().add(1, 'months')),
//         onSwipedRight: () => setCurrentDate(prevDate => prevDate.clone().subtract(1, 'months')),
//         //   preventDefaultTouchmoveEvent: true,
//         trackMouse: true,
//     });

//     const nextMonth = () => {
//         setCurrentDate(currentDate.clone().add(1, 'month'));
//     };

//     const prevMonth = () => {
//         setCurrentDate(currentDate.clone().subtract(1, 'month'));
//     };

//     // Function to generate dates in the calendar
//     const generateCalendarDates = () => {
//         const daysInMonth = currentDate.daysInMonth();
//         const firstDayOfWeek = currentDate.startOf('month').day();
//         const lastDayOfPreviousMonth = currentDate.clone().subtract(1, 'months').endOf('month').date();
//         const dates = [];

//         // Fill in the last days of the previous month
//         for (let i = firstDayOfWeek - 1; i >= 0; i--) {
//             dates.push({
//                 day: lastDayOfPreviousMonth - i,
//                 isCurrentMonth: false,
//             });
//         }

//         // Fill in the current month's days
//         for (let i = 1; i <= daysInMonth; i++) {
//             dates.push({
//                 day: i,
//                 isCurrentMonth: true,
//             });
//         }

//         return dates;
//     };

//     const dates = generateCalendarDates();

//     // Determine styles based on the notifications
//     const getDateStyle = (day: number) => {
//         if (!items) return '';

//         const dateString = currentDate.clone().date(day).format('YYYY-MM-DD');
//         const notificationIndex = items.daily_details.findIndex(
//             item => item.date_before_appointment === dateString
//         );

//         if (notificationIndex === -1) return '';

//         const isFirst = notificationIndex === 0;
//         const isLast = notificationIndex === items.daily_details.length - 1;
//         const isBetween = notificationIndex > 0 && notificationIndex < items.daily_details.length - 1;
//         const isPast = moment().isAfter(moment(dateString), 'day');

//         if (isPast) return 'bg-[#C3C3C3] text-gray-500';
//         if (isFirst || isLast) return 'bg-[#AF88FF] text-white';
//         if (isBetween) return 'bg-[#F5C725] text-white';

//         return '';
//     };


//     return (
//         <div >
//             <p className='mx-5 text-xl font-bold'>รายการที่ต้องปฏิบัติ</p>
//             <div {...handlers}>
//                 <div className="w-full max-w-md mx-auto bg-white p-4 rounded-lg ">
//                     <div className="flex justify-between items-center mb-4">
//                         <button onClick={prevMonth}>
//                             <Image
//                                 src={`/image/icon_left.png`}
//                                 alt="logo"
//                                 width={15}
//                                 height={15}
//                             />
//                         </button>
//                         <span className="text-xl font-bold text-[#AF88FF] ">
//                             {currentDate.format('MMMM YYYY')}
//                         </span>
//                         <button onClick={nextMonth}>
//                             <Image
//                                 src={`/image/icon_right.png`}
//                                 alt="logo"
//                                 width={15}
//                                 height={15}
//                             />
//                         </button>
//                     </div>
//                     <div className="grid grid-cols-7 gap-2">
//                         {['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'].map((day, index) => (
//                             <div key={index} className="text-center font-medium">{day}</div>
//                         ))}
//                         {dates.map((date, index) => (
//                             <div
//                                 key={index}
//                                 className={`relative p-2 rounded-full h-12 flex flex-col items-center justify-center ${date.isCurrentMonth ? getDateStyle(date.day) : 'text-gray-400'
//                                     }`}
//                                 onClick={() => {
//                                     if (date.isCurrentMonth) {
//                                         const dateString = currentDate.clone().date(date.day).format('YYYY-MM-DD');
//                                         onDateSelect(dateString);
//                                     }
//                                 }}
//                             >
//                                 <div>{date.day}</div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default ScheduleCalendar

"use client"

import React, { useState } from 'react';
import { propsItemSchedule } from './ScheduleComponents';
import Image from 'next/image';
import moment from 'moment';
import 'moment/locale/th';
import { useSwipeable } from 'react-swipeable';

moment.locale('th');

interface ScheduleCalendarProps extends propsItemSchedule {
    selectedDate: string | null;
    onDateSelect: (date: string) => void;
}

const ScheduleCalendar = ({ items, selectedDate, onDateSelect }: ScheduleCalendarProps) => {
    const [currentDate, setCurrentDate] = useState(moment());
    const [transitionDirection, setTransitionDirection] = useState('');

    const handlers = useSwipeable({
        onSwipedLeft: () => changeMonth('next'),
        onSwipedRight: () => changeMonth('prev'),
        trackMouse: true,
    });

    const changeMonth = (direction: 'next' | 'prev') => {
        setTransitionDirection(direction);
        setTimeout(() => {
            setCurrentDate(prevDate =>
                direction === 'next' ? prevDate.clone().add(1, 'months') : prevDate.clone().subtract(1, 'months')
            );
            setTransitionDirection('');
        }, 300);
    };

    const generateCalendarDates = () => {
        const daysInMonth = currentDate.daysInMonth();
        const firstDayOfWeek = currentDate.startOf('month').day();
        const lastDayOfPreviousMonth = currentDate.clone().subtract(1, 'months').endOf('month').date();
        const dates = [];

        for (let i = firstDayOfWeek - 1; i >= 0; i--) {
            dates.push({
                day: lastDayOfPreviousMonth - i,
                isCurrentMonth: false,
            });
        }

        for (let i = 1; i <= daysInMonth; i++) {
            dates.push({
                day: i,
                isCurrentMonth: true,
            });
        }

        return dates;
    };

    const dates = generateCalendarDates();

    const getDateStyle = (day: number) => {
        if (!items) return '';

        const dateString = currentDate.clone().date(day).format('YYYY-MM-DD');
        const notificationIndex = items.daily_details.findIndex(
            item => item.date_before_appointment === dateString
        );

        if (notificationIndex === -1) return '';

        const isFirst = notificationIndex === 0;
        const isLast = notificationIndex === items.daily_details.length - 1;
        const isBetween = notificationIndex > 0 && notificationIndex < items.daily_details.length - 1;
        const isPast = moment().isAfter(moment(dateString), 'day');

        if (isPast) return 'bg-[#C3C3C3] text-gray-500';
        if (isFirst || isLast) return 'bg-[#AF88FF] text-white';
        if (isBetween) return 'bg-[#F5C725] text-white';

        return '';
    };

    return (
        <div>
            <p className='mx-5 text-xl font-bold'>รายการที่ต้องปฏิบัติ</p>
            <div {...handlers}>
                <div className="w-full max-w-md mx-auto bg-white p-4 rounded-lg overflow-hidden">
                    <div className="flex justify-between items-center mb-4">
                        <button onClick={() => changeMonth('prev')}>
                            <Image
                                src={`/image/icon_left.png`}
                                alt="logo"
                                width={15}
                                height={15}
                            />
                        </button>
                        <span className="text-xl font-bold text-[#AF88FF] ">
                            {currentDate.format('MMMM YYYY')}
                        </span>
                        <button onClick={() => changeMonth('next')}>
                            <Image
                                src={`/image/icon_right.png`}
                                alt="logo"
                                width={15}
                                height={15}
                            />
                        </button>
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                        {['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'].map((day, index) => (
                            <div key={index} className="text-center font-medium">{day}</div>
                        ))}
                    </div>
                    <div className="relative">
                        <div className={`grid grid-cols-7 gap-2 transition-transform duration-300 ${transitionDirection === 'next' ? 'transform -translate-x-full' : transitionDirection === 'prev' ? 'transform translate-x-full' : ''}`}>
                            {dates.map((date, index) => (
                                <div
                                    key={index}
                                    className={`relative p-2 rounded-full h-12 flex flex-col items-center justify-center ${date.isCurrentMonth ? getDateStyle(date.day) : 'text-gray-400'}`}
                                    onClick={() => {
                                        if (date.isCurrentMonth) {
                                            const dateString = currentDate.clone().date(date.day).format('YYYY-MM-DD');
                                            onDateSelect(dateString);
                                        }
                                    }}
                                >
                                    <div>{date.day}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ScheduleCalendar;

