'use client';

import { useState } from 'react';
import Modal from './Modal';
import { Send, CheckCircle2, Loader2 } from 'lucide-react';

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  collegeName: string;
}

export default function ApplicationModal({ isOpen, onClose, collegeName }: ApplicationModalProps) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
    }, 1500);
  };

  if (status === 'success') {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Application Sent">
        <div className="flex flex-col items-center py-6 text-center">
          <div className="mb-4 rounded-full bg-green-50 p-4 text-green-600">
            <CheckCircle2 className="h-12 w-12" />
          </div>
          <h4 className="mb-2 text-xl font-bold text-gray-900">Successfully Applied!</h4>
          <p className="mb-8 text-gray-500">
            Your application for <span className="font-semibold text-gray-900">{collegeName}</span> has been received. 
            Our academic counselors will contact you within 24 hours.
          </p>
          <button 
            onClick={onClose}
            className="w-full rounded-xl bg-blue-600 py-3 font-bold text-white transition-all hover:bg-blue-700"
          >
            Got it, thanks!
          </button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Apply to ${collegeName}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm font-medium text-gray-700 mb-6">
          Confirm your details below to send your interest to the college admissions office.
        </p>
        
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">Preferred Course</label>
          <select required className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 font-bold text-gray-900 outline-none focus:border-blue-600 focus:bg-white transition-all">
            <option value="">Select a course</option>
            <option value="cse">Computer Science Engineering</option>
            <option value="me">Mechanical Engineering</option>
            <option value="entc">Electronics & Telecommunication</option>
            <option value="civil">Civil Engineering</option>
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">Mobile Number</label>
          <input 
            type="tel" 
            required 
            placeholder="+91 XXXXX XXXXX"
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 font-bold text-gray-900 outline-none focus:border-blue-600 focus:bg-white transition-all placeholder:text-gray-400" 
          />
        </div>

        <div className="pt-4">
          <button 
            type="submit"
            disabled={status === 'submitting'}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-4 font-bold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 active:scale-[0.98] disabled:opacity-50"
          >
            {status === 'submitting' ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                Confirm Application
                <Send className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
