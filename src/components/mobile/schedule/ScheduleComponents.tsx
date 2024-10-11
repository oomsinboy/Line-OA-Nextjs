import { ItemSchedule } from '@/app/mobile/schedule/page'
import React, { useRef, useState } from 'react'
import ScheduleCalendar from './ScheduleCalendar';
import InfoSchedule from './InfoSchedule';

export interface propsItemSchedule {
    items: ItemSchedule | null;
}

const ScheduleComponents = ({ items }: propsItemSchedule) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const infoScheduleRef = useRef<HTMLDivElement>(null);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setTimeout(() => {
        infoScheduleRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100); // หน่วงเวลานิดหน่อยเพื่อให้ content ถูก render ก่อน
  };
    
  return (
    <div>
      <ScheduleCalendar items={items} selectedDate={selectedDate} onDateSelect={handleDateSelect}/>
      <div ref={infoScheduleRef}>
        <InfoSchedule items={items} selectedDate={selectedDate} />
      </div>
      {/* <InfoSchedule items={items} selectedDate={selectedDate} /> */}
    </div>
  )
}

export default ScheduleComponents
