import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Notification {
  id: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'info' | 'warning' | 'success' | 'error';
  relatedTo?: {
    type: 'request' | 'resource' | 'maintenance' | 'tender' | 'supplier';
    id: string;
  };
}

interface NotificationsState {
  notifications: Notification[];
}

// Generate mock notifications
const generateMockNotifications = (): Notification[] => {
  const notifications: Notification[] = [];
  
  const messages = [
    'Nouvelle demande de ressources du département Informatique',
    'Appel d\'offre clôturé : Acquisition d\'ordinateurs',
    'Maintenance terminée pour l\'imprimante INV-P-2003',
    'Nouvelle proposition reçue du fournisseur InfoTech',
    'Ressource affectée : Ordinateur INV-C-1005',
    'Problème signalé pour l\'ordinateur INV-C-1002',
    'Livraison prévue pour demain : 5 ordinateurs',
  ];
  
  const types: Array<'info' | 'warning' | 'success' | 'error'> = ['info', 'warning', 'success', 'error'];
  
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(Math.floor(Math.random() * 24));
    
    notifications.push({
      id: `notif-${i + 1}`,
      message: messages[i],
      timestamp: date.toISOString(),
      read: i > 2,
      type: types[i % types.length],
      relatedTo: i > 0 ? {
        type: i % 2 === 0 ? 'request' : i % 3 === 0 ? 'maintenance' : 'resource',
        id: `${i % 2 === 0 ? 'req' : i % 3 === 0 ? 'maint' : 'c'}-${i + 1}`,
      } : undefined,
    });
  }
  
  // Sort by timestamp descending (newest first)
  return notifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

const initialState: NotificationsState = {
  notifications: generateMockNotifications(),
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'timestamp' | 'read'>>) => {
      const id = `notif-${Date.now()}`;
      state.notifications.unshift({
        ...action.payload,
        id,
        timestamp: new Date().toISOString(),
        read: false,
      });
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) {
        notification.read = true;
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach(notification => {
        notification.read = true;
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
  },
});

export const { 
  addNotification, 
  markAsRead, 
  markAllAsRead, 
  removeNotification,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;