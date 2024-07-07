'use client';
import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import { PatientData, PatientProps } from '../type'
import { formatDate } from '../help';
import Link from 'next/link';

const PatientBody = ({ items }: PatientProps) => {
    const [currentItems, setCurrentItems] = useState<PatientData[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage] = useState<number>(10);

    useEffect(() => {
        if (Array.isArray(items.all_visit)) {
            setCurrentItems(items.all_visit);
        } else {
            console.error("คาดว่า items.all_visit จะเป็นอาร์เรย์ แต่ได้:", items.all_visit);
        }
    }, [items]);

    // Filtered items based on search term
    // const filteredItems = currentItems.filter(item =>
    //     item.patient_name.toLowerCase().includes(searchTerm.toLowerCase())
    // );

    const filteredItems = currentItems
        .filter(item => item.patient_name.toLowerCase().includes(searchTerm.toLowerCase())).reverse();


    // Pagination calculations
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentDisplayItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

    // Change page
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    // const paginationButtons = Array.from({ length: totalPages }, (_, i) => (
    //     <button
    //         key={i + 1}
    //         className={`join-item btn btn-sm ${currentPage === i + 1 ? 'btn-active bg-white' : ''}`}
    //         onClick={() => paginate(i + 1)}
    //         disabled={currentPage === i + 1}
    //     >
    //         {i + 1}
    //     </button>
    // ));

    const paginationButtons = () => {
        const maxPagesToShow = 5; // Maximum number of page buttons to show
        const pages: number[] = [];

        if (totalPages <= maxPagesToShow) {
            // Show all pages if total pages are less than or equal to maxPagesToShow
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Determine active page position relative to the pagination range
            let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
            let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

            if (endPage - startPage < maxPagesToShow - 1) {
                startPage = Math.max(1, endPage - maxPagesToShow + 1);
            }

            // Add first page button
            if (startPage > 1) {
                pages.push(1);
                if (startPage > 2) {
                    pages.push(-1); // Ellipsis placeholder
                }
            }

            // Add pages within the range
            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }

            // Add last page button
            if (endPage < totalPages) {
                if (endPage < totalPages - 1) {
                    pages.push(-1); // Ellipsis placeholder
                }
                pages.push(totalPages);
            }
        }

        return pages.map((page, index) => (
            <button
                key={index}
                className={`join-item btn btn-sm ${page === currentPage ? 'btn-active bg-white' : ''}`}
                onClick={() => paginate(page)}
                disabled={page === currentPage || page === -1}
            >
                {page === -1 ? '...' : page}
            </button>
        ));
    };

    return (
        <div className='px-8'>
            <div className='h-full w-full rounded-[15px] bg-white p-5 '>
                <div className='min-h-[81.71dvh] flex flex-col'>
                    <div className='flex justify-between'>
                        <div>
                            <div className='text-2xl text-[#5955B3] font-semibold'>รายการผู้ป่วย</div>
                            <div className='text-[#705396]'>ทั้งหมด {currentItems.length} รายการ</div>
                        </div>
                        <div className='flex'>
                            <div className='w-72'>
                                <label className="input input-bordered flex items-center gap-2 w-full">
                                    <input
                                        type="text"
                                        className="grow"
                                        placeholder='Search'
                                        value={searchTerm}
                                        onChange={(e) => {setSearchTerm(e.target.value);setCurrentPage(1);}}
                                    />
                                </label>
                            </div>
                            <Link href={`${process.env.NEXT_PUBLIC_BASEROUTE}home/patient/notifications-today`} className="relative text-white w-[160px] font-light bg-[#AF88FF] btn btn-active mx-4">
                                <span>Notifications Today</span>
                                {items.daily_noti > 0 && (
                                    <div className='absolute top-0 right-0 translate-x-[40%] -translate-y-[40%] text-white rounded-full bg-red-500 w-6 h-6 flex items-center justify-center'>
                                        {items.daily_noti}
                                    </div>
                                )}
                            </Link>
                            <Link href={`${process.env.NEXT_PUBLIC_BASEROUTE}home/patient/new-patient`} className="relative text-white w-40 font-light bg-[#AF88FF] btn  ">
                                <Image
                                    className='absolute left-4'
                                    src={`/image/icon_plus.png`}
                                    alt="logo"
                                    width={20}
                                    height={20}
                                />
                                Add New</Link>
                        </div>
                    </div>
                    <div className='pt-3 flex-grow'>
                        <div className="overflow-x-auto ">
                            <table className="table ">
                                <thead>
                                    <tr className='text-center bg-[#C0B4D9] text-base text-[#461F78]'>
                                        <th>วันที่ลงทะเบียน</th>
                                        <th>วันนัดหมายตามกำหนด</th>
                                        <th>ชื่อ-นามสกุล</th>
                                        <th>สถานะ</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody className='text-center text-base text-[#705396]'>
                                    {currentDisplayItems.map((item, index) => (
                                        <tr key={index} className={ `border-none ${(index + 1) % 2 === 0 ? 'bg-[#F4F4FE]' : ''}`}>
                                            <td>{formatDate(item.timestamp)}</td>
                                            <td>{item.appointment_date} | {item.appointment_time}</td>
                                            <td>{item.patient_name}</td>
                                            <td>{item.state}</td>
                                            <td className=' justify-center flex'>
                                                <Link href={`/home/patient/view-patient?id=${item.visit_id}`}>
                                                    <Image
                                                        src={`/image/icon_view.png`}
                                                        alt="logo"
                                                        width={30}
                                                        height={30}
                                                    />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className='mt-4 flex justify-end '>
                        <div className="join">
                            {paginationButtons()}
                        </div>
                    </div>
                    {/* <div className="pagination mt-4 select-none">
                        <ul className="flex justify-end">
                            {Array.from({ length: Math.ceil(filteredItems.length / itemsPerPage) }, (_, i) => (
                                <li
                                    key={i}
                                    className={`cursor-pointer px-3 py-1 mx-1 rounded-full ${currentPage === i + 1 ? 'bg-[#AF88FF] text-white' : 'bg-white text-[#461F78]'}`}
                                    onClick={() => paginate(i + 1)}
                                >
                                    {i + 1}
                                </li>
                            ))}
                        </ul>
                    </div> */}
                </div>
            </div>
        </div>
    )
}

export default PatientBody
