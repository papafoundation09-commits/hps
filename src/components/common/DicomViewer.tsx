import React, { useState } from "react";
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Contrast, 
  Maximize2, 
  Download, 
  Layers, 
  Activity, 
  Sliders,
  Ruler,
  Eye,
  Check
} from "lucide-react";

interface DicomViewerProps {
  studyName: string;
  modality: string;
  imageUrl: string;
  sliceCount: number;
  studyDate: string;
  patientName: string;
}

export const DicomViewer: React.FC<DicomViewerProps> = ({
  studyName,
  modality,
  imageUrl,
  sliceCount = 24,
  studyDate,
  patientName
}) => {
  const [currentSlice, setCurrentSlice] = useState<number>(12);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  const [isInverted, setIsInverted] = useState<boolean>(false);
  const [rotation, setRotation] = useState<number>(0);
  const [preset, setPreset] = useState<string>("default");
  const [showRuler, setShowRuler] = useState<boolean>(false);

  const applyPreset = (presetName: string) => {
    setPreset(presetName);
    switch (presetName) {
      case "bone":
        setBrightness(120);
        setContrast(160);
        setIsInverted(false);
        break;
      case "soft_tissue":
        setBrightness(95);
        setContrast(120);
        setIsInverted(false);
        break;
      case "lung":
        setBrightness(85);
        setContrast(180);
        setIsInverted(true);
        break;
      default:
        setBrightness(100);
        setContrast(100);
        setIsInverted(false);
        break;
    }
  };

  const handleReset = () => {
    setZoomLevel(100);
    setBrightness(100);
    setContrast(100);
    setIsInverted(false);
    setRotation(0);
    setPreset("default");
    setShowRuler(false);
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl text-slate-100 flex flex-col my-4">
      {/* PACS PACS Toolbar Header */}
      <div className="bg-slate-900 border-b border-slate-800 p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-bold px-2.5 py-1 rounded-md text-[11px] tracking-wider">
            PACS DICOM 3.0
          </div>
          <div>
            <span className="font-bold text-white text-sm">{studyName}</span>
            <span className="text-slate-400 text-xs ml-2">[{modality}] • {studyDate}</span>
          </div>
        </div>

        {/* Controls Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Preset Selector */}
          <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg border border-slate-700">
            <Sliders className="w-3.5 h-3.5 text-slate-400 ml-1" />
            {["default", "bone", "soft_tissue", "lung"].map((p) => (
              <button
                key={p}
                onClick={() => applyPreset(p)}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold capitalize transition-colors ${
                  preset === p ? "bg-cyan-500 text-white" : "text-slate-300 hover:text-white"
                }`}
              >
                {p.replace("_", " ")}
              </button>
            ))}
          </div>

          {/* Zoom Buttons */}
          <button
            onClick={() => setZoomLevel((z) => Math.min(250, z + 20))}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-200 border border-slate-700"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(50, z - 20))}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-200 border border-slate-700"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          {/* Invert Color */}
          <button
            onClick={() => setIsInverted(!isInverted)}
            className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 ${
              isInverted ? "bg-amber-500/20 border-amber-500 text-amber-300" : "bg-slate-800 border-slate-700 text-slate-200"
            }`}
            title="Invert Window (Negative View)"
          >
            <Contrast className="w-4 h-4" />
            <span>Invert</span>
          </button>

          {/* Ruler Overlay */}
          <button
            onClick={() => setShowRuler(!showRuler)}
            className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 ${
              showRuler ? "bg-cyan-500/20 border-cyan-500 text-cyan-300" : "bg-slate-800 border-slate-700 text-slate-200"
            }`}
            title="Toggle Ruler Measurement"
          >
            <Ruler className="w-4 h-4" />
            <span>Ruler</span>
          </button>

          {/* Reset */}
          <button
            onClick={handleReset}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 border border-slate-700 font-medium text-[11px]"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Main Image Stage */}
      <div className="relative bg-black min-h-[380px] flex items-center justify-center overflow-hidden p-6 select-none">
        {/* Patient OSD Telemetry Overlay */}
        <div className="absolute top-4 left-4 z-10 text-[11px] font-mono text-cyan-400 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 backdrop-blur-sm space-y-1">
          <p className="font-bold text-white text-xs">{patientName}</p>
          <p>MODALITY: {modality}</p>
          <p>SERIES: {studyName}</p>
          <p>SLICE: {currentSlice} / {sliceCount}</p>
        </div>

        <div className="absolute top-4 right-4 z-10 text-[11px] font-mono text-slate-400 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 backdrop-blur-sm space-y-1 text-right">
          <p>ZOOM: {zoomLevel}%</p>
          <p>BRIGHTNESS: {brightness}%</p>
          <p>CONTRAST: {contrast}%</p>
          <p>WL/WW: PRESET {preset.toUpperCase()}</p>
        </div>

        {/* DICOM Medical Image Container */}
        <div 
          className="transition-all duration-150 relative"
          style={{
            transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg)`,
            filter: `brightness(${brightness}%) contrast(${contrast}%) ${isInverted ? "invert(100%)" : ""}`
          }}
        >
          <img
            src={imageUrl}
            alt={studyName}
            className="max-h-[340px] max-w-full object-contain rounded border border-slate-800 shadow-2xl"
          />

          {/* Measurement Overlay */}
          {showRuler && (
            <div className="absolute top-1/3 left-1/4 right-1/4 h-0.5 bg-cyan-400 border-b border-black flex items-center justify-between px-1">
              <span className="w-2 h-2 rounded-full bg-cyan-300"></span>
              <span className="bg-slate-900 text-cyan-300 text-[10px] font-mono px-1 rounded -mt-5">3.4 cm</span>
              <span className="w-2 h-2 rounded-full bg-cyan-300"></span>
            </div>
          )}
        </div>
      </div>

      {/* Slice Slider Navigation Bar */}
      <div className="bg-slate-900 p-3 border-t border-slate-800 flex items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2 text-slate-400 font-mono text-xs">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span>Slice {currentSlice} of {sliceCount}</span>
        </div>

        <input
          type="range"
          min={1}
          max={sliceCount}
          value={currentSlice}
          onChange={(e) => setCurrentSlice(Number(e.target.value))}
          className="w-full accent-cyan-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
        />

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setCurrentSlice((s) => Math.max(1, s - 1))}
            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 font-mono text-xs"
          >
            Prev
          </button>
          <button 
            onClick={() => setCurrentSlice((s) => Math.min(sliceCount, s + 1))}
            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 font-mono text-xs"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
