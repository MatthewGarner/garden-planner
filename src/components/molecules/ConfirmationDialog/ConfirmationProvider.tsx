import React, { createContext, useContext, useState, useCallback } from 'react';

type ConfirmationOptions = {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'primary' | 'outline' | 'danger';
  onConfirm: () => void;
  onCancel?: () => void;
};

interface ConfirmationContextType {
  showConfirmation: (options: ConfirmationOptions) => void;
}

const ConfirmationContext = createContext<ConfirmationContextType | undefined>(undefined);

export const useConfirmation = () => {
  const context = useContext(ConfirmationContext);
  if (!context) {
    throw new Error('useConfirmation must be used within a ConfirmationProvider');
  }
  return context;
};

export const ConfirmationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [confirmationState, setConfirmationState] = useState<{
    isOpen: boolean;
    options: ConfirmationOptions | null;
  }>({
    isOpen: false,
    options: null,
  });

  const showConfirmation = useCallback((options: ConfirmationOptions) => {
    setConfirmationState({
      isOpen: true,
      options,
    });
  }, []);

  const handleClose = useCallback(() => {
    setConfirmationState({
      isOpen: false,
      options: null,
    });
  }, []);

  const handleConfirm = useCallback(() => {
    if (confirmationState.options?.onConfirm) {
      confirmationState.options.onConfirm();
    }
    handleClose();
  }, [confirmationState.options, handleClose]);

  const handleCancel = useCallback(() => {
    if (confirmationState.options?.onCancel) {
      confirmationState.options.onCancel();
    }
    handleClose();
  }, [confirmationState.options, handleClose]);

  return (
    <ConfirmationContext.Provider value={{ showConfirmation }}>
      {children}
      {confirmationState.isOpen && confirmationState.options && (
        <ConfirmationDialog
          title={confirmationState.options.title}
          message={confirmationState.options.message}
          confirmText={confirmationState.options.confirmText || 'Confirm'}
          cancelText={confirmationState.options.cancelText || 'Cancel'}
          confirmVariant={confirmationState.options.confirmVariant || 'primary'}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </ConfirmationContext.Provider>
  );
};

interface ConfirmationDialogProps extends ConfirmationOptions {
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'primary',
  onConfirm,
  onCancel,
}) => {
  // Handle clicks on the backdrop (only close if clicking directly on the backdrop)
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  // Define button variant styles
  const getButtonVariant = () => {
    switch (confirmVariant) {
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 text-white';
      case 'outline':
        return 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50';
      case 'primary':
      default:
        return 'bg-primary hover:bg-primary-dark text-white';
    }
  };

  return (
    <div
      className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-md w-full max-h-[90vh] animate-slide-up">
        <div className="p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2">{title}</h2>
          <p className="text-gray-700 mb-6">{message}</p>
          
          <div className="flex justify-end space-x-3">
            <button
              className="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              onClick={onCancel}
            >
              {cancelText}
            </button>
            <button
              className={`px-4 py-2 rounded-lg transition-colors ${getButtonVariant()}`}
              onClick={onConfirm}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add animation for dialog
const injectStyles = () => {
  if (typeof document !== 'undefined') {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      @keyframes slide-up {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animate-slide-up {
        animation: slide-up 0.2s ease-out;
      }
    `;
    document.head.appendChild(styleElement);
  }
};

// Call this function when the component mounts
if (typeof window !== 'undefined') {
  injectStyles();
}

export default ConfirmationProvider;