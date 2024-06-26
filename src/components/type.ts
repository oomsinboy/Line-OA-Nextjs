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

export interface PatientProps {
  items: PatientData[];
}

// Patient New
export interface MedicalList {
  id: number;
  name: string;
}

// Patient View
export interface PatientViewID {
  visit_id: number;
  patient_fname: string;
  patient_lname: string;
  line_name: string | null;
  line_id: string | null;
  id_card: string;
  dob: string;
  register_date: string;
  appointment_date: string;
  appointment_time: string;
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

// Information
export interface InfoData {
  id: number;
  header: string;
  detail: string;
  lastupdate: string;
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
}

export type ItemCardProps = {
  item: InfoData;
  onDelete: (id: number) => void;
};

//  Modal
export interface ModalProps {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}
