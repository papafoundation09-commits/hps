export type UserRole = 
  | "super_admin" 
  | "hospital_admin" 
  | "doctor" 
  | "nurse" 
  | "receptionist" 
  | "lab_tech" 
  | "pharmacist" 
  | "patient" 
  | "insurance_staff";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  hospitalId?: string;
  department?: string;
}

export interface Doctor {
  id: string;
  name: string;
  title: string;
  specialty: string;
  hospital: string;
  qualification: string;
  experienceYears: number;
  rating: number;
  reviewsCount: number;
  consultationFee: number;
  avatar: string;
  languages: string[];
  availability: {
    days: string[];
    timeSlots: string[];
  };
  bio: string;
  isOnline: boolean;
}

export interface PatientVitals {
  bpSystolic: number;
  bpDiastolic: number;
  heartRate: number;
  temperatureF: number;
  spO2: number;
  respiratoryRate: number;
  bmi: number;
  weightKg: number;
  heightCm: number;
  bloodGroup: string;
  recordedAt: string;
}

export interface Allergy {
  id: string;
  allergen: string;
  severity: "Mild" | "Moderate" | "Severe";
  reaction: string;
  notes?: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string; // e.g. "Once daily after food"
  duration: string; // e.g. "14 days"
  startDate: string;
  prescribedBy: string;
  status: "Active" | "Completed" | "Discontinued";
}

export interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  date: string;
  medications: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
  }[];
  diagnosis: string;
  qrVerificationCode: string;
  status: "Issued" | "Filled" | "Partially Filled" | "Cancelled";
  notes?: string;
}

export interface SoapNote {
  id: string;
  visitId: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  date: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  icdCodes: { code: string; description: string }[];
  cptCodes: { code: string; description: string }[];
}

export interface LabOrder {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  testName: string;
  category: "Hematology" | "Biochemistry" | "Microbiology" | "Pathology" | "Radiology";
  orderDate: string;
  status: "Ordered" | "Sample Collected" | "Processing" | "Completed";
  barcode: string;
  specimenType?: string;
  resultSummary?: string;
  reportUrl?: string;
  dicomImages?: {
    id: string;
    seriesName: string;
    modality: "X-RAY" | "CT" | "MRI" | "ULTRASOUND";
    imageUrl: string;
    sliceCount: number;
    studyDate: string;
  }[];
}

export interface PharmacyItem {
  id: string;
  name: string;
  genericName: string;
  category: "Antibiotics" | "Analgesics" | "Cardiovascular" | "Diabetic" | "Vitamins" | "Other";
  stockQty: number;
  reorderLevel: number;
  unitPrice: number;
  dosageForm: "Tablet" | "Capsule" | "Syrup" | "Injection" | "Ointment";
  manufacturer: string;
  expiryDate: string;
  location: string;
}

export type ConsultType = "Video" | "Audio" | "Chat" | "In-Person" | "Home Visit";

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorAvatar: string;
  hospital: string;
  consultType: ConsultType;
  date: string;
  timeSlot: string;
  status: "Scheduled" | "Waiting Room" | "In Progress" | "Completed" | "Cancelled";
  paymentStatus: "Paid" | "Pending" | "Refunded" | "Insurance Covered";
  consultationFee: number;
  tokenNumber: string;
  symptoms?: string;
  notes?: string;
  roomId?: string;
}

export interface InvoiceItem {
  description: string;
  category: "Consultation" | "Lab Test" | "Radiology" | "Pharmacy" | "Bed Charge" | "Procedure";
  qty: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  gstAmount: number;
  totalAmount: number;
  insuranceClaimedAmount: number;
  outOfPocketAmount: number;
  status: "Paid" | "Pending" | "Claim Submitted" | "Claim Approved" | "Claim Rejected";
  paymentMethod?: "Credit Card" | "Insurance Direct" | "srivoratech Wallet" | "Cash" | "UPI";
}

export interface SecureMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  receiverId: string;
  receiverName: string;
  receiverRole: UserRole;
  threadId: string;
  content: string;
  timestamp: string;
  attachments?: {
    fileName: string;
    fileType: string;
    fileUrl: string;
  }[];
  isRead: boolean;
  isUrgent?: boolean;
}

export interface DischargeSummary {
  id: string;
  patientId: string;
  patientName: string;
  admissionDate: string;
  dischargeDate: string;
  attendingPhysician: string;
  primaryDiagnosis: string;
  hospitalCourse: string;
  dischargeMedications: string[];
  followUpPlan: string;
  warningSigns: string[];
  pdfGeneratedDate: string;
}

export interface HealthPackage {
  id: string;
  title: string;
  tagline: string;
  price: number;
  originalPrice: number;
  testsIncludedCount: number;
  testsList: string[];
  suitableFor: string;
  recommendedAge: string;
  image: string;
}
