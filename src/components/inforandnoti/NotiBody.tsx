'use client';

import React, { useState, useEffect, } from 'react';
import Image from 'next/image';
import Swal from 'sweetalert2';
import ItemCard from './Itemcard';
import { InfoBodyProps, NotiData } from '../type';
import Modal from './Modal';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });


const NotiBody = ({ items, onFetchInfo }: InfoBodyProps) => {
    const [currentItems, setCurrentItems] = useState<NotiData[]>(items);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [titlename, setTitlename] = useState<string>('');
    const [editedContent, setEditedContent] = useState<string>('');
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [modalData, setModalData] = useState<any>(null);
    const [modalMode, setModalMode] = useState<boolean>(false);
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [textMode, setTextMode] = useState<string>('');

    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ["bold", "italic", "underline", "strike", "blockquote"],
            [{ align: ["right", "center", "justify"] }],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"],
        ],
    };

    useEffect(() => {
        setCurrentItems(items);
    }, [items]);

    const handleOpenModal = () => {
        setIsEditMode(true);
        setModalData(null);
        setShowModal(true);
        setModalMode(true);
        setTextMode('เพิ่มข้อความแจ้งเตือน');
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedFiles([]);
        setTitlename('');
        setEditedContent('');
    };

    const handleFileChange = (event: any) => {
        if (event.target.files && event.target.files[0]) {
            if (selectedFiles.length < 4) {
                setSelectedFiles([...selectedFiles, event.target.files[0]]);
                setErrorMessage(null);
            } else {
                setErrorMessage('สามารถเพิ่มได้สูงสุด 4 รูปเท่านั้น');
            }
        }
    };

    const handleDeleteFile = (index: number) => {
        setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
        if (selectedFiles.length <= 4) {
            setErrorMessage(null);
        }
    };

    const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>, id: number) => {
        e.preventDefault();
        try {
            const result = await Swal.fire({
                title: 'ยืนยันการลบข้อมูล',
                text: "คุณกำลังลบข้อมูล ต้องการดำเนินการต่อหรือไม่?",
                icon: 'warning',
                showCancelButton: true,
                cancelButtonText: 'ยกเลิก',
                confirmButtonText: 'ยืนยัน',
                reverseButtons: false,
                customClass: {
                    icon: 'custom-swal2-warning',
                },
            });

            if (result.isConfirmed) {
                await axios.delete(`${process.env.NEXT_PUBLIC_CALLAPI}notification/task/${id}`);

                setCurrentItems(currentItems.filter(item => item.id !== id));

                await Swal.fire({
                    title: 'สำเร็จ',
                    text: 'คุณได้ทำรายการเรียบร้อยแล้ว',
                    icon: 'success',
                    confirmButtonText: 'ปิด',
                });

            }
        } catch (error) {
            console.error('Error deleting data:', error);

            Swal.fire({
                title: 'ขออภัย',
                text: "เกิดข้อผิดพลาดในการลบข้อมูล กรุณาลองใหม่อีกครั้ง",
                icon: 'error',
                confirmButtonText: 'ปิด',
                customClass: {
                    icon: 'custom-swal2-error',
                }
            });
        }
    };

    const handleViewClick = async (id: number) => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_CALLAPI}notification/task/${id}`);
            const item = response.data; // API response

            setModalData(item);
            setTitlename(item.header);
            setEditedContent(item.detail);
            // setSelectedFiles(item.image);
            setIsEditMode(false);
            setModalMode(false);
            setShowModal(true);
            setTextMode("ข้อความแจ้งเตือน");

        } catch (error) {
            console.error('Error fetching item details:', error);
            // Handle error if necessary
        }
    };

    const handleEdit = () => {
        setIsEditMode(true);
        setModalMode(true);
        setTextMode("แก้ไขข้อความแจ้งเตือน");
    };

    const handleEditClick = async () => {

        const formdata = new FormData();

        formdata.append('header', titlename);
        formdata.append('des', editedContent);

        selectedFiles.forEach((file: any) => {
            formdata.append('image', file);
        });

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_CALLAPI}notification/task/${modalData.id}`, formdata);

            if (response.status === 200) {
                // setIsEditing(false);
                Swal.fire({
                    title: 'สำเร็จ',
                    text: 'คุณได้ทำการแก้ไขข้อความแจ้งเตือนเรียบร้อยแล้ว',
                    icon: 'success',
                    confirmButtonText: 'ปิด',
                }).then(() => {
                    onFetchInfo();
                    handleCloseModal();
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

    const handleSaveClick = async () => {
        const newErrors: { [key: string]: string } = {};

        if (!titlename.trim()) newErrors.titlename = 'กรุณากรอกหัวข้อ';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        } else {
            setErrors({});
        }

        if (modalData) {
            await handleEditClick();
        } else {
            await handleSaveNoti();
        }

    };

    const handleSaveNoti = async () => {
        const formdata = new FormData();

        formdata.append('header', titlename);
        formdata.append('des', editedContent);

        selectedFiles.forEach((file: any) => {
            formdata.append('image', file);
        });

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_CALLAPI}notification`, formdata);

            if (response.status === 200) {
                // setIsEditing(false);
                Swal.fire({
                    title: 'สำเร็จ',
                    text: 'คุณได้ทำการเพิ่มข้อความแจ้งเตือนเรียบร้อยแล้ว',
                    icon: 'success',
                    confirmButtonText: 'ปิด',
                }).then(() => {
                    onFetchInfo();
                    handleCloseModal();
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

    return (
        <div className='px-8'>
            <div className='h-full w-full rounded-[15px] bg-white p-5 '>
                <div className='min-h-[81.71dvh] flex flex-col'>
                    <div className='flex justify-between'>
                        <div>
                            <div className='text-xl 2xl:text-2xl text-[#5955B3] font-semibold'>ข้อความแจ้งเตือนผู้ป่วย</div>
                            <div className='text-[#705396]'>ทั้งหมด {items.length} รายการ</div>
                        </div>
                        <div>
                            <button onClick={handleOpenModal} className="relative text-white w-40 font-light bg-[#AF88FF] btn btn-active">
                                <Image
                                    className='absolute left-4'
                                    src={`/image/icon_plus.png`}
                                    alt="logo"
                                    width={20}
                                    height={20}
                                />
                                Add New</button>
                        </div>
                    </div>
                    <div className='pt-4 flex-grow'>
                        <div className='flex flex-wrap -mx-2'>
                            {currentItems.map((item) => (
                                <ItemCard key={item.id} item={item} onDelete={handleDelete} onView={handleViewClick} title="noti" />
                            ))}
                        </div>
                    </div>
                </div>
                <Modal isVisible={showModal} onClose={handleCloseModal} title={textMode}>
                    <div className='p-5'>
                        <div className='text-xl 2xl:text-2xl text-[#705396] font-semibold'>{textMode}</div>
                        <div className='mt-2'>
                            <div className='text-[#705396]'>ข้อมูลภาพ</div>
                            <div className='mt-4 grid grid-cols-7 gap-7'>
                                {/* {selectedFiles.length <= 4 && (
                                    <div className='relative'>
                                        <input
                                            type='file'
                                            accept='image/*'
                                            onChange={handleFileChange}
                                            className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
                                        />
                                        <div className='flex items-center justify-center w-full h-auto max-h-40'>
                                            <Image
                                                src='/image/icon_plus_border.png'
                                                alt="add icon"
                                                width={40}
                                                height={40}
                                                className='w-full h-auto max-h-40 '
                                            />
                                        </div>
                                    </div>
                                )}
                                {selectedFiles.map((file, index) => (
                                    <div key={index} className='relative'>
                                        <Image
                                            src={URL.createObjectURL(file)}
                                            alt={`Selected ${index}`}
                                            width={40}
                                            height={40}
                                            className='w-full h-auto max-h-40 object-cover rounded-lg'
                                        />
                                        <button
                                            onClick={() => handleDeleteFile(index)}
                                            className='absolute top-0 right-0 p-1 shadow-md'
                                            aria-label="Delete"
                                        >
                                            <Image
                                                src='/image/icon_delete.png'
                                                alt="delete icon"
                                                width={20}
                                                height={20}
                                            />
                                        </button>
                                    </div>
                                ))} */}
                                {modalMode ? (
                                    <>
                                        {selectedFiles.length <= 4 && (
                                            <div className='relative'>
                                                <input
                                                    type='file'
                                                    accept='image/*'
                                                    onChange={handleFileChange}
                                                    className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
                                                />
                                                <div className='flex items-center justify-center w-full h-auto max-h-32'>
                                                    <Image
                                                        src='/image/icon_plus_border.png'
                                                        alt="add icon"
                                                        width={40}
                                                        height={40}
                                                        className='w-[90%] 2xl:w-full h-auto max-h-32'
                                                    />
                                                </div>
                                            </div>
                                        )}
                                        {selectedFiles.map((file, index) => (
                                            <div key={index} className='relative'>
                                                <Image
                                                    src={URL.createObjectURL(file)}
                                                    alt={`Selected ${index}`}
                                                    width={40}
                                                    height={40}
                                                    className='w-[90%] 2xl:w-full h-auto max-h-40 object-cover rounded-lg'
                                                />
                                                <button
                                                    onClick={() => handleDeleteFile(index)}
                                                    className='absolute top-0 right-0 p-1 shadow-md'
                                                    aria-label="Delete"
                                                >
                                                    <Image
                                                        src='/image/icon_delete.png'
                                                        alt="delete icon"
                                                        width={20}
                                                        height={20}
                                                    />
                                                </button>
                                            </div>
                                        ))}
                                    </>
                                ) : (
                                    modalData?.image?.length > 0 && (
                                        <>
                                            {modalData.image.map((url: string, index: number) => (
                                                <div key={index} className='relative'>
                                                    <Image
                                                        src={url}
                                                        alt={`Image ${index}`}
                                                        width={40}
                                                        height={40}
                                                        className='w-[90%] 2xl:w-full h-auto max-h-40 object-cover rounded-lg cursor-pointer'
                                                        onClick={() => window.open(url, '_blank')}
                                                    />
                                                </div>
                                            ))}
                                        </>
                                    )
                                )}
                            </div>
                            {errorMessage && (
                                <div className='mt-4 text-red-500'>{errorMessage}</div>
                            )}
                            <div className="w-full mt-4">
                                <div className='my-2'>
                                    <span className='text-[#705396]'>หัวข้อ</span>
                                    <label className=" input input-bordered flex items-center gap-2 w-full">
                                        <input
                                            type="text"
                                            className="grow text-[#705396]"
                                            value={titlename}
                                            onChange={(e) => setTitlename(e.target.value)}
                                            disabled={!modalMode}
                                        />
                                    </label>
                                    {errors.titlename && <span className='text-red-500'>{errors.titlename}</span>}
                                </div>
                            </div>
                            <div className='mt-4 mb-16'>
                                <span className='text-[#705396]'>เนื้อหา</span>
                                <ReactQuill
                                    className="h-[150px] 2xl:h-[250px]"
                                    value={editedContent}
                                    onChange={(content) => setEditedContent(content)}
                                    theme="snow"
                                    readOnly={!modalMode}
                                    modules={modules}
                                />
                            </div>
                            {/* {modalMode && (
                                <div className='mt-4 flex justify-center items-center'>
                                    <button
                                        onClick={handleSaveClick}
                                        className={`text-white w-38 font-light btn btn-active bg-[#693092]`}
                                    >
                                        <Image
                                            className='gap-2'
                                            src={`/image/icon_save.png`}
                                            alt="logo"
                                            width={30}
                                            height={30}
                                        />
                                        <span>Save</span>
                                    </button>
                                </div>
                            )} */}
                            {/* {!(modalData && [1,2, 3, 4].includes(modalData.id)) && ( */}
                            {/* // )} */}
                            <div className='mt-4 flex justify-center items-center'>
                                <button
                                    onClick={isEditMode ? handleSaveClick : handleEdit}
                                    className={`text-white w-38 font-light btn btn-active bg-[#693092]`}
                                >
                                    <Image
                                        className='gap-2'
                                        src={`/image/icon_save.png`}
                                        alt="logo"
                                        width={30}
                                        height={30}
                                    />
                                    <span>{isEditMode ? 'Save' : 'Edit'}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    )
}

export default NotiBody
