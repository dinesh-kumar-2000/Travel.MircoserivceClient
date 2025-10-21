import { Flight, Hotel, TourPackage } from '@/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SearchFilters {
  hotels: {
    location?: string;
    checkIn?: string;
    checkOut?: string;
    guests?: number;
    priceRange?: [number, number];
    rating?: number;
    amenities?: string[];
    sortBy?: 'price' | 'rating' | 'popularity';
  };
  flights: {
    from?: string;
    to?: string;
    departureDate?: string;
    returnDate?: string;
    passengers?: number;
    class?: 'economy' | 'business' | 'first';
    stops?: 'any' | 'nonstop' | 'one-stop';
    priceRange?: [number, number];
    sortBy?: 'price' | 'duration' | 'departure';
  };
  tours: {
    destination?: string;
    duration?: string;
    startDate?: string;
    travelers?: number;
    priceRange?: [number, number];
    category?: string[];
    sortBy?: 'price' | 'rating' | 'duration';
  };
}

interface CatalogState {
  hotels: {
    items: Hotel[];
    total: number;
    page: number;
    pageSize: number;
  };
  flights: {
    items: Flight[];
    total: number;
    page: number;
    pageSize: number;
  };
  tours: {
    items: TourPackage[];
    total: number;
    page: number;
    pageSize: number;
  };
  filters: SearchFilters;
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
}

const initialState: CatalogState = {
  hotels: {
    items: [],
    total: 0,
    page: 1,
    pageSize: 20,
  },
  flights: {
    items: [],
    total: 0,
    page: 1,
    pageSize: 20,
  },
  tours: {
    items: [],
    total: 0,
    page: 1,
    pageSize: 20,
  },
  filters: {
    hotels: {},
    flights: {},
    tours: {},
  },
  searchQuery: '',
  isLoading: false,
  error: null,
};

const catalogSlice = createSlice({
  name: 'catalog',
  initialState,
  reducers: {
    // Hotels
    setHotels: (
      state,
      action: PayloadAction<{
        items: Hotel[];
        total: number;
        page: number;
      }>
    ) => {
      state.hotels = { ...state.hotels, ...action.payload };
      state.isLoading = false;
    },
    addHotels: (state, action: PayloadAction<Hotel[]>) => {
      state.hotels.items = [...state.hotels.items, ...action.payload];
    },
    clearHotels: (state) => {
      state.hotels = initialState.hotels;
    },

    // Flights
    setFlights: (
      state,
      action: PayloadAction<{
        items: Flight[];
        total: number;
        page: number;
      }>
    ) => {
      state.flights = { ...state.flights, ...action.payload };
      state.isLoading = false;
    },
    addFlights: (state, action: PayloadAction<Flight[]>) => {
      state.flights.items = [...state.flights.items, ...action.payload];
    },
    clearFlights: (state) => {
      state.flights = initialState.flights;
    },

    // Tours
    setTours: (
      state,
      action: PayloadAction<{
        items: TourPackage[];
        total: number;
        page: number;
      }>
    ) => {
      state.tours = { ...state.tours, ...action.payload };
      state.isLoading = false;
    },
    addTours: (state, action: PayloadAction<TourPackage[]>) => {
      state.tours.items = [...state.tours.items, ...action.payload];
    },
    clearTours: (state) => {
      state.tours = initialState.tours;
    },

    // Filters
    setHotelFilters: (
      state,
      action: PayloadAction<Partial<SearchFilters['hotels']>>
    ) => {
      state.filters.hotels = { ...state.filters.hotels, ...action.payload };
    },
    setFlightFilters: (
      state,
      action: PayloadAction<Partial<SearchFilters['flights']>>
    ) => {
      state.filters.flights = { ...state.filters.flights, ...action.payload };
    },
    setTourFilters: (
      state,
      action: PayloadAction<Partial<SearchFilters['tours']>>
    ) => {
      state.filters.tours = { ...state.filters.tours, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },

    // Search
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    clearSearchQuery: (state) => {
      state.searchQuery = '';
    },

    // Loading & Error
    setCatalogLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setCatalogError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearCatalogError: (state) => {
      state.error = null;
    },

    // Reset all
    resetCatalog: () => {
      return initialState;
    },
  },
});

export const {
  setHotels,
  addHotels,
  clearHotels,
  setFlights,
  addFlights,
  clearFlights,
  setTours,
  addTours,
  clearTours,
  setHotelFilters,
  setFlightFilters,
  setTourFilters,
  clearFilters,
  setSearchQuery,
  clearSearchQuery,
  setCatalogLoading,
  setCatalogError,
  clearCatalogError,
  resetCatalog,
} = catalogSlice.actions;

export default catalogSlice.reducer;
