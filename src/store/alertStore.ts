import { create } from 'zustand';
import { AlertType } from '../components/common/Alert';

interface AlertState {
  isOpen: boolean;
  message: string;
  type: AlertType;
  duration: number;
  // Nouveaux états pour les dialogues
  showDialog: boolean;
  dialogTitle: string;
  dialogMessage: string;
  dialogType: AlertType;
  dialogCallback?: () => void;
  showAlert: (message: string, type: AlertType) => void;
  showAlertWithDuration: (message: string, type: AlertType, duration: number) => void;
  showAlertDialog: (title: string, message: string, type: AlertType, callback?: () => void) => void;
  hideAlert: () => void;
  hideDialog: () => void;
}

export const useAlertStore = create<AlertState>((set) => ({
  isOpen: false,
  message: '',
  type: 'info',
  duration: 5000,
  showDialog: false,
  dialogTitle: '',
  dialogMessage: '',
  dialogType: 'info',
  dialogCallback: undefined,
  showAlert: (message, type) => set({ isOpen: true, message, type }),
  showAlertWithDuration: (message, type, duration) => set({ isOpen: true, message, type, duration }),
  showAlertDialog: (title, message, type, callback) => set({ 
    showDialog: true, 
    dialogTitle: title, 
    dialogMessage: message, 
    dialogType: type,
    dialogCallback: callback
  }),
  hideAlert: () => set({ isOpen: false }),
  hideDialog: () => set({ 
    showDialog: false, 
    dialogTitle: '', 
    dialogMessage: '', 
    dialogCallback: undefined 
  }),
}));