"use client"

import Navbar from '@/components/Navbar'
import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import { formatCurrentDate } from '../../../../components/help'
import axios from 'axios';
import { MedicalList } from '@/components/type';
import Swal from 'sweetalert2';
import AftersaveData from '@/components/patient/AftersaveData';
import { DateTimePicker, DatePicker, LocalizationProvider, MobileDatePicker, renderTimeViewClock, TimePicker } from '@mui/x-date-pickers'
// import AdapterDateFns from 'date-fns-buddhist-adapter'

// import { th } from 'date-fns/locale'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import moment from 'moment';
import 'moment/locale/th'

import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import newAdapter from '@/components/ui/newAdapter';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';


function NewPatient() {
    const [firstname, setFirstname] = useState<string>('');
    const [lastname, setLastname] = useState<string>('');
    const [idCard, setIdCard] = useState<string>('');
    const [idCardError, setIdCardError] = useState<boolean>(false);
    // const [birthDate, setBirthDate] = useState<string>('');
    // const [birthDate, setBirthDate] = useState<moment.Moment | null>(null);
    const [birthDate, setBirthDate] = useState<any | null>(null);

    const [currentDate, setCurrentDate] = useState<string>('');
    // const [appointmentDate, setAppointmentDate] = useState<string>('');
    const [appointmentDate, setAppointmentDate] = useState<moment.Moment | null>(null);
    const [appointmentTime, setAppointmentTime] = useState<any | null>(null);
    const [medications, setMedications] = useState<{ id: number; name: string; dose: string; isOther: boolean, isDoseOther: boolean }[]>([]);
    const [medicalList, setMedicalList] = useState<MedicalList[]>([]);
    const [otherMedications, setOtherMedications] = useState<{ [key: number]: string }>({});
    const [otherdoseMedications, setOtherdoseMedications] = useState<{ [key: number]: string }>({});
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [errorMed, setErrorMed] = useState<string>('');
    const [response, setResponse] = useState<any>(null);

    // const [contractDateStart, setContractDateStart] = useState(null);
    const thDate = "th";

    const router = useRouter();



    useEffect(() => {
        const user = Cookies.get('__user');
        if (!user) {
            router.push('/');
        }
    }, [router]);

    useEffect(() => {

        const fetchMedicalo = () => {
            const apicall = process.env.NEXT_PUBLIC_CALLAPI as string;
            axios.get(apicall + "medical")
                .then(res => {
                    setMedicalList(res.data);
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        }
        fetchMedicalo()

        const intervalId = setInterval(() => {
            setCurrentDate(formatCurrentDate());
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    const handleIdCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^\d{0,13}$/.test(value)) {
            setIdCard(value);
        }
    }

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
                    return { ...medication, name: value, isOther: value === 'other' };
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


    const handleMedicationDoseChange = (e: React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement>, id: number) => {
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

    const handleAddNew = async () => {
        const invalidMed = medications.some(medication => !medication.name || !medication.dose);

        // const today = moment().startOf('day'); // ตั้งเวลาเป็น 00:00:00
        // const birthDateMoment = birthDate ? moment(birthDate).startOf('day') : null;
        // const ageInYears = birthDateMoment ? today.diff(birthDateMoment, 'years') : null;

        // console.log(today,birthDateMoment,today.diff(birthDateMoment, 'years'))

        const birthDateMoment = birthDate ? moment(birthDate.toDate()) : null;
        const today = moment().startOf('day'); // ตั้งเวลาเป็น 00:00:00
        const ageInYears = birthDateMoment ? today.diff(birthDateMoment.startOf('day'), 'years') : null;

        // ตรวจสอบค่าที่ได้จาก today, birthDateMoment และการคำนวณอายุ
        // console.log("Today:", today.format('YYYY-MM-DD'));
        // console.log("Birth Date:", birthDateMoment?.format('YYYY-MM-DD'));
        // console.log("Age in Years:", ageInYears);

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
        // if (!birthDate.trim()) newErrors.birthDate = 'กรุณากรอกวันเดือนปีเกิด';
        if (!birthDate) {
            newErrors.birthDate = 'กรุณากรอกวันเดือนปีเกิด';
        } else if (ageInYears === null || ageInYears < 1) {
            newErrors.birthDate = 'กรุณากรอกวันเดือนปีเกิดที่มากกว่าหรือเท่ากับ 1 ปี';
        }

        // console.log( appointmentTime.format('HH:mm:ss'))
        if (!appointmentTime) {
            newErrors.appointmentTime = 'กรุณากรอกเวลานัดหมาย'
        }

        if (!appointmentDate) {
            newErrors.appointmentDate = 'กรุณากรอกวันนัดหมาย';
        } else {

            const appointmentDateMoment = moment(appointmentDate.toDate()).startOf('day');
            // const combinedDateTime = appointmentDateMoment
            //     .set('hour', appointmentTime.hour())
            //     .set('minute', appointmentTime.minute());
            // console.log(combinedDateTime)

            const differenceInDays = appointmentDateMoment.diff(today, 'days');

            // console.log("Combined DateTime:", combinedDateTime.format('YYYY-MM-DD HH:mm'));
            // console.log("Difference in Days:", differenceInDays);

            // const appointmentDateMoment = moment.utc(appointmentDate).startOf('day'); 
            // const differenceInDays = appointmentDateMoment.diff(today, 'days');

            if (differenceInDays < 5) {
                newErrors.appointmentDate = 'กรุณากรอกวันนัดหมายที่มากกว่าวันปัจจุบัน 5 วัน';
            }
        }


        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        } else {
            setErrors({});
        }

        await handleSaveADD();
    }

    const handleSaveADD = async () => {

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
        formdata.append('dob', birthDate ? birthDate.format('YYYY-MM-DD') : '');
        // formdata.append('appointment_date', appointmentDate.split('T')[0]);
        // formdata.append('appointment_time', appointmentDate.split('T')[1]);
        formdata.append('appointment_date', appointmentDate ? appointmentDate.format('YYYY-MM-DD') : '');
        formdata.append('appointment_time', appointmentTime ? appointmentTime.format('HH:mm:ss') : '');
        formdata.append('med', ConvertMed);

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_CALLAPI}patient`, formdata);
            // console.log('Data saved successfully:', response.data);

            if (response.status === 200) {
                setResponse(response.data);
                Swal.fire({
                    title: 'สำเร็จ',
                    text: 'คุณได้ทำรายการเรียบร้อยแล้ว',
                    icon: 'success',
                    confirmButtonText: 'ปิด',
                });
                setIdCardError(false)
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
        } catch (error: any) {
            console.error('Error saving data:', error);

            if (error.response && error.response.status === 400) {
                console.error('Error 400 data:', error.response.data);
                Swal.fire({
                    title: 'ขออภัย',
                    text: "ท่านกรอกข้อมูลไม่ถูกต้อง",
                    icon: 'error',
                    confirmButtonText: 'ปิด',
                    customClass: {
                        icon: 'custom-swal2-error',
                    }
                });
                setIdCardError(true);
            } else {
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
    };


    if (response) {
        return <AftersaveData response={response} />;
    }

    return (
        <div className='min-h-screen'>
            <Navbar />
            <div className='px-8'>
                <div className='h-full w-full rounded-[15px] bg-white p-5 flex justify-center'>
                    <div className='min-h-[81.71dvh] w-[70%] flex flex-col'>
                        <div>
                            <div className='text-xl 2xl:text-2xl text-[#5955B3] font-semibold'>เพิ่มผู้ป่วยใหม่</div>
                        </div>
                        <form action="" className=" mt-2">
                            <div className='flex justify-between'>
                                <div className="w-1/2 pr-4">
                                    <div className='my-2'>
                                        <span className='text-[#705396]'>ชื่อ</span>
                                        <label className=" input input-bordered flex items-center gap-2 w-full">
                                            <input
                                                type="text"
                                                className="grow text-[#705396]"
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
                                        <label className=" input input-bordered flex items-center gap-2 w-full">
                                            <input
                                                type="text"
                                                className="grow text-[#705396]"
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
                                        <span className={`text-${idCardError ? 'red-500' : '[#705396]'}`}>เลขที่บัตรประจำตัวประชาชน </span>
                                        <label className={`input input-bordered  flex items-center gap-2 w-full ${idCardError ? 'input-error' : ''}`}>
                                            <input
                                                type="text"
                                                className="grow text-[#705396] "
                                                value={idCard}
                                                onChange={handleIdCardChange}
                                                maxLength={13}
                                                pattern="\d{13}"
                                                title="กรุณากรอกตัวเลข 13 หลัก"
                                            />
                                        </label>
                                        {errors.idCard && <span className='text-red-500'>{errors.idCard}</span>}
                                    </div>
                                </div>
                                <div className="w-1/2 pl-4">
                                    <div className='my-2'>
                                        <span className='text-[#705396]'>วันเดือนปีเกิด</span>
                                        {/* <label className=" input input-bordered flex items-center gap-2 w-full">
                                            <input
                                                type="date"
                                                className="grow text-[#705396]"
                                                value={birthDate}
                                                onChange={(e) => setBirthDate(e.target.value)}
                                            />
                                        </label> */}

                                        {/* <LocalizationProvider dateAdapter={AdapterMoment}>
                                            <DatePicker
                                                value={birthDate}
                                                format="DD-MM-YYYY"
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
                                                            className: 'w-full  text-[#705396] focus:border-gray-500 h-[48px]',
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
                                                value={currentDate}
                                                readOnly
                                            />
                                        </label>
                                    </div>
                                </div>
                                <div className="w-1/2 pl-4">
                                    <div className='my-2'>
                                        <span className='text-[#705396]'>วันนัดหมาย</span>
                                        {/* <label className="input input-bordered flex items-center gap-2 w-full">
                                            <input
                                                type="datetime-local"
                                                className="grow text-[#705396]"
                                                value={appointmentDate}
                                                onChange={(e) => setAppointmentDate(e.target.value)}
                                            />
                                        </label> */}
                                        {/* <LocalizationProvider dateAdapter={AdapterMoment}>
                                            <DateTimePicker
                                                value={appointmentDate}
                                                format="DD-MM-YYYY HH:mm:ss"
                                                onChange={(newValue) => setAppointmentDate(newValue)}
                                                slotProps={{
                                                    textField: {
                                                        fullWidth: true,
                                                        className: 'rounded-lg text-[#705396] hover:border-gray-500 h-[48px]',
                                                        InputProps: {
                                                            style: {
                                                                borderRadius: "8px",
                                                                color: "#705396"
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


                                    </div>
                                </div>
                            </div>
                        </form>
                        <div className='flex justify-between'>
                            <div className='my-2 w-1/2 pr-4'>
                                <div className='flex'>
                                    <span className='text-[#705396]'>เลือกยาที่ต้องหยุดรับประทาน</span>
                                    <button className='mx-2' onClick={addMedication}>
                                        <Image
                                            src={`/image/icon_addplus.png`}
                                            alt="logo"
                                            width={30}
                                            height={30}
                                        />
                                    </button>
                                </div>
                                {errorMed && <span className='text-red-500'>{errorMed}</span>}
                                <div className='rounded bg-[#E8DBF5] min-h-[36dvh] 2xl:min-h-[40dvh] p-3'>
                                    <span className='text-[#705396]'> รายการที่เลือก {medications.length} รายการ</span>
                                    <div className='max-h-[30dvh] 2xl:max-h-[35dvh] overflow-y-auto'>
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
                                                {/* <select
                                                    className='w-[20%] mx-1 h-[3rem] rounded bg-[#F8F5FB] text-center text-[#705396]'
                                                    value={medication.dose}
                                                    onChange={(e) => handleMedicationDoseChange(e, medication.id)}
                                                >
                                                    <option value='' disabled >วัน</option>
                                                    {[...Array(7)].map((_, i) => (
                                                        <option key={i + 1} value={i + 1}>{i + 1} วัน</option>
                                                    ))}
                                                    <option value='other'>อื่นๆ</option>
                                                </select> */}
                                                {medication.isDoseOther ? (
                                                    <>
                                                        <input
                                                            type="text"
                                                            className="w-[20%] mx-1 h-[3rem] rounded text-center text-[#705396]"
                                                            value={otherdoseMedications[medication.id] || ''}
                                                            // onChange={(e) => handleOtherDoseChange(e, medication.id)}
                                                            onChange={(e) => {
                                                                const value = e.target.value;
                                                                // ตรวจสอบว่าค่าที่กรอกเป็นตัวเลขเท่านั้น
                                                                if (/^\d*$/.test(value)) {
                                                                    handleOtherDoseChange(e, medication.id);
                                                                }
                                                            }}
                                                        />
                                                        <div className="flex items-center text-[#705396]">วัน</div>
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
                                                        alt="delete medication"
                                                        width={30}
                                                        height={30}
                                                    />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-center items-center w-1/2">
                                <div className='flex justify-center'>
                                    <button onClick={handleAddNew} className="text-white w-80 text-xl 2xl:text-2xl font-light bg-[#BE77F1] btn btn-active mx-4">
                                        Save & Generate OTP
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default NewPatient
