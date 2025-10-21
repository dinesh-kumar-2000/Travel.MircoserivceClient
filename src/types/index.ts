// User and Authentication Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  tenantId?: string;
  profilePicture?: string;
  phoneNumber?: string;
  permissions?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'SuperAdmin' | 'TenantAdmin' | 'User';

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
}

// Tenant Types
export interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  contactEmail: string;
  status: string;
  tier: string;
  logo?: string;
  primaryColor?: string;
  secondaryColor?: string;
  isActive: boolean;
  settings?: TenantSettings;
}

export interface TenantSettings {
  theme?: string;
  primaryColor?: string;
  secondaryColor?: string;
  logoUrl?: string;
  faviconUrl?: string;
  customCss?: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  billingCycle: 'monthly' | 'yearly';
  features: string[];
  maxUsers: number;
  maxBookings: number;
  isActive: boolean;
}

// Address Type
export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

// Booking Types
export interface Booking {
  id: string;
  userId: string;
  tenantId: string;
  bookingType: BookingType;
  bookingReference: string;
  status: BookingStatus;
  totalAmount: number;
  currency: string;
  paymentStatus: PaymentStatus;
  bookingDate: string;
  details: HotelBooking | FlightBooking | TourPackageBooking;
  user: User;
  createdAt: string;
  updatedAt: string;
}

export enum BookingType {
  HOTEL = 'Hotel',
  FLIGHT = 'Flight',
  TOUR_PACKAGE = 'TourPackage',
}

export enum BookingStatus {
  PENDING = 'Pending',
  CONFIRMED = 'Confirmed',
  CANCELLED = 'Cancelled',
  COMPLETED = 'Completed',
}

export enum PaymentStatus {
  PENDING = 'Pending',
  PAID = 'Paid',
  REFUNDED = 'Refunded',
  FAILED = 'Failed',
}

export interface HotelBooking {
  hotelId: string;
  hotelName: string;
  roomType: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  numberOfRooms: number;
  amenities: string[];
  specialRequests?: string;
}

export interface FlightBooking {
  flightId: string;
  airline: string;
  flightNumber: string;
  departureAirport: string;
  arrivalAirport: string;
  departureDate: string;
  arrivalDate: string;
  numberOfPassengers: number;
  class: 'Economy' | 'Business' | 'First';
  seatNumbers?: string[];
}

export interface TourPackageBooking {
  packageId: string;
  packageName: string;
  destination: string;
  startDate: string;
  endDate: string;
  numberOfTravelers: number;
  itinerary: ItineraryItem[];
  inclusions: string[];
  exclusions: string[];
}

export interface ItineraryItem {
  day: number;
  title: string;
  description: string;
  activities: string[];
  meals: string[];
  accommodation?: string;
}

// Hotel Types
export interface Hotel {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  address: Address;
  rating: number;
  images: string[];
  amenities: string[];
  rooms: Room[];
  policies: HotelPolicies;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Room {
  id: string;
  hotelId: string;
  type: string;
  description: string;
  maxOccupancy: number;
  basePrice: number;
  images: string[];
  amenities: string[];
  availability: RoomAvailability[];
}

export interface RoomAvailability {
  date: string;
  available: number;
  price: number;
}

export interface HotelPolicies {
  checkInTime: string;
  checkOutTime: string;
  cancellationPolicy: string;
  childPolicy: string;
  petPolicy: string;
}

// Flight Types
export interface Flight {
  id: string;
  tenantId: string;
  airline: string;
  flightNumber: string;
  departureAirport: string;
  arrivalAirport: string;
  departureTime: string;
  arrivalTime: string;
  duration: number; // in minutes
  aircraft: string;
  availableSeats: SeatAvailability;
  pricing: FlightPricing;
  isActive: boolean;
}

export interface SeatAvailability {
  economy: number;
  business: number;
  first: number;
}

export interface FlightPricing {
  economy: number;
  business: number;
  first: number;
}

// Tour Package Types
export interface TourPackage {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  destination: string;
  duration: number; // in days
  price: number;
  images: string[];
  itinerary: ItineraryItem[];
  inclusions: string[];
  exclusions: string[];
  maxGroupSize: number;
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Payment Types
export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId: string;
  gatewayResponse?: any;
  createdAt: string;
}

export enum PaymentMethod {
  CREDIT_CARD = 'CreditCard',
  DEBIT_CARD = 'DebitCard',
  STRIPE = 'Stripe',
  RAZORPAY = 'Razorpay',
  PAYPAL = 'PayPal',
  WALLET = 'Wallet',
}

// Landing Page Types
export interface LandingPage {
  id: string;
  tenantId: string;
  sections: LandingPageSection[];
  isPublished: boolean;
  updatedAt: string;
}

export interface LandingPageSection {
  id: string;
  type: SectionType;
  order: number;
  isVisible: boolean;
  content: any;
}

export enum SectionType {
  HERO = 'Hero',
  ABOUT = 'About',
  SERVICES = 'Services',
  FEATURED_DESTINATIONS = 'FeaturedDestinations',
  TESTIMONIALS = 'Testimonials',
  CONTACT = 'Contact',
  GALLERY = 'Gallery',
  OFFERS = 'Offers',
  FAQ = 'FAQ',
}

// Analytics Types
export interface Analytics {
  totalRevenue: number;
  totalBookings: number;
  totalUsers: number;
  totalTenants?: number;
  revenueGrowth: number;
  bookingGrowth: number;
  userGrowth: number;
  topDestinations: TopDestination[];
  recentBookings: Booking[];
  revenueByMonth: MonthlyRevenue[];
}

export interface TopDestination {
  name: string;
  bookings: number;
  revenue: number;
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
  bookings: number;
}

// Common Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalCount: number;
  };
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  data?: any;
  createdAt: string;
}

export enum NotificationType {
  BOOKING_CONFIRMED = 'BookingConfirmed',
  BOOKING_CANCELLED = 'BookingCancelled',
  PAYMENT_SUCCESS = 'PaymentSuccess',
  PAYMENT_FAILED = 'PaymentFailed',
  SYSTEM = 'System',
  PROMOTIONAL = 'Promotional',
}

// Review Types
export interface Review {
  id: string;
  userId: string;
  bookingId: string;
  rating: number;
  comment: string;
  images?: string[];
  isVerified: boolean;
  createdAt: string;
  user: User;
}

// Search and Filter Types
export interface SearchFilters {
  destination?: string;
  checkInDate?: string;
  checkOutDate?: string;
  guests?: number;
  priceRange?: {
    min: number;
    max: number;
  };
  rating?: number;
  amenities?: string[];
  sortBy?: string;
}
