import React, { useEffect, useState } from 'react';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { Select } from '../../components/common/Select';
import { Tabs } from '../../components/common/Tabs';
import { useNotifications } from '../../hooks/useNotifications';

interface Ticket {
  id: string;
  subject: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'waiting-response' | 'resolved' | 'closed';
  createdAt: string;
  lastUpdated: string;
  messages: Message[];
}

interface Message {
  id: string;
  sender: 'user' | 'agent';
  senderName: string;
  content: string;
  timestamp: string;
  attachments?: string[];
}

export const SupportPage: React.FC = () => {
  const { showSuccess, showError } = useNotifications();

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [newTicket, setNewTicket] = useState({
    subject: '',
    category: 'general',
    priority: 'medium' as const,
    description: '',
    bookingId: '',
  });

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setIsLoading(true);
    try {
      // TODO: API call
      setTickets([
        {
          id: 'TKT001',
          subject: 'Issue with hotel booking',
          category: 'Booking',
          priority: 'high',
          status: 'in-progress',
          createdAt: '2025-01-20',
          lastUpdated: '2025-01-21',
          messages: [
            {
              id: '1',
              sender: 'user',
              senderName: 'You',
              content:
                "I made a booking but haven't received confirmation email.",
              timestamp: '2025-01-20T10:00:00Z',
            },
            {
              id: '2',
              sender: 'agent',
              senderName: 'Support Agent',
              content:
                "Thank you for contacting us. I've checked your booking and the confirmation email has been resent. Please check your spam folder as well.",
              timestamp: '2025-01-20T10:30:00Z',
            },
          ],
        },
        {
          id: 'TKT002',
          subject: 'Question about cancellation policy',
          category: 'General',
          priority: 'medium',
          status: 'resolved',
          createdAt: '2025-01-15',
          lastUpdated: '2025-01-16',
          messages: [
            {
              id: '3',
              sender: 'user',
              senderName: 'You',
              content: 'What is your cancellation policy for hotel bookings?',
              timestamp: '2025-01-15T14:00:00Z',
            },
            {
              id: '4',
              sender: 'agent',
              senderName: 'Support Agent',
              content:
                "Our cancellation policy allows free cancellation up to 48 hours before check-in. After that, a cancellation fee applies based on the property's policy.",
              timestamp: '2025-01-15T15:00:00Z',
            },
          ],
        },
      ]);
    } catch (error) {
      showError('Failed to fetch tickets');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTicket = async () => {
    if (!newTicket.subject || !newTicket.description) {
      showError('Please fill in all required fields');
      return;
    }

    try {
      // TODO: API call
      showSuccess('Support ticket created successfully');
      setShowNewTicketModal(false);
      setNewTicket({
        subject: '',
        category: 'general',
        priority: 'medium',
        description: '',
        bookingId: '',
      });
      fetchTickets();
    } catch (error) {
      showError('Failed to create ticket');
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      // TODO: API call
      if (selectedTicket) {
        const updatedTicket = {
          ...selectedTicket,
          messages: [
            ...selectedTicket.messages,
            {
              id: `msg-${Date.now()}`,
              sender: 'user' as const,
              senderName: 'You',
              content: newMessage,
              timestamp: new Date().toISOString(),
            },
          ],
        };
        setSelectedTicket(updatedTicket);
        setNewMessage('');
        showSuccess('Message sent');
      }
    } catch (error) {
      showError('Failed to send message');
    }
  };

  const handleCloseTicket = async (ticketId: string) => {
    if (!confirm('Are you sure you want to close this ticket?')) return;

    try {
      // TODO: API call
      showSuccess('Ticket closed');
      setShowTicketModal(false);
      fetchTickets();
    } catch (error) {
      showError('Failed to close ticket');
    }
  };

  const getStatusBadge = (status: Ticket['status']) => {
    const variants: Record<
      Ticket['status'],
      'success' | 'warning' | 'error' | 'info'
    > = {
      open: 'info',
      'in-progress': 'warning',
      'waiting-response': 'warning',
      resolved: 'success',
      closed: 'error',
    };
    return (
      <Badge variant={variants[status]}>
        {status.replace('-', ' ').toUpperCase()}
      </Badge>
    );
  };

  const getPriorityColor = (priority: Ticket['priority']) => {
    const colors: Record<Ticket['priority'], string> = {
      low: 'text-gray-600',
      medium: 'text-blue-600',
      high: 'text-orange-600',
      urgent: 'text-red-600',
    };
    return colors[priority];
  };

  const tabs = [
    {
      id: 'tickets',
      label: `My Tickets (${tickets.length})`,
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              View and manage your support tickets
            </p>
            <Button
              variant="primary"
              onClick={() => setShowNewTicketModal(true)}
            >
              + New Ticket
            </Button>
          </div>

          {tickets.length === 0 ? (
            <Card>
              <p className="text-center text-gray-600 dark:text-gray-400">
                No support tickets yet. Create one if you need help!
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {tickets.map((ticket) => (
                <Card key={ticket.id}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <h3 className="font-semibold">{ticket.subject}</h3>
                        {getStatusBadge(ticket.status)}
                      </div>
                      <div className="mb-2 flex gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <span>Ticket #{ticket.id}</span>
                        <span>Category: {ticket.category}</span>
                        <span className={getPriorityColor(ticket.priority)}>
                          Priority: {ticket.priority}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Created:{' '}
                        {new Date(ticket.createdAt).toLocaleDateString()} • Last
                        updated:{' '}
                        {new Date(ticket.lastUpdated).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setSelectedTicket(ticket);
                        setShowTicketModal(true);
                      }}
                    >
                      View Details
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      ),
    },
    {
      id: 'faq',
      label: 'FAQs',
      content: (
        <div className="space-y-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Find answers to commonly asked questions
          </p>

          <div className="space-y-4">
            <Card>
              <h3 className="mb-2 font-semibold">
                How do I modify my booking?
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                You can modify your booking by going to "My Bookings" and
                clicking on the booking you want to change. Modifications are
                subject to availability and may incur fees.
              </p>
            </Card>

            <Card>
              <h3 className="mb-2 font-semibold">
                What is your refund policy?
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Refunds are processed based on the cancellation policy of each
                service. Generally, cancellations made 48+ hours before
                departure receive a full refund.
              </p>
            </Card>

            <Card>
              <h3 className="mb-2 font-semibold">
                How long does it take to process refunds?
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Refunds are typically processed within 5-7 business days after
                cancellation approval. The time it takes to appear in your
                account depends on your payment provider.
              </p>
            </Card>

            <Card>
              <h3 className="mb-2 font-semibold">
                Can I change my travel dates?
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Yes, you can request date changes through the booking
                modification feature. Changes are subject to availability and
                may result in price differences.
              </p>
            </Card>
          </div>
        </div>
      ),
    },
    {
      id: 'contact',
      label: 'Contact Us',
      content: (
        <div className="space-y-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Need immediate assistance? Reach out to us through these channels
          </p>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card>
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900">
                  <svg
                    className="h-6 w-6 text-blue-600 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="mb-1 font-semibold">Email Support</h3>
                  <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                    Response within 24 hours
                  </p>
                  <a
                    href="mailto:support@example.com"
                    className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                  >
                    support@example.com
                  </a>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-green-100 p-3 dark:bg-green-900">
                  <svg
                    className="h-6 w-6 text-green-600 dark:text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="mb-1 font-semibold">Phone Support</h3>
                  <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                    Mon-Fri, 9AM-6PM EST
                  </p>
                  <a
                    href="tel:+1234567890"
                    className="text-sm text-green-600 hover:underline dark:text-green-400"
                  >
                    +1 (234) 567-890
                  </a>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-purple-100 p-3 dark:bg-purple-900">
                  <svg
                    className="h-6 w-6 text-purple-600 dark:text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="mb-1 font-semibold">Live Chat</h3>
                  <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                    Available 24/7
                  </p>
                  <button className="text-sm text-purple-600 hover:underline dark:text-purple-400">
                    Start Chat
                  </button>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-orange-100 p-3 dark:bg-orange-900">
                  <svg
                    className="h-6 w-6 text-orange-600 dark:text-orange-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="mb-1 font-semibold">Office Address</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    123 Travel Street
                    <br />
                    New York, NY 10001
                    <br />
                    United States
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold">Support Center</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Get help with your bookings and account
        </p>
      </div>

      <Tabs tabs={tabs} />

      {/* New Ticket Modal */}
      <Modal
        isOpen={showNewTicketModal}
        onClose={() => setShowNewTicketModal(false)}
        title="Create Support Ticket"
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Subject *"
            value={newTicket.subject}
            onChange={(e) =>
              setNewTicket({ ...newTicket, subject: e.target.value })
            }
            placeholder="Brief description of your issue"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Category"
              value={newTicket.category}
              onChange={(e) =>
                setNewTicket({ ...newTicket, category: e.target.value })
              }
              options={[
                { value: 'general', label: 'General Inquiry' },
                { value: 'booking', label: 'Booking Issue' },
                { value: 'payment', label: 'Payment Issue' },
                { value: 'technical', label: 'Technical Issue' },
                { value: 'other', label: 'Other' },
              ]}
            />

            <Select
              label="Priority"
              value={newTicket.priority}
              onChange={(e) =>
                setNewTicket({
                  ...newTicket,
                  priority: e.target.value as Ticket['priority'],
                })
              }
              options={[
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' },
                { value: 'urgent', label: 'Urgent' },
              ]}
            />
          </div>

          <Input
            label="Booking ID (Optional)"
            value={newTicket.bookingId}
            onChange={(e) =>
              setNewTicket({ ...newTicket, bookingId: e.target.value })
            }
            placeholder="If related to a specific booking"
          />

          <div>
            <label className="mb-2 block text-sm font-medium">
              Description *
            </label>
            <textarea
              value={newTicket.description}
              onChange={(e) =>
                setNewTicket({ ...newTicket, description: e.target.value })
              }
              rows={5}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
              placeholder="Provide details about your issue..."
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setShowNewTicketModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              onClick={handleCreateTicket}
              disabled={!newTicket.subject || !newTicket.description}
            >
              Create Ticket
            </Button>
          </div>
        </div>
      </Modal>

      {/* Ticket Details Modal */}
      <Modal
        isOpen={showTicketModal}
        onClose={() => setShowTicketModal(false)}
        title={`Ticket #${selectedTicket?.id}`}
        size="lg"
      >
        {selectedTicket && (
          <div className="space-y-4">
            <div className="flex items-start justify-between border-b border-gray-200 pb-4 dark:border-gray-700">
              <div>
                <h3 className="mb-2 text-lg font-semibold">
                  {selectedTicket.subject}
                </h3>
                <div className="flex gap-3 text-sm">
                  {getStatusBadge(selectedTicket.status)}
                  <span className={getPriorityColor(selectedTicket.priority)}>
                    {selectedTicket.priority} priority
                  </span>
                </div>
              </div>
              {selectedTicket.status !== 'closed' && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleCloseTicket(selectedTicket.id)}
                >
                  Close Ticket
                </Button>
              )}
            </div>

            <div className="max-h-96 space-y-3 overflow-y-auto">
              {selectedTicket.messages.map((message) => (
                <div
                  key={message.id}
                  className={`rounded-lg p-4 ${
                    message.sender === 'user'
                      ? 'ml-8 bg-blue-50 dark:bg-blue-900/20'
                      : 'mr-8 bg-gray-50 dark:bg-gray-700'
                  }`}
                >
                  <div className="mb-2 flex items-start justify-between">
                    <span className="text-sm font-semibold">
                      {message.senderName}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(message.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm">{message.content}</p>
                </div>
              ))}
            </div>

            {selectedTicket.status !== 'closed' && (
              <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button
                    variant="primary"
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                  >
                    Send
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};
