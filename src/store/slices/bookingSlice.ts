import { bookingService } from '@/services/api/bookingService';
import { Booking, PaginatedResponse } from '@/types';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BookingState {
  bookings: Booking[];
  currentBooking: Booking | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalCount: number;
  };
}

const initialState: BookingState = {
  bookings: [],
  currentBooking: null,
  isLoading: false,
  error: null,
  pagination: {
    currentPage: 1,
    pageSize: 10,
    totalPages: 0,
    totalCount: 0,
  },
};

// Async thunks
export const fetchBookings = createAsyncThunk(
  'booking/fetchAll',
  async (params: { page?: number; pageSize?: number }, { rejectWithValue }) => {
    try {
      const response = await bookingService.getBookings(params);
      return response.data.data as PaginatedResponse<Booking>;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch bookings'
      );
    }
  }
);

export const fetchBookingById = createAsyncThunk(
  'booking/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await bookingService.getBookingById(id);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch booking'
      );
    }
  }
);

export const createBooking = createAsyncThunk(
  'booking/create',
  async (booking: Partial<Booking>, { rejectWithValue }) => {
    try {
      const response = await bookingService.createBooking(booking);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create booking'
      );
    }
  }
);

export const updateBooking = createAsyncThunk(
  'booking/update',
  async (
    { id, data }: { id: string; data: Partial<Booking> },
    { rejectWithValue }
  ) => {
    try {
      const response = await bookingService.updateBooking(id, data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update booking'
      );
    }
  }
);

export const cancelBooking = createAsyncThunk(
  'booking/cancel',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await bookingService.cancelBooking(id);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to cancel booking'
      );
    }
  }
);

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setCurrentBooking: (state, action: PayloadAction<Booking | null>) => {
      state.currentBooking = action.payload;
    },
    clearBookings: (state) => {
      state.bookings = [];
      state.currentBooking = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch bookings
      .addCase(fetchBookings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bookings = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch booking by ID
      .addCase(fetchBookingById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBookingById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentBooking = action.payload!;
      })
      .addCase(fetchBookingById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create booking
      .addCase(createBooking.fulfilled, (state, action) => {
        state.bookings.unshift(action.payload!);
        state.currentBooking = action.payload!;
      })
      // Update booking
      .addCase(updateBooking.fulfilled, (state, action) => {
        const index = state.bookings.findIndex(
          (b) => b.id === action.payload!.id
        );
        if (index !== -1) {
          state.bookings[index] = action.payload!;
        }
        if (state.currentBooking?.id === action.payload!.id) {
          state.currentBooking = action.payload!;
        }
      })
      // Cancel booking
      .addCase(cancelBooking.fulfilled, (state, action) => {
        const index = state.bookings.findIndex(
          (b) => b.id === action.payload!.id
        );
        if (index !== -1) {
          state.bookings[index] = action.payload!;
        }
        if (state.currentBooking?.id === action.payload!.id) {
          state.currentBooking = action.payload!;
        }
      });
  },
});

export const { setCurrentBooking, clearBookings } = bookingSlice.actions;
export default bookingSlice.reducer;
