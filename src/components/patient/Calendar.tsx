import React, { useState } from 'react';
import moment from 'moment';
import 'moment/locale/th';
import Image from 'next/image';

moment.locale('th');

const Calendar = () => {
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
        const dayNames = moment.weekdaysMin(true);
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

    return (
        <div className='pl-8 pt-5'>
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
            <div className="grid grid-cols-7">
                {days.map((week, i) => (
                    <div className="flex" key={i}>
                        {week.map((day, j) => (
                            <div
                                className={`text-center py-2 w-full border ${isSameMonth(day) ? '' : 'text-gray-400'}`}
                                key={j}
                            >
                                {day.format('D')}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Calendar;
