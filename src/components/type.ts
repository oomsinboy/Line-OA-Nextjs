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

export interface MedicalList {
  id: number;
  name : string;
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