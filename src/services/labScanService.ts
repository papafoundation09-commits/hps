import { LabOrder } from "../types";

export interface LabResultItem {
  id: string;
  testName: string;
  value: string;
  numericValue: number;
  unit: string;
  normalRange: string;
  isAbnormal: boolean;
  severity: "Normal" | "Abnormal High" | "Critical High" | "Abnormal Low";
  flagNote?: string;
}

export interface LabResultScanReport {
  labOrderId: string;
  patientId: string;
  patientName: string;
  doctorName: string;
  scanTimestamp: string;
  hasAbnormalities: boolean;
  criticalCount: number;
  items: LabResultItem[];
  messagingNotificationSent: boolean;
}

export function scanLabOrderValues(labOrder: LabOrder): LabResultScanReport {
  const items: LabResultItem[] = [];
  let criticalCount = 0;

  // Simulate scanning standard lab panels based on test name
  if (labOrder.testName.toLowerCase().includes("lipid") || labOrder.testName.toLowerCase().includes("cholesterol")) {
    items.push(
      {
        id: "lab-i-1",
        testName: "Triglycerides",
        value: "280",
        numericValue: 280,
        unit: "mg/dL",
        normalRange: "< 150 mg/dL",
        isAbnormal: true,
        severity: "Abnormal High",
        flagNote: "Elevated cardiovascular risk factor."
      },
      {
        id: "lab-i-2",
        testName: "LDL Cholesterol",
        value: "165",
        numericValue: 165,
        unit: "mg/dL",
        normalRange: "< 100 mg/dL",
        isAbnormal: true,
        severity: "Abnormal High",
        flagNote: "Statin therapy optimization recommended."
      },
      {
        id: "lab-i-3",
        testName: "HDL Cholesterol",
        value: "42",
        numericValue: 42,
        unit: "mg/dL",
        normalRange: "> 40 mg/dL",
        isAbnormal: false,
        severity: "Normal"
      }
    );
  } else if (labOrder.testName.toLowerCase().includes("cardiac") || labOrder.testName.toLowerCase().includes("troponin")) {
    items.push(
      {
        id: "lab-i-4",
        testName: "Troponin I",
        value: "1.8",
        numericValue: 1.8,
        unit: "ng/mL",
        normalRange: "< 0.04 ng/mL",
        isAbnormal: true,
        severity: "Critical High",
        flagNote: "CRITICAL: Myocardial infarction indicator! Immediate physician evaluation required."
      },
      {
        id: "lab-i-5",
        testName: "CK-MB",
        value: "24",
        numericValue: 24,
        unit: "U/L",
        normalRange: "0 - 12 U/L",
        isAbnormal: true,
        severity: "Abnormal High",
        flagNote: "Elevated myocardial enzyme."
      }
    );
    criticalCount += 1;
  } else {
    // Default HbA1c & Complete Blood Count scan
    items.push(
      {
        id: "lab-i-6",
        testName: "HbA1c (Glycated Hemoglobin)",
        value: "8.4",
        numericValue: 8.4,
        unit: "%",
        normalRange: "< 5.7 %",
        isAbnormal: true,
        severity: "Abnormal High",
        flagNote: "Uncontrolled hyperglycemia."
      },
      {
        id: "lab-i-7",
        testName: "Fasting Plasma Glucose",
        value: "158",
        numericValue: 158,
        unit: "mg/dL",
        normalRange: "70 - 99 mg/dL",
        isAbnormal: true,
        severity: "Abnormal High"
      }
    );
  }

  const hasAbnormalities = items.some((i) => i.isAbnormal);

  return {
    labOrderId: labOrder.id,
    patientId: labOrder.patientId,
    patientName: labOrder.patientName,
    doctorName: labOrder.doctorName,
    scanTimestamp: new Date().toISOString(),
    hasAbnormalities,
    criticalCount,
    items,
    messagingNotificationSent: hasAbnormalities
  };
}
