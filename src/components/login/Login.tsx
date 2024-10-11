'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie';
import axios from 'axios';

const LoginComponent = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<{ username?: string, password?: string }>({});
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        // Reset error messages
        setError({});

        // Validate inputs
        const newError: { username?: string, password?: string } = {};
        if (!username.trim()) newError.username = 'กรุณากรอกชื่อผู้ใช้';
        if (!password.trim()) newError.password = 'กรุณากรอกรหัสผ่าน';

        if (Object.keys(newError).length > 0) {
            setError(newError);
            return;
        }

        if (username !== 'colonoscopytuh' || password !== 'colonoscopytuh') {
            setError({ password: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
            return;
        }

        try {
            const formData = new FormData();
            formData.append('username', username);
            formData.append('password', password);

            const response = await axios.post(`${process.env.NEXT_PUBLIC_CALLAPI}login/`, formData);

            // console.log(response);

            if (response.status === 200) {
                Cookies.set('__user', username, { expires: 30 });
                router.push(`${process.env.NEXT_PUBLIC_BASEROUTE}home`);
            } else {
                setError({ password: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
            }
        } catch (error) {
            console.error('Error during login:', error);
            setError({ password: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง' });
        }
    };

    return (
        <div className='w-1/2 flex items-center justify-center'>
            <div className=' w-[70%]'>
                <form onSubmit={handleLogin}>
                    <div className='text-center text-4xl font-bold text-[#461F78]'>Log in</div>

                    <div className='my-5'>
                        <span className='text-[#705396] text-[30px]'>Username</span>
                        <label className="input input-bordered flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" /></svg>
                            <input type="text" className="grow" value={username} onChange={(e) => setUsername(e.target.value)} />
                        </label>
                        {error.username && <div className='text-red-500'>{error.username}</div>}
                    </div>
                    <div className='my-5'>
                        <span className='text-[#705396] text-[30px]'>Password</span>
                        <label className="input input-bordered flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" /></svg>
                            <input type="password" className="grow" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </label>
                        {error.password && <div className='text-red-500'>{error.password}</div>}
                    </div>
                    <div className="flex justify-center w-full">
                        <button type="submit" className="text-white w-40 text-[30px] font-light bg-[#AF88FF] btn btn-active">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default LoginComponent
