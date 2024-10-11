'use client';

import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import { NotificationsPatient, NotiPatientProps } from '../type'
import { formatDate } from '../help';
import Link from 'next/link';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import 'moment/locale/th';

type SortableKeys = keyof NotificationsPatient;

const Notificationtoday = ({ items }: NotiPatientProps) => {
    const [currentItems, setCurrentItems] = useState<NotificationsPatient[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage] = useState<number>(10);
    const [sortConfig, setSortConfig] = useState<{ key: SortableKeys, direction: 'asc' | 'desc' } | null>(null);

    useEffect(() => {
        setCurrentItems(items);
    }, [items]);

    const filteredItems = currentItems
        .filter(item => item.pt_name.toLowerCase().includes(searchTerm.toLowerCase()))
        .reverse();

    const sortedItems = React.useMemo(() => {
            if (sortConfig !== null) {
                return [...filteredItems].sort((a, b) => {
                    if (a[sortConfig.key] < b[sortConfig.key]) {
                        return sortConfig.direction === 'asc' ? -1 : 1;
                    }
                    if (a[sortConfig.key] > b[sortConfig.key]) {
                        return sortConfig.direction === 'asc' ? 1 : -1;
                    }
                    return 0;
                });
            }
            return filteredItems;
    }, [filteredItems, sortConfig]);

    // Pagination calculations
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentDisplayItems = sortedItems.slice(indexOfFirstItem, indexOfLastItem);

    // Change page
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

    // const paginationButtons = Array.from({ length: totalPages }, (_, i) => (
    //     <li
    //         key={i + 1}
    //         className={`list-none cursor-pointer px-3 py-1 mx-1 rounded-full ${currentPage === i + 1 ? 'bg-[#AF88FF] text-white' : 'bg-white text-[#461F78]'}`}
    //         onClick={() => paginate(i + 1)}
    //     >
    //         {i + 1}
    //     </li>
    // ));

    const generatePaginationButtons = () => {
        const pages = [];
        if (totalPages <= 4) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(
                    <li
                        key={i}
                        className={`list-none cursor-pointer px-3 py-1 mx-1 rounded-full ${currentPage === i ? 'bg-[#AF88FF] text-white' : 'bg-white text-[#461F78]'}`}
                        onClick={() => paginate(i)}
                    >
                        {i}
                    </li>
                );
            }
        } else {
            pages.push(
                <li
                    key={1}
                    className={`list-none cursor-pointer px-3 py-1 mx-1 rounded-full ${currentPage === 1 ? 'bg-[#AF88FF] text-white' : 'bg-white text-[#461F78]'}`}
                    onClick={() => paginate(1)}
                >
                    1
                </li>
            );
    
            if (currentPage > 3) {
                pages.push(<li key="start-ellipsis" className="list-none px-3 py-1 mx-1">...</li>);
            }
    
            const startPage = Math.max(2, currentPage - 1);
            const endPage = Math.min(totalPages - 1, currentPage + 1);
    
            for (let i = startPage; i <= endPage; i++) {
                pages.push(
                    <li
                        key={i}
                        className={`list-none cursor-pointer px-3 py-1 mx-1 rounded-full ${currentPage === i ? 'bg-[#AF88FF] text-white' : 'bg-white text-[#461F78]'}`}
                        onClick={() => paginate(i)}
                    >
                        {i}
                    </li>
                );
            }
    
            if (currentPage < totalPages - 2) {
                pages.push(<li key="end-ellipsis" className="list-none px-3 py-1 mx-1">...</li>);
            }
    
            pages.push(
                <li
                    key={totalPages}
                    className={`list-none cursor-pointer px-3 py-1 mx-1 rounded-full ${currentPage === totalPages ? 'bg-[#AF88FF] text-white' : 'bg-white text-[#461F78]'}`}
                    onClick={() => paginate(totalPages)}
                >
                    {totalPages}
                </li>
            );
        }
    
        return pages;
    };

    const handleSort = (key: SortableKeys) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (key: string) => {
        if (!sortConfig || sortConfig.key !== key) {
            return <FontAwesomeIcon icon={faSort} />;
        }
        if (sortConfig.direction === 'asc') {
            return <FontAwesomeIcon icon={faSortUp} />;
        }
        return <FontAwesomeIcon icon={faSortDown} />;
    };

    return (
        <div className='px-8'>
            <div className='h-full w-full rounded-[15px] bg-white p-5 '>
                <div className='min-h-[81.71dvh] flex flex-col'>
                    <div className='flex justify-between'>
                        <div>
                            <div className='text-xl 2xl:text-2xl text-[#5955B3] font-semibold'>รายการแจ้งเตือนผู้ป่วยวันนี้</div>
                            <div className='text-[#705396]'>ทั้งหมด {filteredItems.length} รายการ</div>
                        </div>
                        <div className='flex'>
                            <div className='w-72'>
                                <label className="input input-bordered flex items-center gap-2 w-full">
                                    <input
                                        type="text"
                                        className="grow"
                                        placeholder='Search'
                                        value={searchTerm}
                                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                    />
                                </label>
                            </div>
                            <Link href={`${process.env.NEXT_PUBLIC_BASEROUTE}home/patient`} className="relative text-white w-[160px] font-light bg-[#693092] btn btn-active mx-4">
                                Patient Page
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
                    <div className='2xl:pt-3 flex-grow'>
                        <div className="overflow-x-auto ">
                            <table className="table ">
                                <thead>
                                    <tr className='text-center bg-[#C0B4D9] text-base text-[#461F78]'>
                                        <th className='w-[398px] cursor-pointer' onClick={() => handleSort('regis_date')}>
                                            วันที่ลงทะเบียน {getSortIcon('regis_date')}
                                        </th>
                                        <th className='w-[427px] cursor-pointer' onClick={() => handleSort('appointment_date')}>
                                            วันนัดหมายตามกำหนด {getSortIcon('appointment_date')}
                                        </th>
                                        <th className='w-[450px] cursor-pointer' onClick={() => handleSort('pt_name')}>
                                            ชื่อ-นามสกุล {getSortIcon('pt_name')}
                                        </th>
                                        <th className='w-[108px] cursor-pointer' onClick={() => handleSort('state')}>
                                            สถานะ {getSortIcon('state')}
                                        </th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody className='text-center text-base text-[#705396]'>
                                    {currentDisplayItems.map((item, index) => (
                                        <tr key={index} className={`border-none ${(index + 1) % 2 === 0 ? 'bg-[#F4F4FE]' : ''}`}>
                                            <td className='w-[398px]'>
                                                {/* {formatDate(item.regis_date)} */}
                                                {moment.utc(item.regis_date).add(543, 'years').format('DD-MM-YYYY HH:mm:ss')}
                                            </td>
                                            <td className='w-[427px]'>{moment(item.appointment_date).add(543, 'years').format('DD-MM-YYYY')} | {item.appointment_time}</td>
                                            <td className='w-[450px] break-words'>{item.pt_name}</td>
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
                    <div className="pagination mt-3 2xl:mt-4 select-none flex justify-end items-center">
                        {/* <button
                            className="px-3 py-1 mx-1 rounded-full bg-white text-[#461F78] cursor-pointer"
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            &lt;
                        </button>
                        {paginationButtons}
                        <button
                            className="px-3 py-1 mx-1 rounded-full bg-white text-[#461F78] cursor-pointer"
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            &gt;
                        </button> */}
                        <button
                            className="px-3 py-1 mx-1 rounded-full bg-white text-[#461F78] cursor-pointer"
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            &lt;
                        </button>
                        {generatePaginationButtons()}
                        <button
                            className="px-3 py-1 mx-1 rounded-full bg-white text-[#461F78] cursor-pointer"
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            &gt;
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Notificationtoday
