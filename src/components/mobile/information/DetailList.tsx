"use client"

import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import { DetailListx } from '@/app/mobile/information/detail/page';

interface DetailListProps {
  items: DetailListx;
}

const DetailList = ({ items }: DetailListProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fading, setFading] = useState(false);

  // useEffect(() => {
  //   let interval: NodeJS.Timeout | null = null;

  //   if (items.image.length > 1) {
  //     interval = setInterval(() => {
  //       setFading(true);
  //       setTimeout(() => {
  //         setCurrentImageIndex((prevIndex) =>
  //           prevIndex === items.image.length - 1 ? 0 : prevIndex + 1
  //         );
  //         setFading(false);
  //       }, 500); // Duration of the fade transition
  //     }, 3000);
  //   }

  //   return () => {
  //     if (interval) {
  //       clearInterval(interval);
  //     }
  //   };
  // }, [items.image]);


  const handleNextSlide = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === items.image.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrevSlide = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? items.image.length - 1 : prevIndex - 1
    );
  };

  const handleDotClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className='p-4 overflow-y-auto'>
      <div className='mb-4 relative w-full h-auto'>
        {/* {items.image.length > 0 && (
          <div className={`transition-opacity duration-500 ${fading ? 'opacity-10' : 'opacity-100'}`}>
            <Image
              width={400}
              height={200}
              src={items.image[currentImageIndex % items.image.length]}
              alt={`${items.header} image ${currentImageIndex + 1}`}
              className='w-full h-auto transition-opacity duration-500 ease-in-out rounded-xl'
            />
          </div>
        )} */}

        {items.image.length > 0 && (
          <div className='relative'>
            <Image
              width={400}
              height={200}
              src={items.image[currentImageIndex]}
              alt={`${items.header} image ${currentImageIndex + 1}`}
              className='w-full h-auto rounded-xl'
            />
            {items.image.length > 1 && (
              <>
                <button
                  onClick={handlePrevSlide}
                  className='absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-r-md'
                >
                  {'<'}
                </button>
                <button
                  onClick={handleNextSlide}
                  className='absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-l-md'
                >
                  {'>'}
                </button>
              </>
            )}
          </div>
        )}
      </div>
      {items.image.length > 1 && (
        <div className='flex justify-center space-x-2 mb-4'>
          {items.image.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-3 h-3 rounded-full ${index === currentImageIndex ? 'bg-[#7C52C6]' : 'bg-gray-300'}`}
            />
          ))}
        </div>
      )}
      <h3 className='text-lg font-semibold mb-2 text-[#7C52C6]'>{items.header}</h3>
      <div
        className='break-words text-[#6D7B89]'
        dangerouslySetInnerHTML={{
          __html: items.detail.replace(
            /<ul>/g,
            '<ul class="list-disc pl-5">'
          ).replace(
            /<li>/g,
            '<li class="mb-1">'
          )
        }}
      />
    </div>
  );
}

export default DetailList;
