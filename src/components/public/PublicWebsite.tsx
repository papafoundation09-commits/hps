import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Doctor } from "../../types";
import { highlightText } from "../../utils/highlightMatch";
import { 
  Search, 
  Stethoscope, 
  Calendar, 
  MapPin, 
  Sparkles, 
  Star, 
  Clock, 
  ShieldCheck, 
  PhoneCall, 
  ChevronRight, 
  CheckCircle2, 
  Award, 
  Building, 
  Heart, 
  HelpCircle,
  Video,
  Download
} from "lucide-react";
import { HEALTH_PACKAGES } from "../../data/mockData";

export const PublicWebsite: React.FC<{
  onBookDoctor: (doc: Doctor) => void;
  onOpenSymptomChecker: () => void;
}> = ({ onBookDoctor, onOpenSymptomChecker }) => {
  const { doctors } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");

  const specialties = ["All", "Cardiology", "Neurology", "Pediatrics", "Orthopedics", "Endocrinology"];

  const filteredDoctors = doctors.filter((doc) => {
    const matchesQuery = 
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.hospital.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = selectedSpecialty === "All" || doc.specialty === selectedSpecialty;
    return matchesQuery && matchesSpecialty;
  });

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 pt-12 pb-20 border-b border-slate-800">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 px-4 py-1.5 rounded-full text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next-Gen Teleconsultation & Integrated Hospital EMR</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              World-Class Doctors, Instant Teleconsults & Secure Health Records
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Connect with top specialists in HD video, book hospital visits, access real-time EMR lab reports & radiology PACS, and manage prescriptions digitally.
            </p>

            {/* AI Triage Banner Callout */}
            <div className="pt-2">
              <button
                onClick={onOpenSymptomChecker}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-2xl shadow-xl shadow-cyan-500/25 flex items-center gap-2 mx-auto transition-transform active:scale-95"
                id="hero-ai-symptom-btn"
              >
                <Sparkles className="w-4 h-4 text-cyan-200" />
                <span>Launch AI Symptom Checker & Triage</span>
              </button>
            </div>
          </div>

          {/* Search Card Container */}
          <div className="mt-12 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl max-w-4xl mx-auto backdrop-blur-md">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Doctor / Condition Search Input */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="Doctor name, condition, specialty..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  id="doctor-search-input"
                />
              </div>

              {/* Specialty Dropdown */}
              <div className="relative">
                <Stethoscope className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <select
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
                  id="specialty-filter-select"
                >
                  {specialties.map((spec) => (
                    <option key={spec} value={spec}>
                      Specialty: {spec}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location Selector */}
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
                  id="hospital-location-select"
                >
                  <option value="All">All srivoratech Hospital Campuses</option>
                  <option value="Metro">srivoratech Metro Heart Institute</option>
                  <option value="Neuro">srivoratech Neuro Science Center</option>
                  <option value="Children">srivoratech Children's Hospital</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specialty Grid Section */}
      <section className="py-12 border-b border-slate-900 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-white">Popular Clinical Specialties</h2>
              <p className="text-xs text-slate-400">Consult top board-certified specialists online or in-person</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: "Cardiology", count: "18 Doctors", icon: "❤️" },
              { name: "Neurology", count: "14 Doctors", icon: "🧠" },
              { name: "Pediatrics", count: "22 Doctors", icon: "👶" },
              { name: "Orthopedics", count: "16 Doctors", icon: "🦴" },
              { name: "Endocrinology", count: "11 Doctors", icon: "🩸" },
              { name: "General Medicine", count: "30 Doctors", icon: "🩺" },
            ].map((spec) => (
              <button
                key={spec.name}
                onClick={() => setSelectedSpecialty(spec.name)}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  selectedSpecialty === spec.name
                    ? "bg-cyan-500/10 border-cyan-500 text-white shadow-lg shadow-cyan-500/10"
                    : "bg-slate-900/60 border-slate-800/80 hover:border-slate-700 text-slate-300"
                }`}
              >
                <div className="text-2xl mb-2">{spec.icon}</div>
                <h3 className="font-bold text-xs text-white">{spec.name}</h3>
                <p className="text-[10px] text-slate-400">{spec.count}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Doctors Catalog Grid Section */}
      <section className="py-16 bg-slate-900/40 border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-white">Featured Doctors & Tele-Consultants</h2>
              <p className="text-xs text-slate-400">Book instant video calls or clinic appointments</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doc) => (
              <div
                key={doc.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative">
                      <img
                        src={doc.avatar}
                        alt={doc.name}
                        className="w-16 h-16 rounded-2xl object-cover border border-slate-700"
                      />
                      {doc.isOnline && (
                        <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-900 rounded-full" title="Online for instant video consult"></span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 text-amber-400 text-xs font-semibold mb-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{doc.rating}</span>
                        <span className="text-slate-500">({doc.reviewsCount} reviews)</span>
                      </div>
                      <h3 className="font-bold text-sm text-white truncate">{highlightText(doc.name, searchQuery)}</h3>
                      <p className="text-xs font-semibold text-cyan-400">{highlightText(doc.specialty, searchQuery)}</p>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">{highlightText(doc.hospital, searchQuery)}</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-4">
                    {doc.bio}
                  </p>

                  <div className="space-y-1.5 text-xs text-slate-400 border-t border-slate-800/80 pt-3 mb-4">
                    <div className="flex items-center justify-between">
                      <span>Qualifications:</span>
                      <span className="text-slate-200 font-medium truncate max-w-[180px]">{doc.qualification}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Consultation Fee:</span>
                      <span className="text-emerald-400 font-bold text-sm">${doc.consultationFee}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => onBookDoctor(doc)}
                    className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs py-2.5 rounded-xl shadow-md shadow-cyan-600/20 flex items-center justify-center gap-1.5 transition-all"
                    id={`book-doc-${doc.id}`}
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Book Teleconsult</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Preventive Health Packages Section */}
      <section className="py-16 bg-slate-950 border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl font-bold text-white">Preventive Care & Diagnostic Health Packages</h2>
            <p className="text-xs text-slate-400 mt-1">Full-body checkups with home sample collection & digital doctor review</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {HEALTH_PACKAGES.map((pkg) => (
              <div key={pkg.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between">
                <div className="relative h-44">
                  <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
                  <span className="absolute top-3 right-3 bg-cyan-500 text-slate-950 font-bold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {pkg.testsIncludedCount} Tests Included
                  </span>
                </div>

                <div className="p-5 space-y-4 flex-1">
                  <div>
                    <h3 className="font-bold text-base text-white">{pkg.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed mt-1">{pkg.tagline}</p>
                  </div>

                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {pkg.testsList.slice(0, 4).map((t, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="border-t border-slate-800 pt-3 flex items-baseline justify-between">
                    <div>
                      <span className="text-xl font-extrabold text-white">${pkg.price}</span>
                      <span className="text-xs text-slate-500 line-through ml-2">${pkg.originalPrice}</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded">
                      Save {Math.round((1 - pkg.price / pkg.originalPrice) * 100)}%
                    </span>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button 
                    onClick={() => alert(`Health package "${pkg.title}" added to booking cart! Home sample collection dispatched.`)}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold text-xs py-2.5 rounded-xl border border-slate-700 transition-colors"
                  >
                    Book Package & Home Collection
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials & FAQs Section */}
      <section className="py-16 bg-slate-900/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-white">Frequently Asked Questions</h2>
            <p className="text-xs text-slate-400">Everything you need to know about teleconsultations, prescriptions, & insurance</p>
          </div>

          <div className="space-y-4">
            {[
              { q: "How do virtual teleconsultations work?", a: "After booking an appointment slot, join the srivoratech HD Video room directly from your browser. Your doctor will review your EMR vitals, conduct the call, and instantly generate a legally verified digital prescription." },
              { q: "Are digital prescriptions valid at local pharmacies?", a: "Yes. All srivoratech digital prescriptions are cryptographically signed with QR verification keys, accepted at retail pharmacies and directly fulfillable by srivoratech Pharmacy." },
              { q: "Can I view my DICOM radiology images (X-ray, CT, MRI)?", a: "Yes. srivoratech features an integrated PACS DICOM viewer allowing patients and clinicians to zoom, measure, adjust contrast, and cycle through image slices in real time." },
              { q: "Is insurance claim submission automated?", a: "Our billing staff processes claims directly with connected insurance providers. Out-of-pocket costs and approved claim breakdowns are generated instantly." }
            ].map((faq, idx) => (
              <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <h4 className="font-bold text-xs text-white flex items-center gap-2 mb-1">
                  <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>{faq.q}</span>
                </h4>
                <p className="text-xs text-slate-300 pl-6 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 py-12 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Stethoscope className="w-5 h-5 text-cyan-400" />
              <span className="font-bold text-white text-base">srivoratech OS</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Integrated Hospital Management System & High-Definition Teleconsultation Platform.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3 text-xs uppercase tracking-wider">Patient Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-cyan-400">Search Doctors</a></li>
              <li><a href="#" className="hover:text-cyan-400">Health Packages</a></li>
              <li><a href="#" className="hover:text-cyan-400">AI Symptom Checker</a></li>
              <li><a href="#" className="hover:text-cyan-400">DICOM Image Viewer</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3 text-xs uppercase tracking-wider">Hospital Campuses</h4>
            <ul className="space-y-2">
              <li>Metro Heart Institute</li>
              <li>Neuro Science Center</li>
              <li>Children's Hospital</li>
              <li>Diabetes & Metabolic Clinic</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3 text-xs uppercase tracking-wider">Emergency Hotline</h4>
            <p className="text-base font-bold text-red-400 mb-2">1-800-CARE-911</p>
            <p className="text-[11px] text-slate-500">24/7 Ambulance Dispatch & Trauma Triage Unit</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
