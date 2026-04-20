"use client";

import React, { useState, useRef } from "react";
import {
  Upload,
  CheckCircle2,
  AlertCircle,
  FileText,
  X,
  Clock,
  Camera,
  RefreshCw,
  MapPin,
  Navigation,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Webcam from "react-webcam";
import { cn } from "@/lib/utils";
import { apiClient } from "@/lib/api-client";

interface KYCUploadCardProps {
  documentType: {
    code: string;
    name: string;
    description: string;
  };
  currentStatus?: {
    status: string;
    submitted_at: string | null;
  };
  onSuccess: () => void;
}

export function KYCUploadCard({
  documentType,
  currentStatus,
  onSuccess,
}: KYCUploadCardProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [fetchingLocation, setFetchingLocation] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const webcamRef = useRef<Webcam>(null);

  React.useEffect(() => {
    // Automatically trigger location fetch for location-sensitive documents
    if (documentType.code === "LOCATION_PROOF" && status === "NOT_SUBMITTED") {
      fetchLocation();
    }
  }, []);

  const status = currentStatus?.status || "NOT_SUBMITTED";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError("File size exceeds 10MB limit");
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };

  const dataURLtoFile = (dataurl: string, filename: string) => {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const handleCapture = React.useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      const capturedFile = dataURLtoFile(
        imageSrc,
        `live-photo-${Date.now()}.jpg`,
      );
      setFile(capturedFile);
      setIsCameraOpen(false);
      setError(null);
    }
  }, [webcamRef]);

  const fetchLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setFetchingLocation(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setFetchingLocation(false);
      },
      (err) => {
        console.error(err);
        setError(
          "Failed to get location. Please allow camera/location permissions.",
        );
        setFetchingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const handleSubmit = async () => {
    // Allow submission if there's a file OR if a location is captured (for Location Proof)
    if (!file && !location) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("kyc_type", documentType.code);

    if (location) {
      formData.append("latitude", location.lat.toString());
      formData.append("longitude", location.lng.toString());
    }

    if (file) {
      if (documentType.code === "LIVE_PHOTO") {
        formData.append("LIVE_PHOTO", file);
      } else {
        formData.append("document_file", file);
      }
    }

    try {
      const result = await apiClient.submitKYC(formData);
      if (
        result.error ||
        (typeof result === "object" &&
          !result.id &&
          Object.keys(result).length > 0)
      ) {
        const firstErr =
          typeof result === "string"
            ? result
            : result.error || Object.values(result)[0];
        setError(Array.isArray(firstErr) ? firstErr[0] : firstErr);
      } else {
        setFile(null);
        onSuccess();
      }
    } catch (err) {
      setError("Failed to upload document. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const statusStyles = {
    NOT_SUBMITTED: "border-gray-200 bg-white hover:border-gray-300",
    PENDING: "border-amber-200 bg-amber-50/10",
    UNDER_REVIEW: "border-indigo-200 bg-indigo-50/10",
    APPROVED: "border-emerald-200 bg-emerald-50/10",
    REJECTED: "border-rose-200 bg-rose-50/10",
  };

  return (
    <div
      className={cn(
        "flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-6 rounded-[2rem] border transition-all duration-300",
        statusStyles[status as keyof typeof statusStyles],
        isDragging &&
          "border-indigo-500 bg-indigo-50/50 scale-[1.01] shadow-lg shadow-indigo-100/50",
      )}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <div className="flex items-start lg:items-center gap-5 flex-1 min-w-0">
        <div
          className={cn(
            "w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm",
            status === "APPROVED"
              ? "bg-emerald-100 text-emerald-600"
              : "bg-gray-50 text-gray-500 border border-gray-100",
          )}
        >
          <FileText className="w-6 h-6" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-black text-gray-900 tracking-tight truncate">
            {documentType.name}
          </h3>
          <p className="text-[13px] font-medium text-gray-400 mt-0.5 line-clamp-2 pr-4">
            {documentType.description}
          </p>
          {error && (
            <div className="flex items-center gap-1.5 text-rose-600 mt-2">
              <AlertCircle className="w-3.5 h-3.5" />
              <p className="text-[10px] font-black uppercase tracking-widest">
                {error}
              </p>
            </div>
          )}
          {location && (
            <div className="inline-flex items-center gap-2 mt-3 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100/50 animate-in fade-in slide-in-from-left-2 duration-500">
              <Navigation className="w-3 h-3 fill-emerald-600 rotate-45" />
              <span className="text-[10px] font-black tracking-wider uppercase">
                GPS Locked: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-8 w-full lg:w-auto">
        <div className="flex flex-col lg:items-end text-left lg:text-right">
          <div
            className={cn(
              "inline-flex px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border",
              status === "PENDING" &&
                "bg-amber-100 text-amber-700 border-amber-200",
              status === "APPROVED" &&
                "bg-emerald-100 text-emerald-700 border-emerald-200",
              status === "REJECTED" &&
                "bg-rose-100 text-rose-700 border-rose-200",
              status === "UNDER_REVIEW" &&
                "bg-indigo-100 text-indigo-700 border-indigo-200",
              status === "NOT_SUBMITTED" &&
                "bg-gray-100 text-gray-600 border-gray-200",
            )}
          >
            {status.replace("_", " ")}
          </div>
          {currentStatus?.submitted_at && (
            <p className="text-[10px] font-bold text-gray-400 mt-1.5">
              {new Date(currentStatus.submitted_at).toLocaleDateString()}
            </p>
          )}
        </div>

        {status === "NOT_SUBMITTED" || status === "REJECTED" ? (
          <>
            <div className="w-px h-12 bg-gray-100 hidden lg:block"></div>
            <div className="flex items-center gap-3">
              {!file ? (
                <>
                  {documentType.code === "LOCATION_PROOF" && (
                    <button
                      onClick={fetchLocation}
                      disabled={fetchingLocation}
                      className="flex-1 lg:flex-none px-6 py-3.5 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-100 transition-all flex items-center justify-center gap-2 group w-[180px]"
                    >
                      <MapPin
                        className={cn(
                          "w-4 h-4 transition-transform",
                          fetchingLocation && "animate-bounce",
                        )}
                      />
                      {fetchingLocation
                        ? "Locating..."
                        : location
                          ? "Location Fixed"
                          : "Detect Location"}
                    </button>
                  )}
                  {documentType.code === "LIVE_PHOTO" && (
                    <button
                      onClick={() => setIsCameraOpen(true)}
                      className="flex-1 lg:flex-none px-6 py-3.5 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-100/50 transition-all flex items-center justify-center gap-2 group w-[180px]"
                    >
                      <Camera className="w-4 h-4 group-hover:scale-110 transition-transform" />{" "}
                      Open Camera
                    </button>
                  )}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                      "flex-1 lg:flex-none px-6 py-3.5 border border-gray-200 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 group w-[180px]",
                      documentType.code === "LIVE_PHOTO"
                        ? "bg-white text-gray-500"
                        : "bg-white text-gray-900 hover:border-indigo-600 hover:text-indigo-600 hover:bg-indigo-50",
                    )}
                  >
                    <Upload className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />{" "}
                    {documentType.code === "LIVE_PHOTO"
                      ? "Upload Image"
                      : "Upload File"}
                  </button>
                  <label htmlFor={`file-upload-${documentType.code}`}>
                    {" "}
                    documentType
                  </label>

                  <input
                    id={`file-upload-${documentType.code}`}
                    type="file"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept={
                      documentType.code === "LIVE_PHOTO"
                        ? "image/*"
                        : ".pdf,.jpg,.jpeg,.png,.webp"
                    }
                  />

                  {location && documentType.code === "LOCATION_PROOF" && (
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="flex-1 lg:flex-none px-6 py-3.5 bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-700 shadow-lg shadow-emerald-100/50 transition-all flex items-center justify-center gap-2 group w-[180px]"
                    >
                      {loading ? "Submitting..." : "Submit Location"}
                    </button>
                  )}
                </>
              ) : (
                <div className="flex-1 lg:flex-none flex items-center gap-2 bg-indigo-50 p-1.5 pl-4 rounded-xl border border-indigo-100 w-full lg:w-[320px]">
                  <span className="text-xs font-bold text-indigo-900 truncate flex-1">
                    {file.name}
                  </span>
                  <button
                    onClick={() => setFile(null)}
                    className="p-2 text-rose-400 hover:bg-rose-100 hover:text-rose-600 rounded-lg transition-colors"
                    title="Remove file"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-xs font-black uppercase tracking-widest hover:bg-indigo-700 shadow-md shadow-indigo-200 disabled:opacity-50 transition-all"
                  >
                    {loading ? "Outbox..." : "Submit"}
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="w-[180px] hidden lg:flex justify-end hidden">
            {status === "APPROVED" && (
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            )}
            {status === "PENDING" && (
              <Clock className="w-6 h-6 text-amber-500" />
            )}
          </div>
        )}
      </div>

      {/* Camera Capture Modal */}
      <AnimatePresence>
        {isCameraOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div>
                  <h3 className="text-xl font-black text-gray-900">
                    Live Verification
                  </h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                    Camera Capture
                  </p>
                </div>
                <label htmlFor={`file-upload-${documentType.code}`}>
                  {" "}
                  open your camera{" "}
                </label>
                <button
                  id={`file-upload-${documentType.code}`}
                  onClick={() => setIsCameraOpen(false)}
                  className="p-2 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-8 space-y-6">
                <div className="relative aspect-square overflow-hidden rounded-3xl bg-gray-100 border-2 border-gray-50 shadow-inner">
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={{
                      width: 720,
                      height: 720,
                      facingMode: "user",
                    }}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 border-[10px] border-white/20 rounded-3xl pointer-events-none"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-64 border-2 border-dashed border-white/50 rounded-full pointer-events-none"></div>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleCapture}
                    className="w-full py-4 bg-indigo-600 text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3"
                  >
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                    Capture Photo
                  </button>
                  <p className="text-[10px] font-bold text-center text-gray-400 uppercase tracking-widest">
                    Position your face within the frame and click capture
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
