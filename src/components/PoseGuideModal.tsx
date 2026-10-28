import React from 'react';
import { X, Sparkles } from 'lucide-react';
import { POSING_TIPS } from '../utils/constants';

interface PoseGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PoseGuideModal: React.FC<PoseGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-pink-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-pink-100 rounded-2xl text-pink-600">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-stone-900 text-lg">Ide Gaya Foto Photobooth Korea</h3>
              <p className="text-xs text-stone-500">Inspirasi pose estetik ala 인생네컷 (Life Four Cuts)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-5">
          {POSING_TIPS.map((tip, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-[#FFF9F6] border border-pink-100/70 hover:border-pink-300 transition"
            >
              <div className="font-bold text-sm text-pink-700 mb-1 flex items-center justify-between">
                <span>{tip.title}</span>
                <span className="text-xs px-2 py-0.5 bg-pink-50 text-pink-500 rounded-full font-mono">
                  #{idx + 1}
                </span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">{tip.tip}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-stone-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-pink-500 hover:bg-pink-600 text-white rounded-2xl text-xs font-bold transition shadow-sm"
          >
            Mengerti, Ayo Mulai Foto! 📸
          </button>
        </div>
      </div>
    </div>
  );
};
