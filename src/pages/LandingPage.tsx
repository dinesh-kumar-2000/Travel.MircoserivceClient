import { Button } from '@/components/common/Button';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { tenantService } from '@/services/api/tenantService';
import { setCurrentTenant } from '@/store/slices/tenantSlice';
import { Tenant } from '@/types';
import { storeTenantData } from '@/utils/helpers';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subdomain, setSubdomain] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchTenantData = async () => {
      try {
        // Extract subdomain from hostname
        const hostname = window.location.hostname;
        const parts = hostname.split('.');

        console.log('🌐 Hostname:', hostname);
        console.log('📋 Parts:', parts);

        // Check if it's a subdomain (e.g., sam.localhost)
        if (parts.length > 1) {
          const extractedSubdomain = parts[0];

          // Skip if no subdomain, 'www', 'admin', or just 'localhost'
          if (
            !extractedSubdomain ||
            extractedSubdomain === 'www' ||
            extractedSubdomain === 'admin' ||
            extractedSubdomain === 'localhost'
          ) {
            console.log('⚠️ No valid subdomain found, skipping tenant fetch');
            setIsLoading(false);
            return;
          }

          console.log('🏢 Extracted subdomain:', extractedSubdomain);
          setSubdomain(extractedSubdomain);

          // Fetch tenant data from API
          console.log(
            `🚀 Fetching tenant data for subdomain: ${extractedSubdomain}`
          );
          console.log(
            `📡 API URL: http://localhost:8080/tenants/v1/Tenants/subdomain/${extractedSubdomain}`
          );

          const response =
            await tenantService.getTenantBySubdomain(extractedSubdomain);
          console.log('✅ API Response:', response.data);

          if (response.data.success && response.data.data) {
            const tenantData = response.data.data;
            setTenant(tenantData);
            console.log('🎉 Tenant data loaded:', tenantData);

            // Store tenant in Redux for global access
            dispatch(setCurrentTenant(tenantData));

            // Save tenant data to localStorage for future use
            storeTenantData(tenantData.id, tenantData);

            // Apply tenant theme and branding
            applyTenantBranding(tenantData);
          } else {
            setError('Tenant not found');
          }
        } else {
          console.log('🌍 Single domain, no subdomain detected');
        }

        setIsLoading(false);
      } catch (err: any) {
        console.error('❌ Error fetching tenant:', err);
        console.error('Error details:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
        });
        setError(
          err.response?.data?.message ||
            err.message ||
            'Failed to load tenant information'
        );
        setIsLoading(false);
      }
    };

    fetchTenantData();
  }, [dispatch]);

  // Apply tenant branding including colors, theme, custom CSS, and favicon
  const applyTenantBranding = (tenantData: Tenant) => {
    // Apply primary and secondary colors
    const primaryColor =
      tenantData.settings?.primaryColor || tenantData.primaryColor;
    const secondaryColor =
      tenantData.settings?.secondaryColor || tenantData.secondaryColor;

    if (primaryColor) {
      document.documentElement.style.setProperty(
        '--primary-color',
        primaryColor
      );
      console.log('🎨 Primary color applied:', primaryColor);
    }

    if (secondaryColor) {
      document.documentElement.style.setProperty(
        '--secondary-color',
        secondaryColor
      );
      console.log('🎨 Secondary color applied:', secondaryColor);
    }

    // Apply theme (light/dark mode)
    if (tenantData.settings?.theme) {
      const isDarkMode = tenantData.settings.theme === 'dark';
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      console.log('🌓 Theme applied:', tenantData.settings.theme);
    }

    // Apply custom CSS if provided
    if (tenantData.settings?.customCss) {
      let styleElement = document.getElementById('tenant-custom-css');
      if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = 'tenant-custom-css';
        document.head.appendChild(styleElement);
      }
      styleElement.textContent = tenantData.settings.customCss;
      console.log('💅 Custom CSS applied');
    }

    // Apply favicon if provided
    const faviconUrl = tenantData.settings?.faviconUrl || tenantData.logo;
    if (faviconUrl) {
      let favicon = document.querySelector<HTMLLinkElement>("link[rel='icon']");
      if (!favicon) {
        favicon = document.createElement('link');
        favicon.rel = 'icon';
        document.head.appendChild(favicon);
      }
      favicon.href = faviconUrl;
      console.log('🖼️ Favicon applied:', faviconUrl);
    }

    // Update page title with tenant name
    document.title = `${tenantData.name} - Travel Portal`;
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="mb-4 inline-block h-16 w-16 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Loading tenant information...
          </p>
          {subdomain && (
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Subdomain: {subdomain}
            </p>
          )}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 to-orange-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-md rounded-lg bg-white p-8 shadow-xl dark:bg-gray-800">
          <div className="mb-4 text-center text-6xl">😞</div>
          <h2 className="mb-4 text-center text-3xl font-bold text-red-600">
            Error Loading Tenant
          </h2>
          <p className="mb-4 text-center text-gray-600 dark:text-gray-400">
            {error}
          </p>
          {subdomain && (
            <p className="mb-6 text-center text-sm text-gray-500">
              Subdomain attempted:{' '}
              <span className="font-mono">{subdomain}</span>
            </p>
          )}
          <div className="flex justify-center gap-4">
            <Button onClick={() => window.location.reload()} variant="primary">
              Retry
            </Button>
            <Button
              onClick={() => (window.location.href = 'http://localhost:5173')}
              variant="outline"
            >
              Go to Main Site
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 shadow-sm backdrop-blur-sm dark:bg-gray-900/95">
        <div className="container-custom">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-red-500">
                <span className="text-xl font-bold text-white">G</span>
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {tenant?.name || 'GLOBE TREKKER'}
              </span>
            </div>

            {/* Navigation */}
            <nav className="hidden items-center space-x-8 md:flex">
              <a
                href="#home"
                className="text-gray-700 transition-colors hover:text-orange-500 dark:text-gray-300"
              >
                Home
              </a>
              <a
                href="#destinations"
                className="text-gray-700 transition-colors hover:text-orange-500 dark:text-gray-300"
              >
                Destinations
              </a>
              <a
                href="#experiences"
                className="text-gray-700 transition-colors hover:text-orange-500 dark:text-gray-300"
              >
                Experiences
              </a>
              <a
                href="#blog"
                className="text-gray-700 transition-colors hover:text-orange-500 dark:text-gray-300"
              >
                Blog
              </a>
              <a
                href="#about"
                className="text-gray-700 transition-colors hover:text-orange-500 dark:text-gray-300"
              >
                About Us
              </a>
            </nav>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-700 hover:text-orange-500 dark:text-gray-300">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
              <Link to="/login">
                <Button
                  variant="primary"
                  className="bg-gray-900 text-white hover:bg-gray-800"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        className="relative overflow-hidden py-20 text-white"
        style={{
          background: tenant?.primaryColor
            ? `linear-gradient(135deg, ${tenant.primaryColor} 0%, ${tenant.secondaryColor || tenant.primaryColor} 100%)`
            : 'linear-gradient(135deg, rgb(251 146 60) 0%, rgb(239 68 68) 100%)',
        }}
      >
        <div className="container-custom relative z-10">
          <div className="grid min-h-[80vh] items-center gap-12 lg:grid-cols-2">
            {/* Left Content */}
            <div className="text-left">
              <h1 className="mb-6 text-5xl font-bold leading-tight lg:text-6xl">
                Discover the World's{' '}
                <span className="text-yellow-300">Hidden Wonders</span>
              </h1>

              <p className="mb-8 text-xl leading-relaxed opacity-90">
                Embark on extraordinary journeys to breathtaking destinations.
                From ancient temples to modern marvels, discover unique travel
                experiences that will create memories to last a lifetime.
              </p>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Button
                  size="lg"
                  className="bg-white px-8 py-4 text-lg font-semibold text-orange-600 hover:bg-gray-100"
                >
                  Explore Now
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white px-8 py-4 text-lg font-semibold text-white hover:bg-white hover:text-orange-600"
                >
                  Watch Video
                </Button>
              </div>
            </div>

            {/* Right Content - Images */}
            <div className="grid grid-cols-2 gap-4">
              {/* Top Left Image */}
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  alt="Castle at sunset"
                  className="h-64 w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>

              {/* Top Right Image */}
              <div className="relative mt-8 overflow-hidden rounded-2xl shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1548013146-72479768bada?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  alt="Ancient temples"
                  className="h-64 w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>

              {/* Bottom Right Image */}
              <div className="relative col-span-2 overflow-hidden rounded-2xl shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  alt="Traditional architecture"
                  className="h-48 w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white blur-3xl"></div>
        </div>
      </section>

      {/* Top Destinations Section */}
      <section id="destinations" className="bg-gray-50 py-16 dark:bg-gray-800">
        <div className="container-custom">
          <div className="mb-12 flex flex-col items-start justify-between lg:flex-row lg:items-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white lg:mb-0">
              Top Destinations
            </h2>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex flex-wrap gap-2">
                <button className="border-b-2 border-orange-600 px-4 py-2 font-medium text-orange-600">
                  Popular
                </button>
                <button className="px-4 py-2 text-gray-600 transition-colors hover:text-orange-600">
                  Asia
                </button>
                <button className="px-4 py-2 text-gray-600 transition-colors hover:text-orange-600">
                  Europe
                </button>
                <button className="px-4 py-2 text-gray-600 transition-colors hover:text-orange-600">
                  America & Middle East
                </button>
                <button className="px-4 py-2 text-gray-600 transition-colors hover:text-orange-600">
                  Australia & The Pacific
                </button>
                <button className="px-4 py-2 text-gray-600 transition-colors hover:text-orange-600">
                  Canada
                </button>
                <button className="px-4 py-2 text-gray-600 transition-colors hover:text-orange-600">
                  More
                </button>
              </div>
              <button className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:border-orange-600 hover:text-orange-600">
                Explore all destinations
              </button>
            </div>
          </div>

          {/* Destination Cards */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Destination 1 */}
            <div className="group cursor-pointer">
              <div className="relative mb-4 overflow-hidden rounded-xl">
                <img
                  src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  alt="Golden Bridge Ba Na Hills"
                  className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
              <h3 className="mb-1 font-semibold text-gray-900 dark:text-white">
                Golden Bridge Ba Na Hills
              </h3>
              <p className="text-gray-600 dark:text-gray-400">Vietnam</p>
            </div>

            {/* Destination 2 */}
            <div className="group cursor-pointer">
              <div className="relative mb-4 overflow-hidden rounded-xl">
                <img
                  src="https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  alt="Dubrovnik"
                  className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
              <h3 className="mb-1 font-semibold text-gray-900 dark:text-white">
                Dubrovnik
              </h3>
              <p className="text-gray-600 dark:text-gray-400">Croatia</p>
            </div>

            {/* Destination 3 */}
            <div className="group cursor-pointer">
              <div className="relative mb-4 overflow-hidden rounded-xl">
                <img
                  src="https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  alt="Hot Air Balloon Cappadocia"
                  className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
              <h3 className="mb-1 font-semibold text-gray-900 dark:text-white">
                Hot Air Balloon-Cappadocia
              </h3>
              <p className="text-gray-600 dark:text-gray-400">Turkey</p>
            </div>

            {/* Destination 4 */}
            <div className="group cursor-pointer">
              <div className="relative mb-4 overflow-hidden rounded-xl">
                <img
                  src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  alt="Sydney Harbour Bridge"
                  className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
              <h3 className="mb-1 font-semibold text-gray-900 dark:text-white">
                Sydney Harbour Bridge
              </h3>
              <p className="text-gray-600 dark:text-gray-400">Australia</p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Stories Section */}
      <section id="blog" className="py-16">
        <div className="container-custom">
          <div className="mb-12 flex flex-col items-start justify-between lg:flex-row lg:items-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white lg:mb-0">
              Latest Stories
            </h2>
            <button className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:border-orange-600 hover:text-orange-600">
              Browse all stories
            </button>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Story */}
            <div className="lg:col-span-2">
              <div className="group cursor-pointer">
                <div className="relative mb-6 overflow-hidden rounded-xl">
                  <img
                    src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                    alt="Los Angeles food guide"
                    className="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
                <div className="space-y-3">
                  <span className="inline-block rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-800">
                    Food and Drink
                  </span>
                  <h3 className="text-2xl font-bold text-gray-900 transition-colors group-hover:text-orange-600 dark:text-white">
                    Los Angeles food & drink guide: 10 things to try in Los
                    Angeles, California
                  </h3>
                  <div className="flex items-center text-sm text-gray-500">
                    <span>Aug 09 2023</span>
                    <span className="mx-2">•</span>
                    <span>7 min read</span>
                  </div>
                  <p className="leading-relaxed text-gray-600 dark:text-gray-400">
                    Discover the culinary heart of LA with our comprehensive
                    guide to the city's best food and drink experiences. From
                    iconic street food to fine dining establishments, explore
                    what makes Los Angeles a food lover's paradise.
                  </p>
                </div>
              </div>
            </div>

            {/* Side Stories */}
            <div className="space-y-6">
              {/* Story 1 */}
              <div className="group cursor-pointer">
                <div className="flex gap-4">
                  <div className="relative flex-shrink-0 overflow-hidden rounded-lg">
                    <img
                      src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80"
                      alt="South London Markets"
                      className="h-20 w-20 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex-1">
                    <span className="mb-2 inline-block rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                      Markets
                    </span>
                    <h4 className="mb-1 line-clamp-2 font-semibold text-gray-900 transition-colors group-hover:text-orange-600 dark:text-white">
                      15 South London Markets You'll Love: Best Markets in South
                      London
                    </h4>
                    <div className="flex items-center text-xs text-gray-500">
                      <span>Aug 05 2023</span>
                      <span className="mx-1">•</span>
                      <span>5 min read</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Story 2 */}
              <div className="group cursor-pointer">
                <div className="flex gap-4">
                  <div className="relative flex-shrink-0 overflow-hidden rounded-lg">
                    <img
                      src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80"
                      alt="Incredible hotels"
                      className="h-20 w-20 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex-1">
                    <span className="mb-2 inline-block rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                      Hotels
                    </span>
                    <h4 className="mb-1 line-clamp-2 font-semibold text-gray-900 transition-colors group-hover:text-orange-600 dark:text-white">
                      10 incredible hotels around the world you can book with
                      points in 2024
                    </h4>
                    <div className="flex items-center text-xs text-gray-500">
                      <span>Aug 02 2023</span>
                      <span className="mx-1">•</span>
                      <span>6 min read</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Story 3 */}
              <div className="group cursor-pointer">
                <div className="flex gap-4">
                  <div className="relative flex-shrink-0 overflow-hidden rounded-lg">
                    <img
                      src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80"
                      alt="Chicago budget travel"
                      className="h-20 w-20 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex-1">
                    <span className="mb-2 inline-block rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-800">
                      Budget Travel
                    </span>
                    <h4 className="mb-1 line-clamp-2 font-semibold text-gray-900 transition-colors group-hover:text-orange-600 dark:text-white">
                      Visiting Chicago on a Budget: Affordable Eats and
                      Attraction Deals
                    </h4>
                    <div className="flex items-center text-xs text-gray-500">
                      <span>Jul 28 2023</span>
                      <span className="mx-1">•</span>
                      <span>8 min read</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trekker's Highlights Section */}
      <section className="bg-gray-50 py-16 dark:bg-gray-800">
        <div className="container-custom">
          <h2 className="mb-12 text-center text-4xl font-bold text-gray-900 dark:text-white">
            Trekker's Highlights
          </h2>

          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Testimonial */}
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <img
                  src="https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80"
                  alt="Maria Angelica"
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    Maria Angelica
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Solo Traveler
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="h-5 w-5 text-orange-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                An Unforgettable Journey Through Turkey
              </h3>

              <p className="leading-relaxed text-gray-600 dark:text-gray-400">
                "My trip to Turkey was absolutely magical! From the breathtaking
                hot air balloon ride over Cappadocia at sunrise to exploring the
                ancient streets of Istanbul, every moment was filled with
                wonder. The local people were incredibly welcoming, the food was
                delicious, and the culture was rich and fascinating. I can't
                wait to go back and explore more of this beautiful country.
                Highly recommend this destination for any traveler seeking
                adventure and culture!"
              </p>

              <button className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:border-orange-600 hover:text-orange-600">
                See more highlights
              </button>
            </div>

            {/* Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative overflow-hidden rounded-xl">
                <img
                  src="https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  alt="Hot air balloons in Cappadocia"
                  className="h-64 w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

                {/* Pagination dots */}
                <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 transform space-x-2">
                  <div className="h-2 w-2 rounded-full bg-white"></div>
                  <div className="h-2 w-2 rounded-full bg-white/50"></div>
                  <div className="h-2 w-2 rounded-full bg-white/50"></div>
                </div>
              </div>

              {/* Video Thumbnail */}
              <div className="group relative cursor-pointer overflow-hidden rounded-xl">
                <img
                  src="https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  alt="Istanbul video thumbnail"
                  className="h-32 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 transition-colors group-hover:bg-black/60">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white">
                    <svg
                      className="ml-1 h-6 w-6 text-gray-900"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup Section */}
      <section className="relative overflow-hidden py-20">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80"
            alt="Desert landscape background"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        {/* Content */}
        <div className="container-custom relative z-10">
          <div className="mx-auto max-w-2xl text-center text-white">
            <h2 className="mb-6 text-4xl font-bold lg:text-5xl">
              Get Your Travel Inspiration Straight to Your Inbox
            </h2>

            <form className="mx-auto mb-6 flex max-w-md flex-col gap-4 sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <Button className="rounded-lg bg-orange-600 px-8 py-3 font-semibold text-white hover:bg-orange-700">
                Subscribe
              </Button>
            </form>

            <p className="text-sm text-gray-300">
              Subscribe to our newsletter to receive updates on promotions,
              travel tips, and more.{' '}
              <a
                href="#"
                className="underline transition-colors hover:text-white"
              >
                Read our Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-16 text-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
            {/* Logo and Social */}
            <div className="lg:col-span-2">
              <div className="mb-4 flex items-center space-x-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-red-500">
                  <span className="text-xl font-bold text-white">G</span>
                </div>
                <span className="text-2xl font-bold">
                  {tenant?.name || 'GLOBE TREKKER'}
                </span>
              </div>

              <div className="mb-6 flex space-x-4">
                <a
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-800 transition-colors hover:bg-orange-600"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-800 transition-colors hover:bg-orange-600"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-800 transition-colors hover:bg-orange-600"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-800 transition-colors hover:bg-orange-600"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-800 transition-colors hover:bg-orange-600"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* About Us */}
            <div>
              <h3 className="mb-4 text-lg font-semibold">About Us</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    Who we are
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    Work with us
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    Press & Media
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    Our Partners
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    Terms & Conditions
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>

            {/* Travel Interest */}
            <div>
              <h3 className="mb-4 text-lg font-semibold">Travel Interest</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    Luxury Travel
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    Adventure
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    Honeymoon
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    Road Trips
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    Family Travel
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    Food & Drink
                  </a>
                </li>
              </ul>
            </div>

            {/* Quick Shop */}
            <div>
              <h3 className="mb-4 text-lg font-semibold">Quick Shop</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    Travel Guides
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    Digital Guides
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    Packing Guides
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    Travel Essentials
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-12 border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>
              © 2023 {tenant?.name || 'Globe Trekker'}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
