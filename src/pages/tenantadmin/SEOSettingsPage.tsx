import React, { useEffect, useState } from 'react';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Tabs } from '../../components/common/Tabs';
import { useNotifications } from '../../hooks/useNotifications';
import { tenantService } from '../../services/api/tenantService';

interface SEOSettings {
  general: {
    siteTitle: string;
    siteDescription: string;
    keywords: string;
    author: string;
    canonicalUrl: string;
  };
  openGraph: {
    ogTitle: string;
    ogDescription: string;
    ogImage: string;
    ogType: string;
  };
  twitter: {
    twitterCard: string;
    twitterSite: string;
    twitterTitle: string;
    twitterDescription: string;
    twitterImage: string;
  };
  technical: {
    robots: string;
    googleSiteVerification: string;
    bingSiteVerification: string;
    googleAnalyticsId: string;
    gtmId: string;
  };
  sitemap: {
    enableSitemap: boolean;
    sitemapUrl: string;
    lastGenerated: string;
  };
  schema: {
    enableSchema: boolean;
    organizationSchema: string;
    breadcrumbSchema: boolean;
    productSchema: boolean;
  };
}

export const SEOSettingsPage: React.FC = () => {
  const { showSuccess, showError } = useNotifications();
  const [settings, setSettings] = useState<SEOSettings>({
    general: {
      siteTitle: '',
      siteDescription: '',
      keywords: '',
      author: '',
      canonicalUrl: '',
    },
    openGraph: {
      ogTitle: '',
      ogDescription: '',
      ogImage: '',
      ogType: 'website',
    },
    twitter: {
      twitterCard: 'summary_large_image',
      twitterSite: '',
      twitterTitle: '',
      twitterDescription: '',
      twitterImage: '',
    },
    technical: {
      robots: 'index, follow',
      googleSiteVerification: '',
      bingSiteVerification: '',
      googleAnalyticsId: '',
      gtmId: '',
    },
    sitemap: {
      enableSitemap: true,
      sitemapUrl: '',
      lastGenerated: '',
    },
    schema: {
      enableSchema: true,
      organizationSchema: '',
      breadcrumbSchema: true,
      productSchema: true,
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const response = await tenantService.getSEOSettings();
      setSettings(response);
    } catch (error) {
      showError('Failed to fetch SEO settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await tenantService.updateSEOSettings(settings);
      showSuccess('SEO settings updated successfully');
    } catch (error) {
      showError('Failed to update SEO settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateSitemap = async () => {
    try {
      await tenantService.generateSitemap();
      showSuccess('Sitemap generated successfully');
      fetchSettings();
    } catch (error) {
      showError('Failed to generate sitemap');
    }
  };

  const tabs = [
    {
      id: 'general',
      label: 'General SEO',
      content: (
        <div className="space-y-4">
          <Input
            label="Site Title"
            value={settings.general.siteTitle}
            onChange={(e) =>
              setSettings({
                ...settings,
                general: { ...settings.general, siteTitle: e.target.value },
              })
            }
            placeholder="Your Travel Agency Name"
            helpText="This appears in search results and browser tabs (50-60 characters)"
          />
          <div>
            <label className="mb-2 block text-sm font-medium">
              Meta Description
            </label>
            <textarea
              value={settings.general.siteDescription}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  general: {
                    ...settings.general,
                    siteDescription: e.target.value,
                  },
                })
              }
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
              placeholder="Describe your travel services..."
            />
            <p className="mt-1 text-sm text-gray-500">
              150-160 characters recommended
            </p>
          </div>
          <Input
            label="Keywords"
            value={settings.general.keywords}
            onChange={(e) =>
              setSettings({
                ...settings,
                general: { ...settings.general, keywords: e.target.value },
              })
            }
            placeholder="travel, tours, hotels, flights"
            helpText="Comma-separated keywords relevant to your business"
          />
          <Input
            label="Author"
            value={settings.general.author}
            onChange={(e) =>
              setSettings({
                ...settings,
                general: { ...settings.general, author: e.target.value },
              })
            }
            placeholder="Your Company Name"
          />
          <Input
            label="Canonical URL"
            value={settings.general.canonicalUrl}
            onChange={(e) =>
              setSettings({
                ...settings,
                general: { ...settings.general, canonicalUrl: e.target.value },
              })
            }
            placeholder="https://yourdomain.com"
            helpText="Your primary domain URL"
          />
        </div>
      ),
    },
    {
      id: 'social',
      label: 'Social Media',
      content: (
        <div className="space-y-6">
          <Card>
            <h3 className="mb-4 text-lg font-semibold">
              Open Graph (Facebook)
            </h3>
            <div className="space-y-4">
              <Input
                label="OG Title"
                value={settings.openGraph.ogTitle}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    openGraph: {
                      ...settings.openGraph,
                      ogTitle: e.target.value,
                    },
                  })
                }
                placeholder="Title for social media sharing"
              />
              <div>
                <label className="mb-2 block text-sm font-medium">
                  OG Description
                </label>
                <textarea
                  value={settings.openGraph.ogDescription}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      openGraph: {
                        ...settings.openGraph,
                        ogDescription: e.target.value,
                      },
                    })
                  }
                  rows={2}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                />
              </div>
              <Input
                label="OG Image URL"
                value={settings.openGraph.ogImage}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    openGraph: {
                      ...settings.openGraph,
                      ogImage: e.target.value,
                    },
                  })
                }
                placeholder="https://example.com/image.jpg"
                helpText="Recommended size: 1200 x 630 pixels"
              />
            </div>
          </Card>

          <Card>
            <h3 className="mb-4 text-lg font-semibold">Twitter Card</h3>
            <div className="space-y-4">
              <Input
                label="Twitter Site Handle"
                value={settings.twitter.twitterSite}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    twitter: {
                      ...settings.twitter,
                      twitterSite: e.target.value,
                    },
                  })
                }
                placeholder="@yourtravelsite"
              />
              <Input
                label="Twitter Title"
                value={settings.twitter.twitterTitle}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    twitter: {
                      ...settings.twitter,
                      twitterTitle: e.target.value,
                    },
                  })
                }
              />
              <Input
                label="Twitter Image URL"
                value={settings.twitter.twitterImage}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    twitter: {
                      ...settings.twitter,
                      twitterImage: e.target.value,
                    },
                  })
                }
                placeholder="https://example.com/twitter-image.jpg"
              />
            </div>
          </Card>
        </div>
      ),
    },
    {
      id: 'technical',
      label: 'Technical SEO',
      content: (
        <div className="space-y-4">
          <Input
            label="Robots Meta Tag"
            value={settings.technical.robots}
            onChange={(e) =>
              setSettings({
                ...settings,
                technical: { ...settings.technical, robots: e.target.value },
              })
            }
            placeholder="index, follow"
            helpText="Control search engine indexing"
          />
          <Input
            label="Google Site Verification"
            value={settings.technical.googleSiteVerification}
            onChange={(e) =>
              setSettings({
                ...settings,
                technical: {
                  ...settings.technical,
                  googleSiteVerification: e.target.value,
                },
              })
            }
            placeholder="Google verification code"
          />
          <Input
            label="Bing Site Verification"
            value={settings.technical.bingSiteVerification}
            onChange={(e) =>
              setSettings({
                ...settings,
                technical: {
                  ...settings.technical,
                  bingSiteVerification: e.target.value,
                },
              })
            }
            placeholder="Bing verification code"
          />
          <Input
            label="Google Analytics ID"
            value={settings.technical.googleAnalyticsId}
            onChange={(e) =>
              setSettings({
                ...settings,
                technical: {
                  ...settings.technical,
                  googleAnalyticsId: e.target.value,
                },
              })
            }
            placeholder="G-XXXXXXXXXX"
          />
          <Input
            label="Google Tag Manager ID"
            value={settings.technical.gtmId}
            onChange={(e) =>
              setSettings({
                ...settings,
                technical: { ...settings.technical, gtmId: e.target.value },
              })
            }
            placeholder="GTM-XXXXXX"
          />
        </div>
      ),
    },
    {
      id: 'sitemap',
      label: 'Sitemap',
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.sitemap.enableSitemap}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  sitemap: {
                    ...settings.sitemap,
                    enableSitemap: e.target.checked,
                  },
                })
              }
              className="rounded"
            />
            <label>Enable Sitemap Generation</label>
          </div>

          {settings.sitemap.enableSitemap && (
            <>
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                <p className="mb-2 text-sm">Sitemap URL:</p>
                <code className="text-sm">
                  {settings.sitemap.sitemapUrl || 'Not generated yet'}
                </code>
                {settings.sitemap.lastGenerated && (
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Last generated:{' '}
                    {new Date(settings.sitemap.lastGenerated).toLocaleString()}
                  </p>
                )}
              </div>
              <Button variant="secondary" onClick={handleGenerateSitemap}>
                Generate Sitemap Now
              </Button>
            </>
          )}
        </div>
      ),
    },
    {
      id: 'schema',
      label: 'Structured Data',
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.schema.enableSchema}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  schema: {
                    ...settings.schema,
                    enableSchema: e.target.checked,
                  },
                })
              }
              className="rounded"
            />
            <label>Enable Schema.org Markup</label>
          </div>

          {settings.schema.enableSchema && (
            <>
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Organization Schema (JSON-LD)
                </label>
                <textarea
                  value={settings.schema.organizationSchema}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      schema: {
                        ...settings.schema,
                        organizationSchema: e.target.value,
                      },
                    })
                  }
                  rows={10}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                  placeholder='{"@context": "https://schema.org", "@type": "Organization", ...}'
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.schema.breadcrumbSchema}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        schema: {
                          ...settings.schema,
                          breadcrumbSchema: e.target.checked,
                        },
                      })
                    }
                    className="rounded"
                  />
                  <label>Enable Breadcrumb Schema</label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.schema.productSchema}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        schema: {
                          ...settings.schema,
                          productSchema: e.target.checked,
                        },
                      })
                    }
                    className="rounded"
                  />
                  <label>Enable Product Schema (for tours/hotels)</label>
                </div>
              </div>
            </>
          )}
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold">SEO Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Optimize your site for search engines and social media
        </p>
      </div>

      <Card>
        <Tabs tabs={tabs} />
      </Card>

      <div className="mt-6 flex justify-end gap-4">
        <Button variant="secondary" onClick={fetchSettings}>
          Reset
        </Button>
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={isSaving}
          isLoading={isSaving}
        >
          Save Settings
        </Button>
      </div>
    </div>
  );
};
