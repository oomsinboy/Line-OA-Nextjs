import "dayjs/locale/th";
import Dayjs from "dayjs";
import buddhistEra from "dayjs/plugin/buddhistEra";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

Dayjs.extend(buddhistEra);

interface NewAdapterProps {
  locale: any;
  formats: any;
}

export default class newAdapter extends AdapterDayjs {
  constructor({ locale, formats }: NewAdapterProps) {
    super({ locale, formats });
  }


  formatByString = (date: any, format: any) => {
    let newFormat = format.replace(/\bYYYY\b/g, "BBBB");
    // console.log(date, "date");
    // console.log(format, "format");
    // console.log(newFormat, "newFormat");
    // if (format === "YYYY") {
    //   format = "BBBB";
    // }
    // console.log(
    //   this.dayjs(date).format(newFormat),
    //   "return value with new format"
    // );
    return this.dayjs(date).format(newFormat);
  };
}

// import "dayjs/locale/th";
// import Dayjs from "dayjs";
// import buddhistEra from "dayjs/plugin/buddhistEra";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

// Dayjs.extend(buddhistEra);

// interface NewAdapterProps extends AdapterDayjsProps {
//     locale: any;
//     formats: any;
//     instance?: any;  // แก้ไขเพื่อรองรับ 'instance' ที่ไม่ทราบประเภท
// }

// export default class NewAdapter extends AdapterDayjs {
//     constructor({ locale, formats, instance }: NewAdapterProps) {
//         super({ locale, formats });
//         // กำหนดการใช้งาน instance ได้ที่นี่ หากจำเป็น
//         if (instance) {
//             // ทำสิ่งที่ต้องการกับ instance
//         }
//     }

//     formatByString = (date: any, format: string): string => {
//         let newFormat = format.replace(/\bYYYY\b/g, "BBBB");
//         console.log(date, "date");
//         console.log(format, "format");
//         console.log(newFormat, "newFormat");

//         const formattedDate = this.dayjs(date).format(newFormat);
//         console.log(formattedDate, "return value with new format");
//         return formattedDate;
//     };
// }
