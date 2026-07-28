import { Doctor, Appointment, Prescription, SoapNote, LabOrder, PharmacyItem, Invoice, SecureMessage, DischargeSummary, HealthPackage } from "../types";

export const INITIAL_DOCTORS: Doctor[] = [
  {
    id: "doc-101",
    name: "Dr. Sarah Jenkins, MD",
    title: "Senior Cardiologist & Interventional Specialist",
    specialty: "Cardiology",
    hospital: "srivoratech Metro Heart Institute",
    qualification: "MD (Cardiology), FACC, Harvard Medical Fellow",
    experienceYears: 16,
    rating: 4.9,
    reviewsCount: 342,
    consultationFee: 120,
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400",
    languages: ["English", "Spanish", "French"],
    availability: {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      timeSlots: ["09:00 AM", "10:30 AM", "02:00 PM", "04:15 PM"],
    },
    bio: "Specializing in preventive cardiology, echocardiography, coronary artery disease management, and remote cardiovascular telemonitoring.",
    isOnline: true,
  },
  {
    id: "doc-102",
    name: "Dr. Rajesh K. Varma, MD",
    title: "Chief Neurologist & Brain Health Lead",
    specialty: "Neurology",
    hospital: "srivoratech Neuro Science Center",
    qualification: "MD, DM (Neurology), Johns Hopkins Postdoc",
    experienceYears: 19,
    rating: 4.95,
    reviewsCount: 512,
    consultationFee: 150,
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400",
    languages: ["English", "Hindi", "German"],
    availability: {
      days: ["Monday", "Wednesday", "Friday", "Saturday"],
      timeSlots: ["10:00 AM", "11:30 AM", "03:00 PM", "05:00 PM"],
    },
    bio: "Renowned neurologist expert in migraine syndromes, epilepsy, stroke rehab, neuro-imaging analytics, and cognitive assessment.",
    isOnline: true,
  },
  {
    id: "doc-103",
    name: "Dr. Elena Rostova, MD",
    title: "Lead Pediatrician & Adolescent Health Specialist",
    specialty: "Pediatrics",
    hospital: "srivoratech Children's Hospital",
    qualification: "MD (Pediatrics), DCH, Royal College Certified",
    experienceYears: 12,
    rating: 4.88,
    reviewsCount: 289,
    consultationFee: 95,
    avatar: "https://images.unsplash.com/photo-1594824813566-78a9c394c86e?auto=format&fit=crop&q=80&w=400",
    languages: ["English", "Russian"],
    availability: {
      days: ["Tuesday", "Thursday", "Friday", "Saturday"],
      timeSlots: ["09:30 AM", "11:00 AM", "01:30 PM", "03:30 PM"],
    },
    bio: "Dedicated pediatric specialist focusing on growth tracking, pediatric immunizations, childhood allergies, and tele-pediatric guidance.",
    isOnline: false,
  },
  {
    id: "doc-104",
    name: "Dr. Marcus Vance, MD",
    title: "Consultant Orthopedic Surgeon & Sports Medicine",
    specialty: "Orthopedics",
    hospital: "srivoratech Ortho & Joint Care",
    qualification: "MS (Ortho), Fellowship in Arthroscopy & Joint Replacement",
    experienceYears: 15,
    rating: 4.85,
    reviewsCount: 198,
    consultationFee: 130,
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400",
    languages: ["English"],
    availability: {
      days: ["Monday", "Tuesday", "Thursday", "Friday"],
      timeSlots: ["08:30 AM", "11:00 AM", "02:30 PM", "04:30 PM"],
    },
    bio: "Expert in spine alignment, knee & shoulder arthroscopy, fracture care, and post-surgical rehabilitation plans.",
    isOnline: true,
  },
  {
    id: "doc-105",
    name: "Dr. Aisha Al-Mansoor, MD",
    title: "Senior Endocrinologist & Diabetologist",
    specialty: "Endocrinology",
    hospital: "srivoratech Diabetes & Metabolic Clinic",
    qualification: "MD (Endocrinology), FACE",
    experienceYears: 14,
    rating: 4.92,
    reviewsCount: 410,
    consultationFee: 110,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
    languages: ["English", "Arabic"],
    availability: {
      days: ["Monday", "Wednesday", "Thursday", "Saturday"],
      timeSlots: ["10:00 AM", "01:00 PM", "03:30 PM", "05:30 PM"],
    },
    bio: "Specializing in Type 1 & Type 2 diabetes management, thyroid disorders, continuous glucose monitoring, and hormonal health.",
    isOnline: true,
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: "apt-2026-001",
    patientId: "pat-1001",
    patientName: "Michael Chang",
    patientAge: 42,
    patientGender: "Male",
    doctorId: "doc-101",
    doctorName: "Dr. Sarah Jenkins, MD",
    doctorSpecialty: "Cardiology",
    doctorAvatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400",
    hospital: "srivoratech Metro Heart Institute",
    consultType: "Video",
    date: "2026-07-28",
    timeSlot: "10:30 AM",
    status: "Waiting Room",
    paymentStatus: "Paid",
    consultationFee: 120,
    tokenNumber: "CP-T04",
    symptoms: "Occasional tightness in chest during moderate exercise, mild shortness of breath",
    notes: "Patient monitored on home ECG patch. Fasting Lipid profile requested.",
    roomId: "tele-room-car-01"
  },
  {
    id: "apt-2026-002",
    patientId: "pat-1002",
    patientName: "Emily Watson",
    patientAge: 29,
    patientGender: "Female",
    doctorId: "doc-102",
    doctorName: "Dr. Rajesh K. Varma, MD",
    doctorSpecialty: "Neurology",
    doctorAvatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400",
    hospital: "srivoratech Neuro Science Center",
    consultType: "Video",
    date: "2026-07-28",
    timeSlot: "11:30 AM",
    status: "Scheduled",
    paymentStatus: "Paid",
    consultationFee: 150,
    tokenNumber: "CP-T08",
    symptoms: "Chronic migraine attacks with visual aura, 3 episodes this week",
    notes: "MRI Brain with Contrast reviewed. Rule out tension vascular triggers.",
    roomId: "tele-room-neu-02"
  },
  {
    id: "apt-2026-003",
    patientId: "pat-1003",
    patientName: "David Miller",
    patientAge: 58,
    patientGender: "Male",
    doctorId: "doc-105",
    doctorName: "Dr. Aisha Al-Mansoor, MD",
    doctorSpecialty: "Endocrinology",
    doctorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
    hospital: "srivoratech Diabetes & Metabolic Clinic",
    consultType: "In-Person",
    date: "2026-07-28",
    timeSlot: "01:00 PM",
    status: "Scheduled",
    paymentStatus: "Insurance Covered",
    consultationFee: 110,
    tokenNumber: "CP-T12",
    symptoms: "HbA1c quarterly review, adjusting insulin pump basal rates",
    notes: "Bring CGM 14-day telemetry log sheet."
  },
  {
    id: "apt-2026-004",
    patientId: "pat-1001",
    patientName: "Michael Chang",
    patientAge: 42,
    patientGender: "Male",
    doctorId: "doc-104",
    doctorName: "Dr. Marcus Vance, MD",
    doctorSpecialty: "Orthopedics",
    doctorAvatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400",
    hospital: "srivoratech Ortho & Joint Care",
    consultType: "Video",
    date: "2026-07-30",
    timeSlot: "02:30 PM",
    status: "Scheduled",
    paymentStatus: "Paid",
    consultationFee: 130,
    tokenNumber: "CP-T21",
    symptoms: "Right knee pain after tennis session, joint effusion and clicking sound",
    roomId: "tele-room-ort-03"
  }
];

