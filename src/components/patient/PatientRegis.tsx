import React, { useState } from 'react'
import Image from 'next/image';
import Calendar from './Calendar';
import { PatientStateOTP } from '../type';
import { formatDate } from '../help';
import axios from 'axios';

const PatientRegis = ({ items }: PatientStateOTP) => {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [lineName, setLineName] = useState<string>(items.patient.line_name);

    const date = items.patient.appointment_date.split('T')[0];

    const datetimeLocal = `${date}T${items.patient.appointment_time}`;

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = () => {

        setIsEditing(false);
    };

    const handleRefreshLineName = async () => {

        // const params = {
        //     visit_id: items.patient.visit_id,
        //     userId: items.patient.line_id,
        // };

        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_CALLAPI}visit/line/renew`, {
                params: {
                    visit_id: items.patient.visit_id,
                    userId: items.patient.line_id,
                },
            }
            );

            console.log(`${process.env.NEXT_PUBLIC_CALLAPI}visit/line/renew`);


            if (response.status === 200) {
                setLineName(response.data.line_name);
                console.log('Data refreshed successfully:', response.data);
            } else {
                console.error('Failed to refresh data');
            }
        } catch (error) {
            console.error('Error while refreshing data:', error);
        }

    };

    console.log(items.patient);



    return (
        <div className='px-8'>
            <div className='h-full w-full rounded-[15px] bg-white p-5 '>
                <div className='min-h-[81.71dvh] flex flex-col'>
                    <div className='flex justify-between'>
                        <div>
                            <div className='text-2xl text-[#5955B3] font-semibold'>ลงทะเบียนผู้ป่วย</div>
                        </div>
                        <div className='flex'>
                            <button
                                onClick={isEditing ? handleSaveClick : handleEditClick}
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
                    </div>
                    <div className='flex'>
                        <div className=' w-[55%]'>
                            <form action="">
                                <div className='flex justify-between'>
                                    <div className="w-1/2 pr-4">
                                        <div className='my-2'>
                                            <span className='text-[#705396]'>ชื่อ</span>
                                            <label className="input input-bordered flex items-center gap-2 w-full">
                                                <input
                                                    type="text"
                                                    className="grow text-[#705396]"
                                                    defaultValue={items.patient.patient_fname}
                                                    readOnly={!isEditing}
                                                // value={firstname}
                                                // onChange={(e) => setFirstname(e.target.value)}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                    <div className="w-1/2 pl-4">
                                        <div className='my-2'>
                                            <span className='text-[#705396] '>นามสกุล</span>
                                            <label className="input input-bordered flex items-center gap-2 w-full">
                                                <input
                                                    type="text"
                                                    className="grow text-[#705396]"
                                                    defaultValue={items.patient.patient_lname}
                                                    readOnly={!isEditing}
                                                // value={lastname}
                                                // onChange={(e) => setLastname(e.target.value)}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className='flex justify-between'>
                                    <div className="w-1/2 pr-4">
                                        <div className='my-2'>
                                            <span className='text-[#705396]'>เลขที่บัตรประจำตัวประชาชน</span>
                                            <label className="input input-bordered flex items-center gap-2 w-full">
                                                <input
                                                    type="text"
                                                    className="grow text-[#705396]"
                                                    // value={idcard}
                                                    maxLength={13}
                                                    pattern="\d{13}"
                                                    defaultValue={items.patient.id_card}
                                                    readOnly={!isEditing}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                    <div className="w-1/2 pl-4">
                                        <div className='my-2'>
                                            <span className='text-[#705396]'>วันเดือนปีเกิด</span>
                                            <label className="input input-bordered flex items-center gap-2 w-full">
                                                <input
                                                    type="date"
                                                    className="grow text-[#705396]"
                                                    // value={dob}
                                                    defaultValue={items.patient.dob}
                                                    readOnly={!isEditing}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className='flex justify-between'>
                                    <div className="w-1/2 pr-4">
                                        <div className='my-2'>
                                            <span className='text-[#705396]'>วันที่ลงทะเบียน</span>
                                            <label className=" bg-[#F8F5FB] input input-bordered flex items-center gap-2 w-full">
                                                <input
                                                    type="text"
                                                    className="grow pointer-events-none text-[#705396]"
                                                    // value={register_time}
                                                    // readOnly
                                                    defaultValue={formatDate(items.patient.register_date)}
                                                    readOnly={!isEditing}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                    <div className="w-1/2 pl-4">
                                        <div className='my-2'>
                                            <span className='text-[#705396]'>วันนัดหมาย</span>
                                            <label className="input input-bordered flex items-center gap-2 w-full">
                                                <input
                                                    type="datetime-local"
                                                    className="grow text-[#705396]"
                                                    defaultValue={datetimeLocal}
                                                    readOnly={!isEditing}
                                                // value={datetimeLocal}
                                                // readOnly
                                                />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </form>
                            <div className='my-2 w-1/2 pr-4'>
                                <div className='flex'>
                                    <span className='text-[#705396]'>เลือกยาที่ควรหยุดรับประทาน</span>
                                </div>
                                <div className='rounded bg-[#E8DBF5] min-h-[48dvh] p-3'>
                                    {/* <span className='text-[#705396]'> รายการที่เลือก {med.length} รายการ</span> */}
                                    <div className='max-h-[45dvh] overflow-y-auto'>
                                        {/* {med.map((medication: any, index: number) => (
                                    <div key={index} className='flex justify-between pt-2'>
                                        <select
                                            className='w-[70%] mx-1 h-[3rem] rounded bg-[#F8F5FB] text-center text-[#705396]'
                                            defaultValue={medication.medic}
                                            disabled
                                        >
                                            <option value={medication.medic}>{medication.medic}</option>
                                        </select>
                                        <select
                                            className='w-[20%] mx-1 h-[3rem] rounded text-center text-[#705396]'
                                            defaultValue={medication.val}
                                            disabled
                                        >
                                            <option value={medication.val}>{medication.val} วัน</option>
                                        </select>
                                    </div>
                                ))} */}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className=' w-[45%]'>
                            <div className='flex pl-8'>
                                <div className="w-[63.016%] ">
                                    <div className='my-2'>
                                        <span className='text-[#705396] '>Line Username</span>
                                        <label className="relative input input-bordered flex items-center gap-2 w-full">
                                            <input
                                                type="text"
                                                className="grow text-[#705396]"
                                                value={lineName}
                                                readOnly
                                            />
                                        </label>
                                    </div>
                                </div>
                                <div className='flex items-center pt-6'>
                                    <button onClick={handleRefreshLineName} className="relative text-white font-light bg-[#693092] btn btn-active mx-3">
                                        <Image
                                            src={`/image/icon_refresh.png`}
                                            alt="logo"
                                            width={30}
                                            height={30}
                                        />
                                    </button>
                                </div>
                            </div>
                            <Calendar dailyDetail={items.daily_detail} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PatientRegis