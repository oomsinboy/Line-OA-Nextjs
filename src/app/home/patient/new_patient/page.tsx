"use client"

import Navbar from '@/components/Navbar'
import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import { formatCurrentDate } from '../../../../components/help'
import axios from 'axios';
import { MedicalList } from '@/components/type';
import Swal from 'sweetalert2';

const DataResponse = ({ response }: any) => {
    const {
        patient: {
            fname,
            lname,
            idcard,
            dob,
            register_time,
            appointment_date,
            otp,
            med,
        },
    } = response;

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
                                        <label className="input input-bordered flex items-center gap-2 w-full">
                                            <input
                                                type="text"
                                                className="grow"
                                                value={fname}
                                                readOnly
                                            />
                                        </label>
                                    </div>
                                </div>
                                <div className="w-1/2 pl-4">
                                    <div className='my-2'>
                                        <span className='text-[#705396]'>นามสกุล</span>
                                        <label className="input input-bordered flex items-center gap-2 w-full">
                                            <input
                                                type="text"
                                                className="grow"
                                                value={lname}
                                                readOnly
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
                                                className="grow"
                                                value={idcard}
                                                maxLength={13}
                                                pattern="\d{13}"
                                                readOnly
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
                                                className="grow"
                                                value={dob}
                                                readOnly
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
                                                className="grow pointer-events-none"
                                                value={register_time}
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
                                                className="grow"
                                                value={appointment_date}
                                                readOnly
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </form>
                        <div className='flex justify-between'>
                            <div className='my-2 w-1/2 pr-4'>
                                <div className='flex'>
                                    <span className='text-[#705396]'>เลือกยาที่ควรหยุดรับประทาน</span>
                                </div>
                                <div className='rounded bg-[#E8DBF5] min-h-[49dvh] p-3'>
                                    <span className='text-[#705396]'> รายการที่เลือก {med.length} รายการ</span>
                                    <div className='max-h-[45dvh] overflow-y-auto'>
                                        {/* {med.map((medication: any, index: number) => (
                                        <div key={index} className='flex justify-between pt-2'>
                                            <select
                                                className='w-[70%] mx-1 h-[3rem] rounded bg-[#F8F5FB] text-center text-[#705396]'
                                                value={medication.medic}
                                            >
                                                <option value={medication.medic}>{medication.medic}</option>
                                            </select>
                                            <select
                                                className='w-[20%] mx-1 h-[3rem] rounded text-center text-[#705396]'
                                                value={medication.val}
                                            >
                                                <option value={medication.val}>{medication.val} วัน</option>
                                            </select>
                                        </div>
                                    ))} */}
                                        {med.map((medication: any, index: number) => (
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
                                </div>
                            </div>

                            <div className="w-1/2 pl-4 flex justify-center items-center">
                                <div className='text-center w-1/2'>
                                    <div className='text-[#461F78] text-3xl font-semibold my-2'>OTP</div>
                                    <div className='text-[#705396] my-2'>รหัสนี้ใช้สำหรับลงทะเบียนผู้ใช้งาน Line OA</div>
                                    <div className='p-10 bg-[#F8F5FB] my-2'>
                                        <span className='text-[#7F57D0] text-4xl tracking-widest'>{otp}</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


function NewPatient() {
    const [firstname, setFirstname] = useState<string>('');
    const [lastname, setLastname] = useState<string>('');
    const [idCard, setIdCard] = useState<string>('');
    const [birthDate, setBirthDate] = useState<string>('');
    const [currentDate, setCurrentDate] = useState<string>('');
    const [appointmentDate, setAppointmentDate] = useState<string>('');
    const [medications, setMedications] = useState([{ id: Date.now(), name: '', dose: '' }]);
    const [medicalList, setMedicalList] = useState<MedicalList[]>([]);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [errorMed, setErrorMed] = useState<string>('');
    const [response, setResponse] = useState<any>(null);


    useEffect(() => {
        setCurrentDate(formatCurrentDate());

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
    }, []);

    const handleIdCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^\d{0,13}$/.test(value)) {
            setIdCard(value);
        }
    }

    const addMedication = () => {
        setMedications([...medications, { id: Date.now(), name: '', dose: '' }]);
    };

    const removeMedication = (id: number) => {
        setMedications(medications.filter(medication => medication.id !== id));
    };

    const handleMedicationNameChange = (e: React.ChangeEvent<HTMLSelectElement>, id: number) => {
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

        const medData = medications
            .filter(medication => medication.dose.trim() !== '' && medication.name.trim() !== '')
            .map(medication => ({
                val: medication.dose.trim(),
                medic: medication.name.trim(),
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
        if (!appointmentDate.trim()) newErrors.appointmentDate = 'กรุณากรอกวันนัดหมาย';
        if (medData.length === 0) {
            setErrorMed('กรุณาเลือกรายการ');
        } else {
            setErrorMed('');
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
            console.log('Data saved successfully:', response.data);

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
        return <DataResponse response={response} />;
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
                                        <label className="input input-bordered flex items-center gap-2 w-full">
                                            <input
                                                type="text"
                                                className="grow"
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
                                        <label className="input input-bordered flex items-center gap-2 w-full">
                                            <input
                                                type="text"
                                                className="grow"
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
                                        <label className="input input-bordered flex items-center gap-2 w-full">
                                            <input
                                                type="text"
                                                className="grow"
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
                                        <label className="input input-bordered flex items-center gap-2 w-full">
                                            <input
                                                type="date"
                                                className="grow"
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
                                                className="grow pointer-events-none"
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
                                                className="grow"
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
                                            src={`/icon_addplus.png`}
                                            alt="logo"
                                            width={30}
                                            height={30}
                                        />
                                    </button>
                                </div>
                                {errorMed && <span className='text-red-500'>{errorMed}</span>}
                                <div className='rounded bg-[#E8DBF5] min-h-[49dvh] p-3'>
                                    <span className='text-[#705396]'> รายการที่เลือก {medications.length} รายการ</span>
                                    <div className='max-h-[45dvh] overflow-y-auto'>
                                        {medications.map((medication, index) => (
                                            <div key={medication.id} className='flex justify-between pt-2'>
                                                <select
                                                    className='w-[70%] mx-1 h-[3rem] rounded bg-[#F8F5FB] text-center text-[#705396]'
                                                    value={medication.name}
                                                    onChange={(e) => handleMedicationNameChange(e, medication.id)}
                                                >
                                                    <option value='' disabled >เลือกยา</option>
                                                    {medicalList.map(medical => (
                                                        <option key={medical.id} value={medical.name}>{medical.name}</option>
                                                    ))}
                                                </select>
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
                                                {medications.length > 1 && (
                                                    <button className='mx-1' onClick={() => removeMedication(medication.id)}>
                                                        <Image
                                                            src={`/icon_delete.png`}
                                                            alt="delete medication"
                                                            width={30}
                                                            height={30}
                                                        />
                                                    </button>
                                                )}
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

                            {/* <div className="w-1/2 pl-4 flex justify-center items-center">
                                <div className='text-center w-1/2'>
                                    <div className='text-[#461F78] text-3xl font-semibold my-2'>OTP</div>
                                    <div className='text-[#705396] my-2'>รหัสนี้ใช้สำหรับลงทะเบียนผู้ใช้งาน Line OA</div>
                                    <div className='p-10 bg-[#F8F5FB] my-2'>
                                        <span className='text-[#7F57D0] text-4xl tracking-widest'>123456</span>
                                    </div>
                                </div>
                            </div> */}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default NewPatient