export const INITIAL_PRESCRIPTIONS: Prescription[] = [
  {
    id: "rx-9001",
    patientId: "pat-1001",
    patientName: "Michael Chang",
    doctorId: "doc-101",
    doctorName: "Dr. Sarah Jenkins, MD",
    doctorSpecialty: "Cardiology",
    date: "2026-07-20",
    medications: [
      {
        name: "Atorvastatin Calcium",
        dosage: "20 mg",
        frequency: "Once daily at bedtime",
        duration: "30 days",
        instructions: "Take with or without food. Avoid excessive grapefruit juice."
      },
      {
        name: "Amlodipine Besylate",
        dosage: "5 mg",
        frequency: "Once daily in the morning",
        duration: "30 days",
        instructions: "Monitor blood pressure weekly."
      }
    ],
    diagnosis: "I10 - Essential (primary) hypertension, E78.5 - Hyperlipidemia",
    qrVerificationCode: "CP-RX-9001-VERIFIED-AUTH-KEY-882",
    status: "Issued",
    notes: "Repeat Lipid Profile in 6 weeks."
  }
];

export const INITIAL_LAB_ORDERS: LabOrder[] = [
  {
    id: "lab-701",
    patientId: "pat-1001",
    patientName: "Michael Chang",
    doctorId: "doc-101",
    doctorName: "Dr. Sarah Jenkins, MD",
    testName: "Comprehensive Cardiac Risk Profile (Lipid + hs-CRP + HbA1c)",
    category: "Biochemistry",
    orderDate: "2026-07-26",
    status: "Completed",
    barcode: "890123456701",
    specimenType: "Venous Blood (EDTA + Gel Tube)",
    resultSummary: "Total Cholesterol: 215 mg/dL (High), LDL: 138 mg/dL, HDL: 48 mg/dL, Triglycerides: 145 mg/dL, hs-CRP: 1.8 mg/L",
    reportUrl: "/reports/cardiac_risk_701.pdf"
  },
  {
    id: "rad-802",
    patientId: "pat-1001",
    patientName: "Michael Chang",
    doctorId: "doc-104",
    doctorName: "Dr. Marcus Vance, MD",
    testName: "MRI Right Knee Joint with Contrast",
    category: "Radiology",
    orderDate: "2026-07-27",
    status: "Completed",
    barcode: "890123456802",
    specimenType: "Imaging",
    resultSummary: "Grade II posterior horn medial meniscus tear noted. Joint capsule intact without complete ligament rupture.",
    dicomImages: [
      {
        id: "dcm-01",
        seriesName: "Sagittal T2 MRI Knee",
        modality: "MRI",
        imageUrl: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800",
        sliceCount: 24,
        studyDate: "2026-07-27"
      },
      {
        id: "dcm-02",
        seriesName: "Coronal PD MRI Knee",
        modality: "MRI",
        imageUrl: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&q=80&w=800",
        sliceCount: 18,
        studyDate: "2026-07-27"
      }
    ]
  }
];

