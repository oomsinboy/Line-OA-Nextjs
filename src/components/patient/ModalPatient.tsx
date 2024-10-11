import React from 'react'
import Image from 'next/image';
import { ModalProps } from '../type';


const ModalPatient = ({ isVisible, onClose, title, children }: ModalProps) => {
    if (!isVisible) return null;

    return (
        <div className='fixed inset-0 bg-black bg-opacity-20 flex justify-center items-center'>
            <div className='w-[80%] animate-modalOpen'>
                <div className='relative bg-white p-3 rounded'>
                    <div className='absolute right-2'>
                        <button onClick={() => onClose()}>
                            <Image
                                src={`/image/icon_close.png`}
                                alt="logo"
                                width={30}
                                height={30}
                            />
                        </button>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default ModalPatient