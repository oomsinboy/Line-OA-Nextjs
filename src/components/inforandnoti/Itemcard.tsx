import React from 'react'
import Image from 'next/image';
import { ItemCardProps } from '../type';

const ItemCard = ({ item, onDelete, onView, title }: ItemCardProps) => {
    const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        onDelete(e, item.id);
    };

    const handleViewClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        onView(item.id);
    };

    const notiNonDeletableIds = [1, 2, 3, 4];
    const infoNonDeletableIds = [ 2, 3, 4, 5, 6, 7, 8,9];

    const isNonDeletable = title === "noti" ? notiNonDeletableIds.includes(item.id) : infoNonDeletableIds.includes(item.id);

    return (
        <div className='w-full sm:w-1/2 lg:w-1/4 px-2 mb-4'>
            <div className="border border-[#705396] bg-[#F4F4FE] shadow-md rounded-lg image-full h-full">
                <div className="card-body p-2">
                    <div className='flex justify-between'>
                        <div className='w-4/5 break-words overflow-hidden text-ellipsis min-h-[48px] max-h-[50px]'>
                            {item.header}
                        </div>
                        <div className='flex'>
                            <button className='mx-1' onClick={handleViewClick}>
                                <Image
                                    src={`/image/icon_view.png`}
                                    alt="logo"
                                    width={30}
                                    height={30}
                                />
                            </button>
                            {!isNonDeletable && (
                                <button onClick={handleDeleteClick}>
                                    <Image
                                        src={`/image/icon_trash.png`}
                                        alt="logo"
                                        width={30}
                                        height={30}
                                    />
                                </button>
                            )}
                        </div>
                    </div>
                    <div className='border-b border-[#705396] opacity-50' />
                    <div className='break-words overflow-hidden text-ellipsis min-h-[90px] max-h-[90px]' dangerouslySetInnerHTML={{ __html: item.detail }} />
                </div>
            </div>
        </div>
    )
}

export default ItemCard
