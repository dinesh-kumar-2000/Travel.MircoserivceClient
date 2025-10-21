import React from 'react';
import { Section } from './SectionEditor';

interface SectionPreviewProps {
  sections: Section[];
}

const SectionPreview: React.FC<SectionPreviewProps> = ({ sections }) => {
  const activeSections = sections
    .filter((s) => s.isActive)
    .sort((a, b) => a.order - b.order);

  const renderSection = (section: Section) => {
    const style = {
      backgroundColor: section.backgroundColor || '#FFFFFF',
      color: section.textColor || '#000000',
    };

    switch (section.type) {
      case 'hero':
        return (
          <section key={section.id} className="px-4 py-20" style={style}>
            <div className="mx-auto max-w-6xl">
              <div className="grid items-center gap-8 md:grid-cols-2">
                <div>
                  <h1 className="mb-4 text-5xl font-bold">{section.title}</h1>
                  {section.subtitle && (
                    <p className="mb-6 text-xl">{section.subtitle}</p>
                  )}
                  {section.buttonText && (
                    <button className="rounded-lg bg-blue-600 px-8 py-3 text-white transition hover:bg-blue-700">
                      {section.buttonText}
                    </button>
                  )}
                </div>
                {section.imageUrl && (
                  <div>
                    <img
                      src={section.imageUrl}
                      alt={section.title}
                      className="h-96 w-full rounded-lg object-cover shadow-lg"
                    />
                  </div>
                )}
              </div>
            </div>
          </section>
        );

      case 'about':
        return (
          <section key={section.id} className="px-4 py-16" style={style}>
            <div className="mx-auto max-w-6xl">
              <div className="grid items-center gap-8 md:grid-cols-2">
                {section.imageUrl && (
                  <div>
                    <img
                      src={section.imageUrl}
                      alt={section.title}
                      className="h-80 w-full rounded-lg object-cover"
                    />
                  </div>
                )}
                <div>
                  <h2 className="mb-4 text-3xl font-bold">{section.title}</h2>
                  {section.subtitle && (
                    <p className="mb-4 text-lg">{section.subtitle}</p>
                  )}
                  {section.content && (
                    <div
                      className="prose"
                      dangerouslySetInnerHTML={{ __html: section.content }}
                    />
                  )}
                </div>
              </div>
            </div>
          </section>
        );

      case 'services':
        return (
          <section key={section.id} className="px-4 py-16" style={style}>
            <div className="mx-auto max-w-6xl text-center">
              <h2 className="mb-12 text-3xl font-bold">{section.title}</h2>
              <div className="grid gap-8 md:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="rounded-lg bg-white p-6 shadow">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-2xl">
                      🏨
                    </div>
                    <h3 className="mb-2 text-xl font-semibold">Service {i}</h3>
                    <p className="text-gray-600">Description of service {i}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'gallery':
        return (
          <section key={section.id} className="px-4 py-16" style={style}>
            <div className="mx-auto max-w-6xl">
              <h2 className="mb-12 text-center text-3xl font-bold">
                {section.title}
              </h2>
              <div className="grid gap-4 md:grid-cols-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div
                    key={i}
                    className="aspect-square overflow-hidden rounded-lg bg-gray-200"
                  >
                    <div className="flex h-full w-full items-center justify-center text-gray-400">
                      Image {i}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'testimonials':
        return (
          <section key={section.id} className="px-4 py-16" style={style}>
            <div className="mx-auto max-w-6xl">
              <h2 className="mb-12 text-center text-3xl font-bold">
                {section.title}
              </h2>
              <div className="grid gap-8 md:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="rounded-lg bg-white p-6 shadow">
                    <p className="mb-4 text-gray-600">
                      "Amazing experience! Highly recommend."
                    </p>
                    <div className="flex items-center">
                      <div className="mr-3 h-12 w-12 rounded-full bg-gray-300"></div>
                      <div>
                        <p className="font-semibold">Customer {i}</p>
                        <p className="text-sm text-gray-500">
                          Verified Traveler
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'contact':
        return (
          <section key={section.id} className="px-4 py-16" style={style}>
            <div className="mx-auto max-w-4xl">
              <h2 className="mb-12 text-center text-3xl font-bold">
                {section.title}
              </h2>
              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <h3 className="mb-4 text-xl font-semibold">Get in Touch</h3>
                  <div className="space-y-3">
                    <p>📧 Email: contact@example.com</p>
                    <p>📞 Phone: +1 234 567 8900</p>
                    <p>📍 Address: 123 Travel Street</p>
                  </div>
                </div>
                <form className="space-y-4">
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full rounded-lg border px-4 py-2"
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="w-full rounded-lg border px-4 py-2"
                  />
                  <textarea
                    placeholder="Your Message"
                    rows={4}
                    className="w-full rounded-lg border px-4 py-2"
                  />
                  <button
                    type="button"
                    className="w-full rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </section>
        );

      case 'cta':
        return (
          <section key={section.id} className="px-4 py-20" style={style}>
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="mb-4 text-4xl font-bold">{section.title}</h2>
              {section.subtitle && (
                <p className="mb-6 text-xl">{section.subtitle}</p>
              )}
              {section.content && (
                <div
                  className="prose prose-lg mx-auto mb-8"
                  dangerouslySetInnerHTML={{ __html: section.content }}
                />
              )}
              {section.buttonText && (
                <button className="rounded-lg bg-blue-600 px-8 py-3 text-lg text-white transition hover:bg-blue-700">
                  {section.buttonText}
                </button>
              )}
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-full overflow-auto bg-white">
      {activeSections.length > 0 ? (
        activeSections.map(renderSection)
      ) : (
        <div className="flex h-full items-center justify-center text-gray-500">
          <p>No active sections. Add sections to see preview.</p>
        </div>
      )}
    </div>
  );
};

export default SectionPreview;
