// import React from 'react';
// import styles from './modal.module.css';

// interface ConfirmModalProps {
//   title: string;
//   message: string;
//   onConfirm: () => void;
//   onCancel: () => void;
// }

// const ConfirmModal: React.FC<ConfirmModalProps> = ({
//   title,
//   message,
//   onConfirm,
//   onCancel,
// }) => (
//   <div className={styles.modal}>
//     <div className={styles.modalContent}>
//       <h2>{title}</h2>
//       <p>{message}</p>
//       <div className={styles.modalButtons}>
//         <button onClick={onConfirm} className={styles.modalButton}>OK</button>
//         <button onClick={onCancel} className={styles.modalButton}>Cancel</button>
//       </div>
//     </div>
//   </div>
// );

// export default ConfirmModal;



import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ConfirmModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  title,
  message,
  onConfirm,
  onCancel,
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
    {/* Modal Container */}
    <div className="bg-surface w-full max-w-md rounded-3xl shadow-2xl border border-border overflow-hidden transform transition-all scale-100">
      
      {/* Content Area */}
      <div className="p-8 text-center">
        {/* Icon */}
        <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8 text-purple-600" />
        </div>
        
        {/* Title */}
        <h2 className="text-2xl font-bold text-text mb-3">
          {title}
        </h2>
        
        {/* Message */}
        <p className="text-muted text-base leading-relaxed">
          {message}
        </p>
      </div>

      {/* Button Footer */}
      <div className="p-6 bg-background border-t border-border flex gap-4">
        <button 
          onClick={onCancel} 
          className="flex-1 py-3.5 px-4 bg-surface border-2 border-border rounded-xl text-text font-bold hover:bg-background hover:border-purple-200 transition-colors"
        >
          Cancel
        </button>
        <button 
          onClick={onConfirm} 
          className="flex-1 py-3.5 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
);

export default ConfirmModal;