export const INITIAL_PHARMACY_STOCK: PharmacyItem[] = [
  {
    id: "phm-101",
    name: "Amoxicillin & Clavulanate Potassium",
    genericName: "Augmentin 625mg",
    category: "Antibiotics",
    stockQty: 480,
    reorderLevel: 100,
    unitPrice: 18.5,
    dosageForm: "Tablet",
    manufacturer: "GSK Pharmaceuticals",
    expiryDate: "2027-11-30",
    location: "Shelf A-12"
  },
  {
    id: "phm-102",
    name: "Atorvastatin Calcium 20mg",
    genericName: "Lipitor Equivalent",
    category: "Cardiovascular",
    stockQty: 620,
    reorderLevel: 150,
    unitPrice: 12.0,
    dosageForm: "Tablet",
    manufacturer: "Pfizer Care",
    expiryDate: "2028-03-15",
    location: "Shelf C-04"
  },
  {
    id: "phm-103",
    name: "Metformin Hydrochloride 500mg ER",
    genericName: "Glucophage XR",
    category: "Diabetic",
    stockQty: 850,
    reorderLevel: 200,
    unitPrice: 8.5,
    dosageForm: "Tablet",
    manufacturer: "Merck Health",
    expiryDate: "2027-08-20",
    location: "Shelf B-08"
  },
  {
    id: "phm-104",
    name: "Ibuprofen 400mg Softgel",
    genericName: "Advil Extra Strength",
    category: "Analgesics",
    stockQty: 90,
    reorderLevel: 120,
    unitPrice: 5.0,
    dosageForm: "Capsule",
    manufacturer: "Haleon Consumer",
    expiryDate: "2026-12-31",
    location: "Shelf D-02"
  }
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: "INV-2026-8801",
    patientId: "pat-1001",
    patientName: "Michael Chang",
    date: "2026-07-26",
    items: [
      { description: "Teleconsultation - Dr. Sarah Jenkins", category: "Consultation", qty: 1, unitPrice: 120, total: 120 },
      { description: "Cardiac Risk Lipid Profile", category: "Lab Test", qty: 1, unitPrice: 85, total: 85 },
      { description: "Atorvastatin 20mg (30 day supply)", category: "Pharmacy", qty: 1, unitPrice: 12, total: 12 }
    ],
    subtotal: 217,
    discount: 17,
    gstAmount: 18,
    totalAmount: 218,
    insuranceClaimedAmount: 160,
    outOfPocketAmount: 58,
    status: "Claim Approved",
    paymentMethod: "Insurance Direct"
  }
];

