// "use client"

// import React, { useState, useEffect } from 'react';
// import Image from 'next/image';
// import { useRouter } from 'next/navigation';
// import { InfoDataX } from '@/components/type';

// interface itemsList {
//   items: InfoDataX[];
// }

// const InformationList = ({ items }: itemsList) => {
//   const router = useRouter();
//   // const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const [currentImageIndexes, setCurrentImageIndexes] = useState<{ [key: number]: number }>({});
//   const [fading, setFading] = useState(false);

//   const handleItemClick = (id: number) => {
//     router.push(`/mobile/information/detail?id=${encodeURIComponent(id)}`);
//   };

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setFading(true);
//       setTimeout(() => {
//         setCurrentImageIndexes((prevIndexes) => {
//           const newIndexes = { ...prevIndexes };
//           items.forEach((item) => {
//             if (item.images.length > 1) {
//               const currentIdx = prevIndexes[item.id] || 0;
//               newIndexes[item.id] = (currentIdx + 1) % item.images.length;
//             }
//           });
//           return newIndexes;
//         });
//         setFading(false);
//       }, 500); // Duration of the fade transition
//     }, 3000);

//     return () => clearInterval(interval);
//   }, [items]);

//   return (
//     <div className="overflow-y-auto">
//       {items.map((item, itemIndex) => (
//         <div
//           onClick={() => handleItemClick(item.id)}
//           key={item.id}
//           className="relative m-4 bg-white rounded-[30px] overflow-hidden"
//         >
//           <div className="relative w-full h-[220px] pb-[50%]">
//           {item.images.length > 1 ? (
//               <div className={`absolute inset-0 transition-opacity duration-500 ${fading ? 'opacity-10' : 'opacity-100'}`}>
//                 <Image
//                   src={item.images[currentImageIndexes[item.id] || 0]}
//                   alt={`${item.header} image ${currentImageIndexes[item.id] || 0}`}
//                   fill
//                   style={{ objectFit: 'cover' }}
//                   className="absolute inset-0"
//                   priority
//                 />
//               </div>
//             ) : (
//               <Image
//                 src={item.images[0]}
//                 alt={`${item.header} image`}
//                 fill
//                 style={{ objectFit: 'cover' }}
//                 className="absolute inset-0"
//                 priority
//               />
//             )}
//           </div>
//           <div className="absolute inset-0 bg-black bg-opacity-30"></div>
//           <div className="p-4 absolute bottom-0 left-0 right-0">
//             <h2 className="text-white text-xl font-bold">{item.header}</h2>
//             <div className="flex justify-end items-end">
//               <button className="mt-2 bg-[#AF88FF] text-white py-1 px-3 rounded-2xl">อ่านต่อ</button>
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default InformationList;

"use client"

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { InfoDataX } from '@/components/type';

interface itemsList {
  items: InfoDataX[];
}
const InformationList = ({ items }: itemsList) => {
  const router = useRouter();

  const handleItemClick = (id: number) => {
    router.push(`/mobile/information/detail?id=${encodeURIComponent(id)}`);
  };

  return (
    <div className="overflow-y-auto">
      {items.map((item, itemIndex) => (
        <div
          onClick={() => handleItemClick(item.id)}
          key={item.id}
          className="relative m-4 bg-white rounded-[30px] overflow-hidden"
        >
          <div className="relative w-full h-[220px] pb-[50%]">
            <Image
              src={item.images[0]} // แสดงเฉพาะรูปแรก
              alt={`${item.header} image`}
              fill
              style={{ objectFit: 'cover' }}
              className="absolute inset-0"
              priority
            />
          </div>
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
          <div className="p-4 absolute bottom-0 left-0 right-0">
            <h2 className="break-words text-white text-xl font-bold line-clamp-2">
              {item.header}
            </h2>
            {/* <div
                className='break-words text-white text-xl font-bold'
                dangerouslySetInnerHTML={{__html: item.header}}
              /> */}
            <div className="flex justify-end items-end">
              <button className="mt-2 bg-[#AF88FF] text-white py-1 px-3 rounded-2xl">อ่านต่อ</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InformationList;


