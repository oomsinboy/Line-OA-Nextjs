'use client';

import React, { useState, useRef, useEffect,  } from 'react';
import Image from 'next/image';
import Swal from 'sweetalert2';
import ItemCard from './Itemcard';
import { InfoBodyProps, NotiData } from '../type';

const NotiBody = ({ items } : InfoBodyProps) => {
    const [currentItems, setCurrentItems] = useState<NotiData[]>(items);
    const modalRef = useRef<HTMLDialogElement>(null);

    const openModal = () => {
        if (modalRef.current) {
            modalRef.current.showModal();
        }
    };

    useEffect(() => {
        setCurrentItems(items);
    }, [items]);

    const handleDelete = (id: number) => {
        // e.preventDefault();
        Swal.fire({
            title: 'ยืนยันการลบข้อมูล',
            text: "คุณกำลังลบข้อมูล ต้องการดำเนินการต่อหรือไม่ ?",
            icon: 'warning',
            showCancelButton: true,
            cancelButtonText: 'ยกเลิก',
            confirmButtonText: 'ยืนยัน',
            reverseButtons: false,
            customClass: {
                icon: 'custom-swal2-warning',
            },
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'สำเร็จ',
                    text: 'คุณได้ทำรายการเรียบร้อยแล้ว',
                    icon: 'success',
                    confirmButtonText: 'ปิด',
                })
                // .then(() => {
                // });
            }
        });
    };
    return (
        <div className='px-8'>
            <div className='h-full w-full rounded-[15px] bg-white p-5 '>
                <div className='min-h-[81.71dvh] flex flex-col'>
                    <div className='flex justify-between'>
                        <div>
                            <div className='text-2xl text-[#5955B3] font-semibold'>ข้อความแจ้งเตือนผู้ป่วย</div>
                            <div className='text-[#705396]'>ทั้งหมด {items.length} รายการ</div>
                        </div>
                        <div>
                            <button onClick={openModal} className="relative text-white w-40 font-light bg-[#AF88FF] btn btn-active">
                                <Image
                                    className='absolute left-4'
                                    src={`/image/icon_plus.png`}
                                    alt="logo"
                                    width={20}
                                    height={20}
                                />
                                Add New</button>
                            <dialog className="modal" ref={modalRef}>
                                <div className="modal-box w-11/12 max-w-5xl">
                                    <h3 className="font-bold text-lg">Hello!</h3>
                                    <p className="py-4">Click the button below to close</p>
                                    <div className="modal-action">
                                        <form method="dialog">
                                            <button className="btn">Close</button>
                                        </form>
                                    </div>
                                </div>
                            </dialog>
                        </div>
                    </div>
                    <div className='pt-4 flex-grow'>
                        <div className='flex flex-wrap -mx-2'>
                            {currentItems.map((item) => (
                                <ItemCard key={item.id} item={item} onDelete={handleDelete} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NotiBody
