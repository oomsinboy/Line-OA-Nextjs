import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import Calendar from './Calendar';
import { InfoData, MedicalList, PatientStateCall } from '../type';
import { cleanHtmlContent, formatDate } from '../help';
import axios from 'axios';
import Swal from 'sweetalert2';
import moment from 'moment';
import 'moment/locale/th';
import ModalPatient from './ModalPatient';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker, MobileDatePicker, TimePicker } from '@mui/x-date-pickers'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

import dynamic from 'next/dynamic';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';
import newAdapter from '../ui/newAdapter';
import dayjs from 'dayjs';

moment.locale('th');

const PatientRegis = ({ items, fetchDataview }: PatientStateCall) => {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [firstname, setFirstname] = useState<string>(items.patient.patient_fname);
    const [lastname, setLastname] = useState<string>(items.patient.patient_lname);
    const [idCard, setIdCard] = useState<string>(items.patient.id_card);
    // const [birthDate, setBirthDate] = useState<string>(items.patient.dob);
    // const [birthDate, setBirthDate] = useState<moment.Moment | null>(moment(items.patient.dob));
    const [birthDate, setBirthDate] = useState<any | null>(dayjs(items.patient.dob));

    // const [appointmentDate, setAppointmentDate] = useState<string>(`${items.patient.appointment_date.split('T')[0]}T${items.patient.appointment_time}`);
    // const [appointmentDate, setAppointmentDate] = useState<moment.Moment | null>(moment(`${items.patient.appointment_date.split('T')[0]}T${items.patient.appointment_time}`));
    const [appointmentDate, setAppointmentDate] = useState<any | null>(dayjs(items.patient.appointment_date));
    const [appointmentTime, setAppointmentTime] = useState<any | null>(moment(items.patient.appointment_time, "HH:mm"));

    const [lineName, setLineName] = useState<string>(items.patient.line_name);
    const [medications, setMedications] = useState<{ id: number; name: string; dose: string; isOther: boolean, isDoseOther: boolean }[]>([]);
    const [medicalList, setMedicalList] = useState<MedicalList[]>([]);
    const [otherMedications, setOtherMedications] = useState<{ [key: number]: string }>({});
    const [otherdoseMedications, setOtherdoseMedications] = useState<{ [key: number]: string }>({});

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [errorMed, setErrorMed] = useState<string>('');

    const [notiList, setNotiList] = useState<InfoData[]>([]);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [modalContent, setModalContent] = useState<any>(null);
    // const [isEditingModal, setIsEditingModal] = useState<boolean>(false);
    const [editedContent, setEditedContent] = useState<string>('');
    const [selectedNoti, setSelectedNoti] = useState<number>(0);

    const thDate = "th";

    useEffect(() => {
        if (!isEditing) {
            setAppointmentDate(dayjs(`${items.patient.appointment_date.split('T')[0]}T${items.patient.appointment_time}`));
        }

        const fetchMedicalData = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_CALLAPI}medical`);
                const medicalListData = response.data;
                setMedicalList(medicalListData);

                if (items.patient.med) {
                    // console.log(items.patient.med);
                    const initialMedications = items.patient.med.map((medication: any, index) => {
                        const isInMedicalList = medicalListData.some((medical: any) => medical.name === medication.medic);
                        const isDoseValid = /^[1-7]$/.test(medication.val);
                        return {
                            id: index,
                            name: medication.medic,
                            dose: medication.val,
                            isOther: !isInMedicalList,
                            isDoseOther: !isDoseValid
                        };
                    });
                    setMedications(initialMedications);
                }
            } catch (error) {
                console.error('Error fetching medical data:', error);
            }
        };

        const fetchNotiData = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_CALLAPI}notification`);
                setNotiList(response.data);
            } catch (error) {
                console.error('Error fetching noti data:', error);
            }
        }

        fetchMedicalData();
        fetchNotiData();

    }, [items.patient.med, items.patient.appointment_date, items.patient.appointment_time, isEditing]);

    const handleEditClick = () => {
        setIsEditing(true);
    };


    const addMedication = () => {
        setMedications([...medications, { id: Date.now(), name: '', dose: '', isOther: false, isDoseOther: false }]);
    };

    const removeMedication = (id: number) => {
        setMedications(medications.filter(medication => medication.id !== id));
    };

    const handleMedicationNameChange = (e: React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement>, id: number) => {
        const value = e.target.value;
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

    const handleOtherDoseChange = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
        const updateOtherDoseMedications = { ...otherdoseMedications, [id]: e.target.value };
        setOtherdoseMedications(updateOtherDoseMedications);
        const selectedMedications = medications.map(medication => {
            if (medication.id === id) {
                return { ...medication, dose: e.target.value };
            }
            return medication;
        })
        setMedications(selectedMedications);
    };

    const handleMedicationDoseChange = (e: React.ChangeEvent<HTMLSelectElement>, id: number) => {
        const value = e.target.value;

        // const isDuplicate = medications.some(medication => medication.dose === value && medication.id !== id && value !== 'other');

        // if (!isDuplicate) {
        //     const selectedMedications = medications.map(medication => {
        //         if (medication.id === id) {
        //             return { ...medication, dose: value, isDoseOther: value === 'other' };
        //         }
        //         return medication;
        //     });
        //     setMedications(selectedMedications);
        // }

        const selectedMedications = medications.map(medication => {
            if (medication.id === id) {
                return { ...medication, dose: value, isDoseOther: value === 'other' };
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

    const handleSaveClick = async () => {

        const invalidMed = medications.some(medication => !medication.name || !medication.dose);

        // const today = moment().startOf('day'); // ตั้งเวลาเป็น 00:00:00
        // const birthDateMoment = birthDate ? moment(birthDate).startOf('day') : null;
        // const ageInYears = birthDateMoment ? today.diff(birthDateMoment, 'years') : null;

        const today = dayjs().startOf('day'); // ใช้ dayjs แทน moment
        const birthDateDayjs = birthDate ? dayjs(birthDate).startOf('day') : null; // ใช้ dayjs แทน moment
        const ageInYears = birthDateDayjs ? today.diff(birthDateDayjs, 'year') : null; // คำนวณอายุเป็นปี

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

        if (!birthDate) {
            newErrors.birthDate = 'กรุณากรอกวันเดือนปีเกิด';
        } else if (ageInYears === null || ageInYears < 1) {
            newErrors.birthDate = 'กรุณากรอกวันเดือนปีเกิดที่มากกว่าหรือเท่ากับ 1 ปี';
        }

        if (!appointmentTime) {
            newErrors.appointmentTime = 'กรุณากรอกเวลานัดหมาย'
        }

        if (!appointmentDate) {
            newErrors.appointmentDate = 'กรุณากรอกวันนัดหมาย';
        } else {

            const registerDateMoment = moment.utc(items.patient.register_date).startOf('day'); // ตั้งเวลาเป็น 00:00:00
            const differenceInDays = appointmentDate.diff(registerDateMoment, 'days');

            if (differenceInDays < 5) {
                newErrors.appointmentDate = 'กรุณากรอกวันนัดหมายที่มากกว่าวันลงทะเบียน 5 วัน';
            }

        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        } else {
            setErrors({});
        }

        await sendEditform();

    };

    const sendEditform = async () => {

        const medData = medications
            .map(medication => ({
                val: medication.dose,
                medic: medication.name,
            }));

        const ConvertMed = JSON.stringify(medData);

        const formdata = new FormData();

        formdata.append('fname', firstname);
        formdata.append('lname', lastname);
        formdata.append('idcard', idCard);
        // formdata.append('dob', birthDate);
        formdata.append('dob', birthDate ? birthDate.format('YYYY-MM-DD') : '');
        // formdata.append('appointment_date', appointmentDate.split('T')[0]);
        // formdata.append('appointment_time', appointmentDate.split('T')[1]);
        formdata.append('appointment_date', appointmentDate ? appointmentDate.format('YYYY-MM-DD') : '');
        formdata.append('appointment_time', appointmentTime ? appointmentTime.format('HH:mm:ss') : '');
        formdata.append('patient_id', String(items.patient.patient_id));
        formdata.append('med', ConvertMed);

        // for (let [key, value] of formdata.entries()) {
        //     console.log(key, value);
        // }

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_CALLAPI}visit/task/${items.patient.visit_id}`, formdata);
            // console.log(response)
            if (response.status === 200) {
                setIsEditing(false);
                Swal.fire({
                    title: 'สำเร็จ',
                    text: 'คุณได้ทำการแก้ไขเรียบร้อยแล้ว',
                    icon: 'success',
                    confirmButtonText: 'ปิด',
                }).then(() => {
                    window.location.reload();
                    // fetchDataview();
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

    const isTodayMatching = items.daily_detail.slice(1, items.daily_detail.length - 1).some(detail =>
        moment().isSame(detail.date_before_appointment, 'day')
    );

    // Edit 
    const handleButtonClick = (detail: any) => {
        setModalContent(detail);
        setEditedContent(detail.noti_detail || '');
        setShowModal(true);
    };

    const handleSaveClickNoti = async () => {

        const formdata = new FormData();

        const notiId = selectedNoti === 0 ? modalContent.noti_id : selectedNoti.toString();

        formdata.append('visit_id', items.patient.visit_id.toString());
        formdata.append('noti_id', notiId);
        formdata.append('noti_detail', editedContent);

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_CALLAPI}daily_noti/task/${modalContent.daily_id}`, formdata);

            if (response.status === 200) {

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
        setEditedContent(modalContent ? modalContent.noti_detail || '' : '');
    };

    const handleNotiChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = parseInt(e.target.value, 10);
        setSelectedNoti(selectedId);
        const selectedNotiDetail = notiList.find(noti => noti.id === selectedId);
        setEditedContent(selectedNotiDetail ? selectedNotiDetail.detail : '');
    };

    return (
        <div className='px-8'>
            <div className='h-full w-full rounded-[15px] bg-white p-5 '>
                <div className='min-h-[81.71dvh] flex flex-col'>
                    <div className='flex justify-between'>
                        <div>
                            <div className='text-xl 2xl:text-2xl text-[#5955B3] font-semibold'>ลงทะเบียนผู้ป่วย</div>
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
                                            {!isEditing ? (
                                                <label className='bg-[#F8F5FB] input input-bordered flex items-center gap-2 w-full'>
                                                    <input
                                                        type="text"
                                                        className="grow text-[#705396]"
                                                        // value={birthDate}
                                                        value={birthDate ? birthDate.format('DD-MM') + '-' + (birthDate.year() + 543) : ''}
                                                        readOnly
                                                    />
                                                </label>
                                            ) : (
                                                <>
                                                    {/* <LocalizationProvider dateAdapter={AdapterMoment}>
                                                        <DatePicker
                                                            value={birthDate}
                                                            format="DD-MM-YYYY"
                                                            onChange={(newValue) => setBirthDate(newValue)}
                                                            disabled={!isEditing}
                                                            slotProps={{
                                                                textField: {
                                                                    fullWidth: true,
                                                                    className: `${!isEditing ? 'bg-[#F8F5FB]' : ''} rounded-lg text-[#705396] hover:border-gray-500 h-[48px]`,
                                                                    InputProps: {
                                                                        style: {
                                                                            borderRadius: "8px",
                                                                            color: '#705396', // Keep color consistent
                                                                        },
                                                                        className: 'w-full rounded-lg text-[#705396] focus:border-gray-500 h-[48px]',
                                                                    },
                                                                },
                                                            }}
                                                        />
                                                    </LocalizationProvider> */}

                                                    <LocalizationProvider dateAdapter={newAdapter} adapterLocale={thDate}>
                                                        <MobileDatePicker
                                                            format="DD-MM-YYYY"
                                                            value={birthDate}
                                                            onChange={(newValue) => setBirthDate(newValue)}
                                                            slotProps={{
                                                                textField: {
                                                                    fullWidth: true,
                                                                    className: ' text-[#705396] hover:border-gray-500 h-[48px]',
                                                                    InputProps: {
                                                                        style: {
                                                                            borderRadius: "8px",
                                                                            color: "#705396"
                                                                        },
                                                                        className: ' input-bordered border-none w-full  text-[#705396] focus:border-gray-500 h-[48px]',
                                                                    },
                                                                },
                                                            }}
                                                        />
                                                    </LocalizationProvider>
                                                </>
                                            )}
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
                                                    // value={formatDate(items.patient.register_date)}
                                                    value={moment.utc(items.patient.register_date).add(543, 'years').format('DD-MM-YYYY HH:mm:ss')}
                                                    readOnly
                                                />
                                            </label>
                                        </div>
                                    </div>
                                    <div className="w-1/2 pl-4">
                                        <div className='my-2'>
                                            <span className='text-[#705396]'>วันนัดหมาย</span>
                                            {!isEditing ? (
                                                <div className='flex justify-between gap-2'>
                                                    <label className='bg-[#F8F5FB] input input-bordered flex items-center gap-2 w-1/2'>
                                                        <input
                                                            type="text"
                                                            className="grow text-[#705396]"
                                                            // value={appointmentDate ? appointmentDate.format('DD-MM-YYYY HH:mm:ss') : ''}
                                                            value={appointmentDate ? appointmentDate.format('DD-MM') + '-' + (appointmentDate.year() + 543): ''}
                                                            readOnly
                                                        />
                                                    </label>
                                                    <label className='bg-[#F8F5FB] input input-bordered flex items-center gap-2 w-1/2'>
                                                        <input
                                                            type="text"
                                                            className="grow text-[#705396]"
                                                            // value={appointmentDate ? appointmentDate.format('DD-MM-YYYY HH:mm:ss') : ''}
                                                            value={appointmentTime ? appointmentDate.format(' HH:mm:ss') : ''}
                                                            readOnly
                                                        />
                                                    </label>
                                                </div>
                                            ) : (
                                                <>
                                                    {/* <LocalizationProvider dateAdapter={AdapterMoment}>
                                                        <DateTimePicker
                                                            value={appointmentDate}
                                                            format="DD-MM-YYYY HH:mm:ss"
                                                            onChange={(newValue) => setAppointmentDate(newValue)}
                                                            disabled={!isEditing}
                                                            slotProps={{
                                                                textField: {
                                                                    fullWidth: true,
                                                                    className: `${!isEditing ? 'bg-[#F8F5FB]' : ''} rounded-lg text-[#705396] hover:border-gray-500 h-[48px]`,
                                                                    InputProps: {
                                                                        style: {
                                                                            borderRadius: "8px",
                                                                            color: '#705396', // Keep color consistent
                                                                        },
                                                                        className: 'w-full rounded-lg text-[#705396] focus:border-gray-500 h-[48px]',
                                                                    },
                                                                },
                                                            }}
                                                        />
                                                    </LocalizationProvider> */}

                                                    <div className='flex justify-between gap-2'>
                                                        <div className='w-[50%]'>
                                                            <LocalizationProvider dateAdapter={newAdapter} adapterLocale={thDate}>
                                                                <MobileDatePicker
                                                                    format="DD-MM-YYYY"
                                                                    value={appointmentDate}
                                                                    onChange={(newValue) => setAppointmentDate(newValue)}
                                                                    slotProps={{
                                                                        textField: {
                                                                            fullWidth: true,
                                                                            className: ' text-[#705396] hover:border-gray-500 h-[48px]',
                                                                            InputProps: {
                                                                                style: {
                                                                                    borderRadius: "8px",
                                                                                    color: "#705396"
                                                                                },
                                                                                className: ' input-bordered border-none w-full  text-[#705396] focus:border-gray-500 h-[48px]',
                                                                            },
                                                                        },
                                                                    }}
                                                                />
                                                            </LocalizationProvider>
                                                            {errors.appointmentDate && <span className='text-red-500'>{errors.appointmentDate}</span>}
                                                        </div>

                                                        <div className='w-[50%]'>
                                                            <LocalizationProvider dateAdapter={AdapterMoment}>
                                                                <TimePicker
                                                                    value={appointmentTime}
                                                                    onChange={(newValue) => setAppointmentTime(newValue)}
                                                                    slotProps={{
                                                                        textField: {
                                                                            fullWidth: true,
                                                                            className: 'rounded-lg text-[#705396] hover:border-gray-500 h-[48px]',
                                                                            InputProps: {
                                                                                style: {
                                                                                    borderRadius: "8px",
                                                                                    color: "#705396"
                                                                                },
                                                                                className: ' input-bordered border-none w-full rounded-lg text-[#705396] focus:border-gray-500 h-[48px]',
                                                                            },
                                                                        },
                                                                    }}
                                                                />
                                                            </LocalizationProvider>
                                                            {errors.appointmentTime && <span className='text-red-500'>{errors.appointmentTime}</span>}
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                            {/* {errors.appointmentDate && <span className='text-red-500'>{errors.appointmentDate}</span>} */}
                                        </div>
                                    </div>
                                </div>
                            </form>
                            <div className={`my-2 relative  ${isTodayMatching ? 'w-full' : 'w-1/2 pr-4'}`}>
                                <div className={`flex ${isTodayMatching ? 'h-[50px]' : 'h-[30px]'}`}>
                                    <span className={`text-[#705396]  ${isTodayMatching ? 'flex items-center' : ''} `}>
                                        {isTodayMatching ? `ข้อความที่ต้องส่งวันที่ ${moment().format('DD-MM-YYYY')}` : `เลือกยาที่ต้องหยุดรับประทาน`}
                                    </span>
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
                                {errorMed && <span className='text-red-500'>{errorMed}</span>}
                                <div className={`rounded bg-[#E8DBF5] ${errorMed ? 'min-h-[36dvh] 2xl:min-h-[42dvh]' : 'min-h-[38dvh] 2xl:min-h-[44dvh]'} p-3`}>
                                    {isTodayMatching ? (
                                        <div className=''>
                                            {items.daily_detail
                                                .filter(detail => moment(detail.date_before_appointment).isSame(moment(), 'day'))
                                                .map((notification, index) => {
                                                    return (
                                                        <div key={index} className='items-center m-2'>
                                                            <div className='flex'>
                                                                {notification.noti_image?.map((image, idx) => (
                                                                    <Image
                                                                        key={idx}
                                                                        src={image}
                                                                        width={100}
                                                                        height={100}
                                                                        alt={`notification image ${idx}`}
                                                                        className='cursor-pointer max-w-[60px] 2xl:max-w-[80px] 2xl:h-[80px] object-cover rounded-lg mr-3'
                                                                        onClick={() => window.open(image, '_blank')}
                                                                    />
                                                                ))}
                                                            </div>
                                                            <div className='w-full text-[#705396] mt-2 flex flex-col'>
                                                                <span className='2xl:my-2'>
                                                                    แจ้งคุณ {firstname} {lastname}
                                                                </span>
                                                                <span className='2xl:my-2'>
                                                                    ข้อควรปฏิบัติก่อนรับการตรวจส่องกล้องลำไส้ใหญ่
                                                                </span>
                                                                <div className=' break-words max-h-[18dvh] 2xl:max-h-[30dvh] overflow-y-auto' dangerouslySetInnerHTML={{ __html: cleanHtmlContent(notification.noti_detail) || '' }} />
                                                            </div>
                                                            <button
                                                                onClick={() => handleButtonClick(notification)}
                                                                className={`absolute top-0 left-56 text-white w-38 font-light btn btn-active mx-4 bg-[#693092] `}
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
                                                        </div>
                                                    )
                                                })}
                                        </div>
                                    ) : (
                                        <div>
                                            <span className='text-[#705396]'> รายการที่เลือก {isEditing ? medications.length : items.patient.med.length} รายการ</span>
                                            <div className={`${errorMed ? 'max-h-[34dvh] 2xl:max-h-[38dvh]' : 'max-h-[34dvh] 2xl:max-h-[40dvh]'}  overflow-y-auto`}>
                                                {isEditing ? (
                                                    <div>
                                                        {medications.map((medication) => {
                                                            return (
                                                                <div key={medication.id} className='flex justify-between pt-2'>
                                                                    {medication.isOther ? (
                                                                        <input
                                                                            type='text'
                                                                            className='w-[70%] mx-1 h-[3rem] rounded bg-[#F8F5FB] text-center text-[#705396]'
                                                                            value={medication.name === 'other' ? '' : (otherMedications[medication.id] || medication.name || '')}
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

                                                                    {medication.isDoseOther ? (
                                                                        <>
                                                                            <input
                                                                                type="text"
                                                                                className="w-[20%] mx-1 h-[3rem] text-center rounded  text-[#705396]"
                                                                                value={medication.dose === 'other' ? '' : (otherdoseMedications[medication.id] || medication.dose || '')}
                                                                                onChange={(e) => {
                                                                                    const value = e.target.value;
                                                                                    if (/^\d*$/.test(value)) {
                                                                                        handleOtherDoseChange(e, medication.id);
                                                                                    }
                                                                                }}
                                                                            />
                                                                            <span className="flex items-center text-[#705396]">วัน</span>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <select
                                                                                className='w-[20%] mx-1 h-[3rem] rounded text-center text-[#705396]'
                                                                                value={medication.dose}
                                                                                onChange={(e) => handleMedicationDoseChange(e, medication.id)}
                                                                            >
                                                                                <option value='' disabled >โปรดเลือก</option>
                                                                                {[...Array(7)].map((_, i) => (
                                                                                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                                                                                ))}
                                                                                <option value='other'>อื่นๆ</option>
                                                                            </select>
                                                                            <div className="flex items-center text-[#705396]">วัน</div>
                                                                        </>
                                                                    )}
                                                                    <button className='mx-1' onClick={() => removeMedication(medication.id)}>
                                                                        <Image
                                                                            src={`/image/icon_delete.png`}
                                                                            alt='delete medication'
                                                                            width={30}
                                                                            height={30}
                                                                        />
                                                                    </button>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                ) : (
                                                    // แสดงรายการยาที่เลือกเป็นค่าเริ่มต้น
                                                    <div>
                                                        {medications.map((medication: any) => {
                                                            return (
                                                                <div key={medication.id} className='flex justify-between pt-2'>
                                                                    {medication.isOther ? (
                                                                        <input
                                                                            type='text'
                                                                            className='w-[70%] mx-1 h-[3rem] opacity-70 rounded bg-[#F8F5FB] text-center text-[#705396]'
                                                                            defaultValue={medication.name}
                                                                            disabled
                                                                            placeholder='ระบุชื่อยา'
                                                                        />
                                                                    ) : (
                                                                        <select
                                                                            className='w-[70%] mx-1 h-[3rem] rounded bg-[#F8F5FB] text-center text-[#705396]'
                                                                            defaultValue={medication.name}
                                                                            disabled
                                                                        >
                                                                            <option value={medication.name}>{medication.name}</option>
                                                                        </select>
                                                                    )}

                                                                    {medication.isDoseOther ? (
                                                                        <>
                                                                            <input
                                                                                type='text'
                                                                                className='w-[20%] mx-1 h-[3rem] text-center opacity-70 rounded bg-[#F8F5FB] text-[#705396]'
                                                                                defaultValue={medication.dose}
                                                                                disabled
                                                                            />
                                                                            <div className="flex items-center text-[#705396]">วัน</div>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <select
                                                                                className='w-[20%] mx-1 h-[3rem] rounded bg-[#F8F5FB] text-center text-[#705396]'
                                                                                defaultValue={medication.dose}
                                                                                disabled
                                                                            >
                                                                                <option value={medication.dose}>{medication.dose}</option>
                                                                            </select>
                                                                            <div className="flex items-center text-[#705396]">วัน</div>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
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
                            <Calendar visit_id={items.patient.visit_id} dailyDetail={items.daily_detail} notilist={notiList} />
                            <ModalPatient isVisible={showModal} onClose={handleCloseModal} title="รายละเอียดการแจ้งเตือน">
                                {modalContent && (
                                    <div className='p-5'>
                                        <div className='text-2xl text-[#5955B3] font-semibold'>แจ้งเตือนคุณ {modalContent.ptname}</div>
                                        <div className='text-2xl text-[#5955B3] font-semibold'>วันที่ {moment(modalContent.date_before_appointment).format('DD-MM-') + (moment(modalContent.date_before_appointment).year() + 543)}</div>
                                        <div className={`rounded bg-white min-h-[40dvh] 2xl:min-h-[48dvh] py-2 mt-2 text-xl mb-16`}>

                                            <select
                                                className="w-full mb-4 p-2 border rounded text-base"
                                                value={selectedNoti}
                                                onChange={handleNotiChange}
                                            >
                                                <option value={0} disabled>เลือกการแจ้งเตือน</option>
                                                {notiList.map((noti) => (
                                                    <option key={noti.id} value={noti.id}>{noti.header}</option>
                                                ))}
                                            </select>
                                            <ReactQuill
                                                className="h-[280px] 2xl:h-[360px]"
                                                value={editedContent}
                                                onChange={(content) => setEditedContent(content)}
                                                theme="snow"
                                            />
                                        </div>
                                        {!moment(modalContent.date_before_appointment).isBefore(moment(), 'day') && (
                                            <div className="flex justify-center mt-4">
                                                <button
                                                    onClick={handleSaveClickNoti}
                                                    className={`relative text-white w-38 font-light btn btn-active mx-4 bg-[#693092]`}
                                                >
                                                    <Image
                                                        className='gap-2'
                                                        src='/image/icon_save.png'
                                                        alt="logo"
                                                        width={30}
                                                        height={30}
                                                    />
                                                    <span>Save</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </ModalPatient>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PatientRegis