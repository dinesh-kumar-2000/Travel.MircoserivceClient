import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { MainLayout } from '@/components/layout';
import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 py-20 text-white">
        <div className="container-custom">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 text-5xl font-bold">
              Your Journey Begins Here
            </h1>
            <p className="mb-8 text-xl">
              Discover amazing destinations, book unforgettable experiences
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/hotels">
                <Button size="lg" variant="secondary">
                  Browse Hotels
                </Button>
              </Link>
              <Link to="/flights">
                <Button size="lg" variant="outline">
                  Find Flights
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container-custom">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900 dark:text-white">
            What We Offer
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <Card>
              <div className="text-center">
                <div className="mb-4 text-5xl">🏨</div>
                <h3 className="mb-2 text-xl font-semibold">Hotels</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Find and book the perfect accommodation for your stay
                </p>
              </div>
            </Card>

            <Card>
              <div className="text-center">
                <div className="mb-4 text-5xl">✈️</div>
                <h3 className="mb-2 text-xl font-semibold">Flights</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Compare and book flights to destinations worldwide
                </p>
              </div>
            </Card>

            <Card>
              <div className="text-center">
                <div className="mb-4 text-5xl">🗺️</div>
                <h3 className="mb-2 text-xl font-semibold">Tour Packages</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Discover curated tour packages for memorable experiences
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default HomePage;
