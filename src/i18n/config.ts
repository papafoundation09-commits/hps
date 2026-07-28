import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      appName: "srivoratech Network",
      rolePatient: "Patient Portal",
      roleDoctor: "Doctor Portal",
      roleHospitalAdmin: "Reception & Admin",
      rolePharmacist: "Pharmacy",
      
      // Nav Tabs
      navHome: "Home & Book",
      navDashboard: "My Health Hub",
      navTeleconsultation: "Teleconsultation",
      navMessaging: "Messages & Alerts",
      navHospitalAdmin: "Hospital Operations",
      navReferrals: "Referrals Pipeline",

      // Medical Terminology
      teleconsultation: "Teleconsultation",
      prescriptions: "Prescriptions",
      labResults: "Lab Results & Scans",
      vitals: "Patient Vitals",
      allergies: "Known Allergies",
      medications: "Active Medications",
      soapNotes: "SOAP Clinical Notes",
      virtualWaitlist: "Virtual Waitlist",
      referralPipeline: "Specialist Referral Pipeline",
      abnormalLabAlert: "Critical Abnormal Lab Value",

      // Actions
      bookAppointment: "Book Appointment",
      exportEmrPdf: "Export EMR PDF",
      extendSession: "Extend Session",
      logout: "Log Out",
      searchPlaceholder: "Search doctors, patients, or specialties...",
      
      // Status
      checkedIn: "Checked-in",
      withDoctor: "With Doctor",
      completed: "Completed",
      pending: "Pending",
      urgent: "Urgent",
      routine: "Routine",
      emergency: "Emergency",

      // Languages
      language: "Language",
      english: "English",
      spanish: "Spanish",
      french: "French"
    }
  },
  es: {
    translation: {
      appName: "Red srivoratech",
      rolePatient: "Portal de Pacientes",
      roleDoctor: "Portal de Médicos",
      roleHospitalAdmin: "Recepción y Admin",
      rolePharmacist: "Farmacia",
      
      // Nav Tabs
      navHome: "Inicio y Citas",
      navDashboard: "Mi Centro de Salud",
      navTeleconsultation: "Teleconsulta",
      navMessaging: "Mensajes y Alertas",
      navHospitalAdmin: "Operaciones de Hospital",
      navReferrals: "Derivaciones Médicas",

      // Medical Terminology
      teleconsultation: "Teleconsulta",
      prescriptions: "Recetas Médicas",
      labResults: "Resultados de Laboratorio",
      vitals: "Signos Vitales",
      allergies: "Alergias Conocidas",
      medications: "Medicamentos Activos",
      soapNotes: "Notas Clínicas SOAP",
      virtualWaitlist: "Lista de Espera Virtual",
      referralPipeline: "Oleoducto de Derivaciones",
      abnormalLabAlert: "Valor Anormal Crítico en Laboratorio",

      // Actions
      bookAppointment: "Reservar Cita",
      exportEmrPdf: "Exportar EMR en PDF",
      extendSession: "Extender Sesión",
      logout: "Cerrar Sesión",
      searchPlaceholder: "Buscar médicos, pacientes o especialidades...",

      // Status
      checkedIn: "Registrado",
      withDoctor: "Con el Médico",
      completed: "Completado",
      pending: "Pendiente",
      urgent: "Urgente",
      routine: "RUTINA",
      emergency: "Emergencia",

      // Languages
      language: "Idioma",
      english: "Inglés",
      spanish: "Español",
      french: "Francés"
    }
  },
  fr: {
    translation: {
      appName: "Réseau srivoratech",
      rolePatient: "Portail Patient",
      roleDoctor: "Portail Médecin",
      roleHospitalAdmin: "Réception & Admin",
      rolePharmacist: "Pharmacie",
      
      // Nav Tabs
      navHome: "Accueil & Rendez-vous",
      navDashboard: "Mon Espace Santé",
      navTeleconsultation: "Téléconsultation",
      navMessaging: "Messages & Alertes",
      navHospitalAdmin: "Opérations Hospitalières",
      navReferrals: "Orientation Spécialisée",

      // Medical Terminology
      teleconsultation: "Téléconsultation",
      prescriptions: "Ordonnances Médicales",
      labResults: "Résultats de Laboratoire",
      vitals: "Signes Vitaux",
      allergies: "Allergies Connues",
      medications: "Médicaments Actifs",
      soapNotes: "Notes Cliniques SOAP",
      virtualWaitlist: "File d'Attente Virtuelle",
      referralPipeline: "Suivi des Orientations",
      abnormalLabAlert: "Valeur Anormale Critique en Labo",

      // Actions
      bookAppointment: "Prendre Rendez-vous",
      exportEmrPdf: "Exporter EMR en PDF",
      extendSession: "Prolonger la Session",
      logout: "Déconnexion",
      searchPlaceholder: "Rechercher des médecins, patients ou spécialités...",

      // Status
      checkedIn: "Enregistré",
      withDoctor: "En Consultation",
      completed: "Terminé",
      pending: "En attente",
      urgent: "Urgent",
      routine: "Routine",
      emergency: "Urgence",

      // Languages
      language: "Langue",
      english: "Anglais",
      spanish: "Espagnol",
      french: "Français"
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en", // Default language
  fallbackLng: "en",
  interpolation: {
    escapeValue: false // React handles escaping safely
  }
});

export default i18n;
