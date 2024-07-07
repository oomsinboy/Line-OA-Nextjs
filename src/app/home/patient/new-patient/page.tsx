"use client"

import Navbar from '@/components/Navbar'
import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import { formatCurrentDate } from '../../../../components/help'
import axios from 'axios';
import { MedicalList } from '@/components/type';
import Swal from 'sweetalert2';
import AftersaveData from '@/components/patient/DataRes';


function NewPatient() {
    const [firstname, setFirstname] = useState<string>('');
    const [lastname, setLastname] = useState<string>('');
    const [idCard, setIdCard] = useState<string>('');
    const [birthDate, setBirthDate] = useState<string>('');
    const [currentDate, setCurrentDate] = useState<string>('');
    const [appointmentDate, setAppointmentDate] = useState<string>('');
    const [medications, setMedications] = useState<{ id: number; name: string; dose: string; isOther: boolean }[]>([]);

    const [medicalList, setMedicalList] = useState<MedicalList[]>([]);
    const [otherMedications, setOtherMedications] = useState<{ [key: number]: string }>({});
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [errorMed, setErrorMed] = useState<string>('');
    const [response, setResponse] = useState<any>(null);


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

    // const addMedication = () => {
    //     setMedications([...medications, { id: Date.now(), name: '', dose: '' }]);
    // };

    const addMedication = () => {
        setMedications([...medications, { id: Date.now(), name: '', dose: '', isOther: false }]);
    };

    const removeMedication = (id: number) => {
        setMedications(medications.filter(medication => medication.id !== id));
    };

    // const handleMedicationNameChange = (e: React.ChangeEvent<HTMLSelectElement>, id: number) => {
    //     const selectedMedications = medications.map(medication => {
    //         if (medication.id === id) {
    //             return { ...medication, name: e.target.value };
    //         }
    //         return medication;
    //     });
    //     setMedications(selectedMedications);
    // };

    const handleMedicationNameChange = (e: React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement>, id: number) => {
        const value = e.target.value;

        const isDuplicate = medications.some(medication => medication.name === value && medication.id !== id && value !== 'other');

        // const selectedMedications = medications.map(medication => {
        //     if (medication.id === id) {
        //         return { ...medication, name: value, isOther: value === 'other' };
        //     }
        //     return medication;
        // });
        // setMedications(selectedMedications);

        if (!isDuplicate) {
            const selectedMedications = medications.map(medication => {
                if (medication.id === id) {
                    return { ...medication, name: value, isOther: value === 'other' };
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

    const handleSave = async () => {

        const invalidMed = medications.some(medication => !medication.name || !medication.dose);

        if (invalidMed) {
            setErrorMed('กรุณากรอกข้อมูลยาและจำนวนวันที่รับประทานให้ครบถ้วน');
            return;
        } else {
            setErrorMed('');
        }

        const medData = medications
            // .filter(medication => medication.dose && medication.name)
            .map(medication => ({
                val: medication.dose,
                medic: medication.name,
            }));

        const newErrors: { [key: string]: string } = {};

        if (!firstname.trim()) newErrors.firstname = 'กรุณากรอกชื่อ';
        if (!lastname.trim()) newErrors.lastname = 'กรุณากรอกนามสกุล';
        if (!idCard.trim()) {
            newErrors.idCard = 'กรุณากรอกบัตรประจำตัวประชาชน';
        } else if (idCard.trim().length !== 13) {
            newErrors.idCard = 'กรุณากรอกบัตรประจำตัวประชาชนให้ถูกต้อง (13 หลัก)';
        }
        if (!birthDate.trim()) newErrors.birthDate = 'กรุณากรอกวันเดือนปีเกิด';
        if (!appointmentDate.trim()) {
            newErrors.appointmentDate = 'กรุณากรอกวันนัดหมาย';
        } else {
            const currentDateObj = new Date(currentDate);
            const appointmentDateObj = new Date(appointmentDate);
            const differenceInTime = appointmentDateObj.getTime() - currentDateObj.getTime();
            const differenceInDays = differenceInTime / (1000 * 3600 * 24);

            if (differenceInDays <= 4) {
                newErrors.appointmentDate = 'กรุณากรอกวันนัดหมายที่มากกว่าวันปัจจุบัน 5 วัน';
            }
        }


        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        } else {
            setErrors({});
        }

        const ConvertMed = JSON.stringify(medData);

        const formdata = new FormData();

        formdata.append('fname', firstname);
        formdata.append('lname', lastname);
        formdata.append('idcard', idCard);
        formdata.append('dob', birthDate);
        formdata.append('appointment_date', appointmentDate.split('T')[0]);
        formdata.append('appointment_time', appointmentDate.split('T')[1]);
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
                            <div className='text-2xl text-[#5955B3] font-semibold'>เพิ่มผู้ป่วยใหม่</div>
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
                                        <span className='text-[#705396]'>เลขที่บัตรประจำตัวประชาชน</span>
                                        <label className=" input input-bordered flex items-center gap-2 w-full">
                                            <input
                                                type="text"
                                                className="grow text-[#705396]"
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
                                        <label className=" input input-bordered flex items-center gap-2 w-full">
                                            <input
                                                type="date"
                                                className="grow text-[#705396]"
                                                value={birthDate}
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
                                                value={currentDate}
                                                readOnly
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
                                                value={appointmentDate}
                                                onChange={(e) => setAppointmentDate(e.target.value)}
                                            />
                                        </label>
                                        {errors.appointmentDate && <span className='text-red-500'>{errors.appointmentDate}</span>}
                                    </div>
                                </div>
                            </div>
                        </form>
                        <div className='flex justify-between'>
                            <div className='my-2 w-1/2 pr-4'>
                                <div className='flex'>
                                    <span className='text-[#705396]'>เลือกยาที่ควรหยุดรับประทาน</span>
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
                                <div className='rounded bg-[#E8DBF5] min-h-[40dvh] p-3'>
                                    <span className='text-[#705396]'> รายการที่เลือก {medications.length} รายการ</span>
                                    <div className='max-h-[45dvh] overflow-y-auto'>
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
                                                    <option value='' disabled >วัน</option>
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
                                </div>
                            </div>
                            <div className="my-44 w-1/2">
                                <div className='flex justify-center'>
                                    <button onClick={handleSave} className="text-white w-80 text-2xl font-light bg-[#BE77F1] btn btn-active mx-4">
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
