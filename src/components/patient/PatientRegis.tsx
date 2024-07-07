import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import Calendar from './Calendar';
import { MedicalList, PatientStateOTP } from '../type';
import { formatDate } from '../help';
import axios from 'axios';
import Swal from 'sweetalert2';
import moment from 'moment';
import 'moment/locale/th';

moment.locale('th');

const PatientRegis = ({ items }: PatientStateOTP) => {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [firstname, setFirstname] = useState<string>(items.patient.patient_fname);
    const [lastname, setLastname] = useState<string>(items.patient.patient_lname);
    const [idCard, setIdCard] = useState<string>(items.patient.id_card);
    const [birthDate, setBirthDate] = useState<string>(items.patient.dob);
    const [appointmentDate, setAppointmentDate] = useState<string>(`${items.patient.appointment_date.split('T')[0]}T${items.patient.appointment_time}`);
    const [lineName, setLineName] = useState<string>(items.patient.line_name);
    const [medications, setMedications] = useState<{ id: number; name: string; dose: string; isOther: boolean }[]>([]);
    const [medicalList, setMedicalList] = useState<MedicalList[]>([]);
    const [otherMedications, setOtherMedications] = useState<{ [key: number]: string }>({});
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [errorMed, setErrorMed] = useState<string>('');
    const [response, setResponse] = useState<any>(null);

    useEffect(() => {

        const fetchMedicalData = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_CALLAPI}medical`);
                setMedicalList(response.data);

                // // After fetching medical data, initialize medications based on items.patient.med if available
                // if (items.patient.med) {
                //     const initialMedications = items.patient.med.map((medication: any) => ({
                //         id: medication.id,
                //         name: medication.medic,
                //         dose: medication.val,
                //         isOther: false, // Assuming isOther should be false initially
                //     }));
                //     setMedications(initialMedications);
                // }
            } catch (error) {
                console.error('Error fetching medical data:', error);
            }
        };

        fetchMedicalData();

        if (items.patient.med) {
            const initialMedications = items.patient.med.map((medication: any, index) => ({
                id: index,
                name: medication.medic,
                dose: medication.val,
                isOther: false,
            }));
            setMedications(initialMedications);
        }
    }, [items.patient.med]);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = async () => {

        const invalidMed = medications.some(medication => !medication.name || !medication.dose);

        if (invalidMed) {
            setErrorMed('กรุณากรอกข้อมูลยาและจำนวนวันที่รับประทานให้ครบถ้วน');
            return;
        } else {
            setErrorMed('');
        }
        const newErrors: { [key: string]: string } = {};

        if (!firstname.trim()) newErrors.firstname = 'กรุณากรอกชื่อ';
        if (!lastname.trim()) newErrors.lastname = 'กรุณากรอกนามสกุล';
        if (!idCard.trim()) {
            newErrors.idCard = 'กรุณากรอกบัตรประจำตัวประชาชน';
        } else if (idCard.trim().length !== 13) {
            newErrors.idCard = 'กรุณากรอกบัตรประจำตัวประชาชนให้ถูกต้อง (13 หลัก)';
        }
        if (!birthDate.trim()) newErrors.birthDate = 'กรุณากรอกวันเดือนปีเกิด';
        if (!appointmentDate.trim()) newErrors.appointmentDate = 'กรุณากรอกวันนัดหมาย';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        } else {
            setErrors({});
        }

        await sendEditform();

    };

    const addMedication = () => {
        setMedications([...medications, { id: Date.now(), name: '', dose: '', isOther: false }]);
    };

    const removeMedication = (id: number) => {
        setMedications(medications.filter(medication => medication.id !== id));
    };
    const handleMedicationNameChange = (e: React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement>, id: number) => {
        const value = e.target.value;
        // const selectedMedications = medications.map(medication => {
        //     if (medication.id === id) {
        //         return { ...medication, name: value, isOther: value === 'other' };
        //     }
        //     return medication;
        // });
        // setMedications(selectedMedications);

        const isDuplicate = medications.some(medication => medication.name === value && medication.id !== id && value !== 'other');

        if (!isDuplicate) {
            const selectedMedications = medications.map(medication => {
                if (medication.id === id) {
                    const isOther = value === 'other' || !medicalList.some(medical => medical.name === value);
                    return { ...medication, name: value, isOther };
                }
                return medication;
            });
            setMedications(selectedMedications);
        } else {
            // alert('ชื่อยานี้ถูกเลือกแล้ว');
            Swal.fire({
                title: 'ขออภัย',
                text: "รายการยานี้ถูกเลือกแล้ว",
                icon: 'error',
                confirmButtonText: 'ปิด',
                customClass: {
                    icon: 'custom-swal2-error',
                }
            });
        }
    };

    const handleOtherMedicationChange = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
        const updatedOtherMedications = { ...otherMedications, [id]: e.target.value };
        setOtherMedications(updatedOtherMedications);
        const selectedMedications = medications.map(medication => {
            if (medication.id === id) {
                return { ...medication, name: e.target.value };
            }
            return medication;
        });
        setMedications(selectedMedications);
    };

    const handleMedicationDoseChange = (e: React.ChangeEvent<HTMLSelectElement>, id: number) => {
        const selectedMedications = medications.map(medication => {
            if (medication.id === id) {
                return { ...medication, dose: e.target.value };
            }
            return medication;
        });
        setMedications(selectedMedications);
    };

    const handleRefreshLineName = async () => {

        const jsonform = {
            visit_id: items.patient.visit_id,
            userId: items.patient.line_id,
        };

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_CALLAPI}visit/line/renew`, jsonform);

            if (response.status === 200) {
                setLineName(response.data.line_name);
                // console.log('Data refreshed successfully:', response.data);
            } else {
                console.error('Failed to refresh data');
            }
        } catch (error) {
            console.error('Error while refreshing data:', error);
        }

    };

    const sendEditform = async () => {

        const medData = medications
            // .filter(medication => medication.dose && medication.name)
            .map(medication => ({
                val: medication.dose,
                medic: medication.name,
            }));

        const ConvertMed = JSON.stringify(medData);

        const formdata = new FormData();

        formdata.append('fname', firstname);
        formdata.append('lname', lastname);
        formdata.append('idcard', idCard);
        formdata.append('dob', birthDate);
        formdata.append('appointment_date', appointmentDate.split('T')[0]);
        formdata.append('appointment_time', appointmentDate.split('T')[1]);
        formdata.append('patient_id', String(items.patient.patient_id));
        formdata.append('med', ConvertMed);

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_CALLAPI}visit/task/${items.patient.visit_id}`, formdata);
            // console.log('Data saved successfully:', response.data);

            if (response.status === 200) {
                // setResponse(response.data);

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

    // console.log(items.daily_detail);

    const isTodayMatching = items.daily_detail.slice(1, items.daily_detail.length - 1).some(detail =>
        moment().isSame(detail.date_before_appointment, 'day')
    );

    // console.log(isTodayMatching);


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
                                            <label className={`${!isEditing ? 'bg-[#F8F5FB]' : ''} input input-bordered flex items-center gap-2 w-full`}>
                                                <input
                                                    type="text"
                                                    className="grow text-[#705396]"
                                                    readOnly={!isEditing}
                                                    value={firstname}
                                                    onChange={(e) => setFirstname(e.target.value)}
                                                />
                                            </label>
                                            {errors.firstname && <span className='text-red-500'>{errors.firstname}</span>}
                                        </div>
                                    </div>
                                    <div className="w-1/2 pl-4">
                                        <div className='my-2'>
                                            <span className='text-[#705396] '>นามสกุล</span>
                                            <label className={`${!isEditing ? 'bg-[#F8F5FB]' : ''} input input-bordered flex items-center gap-2 w-full`}>
                                                <input
                                                    type="text"
                                                    className="grow text-[#705396]"
                                                    readOnly={!isEditing}
                                                    value={lastname}
                                                    onChange={(e) => setLastname(e.target.value)}
                                                />
                                            </label>
                                            {errors.lastname && <span className='text-red-500'>{errors.lastname}</span>}
                                        </div>
                                    </div>
                                </div>
                                <div className='flex justify-between'>
                                    <div className="w-1/2 pr-4">
                                        <div className='my-2'>
                                            <span className='text-[#705396]'>เลขที่บัตรประจำตัวประชาชน</span>
                                            <label className={`${!isEditing ? 'bg-[#F8F5FB]' : ''} input input-bordered flex items-center gap-2 w-full`}>
                                                <input
                                                    type="text"
                                                    className="grow text-[#705396]"
                                                    value={idCard}
                                                    maxLength={13}
                                                    pattern="\d{13}"
                                                    readOnly={!isEditing}
                                                    onChange={(e) => setIdCard(e.target.value)}
                                                />
                                            </label>
                                            {errors.idCard && <span className='text-red-500'>{errors.idCard}</span>}
                                        </div>
                                    </div>
                                    <div className="w-1/2 pl-4">
                                        <div className='my-2'>
                                            <span className='text-[#705396]'>วันเดือนปีเกิด</span>
                                            <label className={`${!isEditing ? 'bg-[#F8F5FB]' : ''} input input-bordered flex items-center gap-2 w-full`}>
                                                <input
                                                    type="date"
                                                    className="grow text-[#705396]"
                                                    value={birthDate}
                                                    readOnly={!isEditing}
                                                    onChange={(e) => setBirthDate(e.target.value)}
                                                />
                                            </label>
                                            {errors.birthDate && <span className='text-red-500'>{errors.birthDate}</span>}
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
                                                    value={formatDate(items.patient.register_date)}
                                                    readOnly
                                                />
                                            </label>
                                        </div>
                                    </div>
                                    <div className="w-1/2 pl-4">
                                        <div className='my-2'>
                                            <span className='text-[#705396]'>วันนัดหมาย</span>
                                            <label className={`${!isEditing ? 'bg-[#F8F5FB]' : ''} input input-bordered flex items-center gap-2 w-full`}>
                                                <input
                                                    type="datetime-local"
                                                    className="grow text-[#705396]"
                                                    value={appointmentDate}
                                                    readOnly={!isEditing}
                                                    onChange={(e) => setAppointmentDate(e.target.value)}
                                                />
                                            </label>
                                            {errors.appointmentDate && <span className='text-red-500'>{errors.appointmentDate}</span>}
                                        </div>
                                    </div>
                                </div>
                            </form>
                            <div className={`my-2  ${isTodayMatching ? 'w-full' : 'w-1/2 pr-4'}`}>
                                <div className={`flex ${isTodayMatching ? 'h-[50px]' : 'h-[30px]'}`}>
                                    {/* <span className='text-[#705396]'>เลือกยาที่ควรหยุดรับประทาน</span> */}
                                    <span className={`text-[#705396]  ${isTodayMatching ? 'flex items-center' : ''} `}>
                                        {isTodayMatching ? `ข้อความที่ต้องส่งวันที่ ${moment().format('DD-MM-YYYY')}` : `เลือกยาที่ควรหยุดรับประทาน`}
                                    </span>
                                    {/* {isEditing && (
                                        <button className='mx-2' onClick={addMedication}>
                                            <Image
                                                src={`/image/icon_addplus.png`}
                                                alt="add medication"
                                                width={30}
                                                height={30}
                                            />
                                        </button>
                                    )} */}
                                    {isTodayMatching && (
                                        <button
                                            // onClick={isEditing ? handleSaveClick : handleEditClick}
                                            className={`relative text-white w-38 font-light btn btn-active mx-4 bg-[#693092] `}
                                        >
                                            <Image
                                                className='gap-1'
                                                src={`/image/icon_edit.png`}
                                                alt="logo"
                                                width={30}
                                                height={30}
                                            />
                                            <span> Edit</span>
                                        </button>
                                    )}
                                    {!isTodayMatching && isEditing && (
                                        <button className='mx-2' onClick={addMedication}>
                                            <Image
                                                src={`/image/icon_addplus.png`}
                                                alt="add medication"
                                                width={30}
                                                height={30}
                                            />
                                        </button>
                                    )}
                                </div>
                                <div className='rounded bg-[#E8DBF5] min-h-[48dvh] p-3'>
                                    {isTodayMatching ? (
                                        <div className=''>
                                            {items.daily_detail
                                                .filter(detail => moment(detail.date_before_appointment).isSame(moment(), 'day'))
                                                .map((notification, index) => (
                                                    <div key={index} className='items-center m-2'>
                                                        <div className='flex'>
                                                            {notification.noti_image?.map((image, idx) => (
                                                                <Image
                                                                    key={idx}
                                                                    src={image}
                                                                    width={100}
                                                                    height={100}
                                                                    alt={`notification image ${idx}`}
                                                                    className='cursor-pointer max-w-[80px] h-[80px] object-cover rounded-lg mr-3'
                                                                    onClick={() => window.open(image, '_blank')}
                                                                />
                                                            ))}
                                                        </div>
                                                        <div className='w-full text-[#705396] mt-2'>
                                                            <p className='my-2'>
                                                                แจ้งคุณ {firstname} {lastname}
                                                            </p>
                                                            <p className='my-2'>
                                                                ข้อควรปฏิบัติก่อนรับการตรวจส่องกล้องลำไส้ใหญ่
                                                            </p>
                                                            <div className=' break-words max-h-[30dvh] overflow-y-auto' dangerouslySetInnerHTML={{ __html: notification.noti_detail || '' }} />
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    ) : (
                                        <div>
                                            <span className='text-[#705396]'> รายการที่เลือก {items.patient.med.length} รายการ</span>
                                            <div className='max-h-[45dvh] overflow-y-auto'>
                                                {isEditing ? (
                                                    // แสดงแบบฟอร์มเพิ่ม/แก้ไขรายการยา
                                                    <div>
                                                        {medications.map((medication) => {
                                                            const isOther = !medicalList.some(medical => medical.name === medication.name);                                
                                                           return (
                                                            <div key={medication.id} className='flex justify-between pt-2'>
                                                                {medication.isOther || isOther ? (
                                                                    <input
                                                                        type='text'
                                                                        className='w-[70%] mx-1 h-[3rem] rounded bg-[#F8F5FB] text-center text-[#705396]'
                                                                        value={otherMedications[medication.id] || medication.name ||'' }
                                                                        onChange={(e) => handleOtherMedicationChange(e, medication.id)}
                                                                        placeholder='ระบุชื่อยา'
                                                                    />
                                                                ) : (
                                                                    <select
                                                                        className='w-[70%] mx-1 h-[3rem] rounded bg-[#F8F5FB] text-center text-[#705396]'
                                                                        value={medication.name}
                                                                        onChange={(e) => handleMedicationNameChange(e, medication.id)}
                                                                    >
                                                                        <option value='' disabled>เลือกยา</option>
                                                                        {medicalList.map(medical => (
                                                                            <option key={medical.id} value={medical.name}>{medical.name}</option>
                                                                        ))}
                                                                        <option value='other'>อื่นๆ</option>
                                                                    </select>
                                                                )}
                                                                <select
                                                                    className='w-[20%] mx-1 h-[3rem] rounded text-center text-[#705396]'
                                                                    value={medication.dose}
                                                                    onChange={(e) => handleMedicationDoseChange(e, medication.id)}
                                                                >
                                                                    <option value='' disabled>วัน</option>
                                                                    {[...Array(7)].map((_, i) => (
                                                                        <option key={i + 1} value={i + 1}>{i + 1} วัน</option>
                                                                    ))}
                                                                </select>
                                                                <button className='mx-1' onClick={() => removeMedication(medication.id)}>
                                                                    <Image
                                                                        src={`/image/icon_delete.png`}
                                                                        alt='delete medication'
                                                                        width={30}
                                                                        height={30}
                                                                    />
                                                                </button>
                                                            </div>
                                                        );})}
                                                    </div>
                                                ) : (
                                                    // แสดงรายการยาที่เลือกเป็นค่าเริ่มต้น
                                                    <div>
                                                        {items.patient.med.map((medication: any, index: number) => (
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
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}



                                    {/* <span className='text-[#705396]'> รายการที่เลือก {items.patient.med.length} รายการ</span>
                                    <div className='max-h-[45dvh] overflow-y-auto'>
                                        {isEditing ? (
                                            <div>
                                                {medications.map((medication) => (
                                                    <div key={medication.id} className='flex justify-between pt-2'>
                                                        {medication.isOther ? (
                                                            <input
                                                                type='text'
                                                                className='w-[70%] mx-1 h-[3rem] rounded bg-[#F8F5FB] text-center text-[#705396]'
                                                                value={otherMedications[medication.id] || ''}
                                                                onChange={(e) => handleOtherMedicationChange(e, medication.id)}
                                                                placeholder='ระบุชื่อยา'
                                                            />
                                                        ) : (
                                                            <select
                                                                className='w-[70%] mx-1 h-[3rem] rounded bg-[#F8F5FB] text-center text-[#705396]'
                                                                value={medication.name}
                                                                onChange={(e) => handleMedicationNameChange(e, medication.id)}
                                                            >
                                                                <option value='' disabled>เลือกยา</option>
                                                                {medicalList.map(medical => (
                                                                    <option key={medical.id} value={medical.name}>{medical.name}</option>
                                                                ))}
                                                                <option value='other'>อื่นๆ</option>
                                                            </select>
                                                        )}
                                                        <select
                                                            className='w-[20%] mx-1 h-[3rem] rounded text-center text-[#705396]'
                                                            value={medication.dose}
                                                            onChange={(e) => handleMedicationDoseChange(e, medication.id)}
                                                        >
                                                            <option value='' disabled>วัน</option>
                                                            {[...Array(7)].map((_, i) => (
                                                                <option key={i + 1} value={i + 1}>{i + 1} วัน</option>
                                                            ))}
                                                        </select>
                                                        <button className='mx-1' onClick={() => removeMedication(medication.id)}>
                                                            <Image
                                                                src={`/image/icon_delete.png`}
                                                                alt="delete medication"
                                                                width={30}
                                                                height={30}
                                                            />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div>
                                                {items.patient.med.map((medication: any, index: number) => (
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
                                                ))}
                                            </div>
                                        )}
                                    </div> */}
                                </div>
                            </div>
                        </div>
                        <div className=' w-[45%]'>
                            <div className='flex pl-8'>
                                <div className="w-[63.016%] ">
                                    <div className='my-2'>
                                        <span className='text-[#705396] '>Line Username</span>
                                        <label className="bg-[#F8F5FB] relative input input-bordered flex items-center gap-2 w-full">
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