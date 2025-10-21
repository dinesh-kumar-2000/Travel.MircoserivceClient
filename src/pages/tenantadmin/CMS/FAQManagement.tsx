import React, { useEffect, useState } from 'react';
import { Button } from '../../../components/common/Button';
import { Card } from '../../../components/common/Card';
import { Input } from '../../../components/common/Input';
import { Modal } from '../../../components/common/Modal';
import { useNotifications } from '../../../hooks/useNotifications';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  isActive: boolean;
}

export const FAQManagement: React.FC = () => {
  const { showSuccess, showError } = useNotifications();
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editModal, setEditModal] = useState<{
    show: boolean;
    faq: FAQ | null;
  }>({
    show: false,
    faq: null,
  });
  const [formData, setFormData] = useState<Partial<FAQ>>({
    question: '',
    answer: '',
    category: 'General',
    isActive: true,
  });

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await cmsService.getFAQs();
      // setFaqs(response.data);

      // Mock data
      setFaqs([
        {
          id: '1',
          question: 'What is your cancellation policy?',
          answer:
            'You can cancel your booking up to 48 hours before departure for a full refund. Cancellations within 48 hours are subject to a 25% cancellation fee.',
          category: 'Booking',
          order: 1,
          isActive: true,
        },
        {
          id: '2',
          question: 'Do you offer travel insurance?',
          answer:
            'Yes, we partner with leading insurance providers to offer comprehensive travel insurance that covers medical emergencies, trip cancellations, and lost baggage.',
          category: 'Insurance',
          order: 2,
          isActive: true,
        },
        {
          id: '3',
          question: 'How do I modify my booking?',
          answer:
            'You can modify your booking by logging into your account and accessing your booking details. Changes are subject to availability and may incur additional fees.',
          category: 'Booking',
          order: 3,
          isActive: true,
        },
      ]);
    } catch (error) {
      showError('Failed to fetch FAQs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (editModal.faq) {
        // Update existing FAQ
        // await cmsService.updateFAQ(editModal.faq.id, formData);
        showSuccess('FAQ updated successfully');
      } else {
        // Create new FAQ
        // await cmsService.createFAQ(formData);
        showSuccess('FAQ created successfully');
      }
      setEditModal({ show: false, faq: null });
      setFormData({
        question: '',
        answer: '',
        category: 'General',
        isActive: true,
      });
      fetchFAQs();
    } catch (error) {
      showError('Failed to save FAQ');
    }
  };

  const handleEdit = (faq: FAQ) => {
    setFormData(faq);
    setEditModal({ show: true, faq });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;

    try {
      // await cmsService.deleteFAQ(id);
      showSuccess('FAQ deleted successfully');
      fetchFAQs();
    } catch (error) {
      showError('Failed to delete FAQ');
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      // await cmsService.updateFAQ(id, { isActive: !isActive });
      showSuccess('FAQ status updated');
      fetchFAQs();
    } catch (error) {
      showError('Failed to update FAQ status');
    }
  };

  const categories = [
    'General',
    'Booking',
    'Payment',
    'Insurance',
    'Travel Tips',
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button
          variant="primary"
          onClick={() => {
            setFormData({
              question: '',
              answer: '',
              category: 'General',
              isActive: true,
            });
            setEditModal({ show: true, faq: null });
          }}
        >
          + Add New FAQ
        </Button>
      </div>

      {categories.map((category) => {
        const categoryFaqs = faqs.filter((faq) => faq.category === category);
        if (categoryFaqs.length === 0) return null;

        return (
          <div key={category}>
            <h3 className="mb-3 text-lg font-semibold">{category}</h3>
            <div className="space-y-3">
              {categoryFaqs.map((faq) => (
                <Card key={faq.id}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <h4 className="font-semibold">{faq.question}</h4>
                        {!faq.isActive && (
                          <span className="rounded bg-gray-200 px-2 py-1 text-xs dark:bg-gray-700">
                            Inactive
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {faq.answer}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleEdit(faq)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleToggleActive(faq.id, faq.isActive)}
                      >
                        {faq.isActive ? 'Hide' : 'Show'}
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(faq.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );
      })}

      {/* Edit/Create Modal */}
      <Modal
        isOpen={editModal.show}
        onClose={() => {
          setEditModal({ show: false, faq: null });
          setFormData({
            question: '',
            answer: '',
            category: 'General',
            isActive: true,
          });
        }}
        title={editModal.faq ? 'Edit FAQ' : 'Add New FAQ'}
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">Category</label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Question"
            value={formData.question}
            onChange={(e) =>
              setFormData({ ...formData, question: e.target.value })
            }
            placeholder="Enter the question"
            required
          />

          <div>
            <label className="mb-2 block text-sm font-medium">Answer</label>
            <textarea
              value={formData.answer}
              onChange={(e) =>
                setFormData({ ...formData, answer: e.target.value })
              }
              rows={4}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
              placeholder="Enter the answer"
              required
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) =>
                setFormData({ ...formData, isActive: e.target.checked })
              }
              className="rounded"
            />
            <label>Active (visible to users)</label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => {
                setEditModal({ show: false, faq: null });
                setFormData({
                  question: '',
                  answer: '',
                  category: 'General',
                  isActive: true,
                });
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              onClick={handleSave}
              disabled={!formData.question || !formData.answer}
            >
              {editModal.faq ? 'Update' : 'Create'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
