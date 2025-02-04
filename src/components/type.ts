// Patient
export interface PatientData {
  visit_id: number;
  patient_name: string;
  timestamp: string;
  appointment_date: string;
  appointment_time: string;
  state_id: number;
  state: string;
}

export interface NotificationsPatient {
  visit_id: number,
  pt_name: string,
  regis_date: string,
  appointment_date: string
  appointment_time: string,
  state: string
}

export interface NotiPatientProps {
  items: NotificationsPatient[];
}

export interface FixPatient {
  all_visit : PatientData[];
  daily_noti: number
}

export interface PatientProps {
  items: FixPatient;
}

// Patient New
export interface MedicalList {
  id: number;
  name: string;
}

// Patient View
export interface PatientViewID {
  firstname: string | number | readonly string[] | undefined;
  state(state: any): unknown;
  visit_id: number;
  patient_id: number;
  patient_fname: string;
  patient_lname: string;
  line_name: string;
  line_id: string | null;
  id_card: string;
  dob: string;
  register_date: string;
  appointment_date: string;
  appointment_time: string;
  state_id: number;
  med: {
      val: string;
      medic: string;
  }[];
  total_med: number;
  otp: string;
}

export interface DailyDetail {
  daily_id?: number;
  ptname: string;
  date_before_appointment: string;
  noti_id?: number;
  noti_detail: string;
  noti_image?: string[];
}

export interface CallViewID {
  patient: PatientViewID;
  daily_detail: DailyDetail[];
}

export interface PatientStateOTP {
  items: CallViewID;
}

export interface PatientStateCall {
  items: CallViewID;
  fetchDataview: () => Promise<void>; 
}

// Information
export interface InfoData {
  id: number;
  header: string;
  detail: string;
  lastupdate: string;
}

export interface InfoDataX {
  id: number;
  header: string;
  detail: string;
  lastupdate: string;
  images: string[]
}


export interface NotiData {
  id: number;
  header: string;
  detail: string;
  lastupdate: string;
}

export interface NotiBodyProps {
  items: NotiData[];
}

export interface InfoBodyProps {
  items: InfoData[];
  onFetchInfo: () => void;
}

export type ItemCardProps = {
  item: InfoData;
  // onDelete: (id: number) => void;
  onDelete: (e: React.MouseEvent<HTMLButtonElement>, id: number) => void;
  onView: (id: number) => void;
  title: string;
};

//  Modal
export interface ModalProps {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}
