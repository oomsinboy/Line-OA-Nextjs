import React from 'react'
import Image from 'next/image';
import { ItemCardProps } from '../type';

const ItemCard = ({ item, onDelete }: ItemCardProps) => {
    return (
        <div className='w-full sm:w-1/2 lg:w-1/4 px-2 mb-4'>
            <div className="border border-[#705396] bg-[#F4F4FE] shadow-md rounded-lg image-full h-full">
                <div className="card-body p-2">
                    <div className='flex justify-between'>
                        <div className='w-4/5 break-words'>
                            {item.header}
                        </div>
                        <div className='flex'>
                            <button className='mx-1'>
                                <Image
                                    src={`/image/icon_view.png`}
                                    alt="logo"
                                    width={30}
                                    height={30}
                                />
                            </button>
                            <button  onClick={() => onDelete(item.id)}>
                                <Image
                                    src={`/image/icon_trash.png`}
                                    alt="logo"
                                    width={30}
                                    height={30}
                                />
                            </button>
                        </div>
                    </div>
                    <div className='border-b border-[#705396] opacity-50' />
                    <div className='break-words' dangerouslySetInnerHTML={{ __html: item.detail }} />
                </div>
            </div>
        </div>
    )
}

export default ItemCard
