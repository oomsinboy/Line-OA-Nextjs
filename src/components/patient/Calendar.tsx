import React, { useState } from 'react';
import moment from 'moment';
import 'moment/locale/th';
import Image from 'next/image';
import ModalPatient from './ModalPatient';
import axios from 'axios';
import Swal from 'sweetalert2';
import dynamic from 'next/dynamic';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';
import { cleanHtmlContent } from '../help';

moment.locale('th');
import 'moment/locale/th';

interface CalendarProps {
    visit_id: number
    dailyDetail: any[];
    notilist: any[];
}

const Calendar = ({ visit_id, dailyDetail, notilist }: CalendarProps) => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [modalContent, setModalContent] = useState<any>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editedContent, setEditedContent] = useState<string>('');
    const [selectedNoti, setSelectedNoti] = useState<number>(0);

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

        setModalContent(detail);
        setEditedContent(detail.noti_detail || '');
        setShowModal(true);
    };

    const handleEditClickCalendar = () => {
        setIsEditing(true);
    };

    const handleSaveClickCalendar = async () => {

        const notiId = selectedNoti === 0 ? modalContent.noti_id : selectedNoti.toString();

        const formdata = new FormData();

        formdata.append('visit_id', visit_id.toString());
        formdata.append('noti_id', notiId);
        formdata.append('noti_detail', editedContent);

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_CALLAPI}daily_noti/task/${modalContent.daily_id}`, formdata);

            if (response.status === 200) {

                setIsEditing(false);
                Swal.fire({
                    title: 'สำเร็จ',
                    text: 'คุณได้การแก้ไขเรียบร้อยแล้ว',
                    icon: 'success',
                    confirmButtonText: 'ปิด',
                }).then(() => {
                    window.location.reload();
                });
            } else {
                Swal.fire({
                    title: 'ขออภัย',
                    text: "คุณทำรายการไม่ถูกต้อง กรุณาตรวจสอบใหม่อีกครั้ง",
                    icon: 'warning',
                    confirmButtonText: 'ปิด',
                    customClass: {
                        icon: 'custom-swal2-warning',
                    }
                });
            }
        } catch (error) {
            console.error('Error saving data:', error);

            Swal.fire({
                title: 'ขออภัย',
                text: "เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง",
                icon: 'error',
                confirmButtonText: 'ปิด',
                customClass: {
                    icon: 'custom-swal2-error',
                }
            });
        }
    }

    const handleCloseModal = () => {
        setShowModal(false);
        setIsEditing(false);
        setEditedContent(modalContent ? modalContent.noti_detail || '' : '');
    };

    const handleNotiChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = parseInt(e.target.value, 10);
        setSelectedNoti(selectedId);
        const selectedNotiDetail = notilist.find(noti => noti.id === selectedId);
        setEditedContent(selectedNotiDetail ? selectedNotiDetail.detail : '');
    };



    return (
        <div className='pl-8 pt-4 2xl:pt-10'>
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
                    {/* {currentMonth.format('MMMM YYYY')}  */}
                    {currentMonth.format('MMMM')} {currentMonth.year() + 543}
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
                    <div className="contents" key={i}>
                        {week.map((day, j) => {
                            const isLast = dailyDetail.some((detail, index) => {
                                const detailDate = moment(detail.date_before_appointment);
                                return detailDate.isSame(day, 'day') && index === dailyDetail.length - 1;
                            });
                            return (
                                <div
                                    className={`relative flex justify-end items-end text-center h-[88px] 2xl:h-24 p-2 w-full border ${isSameMonth(day) ? '' : 'text-gray-400'}`}
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

            <ModalPatient isVisible={showModal} onClose={handleCloseModal} title="รายละเอียดการแจ้งเตือน">
                {modalContent && (
                    <div className='p-5'>
                        <div className='text-xl 2xl:text-2xl text-[#5955B3] font-semibold'>แจ้งเตือนคุณ {modalContent.ptname}</div>
                        <div className='text-xl 2xl:text-2xl text-[#5955B3] font-semibold'>วันที่ {moment(modalContent.date_before_appointment).format('DD-MM-') + (moment(modalContent.date_before_appointment).year() + 543)}</div>
                        <div className={`rounded ${isEditing ? 'bg-white py-2' : ' bg-[#E8DBF5] p-3'}  min-h-[48dvh]  2xl:mt-2 text-xl mb-16`}>
                            {isEditing ? (
                                <>
                                    <select
                                        className="w-full mb-4 p-2 border rounded"
                                        value={selectedNoti}
                                        onChange={handleNotiChange}
                                    >
                                        <option value={0} disabled>เลือกการแจ้งเตือน</option>
                                        {notilist.map((noti) => (
                                            <option key={noti.id} value={noti.id}>{noti.header}</option>
                                        ))}
                                    </select>
                                    <ReactQuill
                                        className="h-[280px] 2xl:h-[360px]"
                                        value={editedContent}
                                        onChange={(content) => setEditedContent(content)}
                                        theme="snow"
                                    />
                                </>
                            ) : (
                                <>
                                    <span className='my-2'>ข้อควรปฏิบัติก่อนรับการตรวจส่องกล้องลำไส้ใหญ่</span>
                                    <div className='break-words max-h-[460px]' dangerouslySetInnerHTML={{ __html: cleanHtmlContent(modalContent.noti_detail) || '' }} />
                                </>
                            )}
                        </div>
                        {
                            // !moment(modalContent.date_before_appointment).isBefore(moment(), 'day') && (
                            modalContent && modalContent.date_before_appointment !== dailyDetail[0].date_before_appointment && !moment(modalContent.date_before_appointment).isBefore(moment(), 'day') && (
                                <div className="flex justify-center mt-4">
                                    <button
                                        onClick={isEditing ? handleSaveClickCalendar : handleEditClickCalendar}
                                        className={`relative text-white w-38 font-light btn btn-active mx-4 ${isEditing ? 'bg-[#693092]' : 'bg-[#AF88FF]'}`}
                                    >
                                        <Image
                                            className='gap-2'
                                            src={isEditing ? `/image/icon_save.png` : `/image/icon_edit.png`}
                                            alt="logo"
                                            width={30}
                                            height={30}
                                        />
                                        <span>{isEditing ? 'Save' : 'Edit'}</span>
                                    </button>
                                </div>
                            )}
                    </div>
                )}
            </ModalPatient>
        </div>
    );
};

export default Calendar;
