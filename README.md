# Travel Platform - Multi-Tenant React Web Application

A comprehensive multi-tenant travel platform web application built with React, TypeScript, and Redux Toolkit. This application supports three distinct roles with subdomain-based authentication and complete tenant isolation.

## 🌟 Overview

TravelSphere is a modern, scalable travel platform that enables:

- **SuperAdmins** to manage multiple travel agency tenants
- **TenantAdmins** to run their branded travel agency
- **Users** to browse and book travel services through tenant-specific branded experiences

## 🎯 Key Features

### 🧑‍💼 SuperAdmin Features

- **Access:** `admin.travelsphere.com`
- Comprehensive tenant management (CRUD operations)
- Subscription plan assignment and management
- Payment gateway key management (Stripe/Razorpay)
- Global analytics dashboard (revenue, bookings, tenant usage)
- System-wide settings and configuration
- Activity logs and audit trails
- Real-time metrics and reporting

### 🏢 TenantAdmin Features

- **Access:** Subdomain-based (e.g., `dreamtravel.travelsphere.com`)
- Custom branded landing page builder
  - Drag-and-drop section editor
  - Dynamic content management (hero, banner, about, offers)
  - Image uploads and rich text editing
  - Custom styling and theming
- Booking management system
- Client/customer management with loyalty tracking
- Inventory management:
  - Hotels (rooms, pricing, amenities, availability)
  - Flights (schedules, pricing, seat management)
  - Tour packages (itineraries, inclusions, pricing)
- Payment gateway configuration
- Marketing tools (coupons, promotions, banners)
- Analytics and reporting
- Multi-language and theme customization
- Domain mapping for custom domains

### 🧳 User Features

- **Access:** Tenant subdomain (e.g., `dreamtravel.travelsphere.com`)
- Browse tenant-branded landing pages
- Advanced search and filtering:
  - Hotels (location, price, rating, amenities)
  - Flights (dates, airlines, price, connections)
  - Tour packages (destinations, activities, duration)
- Secure booking and payment processing
- Booking history and invoice management
- User profile and preferences
- Wishlist and favorites
- Wallet management
- Review and rating system
- Real-time notifications
- Chatbot support
- Multi-language support
- Dark mode

## 🏗️ Architecture

### System-Level Features

- **Tenant Detection:** Automatic subdomain-based tenant identification
- **Role-Based Access:** Dynamic routing and permission guards
- **Tenant Isolation:** Complete data separation per tenant
- **Dynamic Theming:** Per-tenant branding and customization
- **Responsive Design:** Optimized for mobile, tablet, and desktop
- **State Management:** Redux Toolkit with persistence
- **Performance:** Code splitting and lazy loading
- **Error Handling:** Comprehensive error boundaries and fallback UI
- **Analytics:** Integrated tracking and insights

## 🛠️ Tech Stack

### Frontend

- **Framework:** React 18+ with TypeScript
- **Routing:** React Router v6
- **State Management:** Redux Toolkit
- **Styling:** Tailwind CSS / Material-UI
- **Forms:** Formik + Yup
- **API Client:** Axios
- **Build Tool:** Vite
- **Testing:** Jest + React Testing Library
- **Internationalization:** i18next

### Backend Integration

- **.NET 8 Web API** (multi-tenant architecture)
- **CQRS Pattern** with MediatR
- **Database:** PostgreSQL with Dapper
- **Authentication:** JWT-based with role claims
- **Event Bus:** RabbitMQ for distributed events
- **Caching:** Redis
- **API Gateway:** Ocelot

## 📂 Project Structure

```
client/
├── src/
│   ├── assets/              # Static assets (images, fonts, styles)
│   ├── components/          # React components
│   │   ├── common/          # Shared UI components
│   │   ├── layout/          # Layout components
│   │   ├── superadmin/      # SuperAdmin-specific components
│   │   ├── tenantadmin/     # TenantAdmin-specific components
│   │   └── user/            # User-specific components
│   ├── contexts/            # React contexts
│   ├── hooks/               # Custom React hooks
│   ├── pages/               # Page components
│   │   ├── auth/            # Authentication pages
│   │   ├── superadmin/      # SuperAdmin pages
│   │   ├── tenantadmin/     # TenantAdmin pages
│   │   └── user/            # User pages
│   ├── routes/              # Route configuration
│   ├── services/            # API services
│   │   ├── api/             # API service layer
│   │   └── storage/         # Local/session storage
│   ├── store/               # Redux store
│   │   └── slices/          # Redux slices
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Utility functions
│   ├── locales/             # Translation files
│   ├── theme/               # Theme configuration
│   ├── App.tsx              # Main App component
│   └── main.tsx             # Application entry point
├── public/                  # Public assets
├── tests/                   # Test files
├── .env.example             # Environment variables template
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
├── tailwind.config.js       # Tailwind CSS configuration
└── README.md                # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Git
- Backend API services running (see backend repository)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/dinesh-kumar-2000/Travel.MircoserivceClient.git
   cd Travel.MircoserivceClient
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Update `.env.local` with your configuration:

   ```env
   VITE_API_BASE_URL=http://localhost:5000
   VITE_APP_DOMAIN=travelsphere.com
   VITE_STRIPE_PUBLIC_KEY=your_stripe_key
   VITE_RAZORPAY_KEY=your_razorpay_key
   ```

4. **Start development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Access the application**

   - SuperAdmin: `http://admin.localhost:5173`
   - TenantAdmin: `http://[tenant-subdomain].localhost:5173`
   - User: `http://[tenant-subdomain].localhost:5173`

   > **Note:** For local development with subdomains, you may need to configure your `/etc/hosts` file or use a tool like `local-ssl-proxy`.

### Building for Production

```bash
npm run build
# or
yarn build
```

The production-ready files will be in the `dist/` directory.

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## 📱 Responsive Design

The application is fully responsive and optimized for:

- 📱 Mobile devices (320px+)
- 📲 Tablets (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Large screens (1440px+)

## 🌍 Multi-Language Support

Supported languages:

- 🇺🇸 English (default)
- 🇪🇸 Spanish
- 🇫🇷 French
- (Extensible for additional languages)

## 🎨 Theming

- Light/Dark mode support
- Per-tenant custom branding
- Dynamic color schemes
- Custom fonts and logos
- CSS variable-based theming

## 🔐 Authentication Flow

1. User accesses tenant subdomain (e.g., `dreamtravel.travelsphere.com`)
2. System detects tenant from subdomain
3. User logs in with credentials
4. Backend validates credentials and returns JWT token with role claims
5. Frontend stores token securely and routes user based on role
6. All API requests include tenant context and authentication token

## 📊 Current Development Status

**Phase:** Core Infrastructure  
**Progress:** 15% (3/20 major tasks completed)

✅ **Completed:**

- Project setup and configuration
- Folder structure
- Tenant detection system

🔄 **In Progress:**

- Redux store implementation
- API service layer
- Authentication flow

⏳ **Upcoming:**

- Routing and navigation
- Shared component library
- Role-specific features

See [TODO.md](./TODO.md) for detailed development roadmap.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software. All rights reserved.

## 📞 Support

For issues, questions, or contributions:

- **Email:** support@travelsphere.com
- **Documentation:** [Link to full documentation]
- **API Docs:** [Link to API documentation]

## 🔗 Related Repositories

- **Backend API:** [Travel.Microservices](https://github.com/dinesh-kumar-2000/Travel)
- **Mobile App:** `/mobile` directory in main repository
- **Database Scripts:** `/Database` directory in main repository

---

**Built with ❤️ for the modern travel industry**
