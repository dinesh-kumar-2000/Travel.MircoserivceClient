import { User } from '@/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserPreferences {
  language: string;
  currency: string;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  theme: 'light' | 'dark' | 'auto';
}

interface UserState {
  profile: User | null;
  preferences: UserPreferences;
  isLoading: boolean;
  error: string | null;
}

const defaultPreferences: UserPreferences = {
  language: 'en',
  currency: 'USD',
  notifications: {
    email: true,
    sms: false,
    push: true,
  },
  theme: 'auto',
};

const initialState: UserState = {
  profile: null,
  preferences: defaultPreferences,
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserProfile: (state, action: PayloadAction<User>) => {
      state.profile = action.payload;
      state.error = null;
    },
    updateUserProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
      }
    },
    clearUserProfile: (state) => {
      state.profile = null;
    },
    setPreferences: (
      state,
      action: PayloadAction<Partial<UserPreferences>>
    ) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    updateNotificationPreferences: (
      state,
      action: PayloadAction<Partial<UserPreferences['notifications']>>
    ) => {
      state.preferences.notifications = {
        ...state.preferences.notifications,
        ...action.payload,
      };
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.preferences.language = action.payload;
    },
    setCurrency: (state, action: PayloadAction<string>) => {
      state.preferences.currency = action.payload;
    },
    setUserLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setUserError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearUserError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setUserProfile,
  updateUserProfile,
  clearUserProfile,
  setPreferences,
  updateNotificationPreferences,
  setLanguage,
  setCurrency,
  setUserLoading,
  setUserError,
  clearUserError,
} = userSlice.actions;

export default userSlice.reducer;
