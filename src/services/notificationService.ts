import { Appointment } from "../types";

export interface NotificationLog {
  id: string;
  appointmentId: string;
  patientName: string;
  recipient: string; // email address or phone number
  type: "Email" | "SMS" | "WhatsApp";
  channel: string;
  template: string;
  scheduledTime: string;
  sentTime?: string;
  status: "Queued" | "Sent" | "Delivered" | "Failed";
}

const NOTIFICATION_STORAGE_KEY = "carepulse_notification_logs";

export const getNotificationLogs = (): NotificationLog[] => {
  const stored = localStorage.getItem(NOTIFICATION_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      // fallback
    }
  }

  // Pre-seeded initial notification reminders
  const initialLogs: NotificationLog[] = [
    {
      id: "notif-101",
      appointmentId: "apt-1",
      patientName: "Michael Chang",
      recipient: "+1 (555) 234-5678",
      type: "SMS",
      channel: "Twilio SMS Gateway",
      template: "Reminder: Your Teleconsultation with Dr. Sarah Jenkins is scheduled today at 10:30 AM. Join link: https://carepulse.health/live/CP-T08",
      scheduledTime: "2026-07-29 08:30 AM",
      sentTime: "2026-07-29 08:30 AM",
      status: "Delivered"
    },
    {
      id: "notif-102",
      appointmentId: "apt-1",
      patientName: "Michael Chang",
      recipient: "michael.chang@example.com",
      type: "Email",
      channel: "SendGrid SMTP",
      template: "CarePulse Appointment Confirmation: Video Consultation with Dr. Sarah Jenkins (Cardiology) on July 29, 2026 at 10:30 AM.",
      scheduledTime: "2026-07-28 10:30 AM",
      sentTime: "2026-07-28 10:30 AM",
      status: "Delivered"
    },
    {
      id: "notif-103",
      appointmentId: "apt-2",
      patientName: "Sarah Connor",
      recipient: "+1 (555) 876-5432",
      type: "SMS",
      channel: "Twilio SMS Gateway",
      template: "Reminder: Your OPD Consultation with Dr. Robert Chen is tomorrow at 02:00 PM at Main Hospital OPD Wing B.",
      scheduledTime: "2026-07-28 02:00 PM",
      sentTime: "2026-07-28 02:00 PM",
      status: "Sent"
    }
  ];

  localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(initialLogs));
  return initialLogs;
};

export const sendInstantReminder = (
  appointment: Appointment,
  type: "Email" | "SMS" | "WhatsApp"
): NotificationLog => {
  const currentLogs = getNotificationLogs();
  const recipient =
    type === "Email"
      ? `${appointment.patientName.toLowerCase().replace(/\s+/g, ".")}@example.com`
      : "+1 (555) " + Math.floor(100 + Math.random() * 900) + "-" + Math.floor(1000 + Math.random() * 9000);

  const template =
    type === "Email"
      ? `Dear ${appointment.patientName}, this is a reminder for your upcoming ${appointment.consultType} consultation with ${appointment.doctorName} (${appointment.doctorSpecialty}) on ${appointment.date} at ${appointment.timeSlot}. Token: ${appointment.tokenNumber}.`
      : `CarePulse Alert: Hi ${appointment.patientName}, your appointment with ${appointment.doctorName} is on ${appointment.date} at ${appointment.timeSlot}. Join/Checkin token: ${appointment.tokenNumber}.`;

  const newLog: NotificationLog = {
    id: `notif-${Date.now()}`,
    appointmentId: appointment.id,
    patientName: appointment.patientName,
    recipient,
    type,
    channel: type === "Email" ? "SendGrid Cloud SMTP" : type === "SMS" ? "Twilio SMS Gateway" : "WhatsApp Business API",
    template,
    scheduledTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    sentTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    status: "Delivered"
  };

  const updated = [newLog, ...currentLogs];
  localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(updated));
  return newLog;
};
