'use client'

import React, { lazy, Suspense } from 'react';
import './alert.css'

const OTPPageContent = lazy(() => import('../../components/otp/Otp'));

function OTPPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <OTPPageContent />
        </Suspense>
    );
}

export default OTPPage;

// function OTPPageContent() {
//     const [otp, setOtp] = useState<string>('');
//     const searchParams = useSearchParams()
//     const userId = searchParams.get('userId') || ""

//     const containerStyle: CSSProperties = {
//         display: 'flex',
//         justifyContent: 'center',
//         margin: '20px 0'
//     };

//     const inputStyle: CSSProperties = {
//         width: '50px',
//         height: '60px',
//         margin: '0 5px',
//         fontSize: '18px',
//         border: '1px solid #7F57D0',
//         textAlign: 'center'
//     };

//     const verifyOTP = async () => {

//         if (otp.length !== 6) {
//             Swal.fire({
//                 title: 'ขออภัย',
//                 text: "กรุณากรอก OTP ให้ถูกต้อง",
//                 icon: 'warning',
//                 confirmButtonText: 'Try Again',
//                 customClass: {
//                     icon: 'custom-swal2-warning-m',
//                 },
//             });
//             return;
//         }

//         const payload = {
//             userId: userId,
//             otp: otp
//         };

//         try {
//             const response = await axios.post(`${process.env.NEXT_PUBLIC_CALLAPI}otp/verify`, payload, {
//                 headers: {
//                     'Content-Type': 'application/json'
//                 }
//             });
//             console.log('Data saved successfully:', response.data);

//             if (response.status === 200) {
//                 Swal.fire({
//                     title: 'สำเร็จ',
//                     text: 'ระบบได้ทำการลงทะเบียน ข้อมูลของท่านเรียบร้อยแล้ว',
//                     icon: 'success',
//                     cancelButtonText: 'Close',
//                     customClass: {
//                         icon: 'custom-swal2-warning-text',
//                     },
//                 });
//             } else {
//                 Swal.fire({
//                     title: 'ขออภัย',
//                     text: "OTP ของท่านไม่ถูกต้องหรือไม่มีข้อมูลของคุณในระบบ",
//                     icon: 'warning',
//                     confirmButtonText: 'ปิด',
//                     customClass: {
//                         icon: 'custom-swal2-warning',
//                     }
//                 });
//             }
//         } catch (error) {
//             console.error('Error saving data:', error);

//             Swal.fire({
//                 title: 'ขออภัย',
//                 text: "OTP ของท่านไม่ถูกต้องหรือไม่มีข้อมูลของคุณในระบบ",
//                 icon: 'warning',
//                 confirmButtonText: 'Try Again',
//                 customClass: {
//                     icon: 'custom-swal2-warning-m',
//                 },
//             });

//         }
//     }

//     return (
//         <div className='min-h-screen'>
//             <div className='py-2 bg-[#AF88FF] flex justify-center items-center h-12'>
//                 <div className='text-white text-center'>
//                     <span>Sign up</span>
//                 </div>
//             </div>

//             <div className='pt-[25dvh] flex justify-center items-center text-center'>
//                 <div>
//                     <span className='text-2xl'>Please Fill in OTP</span>
//                     <div>
//                         <OtpInput
//                             value={otp}
//                             onChange={setOtp}
//                             numInputs={6}
//                             containerStyle={containerStyle}
//                             inputStyle={inputStyle}
//                             renderInput={(props) => <input {...props} />}
//                         />
//                     </div>
//                     <div className="flex justify-center w-full my-10">
//                         <button onClick={verifyOTP} className="text-white w-32 h-10 text-xl font-light bg-[#AF88FF] btn btn-active">Submit</button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default OTPPageContent;