export const INITIAL_MESSAGES: SecureMessage[] = [
  {
    id: "msg-1",
    senderId: "doc-101",
    senderName: "Dr. Sarah Jenkins, MD",
    senderRole: "doctor",
    receiverId: "pat-1001",
    receiverName: "Michael Chang",
    receiverRole: "patient",
    threadId: "thread-pat1001-doc101",
    content: "Hello Mr. Chang. I reviewed your recent cardiac risk blood panel. Your cholesterol levels show improvement, but we should discuss slightly modifying your dosage during our call today.",
    timestamp: "2026-07-28 09:15 AM",
    isRead: true
  },
  {
    id: "msg-2",
    senderId: "pat-1001",
    senderName: "Michael Chang",
    senderRole: "patient",
    receiverId: "doc-101",
    receiverName: "Dr. Sarah Jenkins, MD",
    receiverRole: "doctor",
    threadId: "thread-pat1001-doc101",
    content: "Thank you Dr. Jenkins! I also uploaded the MRI report of my knee from yesterday. Looking forward to our video consultation.",
    timestamp: "2026-07-28 09:22 AM",
    isRead: false
  }
];

export const HEALTH_PACKAGES: HealthPackage[] = [
  {
    id: "pkg-1",
    title: "Executive Master Health Checkup",
    tagline: "Full-body comprehensive wellness screening with 85+ parameters & doctor consultation",
    price: 199,
    originalPrice: 350,
    testsIncludedCount: 85,
    testsList: [
      "Complete Blood Count (CBC) with ESR",
      "Lipid Profile & Atherogenic Risk Ratio",
      "HbA1c & Fasting Blood Sugar",
      "Liver Function Test (LFT)",
      "Kidney Function Test (KFT)",
      "Thyroid Profile (T3, T4, TSH)",
      "ECG & Chest X-Ray",
      "Vitamin D3 & B12 Levels"
    ],
    suitableFor: "Men & Women looking for thorough annual health evaluation",
    recommendedAge: "30+ years",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "pkg-2",
    title: "Advanced Cardiac Protection Panel",
    tagline: "Dedicated heart health evaluation with High-Sensitivity CRP, Homocysteine & ECG",
    price: 149,
    originalPrice: 260,
    testsIncludedCount: 42,
    testsList: [
      "Extended Lipid Sub-fractions",
      "hs-CRP Cardiac Inflammation Marker",
      "Homocysteine & Lipoprotein (a)",
      "Serum Electrolytes (Na, K, Cl)",
      "Resting 12-Lead ECG",
      "Cardiologist Tele-consultation"
    ],
    suitableFor: "Individuals with family history of cardiac disease or hypertension",
    recommendedAge: "25+ years",
    image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "pkg-3",
    title: "Diabetic Care & Metabolic Shield",
    tagline: "Quarterly monitoring for blood glucose control, renal safety & neuropathy risk",
    price: 99,
    originalPrice: 180,
    testsIncludedCount: 32,
    testsList: [
      "HbA1c & Estimated Average Glucose",
      "Urine Microalbumin/Creatinine Ratio",
      "Fasting & Postprandial Glucose",
      "Lipid Profile",
      "Endocrinologist Review"
    ],
    suitableFor: "Patients diagnosed with Type 1/2 diabetes or pre-diabetes",
    recommendedAge: "All ages",
    image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=600"
  }
];
