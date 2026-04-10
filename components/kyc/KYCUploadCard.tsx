'use client';

import React, { useState, useRef } from 'react';
import { Upload, CheckCircle2, AlertCircle, Clock, FileText, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { apiClient } from '@/lib/api-client';

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

export function KYCUploadCard({ documentType, currentStatus, onSuccess }: KYCUploadCardProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const status = currentStatus?.status || 'NOT_SUBMITTED';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('File size exceeds 10MB limit');
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleSubmit = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('kyc_type', documentType.code);
    
    // Choose the right field name based on document type
    if (documentType.code === 'LIVE_PHOTO') {
      formData.append('LIVE_PHOTO', file);
    } else {
      formData.append('document_file', file);
    }

    try {
      const result = await apiClient.submitKYC(formData);
      if (result.error || (typeof result === 'object' && !result.id && Object.keys(result).length > 0)) {
        // If it's a field-level error object from DRF
        const firstErr = typeof result === 'string' ? result : (result.error || Object.values(result)[0]);
        setError(Array.isArray(firstErr) ? firstErr[0] : firstErr);
      } else {
        setFile(null);
        onSuccess();
      }
    } catch (err) {
      setError('Failed to upload document. Please try again.');
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
    NOT_SUBMITTED: "border-gray-200 bg-white",
    PENDING: "border-amber-200 bg-amber-50/30",
    UNDER_REVIEW: "border-indigo-200 bg-indigo-50/30",
    APPROVED: "border-emerald-200 bg-emerald-50/30",
    REJECTED: "border-rose-200 bg-rose-50/30",
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "p-8 rounded-[2.5rem] border-2 transition-all duration-300 relative overflow-hidden",
        statusStyles[status as keyof typeof statusStyles],
        isDragging && "border-indigo-500 bg-indigo-50/50 scale-[1.02]"
      )}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center text-xl",
              status === 'APPROVED' ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-500"
            )}>
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-900 tracking-tighter">{documentType.name}</h3>
              <p className="text-sm font-medium text-gray-400">{documentType.description}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 text-right">
          <div className={cn(
            "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
            status === 'PENDING' && "bg-amber-100 text-amber-700 border-amber-200",
            status === 'APPROVED' && "bg-emerald-100 text-emerald-700 border-emerald-200",
            status === 'REJECTED' && "bg-rose-100 text-rose-700 border-rose-200",
            status === 'UNDER_REVIEW' && "bg-indigo-100 text-indigo-700 border-indigo-200",
            status === 'NOT_SUBMITTED' && "bg-gray-100 text-gray-600 border-gray-200",
          )}>
            {status.replace('_', ' ')}
          </div>
          {currentStatus?.submitted_at && (
            <p className="text-[10px] font-bold text-gray-400">
              Submitted: {new Date(currentStatus.submitted_at).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      <AnimatePresence>
        {(status === 'NOT_SUBMITTED' || status === 'REJECTED') && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-8 space-y-6 pt-8 border-t border-gray-100"
          >
            {!file ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer border-2 border-dashed border-gray-100 rounded-[2rem] p-10 flex flex-col items-center justify-center gap-4 hover:border-indigo-600 hover:bg-gray-50/50 transition-all group"
              >
                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 group-hover:rotate-6">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-black text-gray-900 tracking-tight italic">Click or drag to upload document</p>
                  <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">PDF, JPG or PNG (Max 10MB)</p>
                </div>
                <input 
                  id={`file-upload-${documentType.code}`}
                  title={`Upload ${documentType.name}`}
                  type="file" 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png,.webp"
                />
              </div>
            ) : (
              <div className="flex items-center justify-between p-6 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-gray-900 tracking-tight truncate max-w-[200px]">{file.name}</p>
                    <p className="text-xs font-bold text-indigo-600">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setFile(null)}
                    title="Remove selected file"
                    className="p-2 text-gray-400 hover:text-rose-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50"
                  >
                    {loading ? 'Uploading...' : 'Submit'}
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 text-rose-600 bg-rose-50 p-4 rounded-xl border border-rose-100">
                <AlertCircle className="w-4 h-4" />
                <p className="text-xs font-bold uppercase tracking-tight">{error}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {status === 'APPROVED' && (
        <div className="absolute -bottom-8 -right-8 opacity-5">
          <CheckCircle2 className="w-32 h-32" />
        </div>
      )}
    </motion.div>
  );
}
