import React, { useState, useEffect, useMemo, createContext, useContext } from 'react';
import {
  FiUsers, FiUser, FiGrid, FiPlus, FiEdit2, FiTrash2,
  FiChevronDown, FiChevronUp, FiBriefcase, FiFileText,
  FiDollarSign, FiMessageSquare, FiLogOut, FiSettings,
  FiBell, FiSearch, FiCheck, FiX, FiClock, FiDownload, FiCamera
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// --- Mock Data (Based on db.json) ---
const initialUsers = [
  { id: 1, name: 'Alice Wonderland', email: 'alice@example.com', role: 'Admin', joinedDate: '2023-01-15', avatar: 'https://placehold.co/100x100/FFC0CB/000000?text=AW', status: 'active' },
  { id: 2, name: 'Bob The Builder', email: 'bob@example.com', role: 'Editor', joinedDate: '2023-02-20', avatar: 'https://placehold.co/100x100/ADD8E6/000000?text=BB', status: 'active' },
  { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', role: 'Viewer', joinedDate: '2023-03-10', avatar: 'https://placehold.co/100x100/90EE90/000000?text=CB', status: 'inactive' },
  { id: 4, name: 'Diana Prince', email: 'diana@example.com', role: 'Editor', joinedDate: '2023-04-05', avatar: 'https://placehold.co/100x100/FFD700/000000?text=DP', status: 'active' },
  { id: 5, name: 'Edward Scissorhands', email: 'edward@example.com', role: 'Viewer', joinedDate: '2023-05-12', avatar: 'https://placehold.co/100x100/D3D3D3/000000?text=ES', status: 'inactive' },
];

const initialInvoices = [
  { id: 'INV-001', customer: 'Tech Solutions Inc.', amount: 1200, status: 'Paid', date: '2024-03-15', dueDate: '2024-04-15', items: [{ description: 'Website Development', quantity: 1, price: 1200 }] },
  { id: 'INV-002', customer: 'Creative Designs LLC', amount: 850, status: 'Pending', date: '2024-03-20', dueDate: '2024-04-20', items: [{ description: 'Logo Design', quantity: 1, price: 500 }, { description: 'Brand Guidelines', quantity: 1, price: 350 }] },
  { id: 'INV-003', customer: 'Global Web Services', amount: 2500, status: 'Overdue', date: '2024-02-10', dueDate: '2024-03-10', items: [{ description: 'SEO Services', quantity: 5, price: 500 }] },
];

const initialJobVacancies = [
  { id: 1, title: 'Senior Frontend Developer', department: 'Engineering', location: 'Remote', status: 'Open', applications: 25, postedDate: '2024-04-01', description: 'We are looking for an experienced frontend developer to join our team.' },
  { id: 2, title: 'UX/UI Designer', department: 'Design', location: 'New York, NY', status: 'Closed', applications: 42, postedDate: '2024-03-15', description: 'Join our design team to create beautiful user experiences.' },
  { id: 3, title: 'Product Manager', department: 'Product', location: 'San Francisco, CA', status: 'Open', applications: 18, postedDate: '2024-04-10', description: 'Lead our product development efforts and work with cross-functional teams.' },
];

const initialTickets = [
  { id: 'TKT-001', subject: 'Payment Issue', customer: 'John Doe', status: 'Open', priority: 'High', created: '2024-05-10', lastResponse: null, messages: [] },
  { id: 'TKT-002', subject: 'Login Problem', customer: 'Jane Smith', status: 'In Progress', priority: 'Medium', created: '2024-05-09', lastResponse: '2024-05-10', messages: [] },
  { id: 'TKT-003', subject: 'Refund Request', customer: 'Mike Johnson', status: 'Closed', priority: 'Low', created: '2024-05-08', lastResponse: '2024-05-09', messages: [] }
];

const initialPayments = [
  { id: 'PMT-001', amount: 1500, customer: 'Tech Corp', method: 'Bank Transfer', status: 'Completed', date: '2024-05-10', currency: 'USD', invoiceId: 'INV-001' },
  { id: 'PMT-002', amount: 800, customer: 'Digital Solutions', method: 'M-Pesa', status: 'Pending', date: '2024-05-10', currency: 'KES', invoiceId: 'INV-002' },
  { id: 'PMT-003', amount: 2000, customer: 'WebTech Inc', method: 'Credit Card', status: 'Completed', date: '2024-05-09', currency: 'USD', invoiceId: 'INV-003' }
];

const initialApplications = [
  { id: 'APP-001', jobId: 1, candidate: 'Sarah Wilson', email: 'sarah@example.com', status: 'Under Review', appliedDate: '2024-05-01', resume: 'sarah_wilson_resume.pdf' },
  { id: 'APP-002', jobId: 1, candidate: 'James Brown', email: 'james@example.com', status: 'Shortlisted', appliedDate: '2024-05-02', resume: 'james_brown_resume.pdf' },
  { id: 'APP-003', jobId: 3, candidate: 'Emma Davis', email: 'emma@example.com', status: 'Rejected', appliedDate: '2024-05-03', resume: 'emma_davis_resume.pdf' }
];


// --- Placeholder Modals and Context (Recreated from Imports) ---

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (notification) => {
    setNotifications(prev => [
      { 
        ...notification, 
        id: Date.now(), 
        timestamp: Date.now(), 
        read: false 
      },
      ...prev // Add new notifications at the start
    ]);
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === notificationId 
        ? { ...notification, read: true }
        : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notification => ({ 
      ...notification, 
      read: true 
    })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      addNotification, 
      markAsRead,
      markAllAsRead,
      clearNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);


const Notifications = ({ notifications, markAsRead }) => {
  // but we'll include a placeholder if it's intended for a separate view.
  return null; // Or render a list if needed elsewhere
};


// Minimal Modal Placeholders
const ModalWrapper = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose} // Close on overlay click
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-xl font-semibold text-slate-700">{title}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800">
            <FiX size={20} />
          </button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
};


const JobFormModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState(initialData || { title: '', department: '', location: '', status: 'Open', description: '' });

  useEffect(() => {
    setFormData(initialData || { title: '', department: '', location: '', status: 'Open', description: '' });
  }, [initialData, isOpen]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ title: '', department: '', location: '', status: 'Open', description: '' }); // Reset form
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title={initialData ? 'Edit Job' : 'Add Job'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">Title</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required className="mt-1 block w-full border border-[#3554a6]/20 rounded-lg focus:ring-2 focus:ring-[#3554a6] focus:border-[#399b24] transition-all duration-300" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Department</label>
          <input type="text" name="department" value={formData.department} onChange={handleChange} required className="mt-1 block w-full border border-[#3554a6]/20 rounded-lg focus:ring-2 focus:ring-[#3554a6] focus:border-[#399b24] transition-all duration-300" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Location</label>
          <input type="text" name="location" value={formData.location} onChange={handleChange} required className="mt-1 block w-full border border-[#3554a6]/20 rounded-lg focus:ring-2 focus:ring-[#3554a6] focus:border-[#399b24] transition-all duration-300" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Status</label>
          <select name="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full border border-[#3554a6]/20 rounded-lg focus:ring-2 focus:ring-[#3554a6] focus:border-[#399b24] transition-all duration-300">
            <option value="Open">Open</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="mt-1 block w-full border border-[#3554a6]/20 rounded-lg focus:ring-2 focus:ring-[#3554a6] focus:border-[#399b24] transition-all duration-300"></textarea>
        </div>
        <div className="flex justify-end space-x-3">
          <button type="button" onClick={onClose} className="px-4 py-2 border border-[#3554a6]/20 rounded-lg hover:bg-[#3554a6]/5 focus:ring-2 focus:ring-[#3554a6] focus:border-[#399b24] transition-all duration-300">Cancel</button>
          <button type="submit" className="flex items-center bg-gradient-to-r from-[#3554a6] to-[#399b24] hover:from-[#399b24] hover:to-[#3554a6] text-white font-semibold py-2 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
            {initialData ? 'Save Changes' : 'Add Job'}
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
};

const UserFormModal = ({ isOpen, onClose, onSubmit, initialData }) => {
    const [formData, setFormData] = useState(initialData || { name: '', email: '', role: 'Viewer', status: 'active', avatar: 'https://placehold.co/100x100/CCCCCC/000000?text=User' });

    useEffect(() => {
        setFormData(initialData || { name: '', email: '', role: 'Viewer', status: 'active', avatar: 'https://placehold.co/100x100/CCCCCC/000000?text=User' });
    }, [initialData, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        setFormData({ name: '', email: '', role: 'Viewer', status: 'active', avatar: 'https://placehold.co/100x100/CCCCCC/000000?text=User' }); // Reset form
    };

    return (
        <ModalWrapper isOpen={isOpen} onClose={onClose} title={initialData ? 'Edit User' : 'Add User'}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700">Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full border border-[#3554a6]/20 rounded-lg focus:ring-2 focus:ring-[#3554a6] focus:border-[#399b24] transition-all duration-300" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700">Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full border border-[#3554a6]/20 rounded-lg focus:ring-2 focus:ring-[#3554a6] focus:border-[#399b24] transition-all duration-300" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700">Role</label>
                    <select name="role" value={formData.role} onChange={handleChange} className="mt-1 block w-full border border-[#3554a6]/20 rounded-lg focus:ring-2 focus:ring-[#3554a6] focus:border-[#399b24] transition-all duration-300">
                        <option value="Admin">Admin</option>
                        <option value="Editor">Editor</option>
                        <option value="Viewer">Viewer</option>
                    </select>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700">Status</label>
                    <select name="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full border border-[#3554a6]/20 rounded-lg focus:ring-2 focus:ring-[#3554a6] focus:border-[#399b24] transition-all duration-300">
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700">Avatar URL (Optional)</label>
                    <input type="text" name="avatar" value={formData.avatar} onChange={handleChange} className="mt-1 block w-full border border-[#3554a6]/20 rounded-lg focus:ring-2 focus:ring-[#3554a6] focus:border-[#399b24] transition-all duration-300" />
                </div>
                <div className="flex justify-end space-x-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 border border-[#3554a6]/20 rounded-lg hover:bg-[#3554a6]/5 focus:ring-2 focus:ring-[#3554a6] focus:border-[#399b24] transition-all duration-300">Cancel</button>
                    <button type="submit" className="flex items-center bg-gradient-to-r from-[#3554a6] to-[#399b24] hover:from-[#399b24] hover:to-[#3554a6] text-white font-semibold py-2 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                        {initialData ? 'Save Changes' : 'Add User'}
                    </button>
                </div>
            </form>
        </ModalWrapper>
    );
};


const TicketResponseModal = ({ isOpen, onClose, onSubmit, ticket }) => {
  const [response, setResponse] = useState('');

  useEffect(() => {
    setResponse(''); // Reset response when modal opens/changes ticket
  }, [isOpen, ticket]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (response.trim() && ticket) {
      onSubmit(ticket.id, response);
      setResponse('');
    }
  };

  if (!ticket) return null;

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title={`Respond to Ticket ${ticket.id}`}>
      <div className="space-y-4">
        <div className="bg-slate-100 p-4 rounded-md">
          <p className="text-sm font-medium text-slate-700 mb-2">Subject: {ticket.subject}</p>
          <p className="text-xs text-slate-600">Customer: {ticket.customer}</p>
          <p className="text-xs text-slate-600">Created: {ticket.created}</p>
        </div>
        {/* Display existing messages if any */}
         {ticket.messages && ticket.messages.length > 0 && (
            <div className="max-h-40 overflow-y-auto border-b pb-4">
                <h4 className="text-sm font-semibold mb-2">Conversation:</h4>
                {ticket.messages.map((msg, index) => (
                    <div key={msg.id} className={`mb-2 ${msg.sender === 'Admin' ? 'text-right' : 'text-left'}`}>
                        <span className={`inline-block p-2 rounded-lg text-sm ${msg.sender === 'Admin' ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                            {msg.text}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">{new Date(msg.timestamp).toLocaleString()}</p>
                    </div>
                ))}
            </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-slate-700">Your Response</label>
            <textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              rows="4"
              required
              className="mt-1 block w-full border border-[#3554a6]/20 rounded-lg focus:ring-2 focus:ring-[#3554a6] focus:border-[#399b24] transition-all duration-300"
              placeholder="Type your response here..."
            ></textarea>
          </div>
          <div className="flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-[#3554a6]/20 rounded-lg hover:bg-[#3554a6]/5 focus:ring-2 focus:ring-[#3554a6] focus:border-[#399b24] transition-all duration-300">Cancel</button>
            <button type="submit" className="flex items-center bg-gradient-to-r from-[#3554a6] to-[#399b24] hover:from-[#399b24] hover:to-[#3554a6] text-white font-semibold py-2 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">Send Response</button>
          </div>
        </form>
      </div>
    </ModalWrapper>
  );
};

const InvoiceFormModal = ({ isOpen, onClose, onSubmit, initialData }) => {
    const [formData, setFormData] = useState(initialData || { customer: '', amount: '', status: 'Pending', date: '', dueDate: '', items: [{ description: '', quantity: 1, price: '' }] });

     useEffect(() => {
        setFormData(initialData || { customer: '', amount: '', status: 'Pending', date: '', dueDate: '', items: [{ description: '', quantity: 1, price: '' }] });
    }, [initialData, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleItemChange = (index, e) => {
        const { name, value } = e.target;
        const newItems = formData.items.map((item, i) => (
            i === index ? { ...item, [name]: value } : item
        ));
        setFormData({ ...formData, items: newItems });
    };

    const addItem = () => {
        setFormData({ ...formData, items: [...formData.items, { description: '', quantity: 1, price: '' }] });
    };

    const removeItem = (index) => {
        setFormData({ ...formData, items: formData.items.filter((_, i) => i !== index) });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Basic validation and amount calculation
        const calculatedAmount = formData.items.reduce((sum, item) => {
            const quantity = parseFloat(item.quantity) || 0;
            const price = parseFloat(item.price) || 0;
            return sum + quantity * price;
        }, 0);

        onSubmit({
            ...formData,
            amount: calculatedAmount, // Recalculate amount based on items
            id: initialData?.id || `INV-${Date.now().toString().slice(-5)}`, // Simple ID generation
            date: formData.date || new Date().toISOString().split('T')[0],
            dueDate: formData.dueDate || new Date(Date.now() + 7*24*60*60*1000).toISOString().split('T')[0], // Default due in 7 days
        });
         setFormData({ customer: '', amount: '', status: 'Pending', date: '', dueDate: '', items: [{ description: '', quantity: 1, price: '' }] }); // Reset form
    };

    return (
        <ModalWrapper isOpen={isOpen} onClose={onClose} title={initialData ? 'Edit Invoice' : 'Create Invoice'}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700">Customer</label>
                    <input type="text" name="customer" value={formData.customer} onChange={handleChange} required className="mt-1 block w-full border border-[#3554a6]/20 rounded-lg focus:ring-2 focus:ring-[#3554a6] focus:border-[#399b24] transition-all duration-300" />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700">Status</label>
                    <select name="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full border border-[#3554a6]/20 rounded-lg focus:ring-2 focus:ring-[#3554a6] focus:border-[#399b24] transition-all duration-300">
                        <option value="Pending">Pending</option>
                        <option value="Paid">Paid</option>
                        <option value="Overdue">Overdue</option>
                    </select>
                </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Date</label>
                        <input type="date" name="date" value={formData.date} onChange={handleChange} className="mt-1 block w-full border border-[#3554a6]/20 rounded-lg focus:ring-2 focus:ring-[#3554a6] focus:border-[#399b24] transition-all duration-300" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Due Date</label>
                        <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} required className="mt-1 block w-full border border-[#3554a6]/20 rounded-lg focus:ring-2 focus:ring-[#3554a6] focus:border-[#399b24] transition-all duration-300" />
                    </div>
                </div>

                <div className="space-y-3 border-t pt-4">
                    <h3 className="text-md font-semibold text-slate-700">Items</h3>
                    {formData.items.map((item, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700">Description</label>
                                <input type="text" name="description" value={item.description} onChange={(e) => handleItemChange(index, e)} required className="mt-1 block w-full border border-[#3554a6]/20 rounded-lg focus:ring-2 focus:ring-[#3554a6] focus:border-[#399b24] transition-all duration-300" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Qty</label>
                                <input type="number" name="quantity" value={item.quantity} onChange={(e) => handleItemChange(index, e)} required min="1" className="mt-1 block w-full border border-[#3554a6]/20 rounded-lg focus:ring-2 focus:ring-[#3554a6] focus:border-[#399b24] transition-all duration-300" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Price</label>
                                <input type="number" name="price" value={item.price} onChange={(e) => handleItemChange(index, e)} required min="0" step="0.01" className="mt-1 block w-full border border-[#3554a6]/20 rounded-lg focus:ring-2 focus:ring-[#3554a6] focus:border-[#399b24] transition-all duration-300" />
                            </div>
                            {formData.items.length > 1 && (
                                <button type="button" onClick={() => removeItem(index)} className="text-red-600 hover:text-red-800 flex justify-center md:justify-start">
                                    <FiTrash2 size={18} />
                                </button>
                            )}
                        </div>
                    ))}
                    <button type="button" onClick={addItem} className="flex items-center text-indigo-600 hover:text-indigo-800 text-sm font-medium mt-2">
                        <FiPlus size={16} className="mr-1" /> Add Item
                    </button>
                </div>

                <div className="flex justify-end space-x-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 border border-[#3554a6]/20 rounded-lg hover:bg-[#3554a6]/5 focus:ring-2 focus:ring-[#3554a6] focus:border-[#399b24] transition-all duration-300">Cancel</button>
                    <button type="submit" className="flex items-center bg-gradient-to-r from-[#3554a6] to-[#399b24] hover:from-[#399b24] hover:to-[#3554a6] text-white font-semibold py-2 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                        {initialData ? 'Save Changes' : 'Create Invoice'}
                    </button>
                </div>
            </form>
        </ModalWrapper>
    );
};


// --- Helper Functions & Constants ---
const SIDENAV_ITEMS = [
  { title: 'Dashboard', icon: <FiGrid size={20} />, path: 'dashboard' },
  { title: 'Users', icon: <FiUsers size={20} />, path: 'users' },
  { title: 'Admin Profile', icon: <FiUser size={20} />, path: 'profile' },
  { title: 'Job Vacancies', icon: <FiBriefcase size={20} />, path: 'jobs' },
  { title: 'Applications', icon: <FiFileText size={20} />, path: 'applications' },
  { title: 'Tickets', icon: <FiMessageSquare size={20} />, path: 'tickets' },
  { title: 'Invoices', icon: <FiDollarSign size={20} />, path: 'invoices' },
  { title: 'Payments', icon: <FiDollarSign size={20} />, path: 'payments' },
];

// Status Badge Component (as provided)
const StatusBadge = ({ status }) => {
  const statusClasses = {
    active: 'bg-[#399b24]/10 text-[#399b24] border border-[#399b24]/30',
    inactive: 'bg-red-100 text-red-800 border border-red-200',
    Open: 'bg-[#399b24]/10 text-[#399b24] border border-[#399b24]/30',
    Closed: 'bg-red-100 text-red-800 border border-red-200',
    Paid: 'bg-[#399b24]/10 text-[#399b24] border border-[#399b24]/30',
    Pending: 'bg-[#3554a6]/10 text-[#3554a6] border border-[#3554a6]/30',
    Overdue: 'bg-red-100 text-red-800 border border-red-200',
    Completed: 'bg-[#399b24]/10 text-[#399b24] border border-[#399b24]/30',
    High: 'bg-red-100 text-red-800 border border-red-200',
    Medium: 'bg-[#3554a6]/10 text-[#3554a6] border border-[#3554a6]/30',
    Low: 'bg-[#399b24]/10 text-[#399b24] border border-[#399b24]/30',
    'Under Review': 'bg-blue-100 text-blue-800',
    Shortlisted: 'bg-purple-100 text-purple-800',
    Rejected: 'bg-red-100 text-red-800',
  };

  return (
    <span className={`px-2 py-1 text-xs rounded-full ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
      {status}
    </span>
  );
};


// --- Components (as provided, or reconstructed) ---

// Sidebar Component (as provided)
const Sidebar = ({ currentPage, setCurrentPage }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-20 p-2 bg-slate-700 text-white rounded-md"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <FiChevronUp size={24} /> : <FiChevronDown size={24} />}
      </button>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: '-100%' }}
        animate={{ x: isMobileMenuOpen || window.innerWidth >= 768 ? 0 : '-100%' }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="fixed inset-y-0 left-0 z-10 w-64 bg-gradient-to-b from-[#3554a6] via-[#32488d] to-[#399b24] text-white p-6 space-y-6 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 backdrop-blur-sm border-r border-[#3554a6]/20"
      >
        <div className="flex items-center space-x-3 mb-10">
          <div className="p-2 bg-indigo-500 rounded-lg">
            <FiSettings size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
        </div>

        <nav className="space-y-2">
          {SIDENAV_ITEMS.map((item) => (
            <button
              key={item.title}
              onClick={() => {
                setCurrentPage(item.path);
                if (isMobileMenuOpen) setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ease-in-out hover:bg-white/10 hover:scale-105 ${
                currentPage === item.path 
                  ? 'bg-gradient-to-r from-[#3554a6] to-[#399b24] text-white shadow-lg shadow-[#3554a6]/30' 
                  : 'text-white/80 hover:text-white'
              }`}
              aria-current={currentPage === item.path ? 'page' : undefined}
            >
              {item.icon}
              <span>{item.title}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-6 left-0 right-0 px-6">
          <button
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onClick={() => {
              // Implement actual logout logic here
              console.log('Logout clicked');
              // window.location.href = '/login'; // Example redirection
            }}
          >
            <FiLogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </motion.aside>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-0 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          role="presentation"
        />
      )}
    </>
  );
};

// Header Component (updated)
const Header = ({ title, setCurrentPage }) => {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const unreadCount = useMemo(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  const handleNotificationClick = (notificationId) => {
    markAsRead(notificationId);
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  const handleGlobalSearch = (searchTerm) => {
    setGlobalSearch(searchTerm);
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const term = searchTerm.toLowerCase();
    const results = [
      // Users
      ...initialUsers.map(user => ({
        type: 'user',
        id: user.id,
        title: user.name,
        subtitle: user.email,
        status: user.status,
        path: 'users'
      })),
      // Jobs
      ...initialJobVacancies.map(job => ({
        type: 'job',
        id: job.id,
        title: job.title,
        subtitle: job.department,
        status: job.status,
        path: 'jobs'
      })),
      // Tickets
      ...initialTickets.map(ticket => ({
        type: 'ticket',
        id: ticket.id,
        title: ticket.subject,
        subtitle: ticket.customer,
        status: ticket.status,
        path: 'tickets'
      })),
      // Invoices
      ...initialInvoices.map(invoice => ({
        type: 'invoice',
        id: invoice.id,
        title: `Invoice ${invoice.id}`,
        subtitle: invoice.customer,
        status: invoice.status,
        path: 'invoices'
      }))
    ].filter(item => 
      item.title.toLowerCase().includes(term) ||
      item.subtitle.toLowerCase().includes(term) ||
      item.id.toString().toLowerCase().includes(term)
    );

    setSearchResults(results);
    setShowSearchResults(true);
  };

  const handleResultClick = (result) => {
    setCurrentPage(result.path);
    setShowSearchResults(false);
    setGlobalSearch('');
  };

  // Close notifications dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isNotificationOpen && !event.target.closest('.notifications-container')) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isNotificationOpen]);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileDropdownOpen && !event.target.closest('.relative')) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileDropdownOpen]);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.search-container')) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-[#3554a6]/10 shadow-lg p-6 mb-6 sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-3xl font-semibold text-slate-700">{title}</h1>
        <div className="flex items-center space-x-4">
          {/* Global Search */}
          <div className="relative search-container">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search anything..."
              value={globalSearch}
              onChange={(e) => handleGlobalSearch(e.target.value)}
              className="pl-10 pr-4 py-2 w-64 border border-[#3554a6]/20 rounded-lg focus:ring-2 focus:ring-[#3554a6] focus:border-[#399b24] outline-none transition-all bg-white/50 backdrop-blur-sm hover:bg-white"
            />

            {/* Search Results Dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute mt-2 w-96 bg-white rounded-lg shadow-xl border border-slate-200 max-h-96 overflow-y-auto z-50">
                {searchResults.map((result, index) => (
                  <button
                    key={`${result.type}-${result.id}-${index}`}
                    onClick={() => handleResultClick(result)}
                    className="w-full text-left px-4 py-3 hover:bg-slate-50 flex items-start justify-between group"
                  >
                    <div>
                      <div className="flex items-center">
                        {result.type === 'user' && <FiUser className="mr-2 text-slate-400" />}
                        {result.type === 'job' && <FiBriefcase className="mr-2 text-slate-400" />}
                        {result.type === 'ticket' && <FiMessageSquare className="mr-2 text-slate-400" />}
                        {result.type === 'invoice' && <FiDollarSign className="mr-2 text-slate-400" />}
                        <span className="font-medium text-slate-700">{result.title}</span>
                      </div>
                      <p className="text-sm text-slate-500">{result.subtitle}</p>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <StatusBadge status={result.status} />
                    </div>
                  </button>
                ))}
              </div>
            )}

            {showSearchResults && searchResults.length === 0 && globalSearch && (
              <div className="absolute mt-2 w-96 bg-white rounded-lg shadow-xl border border-slate-200 p-4 text-center">
                <p className="text-slate-500">No results found</p>
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="relative notifications-container">
            <button
              className="text-slate-500 hover:text-[#3554a6] relative transition-colors"
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              aria-label="Notifications"
            >
              <FiBell size={24} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 block h-4 w-4 rounded-full bg-gradient-to-r from-[#3554a6] to-[#399b24] ring-2 ring-white animate-pulse">
                  <span className="text-[10px] text-white flex items-center justify-center h-full">
                    {unreadCount}
                  </span>
                </span>
              )}
            </button>

            {isNotificationOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50 overflow-hidden">
                <div className="px-4 py-2 border-b border-slate-200 flex justify-between items-center">
                  <h3 className="text-lg font-medium text-slate-700">Notifications</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      className="text-sm text-[#3554a6] hover:text-[#399b24] transition-colors"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={() => handleNotificationClick(notification.id)}
                        className={`px-4 py-3 hover:bg-slate-50 cursor-pointer transition-all ${
                          !notification.read ? 'bg-[#3554a6]/5' : ''
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <p className={`text-sm ${!notification.read ? 'font-medium text-[#3554a6]' : 'text-slate-600'}`}>
                            {notification.message}
                          </p>
                          <span className="text-xs text-slate-500">
                            {new Date(notification.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 capitalize">
                          {notification.type}
                        </p>
                      </motion.div>
                    ))
                  ) : (
                    <p className="px-4 py-3 text-sm text-slate-500 text-center">
                      No notifications
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User profile */}
          <div className="relative">
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center space-x-2 group"
            >
              <img
                src="https://placehold.co/40x40/6366F1/FFFFFF?text=A"
                alt="Admin Avatar"
                className="w-10 h-10 rounded-full border-2 border-[#3554a6] group-hover:border-[#399b24] transition-colors"
              />
              <span className="text-slate-700 font-medium group-hover:text-[#3554a6]">Admin User</span>
              <FiChevronDown className={`text-slate-400 transition-transform duration-200 ${
                isProfileDropdownOpen ? 'transform rotate-180' : ''
              }`} />
            </button>

            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-50 py-1 border border-slate-200">
                <button
                  onClick={() => {
                    setIsProfileDropdownOpen(false);
                    setCurrentPage('profile');
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  <FiUser className="mr-2" size={16} />
                  View Profile
                </button>
                <button
                  onClick={() => {
                    setIsProfileDropdownOpen(false);
                    // Add settings functionality
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  <FiSettings className="mr-2" size={16} />
                  Settings
                </button>
                <div className="border-t border-slate-200 my-1"></div>
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to logout?')) {
                      // Add logout functionality
                      console.log('Logging out...');
                    }
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <FiLogOut className="mr-2" size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

// --- Page Components (as provided, or reconstructed) ---

// Dashboard Page (updated with charts)
const DashboardPage = ({ users, jobs, tickets, invoices }) => {
  // Chart data and options
  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue',
        data: [12000, 19000, 15000, 25000, 22000, 30000],
        fill: true,
        backgroundColor: 'rgba(53, 84, 166, 0.1)',
        borderColor: '#3554a6',
        tension: 0.4,
      },
      {
        label: 'Expenses',
        data: [8000, 15000, 10000, 18000, 15000, 22000],
        fill: true,
        backgroundColor: 'rgba(57, 155, 36, 0.1)',
        borderColor: '#399b24',
        tension: 0.4,
      }
    ]
  };

  const ticketStatusData = {
    labels: ['Open', 'In Progress', 'Closed'],
    datasets: [
      {
        data: [
          tickets.filter(t => t.status === 'Open').length,
          tickets.filter(t => t.status === 'In Progress').length,
          tickets.filter(t => t.status === 'Closed').length,
        ],
        backgroundColor: [
          '#3554a6',
          '#399b24',
          '#64748b',
        ],
        borderWidth: 0,
      }
    ]
  };

  const userActivityData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Active Users',
        data: [65, 59, 80, 81, 56, 55, 40],
        backgroundColor: '#3554a6',
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  const stats = [
    { title: 'Total Users', value: users.length, change: '+12%', icon: <FiUsers size={24} />, color: 'bg-indigo-100 text-indigo-600' },
    { title: 'Active Jobs', value: jobs.filter(job => job.status === 'Open').length, change: '+5%', icon: <FiBriefcase size={24} />, color: 'bg-green-100 text-green-600' },
    { title: 'Pending Tickets', value: tickets.filter(ticket => ticket.status !== 'Closed').length, change: '-3%', icon: <FiMessageSquare size={24} />, color: 'bg-yellow-100 text-yellow-600' },
    { title: 'Total Revenue', value: `$${invoices.reduce((sum, inv) => sum + inv.amount, 0).toLocaleString()}`, change: '+18%', icon: <FiDollarSign size={24} />, color: 'bg-purple-100 text-purple-600' },
  ];

  const recentActivities = [
    { id: 1, user: 'Alice Wonderland', action: 'created a new job posting', time: '2 hours ago', icon: <FiBriefcase className="text-indigo-500" /> },
    { id: 2, user: 'Bob The Builder', action: 'updated user permissions', time: '5 hours ago', icon: <FiUser className="text-blue-500" /> },
    { id: 3, user: 'System', action: 'completed scheduled backup', time: 'Yesterday', icon: <FiSettings className="text-green-500" /> },
    { id: 4, user: 'Diana Prince', action: 'responded to ticket TKT-002', time: 'Yesterday', icon: <FiMessageSquare className="text-purple-500" /> },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -5, scale: 1.02 }}
            className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-[#3554a6]/10"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                <p className="text-3xl font-bold mt-1">{stat.value}</p>
                <p className={`text-sm mt-2 ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.change} from last month
                </p>
              </div>
              <div className={`p-3 rounded-full ${
                index % 2 === 0 
                  ? 'bg-[#3554a6]/10 text-[#3554a6]' 
                  : 'bg-[#399b24]/10 text-[#399b24]'
              }`}>
                {stat.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-xl border border-[#3554a6]/10">
          <h3 className="text-xl font-semibold text-slate-700 mb-4">Revenue Overview</h3>
          <div className="h-80">
            <Line data={revenueData} options={chartOptions} />
          </div>
        </div>

        {/* User Activity Chart */}
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-xl border border-[#3554a6]/10">
          <h3 className="text-xl font-semibold text-slate-700 mb-4">User Activity</h3>
          <div className="h-80">
            <Bar data={userActivityData} options={chartOptions} />
          </div>
        </div>

        {/* Ticket Status Chart */}
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-xl border border-[#3554a6]/10">
          <h3 className="text-xl font-semibold text-slate-700 mb-4">Ticket Status Distribution</h3>
          <div className="h-80">
            <Doughnut data={ticketStatusData} options={chartOptions} />
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-xl border border-[#3554a6]/10">
          <h3 className="text-xl font-semibold text-slate-700 mb-4">Recent Activities</h3>
          <div className="space-y-4">
            {recentActivities.map(activity => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="p-2 bg-slate-100 rounded-full">
                  {activity.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">
                    <span className="font-semibold">{activity.user}</span> {activity.action}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// User List Page (as provided, with state props added)
const UserListPage = ({ users, setUsers }) => {
  const { addNotification } = useNotifications();
  const [showUserFormModal, setShowUserFormModal] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = useMemo(() => {
    return users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const handleAddUser = (newUser) => {
    setUsers([...users, { ...newUser, id: Date.now(), joinedDate: new Date().toISOString().split('T')[0] }]);
    setShowUserFormModal(false);
    addNotification({
      type: 'success',
      message: `User ${newUser.name} added successfully`
    });
  };

  const handleEditUser = (updatedUser) => {
    setUsers(users.map(user =>
      user.id === updatedUser.id ? updatedUser : user
    ));
    setUserToEdit(null);
    setShowUserFormModal(false);
    addNotification({
      type: 'success',
      message: 'User updated successfully'
    });
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== userId));
      addNotification({
        type: 'info',
        message: 'User deleted successfully'
      });
    }
  };

  const toggleUserStatus = (userId) => {
    setUsers(users.map(user =>
      user.id === userId ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' } : user
    ));
    addNotification({
      type: 'success',
      message: 'User status updated'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-white rounded-lg shadow gap-4">
        <div className="relative w-full md:w-auto">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full md:w-72 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setUserToEdit(null);
            setShowUserFormModal(true);
          }}
          className="flex items-center bg-gradient-to-r from-[#3554a6] to-[#399b24] hover:from-[#399b24] hover:to-[#3554a6] text-white font-semibold py-2 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <FiPlus size={18} className="mr-2" />
          Add User
        </motion.button>
      </div>

      <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-xl overflow-hidden border border-slate-200/50">
        <table className="min-w-full divide-y divide-slate-200/50">
          <thead className="bg-slate-50/50 backdrop-blur-sm">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Joined Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            <AnimatePresence>
              {filteredUsers.map(user => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="hover:bg-slate-50/50 backdrop-blur-sm transition-colors duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover mr-3" />
                      <div>
                        <p className="text-sm font-medium text-slate-900">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{user.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={user.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{user.joinedDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleUserStatus(user.id)}
                      className={`p-1 rounded-full ${user.status === 'active' ? 'text-red-600 hover:bg-red-100' : 'text-green-600 hover:bg-green-100'}`}
                      title={user.status === 'active' ? 'Deactivate' : 'Activate'}
                    >
                      {user.status === 'active' ? <FiX size={18} /> : <FiCheck size={18} />}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        setUserToEdit(user);
                        setShowUserFormModal(true);
                      }}
                      className="text-indigo-600 hover:text-indigo-900 p-1"
                      title="Edit"
                    >
                      <FiEdit2 size={18} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-600 hover:text-red-900 p-1"
                      title="Delete"
                    >
                      <FiTrash2 size={18} />
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
        {filteredUsers.length === 0 && (
          <div className="text-center py-8">
            <p className="text-slate-500">No users found</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setUserToEdit(null);
                setShowUserFormModal(true);
              }}
              className="mt-2 text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Add a new user
            </button>
          </div>
        )}
         {users.length === 0 && initialUsers.length > 0 && (
             <div className="text-center py-8">
                <p className="text-slate-500">All users have been deleted.</p>
             </div>
         )}
      </div>

      <AnimatePresence>
        {showUserFormModal && (
          <UserFormModal
            isOpen={showUserFormModal}
            onClose={() => {
              setShowUserFormModal(false);
              setUserToEdit(null);
            }}
            onSubmit={userToEdit ? handleEditUser : handleAddUser}
            initialData={userToEdit}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Job Vacancies Page
const JobVacanciesPage = ({ jobVacancies, setJobVacancies }) => {
     const { addNotification } = useNotifications();
     const [showJobFormModal, setShowJobFormModal] = useState(false);
     const [jobToEdit, setJobToEdit] = useState(null);
     const [searchTerm, setSearchTerm] = useState('');
     const [statusFilter, setStatusFilter] = useState('All');


     const filteredJobs = useMemo(() => {
        return jobVacancies.filter(job => {
            const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 job.location.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'All' || job.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
     }, [jobVacancies, searchTerm, statusFilter]);


     const handleAddJob = (newJob) => {
         setJobVacancies([...jobVacancies, { ...newJob, id: Date.now(), applications: 0, postedDate: new Date().toISOString().split('T')[0] }]);
         setShowJobFormModal(false);
         addNotification({ type: 'success', message: `Job "${newJob.title}" added.` });
     };

     const handleEditJob = (updatedJob) => {
         setJobVacancies(jobVacancies.map(job => job.id === updatedJob.id ? updatedJob : job));
         setJobToEdit(null);
         setShowJobFormModal(false);
         addNotification({ type: 'success', message: `Job "${updatedJob.title}" updated.` });
     };

     const handleDeleteJob = (jobId, jobTitle) => {
        if(window.confirm(`Are you sure you want to delete the job "${jobTitle}"?`)) {
            setJobVacancies(jobVacancies.filter(job => job.id !== jobId));
            addNotification({ type: 'info', message: `Job "${jobTitle}" deleted.` });
        }
     };

     const toggleJobStatus = (jobId, jobTitle, currentStatus) => {
        setJobVacancies(jobVacancies.map(job =>
            job.id === jobId ? { ...job, status: currentStatus === 'Open' ? 'Closed' : 'Open' } : job
        ));
         addNotification({ type: 'success', message: `Job "${jobTitle}" status updated.` });
     };


    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
        >
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-white rounded-lg shadow gap-4">
                <div className="relative w-full md:w-auto">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search jobs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 w-full md:w-72 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                 <div className="flex items-center space-x-4 w-full md:w-auto">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border border-[#3554a6]/20 rounded-lg focus:ring-2 focus:ring-[#3554a6] focus:border-[#399b24] transition-all duration-300"
                    >
                        <option value="All">All Statuses</option>
                        <option value="Open">Open</option>
                        <option value="Closed">Closed</option>
                    </select>
                     <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                            setJobToEdit(null);
                            setShowJobFormModal(true);
                        }}
                        className="flex items-center bg-gradient-to-r from-[#3554a6] to-[#399b24] hover:from-[#399b24] hover:to-[#3554a6] text-white font-semibold py-2 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                        <FiPlus size={18} className="mr-2" />
                        Add Job
                    </motion.button>
                 </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-xl overflow-hidden border border-slate-200/50">
                <table className="min-w-full divide-y divide-slate-200/50">
                    <thead className="bg-slate-50/50 backdrop-blur-sm">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Department</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Location</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                             <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Applications</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Posted Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        <AnimatePresence>
                            {filteredJobs.map(job => (
                                <motion.tr
                                    key={job.id}
                                     initial={{ opacity: 0 }}
                                     animate={{ opacity: 1 }}
                                     exit={{ opacity: 0 }}
                                    className="hover:bg-slate-50/50 backdrop-blur-sm transition-colors duration-200"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{job.title}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{job.department}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{job.location}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <StatusBadge status={job.status} />
                                    </td>
                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{job.applications}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{job.postedDate}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <motion.button
                                          whileHover={{ scale: 1.1 }}
                                          whileTap={{ scale: 0.9 }}
                                            onClick={() => toggleJobStatus(job.id, job.title, job.status)}
                                            className={`p-1 rounded-full ${job.status === 'Open' ? 'text-red-600 hover:bg-red-100' : 'text-green-600 hover:bg-green-100'}`}
                                             title={job.status === 'Open' ? 'Close Job' : 'Open Job'}
                                        >
                                            {job.status === 'Open' ? <FiX size={18} /> : <FiCheck size={18} />}
                                        </motion.button>
                                        <motion.button
                                          whileHover={{ scale: 1.1 }}
                                          whileTap={{ scale: 0.9 }}
                                            onClick={() => { setJobToEdit(job); setShowJobFormModal(true); }}
                                            className="text-indigo-600 hover:text-indigo-900 p-1"
                                            title="Edit"
                                        >
                                            <FiEdit2 size={18} />
                                        </motion.button>
                                        <motion.button
                                          whileHover={{ scale: 1.1 }}
                                          whileTap={{ scale: 0.9 }}
                                            onClick={() => handleDeleteJob(job.id, job.title)}
                                            className="text-red-600 hover:text-red-900 p-1"
                                             title="Delete"
                                        >
                                            <FiTrash2 size={18} />
                                        </motion.button>
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>
                 {filteredJobs.length === 0 && (
                     <div className="text-center py-8">
                        <p className="text-slate-500">No job vacancies found</p>
                         {searchTerm !== '' || statusFilter !== 'All' ? (
                              <button
                                onClick={() => { setSearchTerm(''); setStatusFilter('All'); setShowJobFormModal(true); }}
                                className="mt-2 text-indigo-600 hover:text-indigo-800 font-medium"
                                >
                                Reset Filters and Add a New Job
                                </button>
                         ) : (
                             <button
                                onClick={() => { setShowJobFormModal(true); }}
                                className="mt-2 text-indigo-600 hover:text-indigo-800 font-medium"
                             >
                                Add a New Job
                             </button>
                         )}
                     </div>
                 )}
                  {jobVacancies.length === 0 && initialJobVacancies.length > 0 && searchTerm === '' && statusFilter === 'All' && (
                     <div className="text-center py-8">
                        <p className="text-slate-500">All job vacancies have been removed.</p>
                     </div>
                 )}
            </div>

             <AnimatePresence>
                 {showJobFormModal && (
                     <JobFormModal
                         isOpen={showJobFormModal}
                         onClose={() => { setShowJobFormModal(false); setJobToEdit(null); }}
                         onSubmit={jobToEdit ? handleEditJob : handleAddJob}
                         initialData={jobToEdit}
                     />
                 )}
             </AnimatePresence>
        </motion.div>
    );
};


// Applications Page
const ApplicationsPage = ({ applications, jobs }) => {
     const [searchTerm, setSearchTerm] = useState('');
     const [statusFilter, setStatusFilter] = useState('All');
     const [jobFilter, setJobFilter] = useState('All');

     const filteredApplications = useMemo(() => {
        return applications.filter(app => {
            const job = jobs.find(j => j.id === app.jobId);
            const jobTitle = job ? job.title.toLowerCase() : '';
            const matchesSearch = app.candidate.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 jobTitle.includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
            const matchesJob = jobFilter === 'All' || app.jobId === parseInt(jobFilter);
            return matchesSearch && matchesStatus && matchesJob;
        });
     }, [applications, searchTerm, statusFilter, jobFilter, jobs]);

     // Helper to get job title from jobId
     const getJobTitle = (jobId) => {
        const job = jobs.find(j => j.id === jobId);
        return job ? job.title : 'Unknown Job';
     };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
        >
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-white rounded-lg shadow gap-4">
                <div className="relative w-full md:w-auto">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search applications..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 w-full md:w-72 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                 <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto">
                     <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border border-[#3554a6]/20 rounded-lg focus:ring-2 focus:ring-[#3554a6] focus:border-[#399b24] transition-all duration-300"
                    >
                        <option value="All">All Statuses</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                     <select
                        value={jobFilter}
                        onChange={(e) => setJobFilter(e.target.value)}
                        className="px-4 py-2 border border-[#3554a6]/20 rounded-lg focus:ring-2 focus:ring-[#3554a6] focus:border-[#399b24] transition-all duration-300"
                    >
                        <option value="All">All Jobs</option>
                        {jobs.map(job => (
                            <option key={job.id} value={job.id}>{job.title}</option>
                        ))}
                    </select>
                 </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-xl overflow-hidden border border-slate-200/50">
                <table className="min-w-full divide-y divide-slate-200/50">
                    <thead className="bg-slate-50/50 backdrop-blur-sm">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Candidate</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Job Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Applied Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                     <tbody className="bg-white divide-y divide-slate-200">
                        <AnimatePresence>
                            {filteredApplications.map(app => (
                                <motion.tr
                                    key={app.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="hover:bg-slate-50/50 backdrop-blur-sm transition-colors duration-200"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{app.candidate}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{app.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{getJobTitle(app.jobId)}</td>
                                     <td className="px-6 py-4 whitespace-nowrap">
                                        <StatusBadge status={app.status} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{app.appliedDate}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        {/* Placeholder actions - implement actual logic as needed */}
                                        <motion.button
                                          whileHover={{ scale: 1.1 }}
                                          whileTap={{ scale: 0.9 }}
                                            onClick={() => console.log('View resume:', app.resume)}
                                            className="text-blue-600 hover:text-blue-900 p-1"
                                            title="View Resume"
                                        >
                                            <FiFileText size={18} />
                                        </motion.button>
                                         <motion.button
                                          whileHover={{ scale: 1.1 }}
                                          whileTap={{ scale: 0.9 }}
                                            onClick={() => console.log('Download resume:', app.resume)}
                                            className="text-green-600 hover:text-green-900 p-1"
                                            title="Download Resume"
                                        >
                                            <FiDownload size={18} />
                                        </motion.button>
                                        {/* Add status update buttons if needed */}
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>
                 {filteredApplications.length === 0 && (
                     <div className="text-center py-8">
                        <p className="text-slate-500">No applications found</p>
                          {(searchTerm !== '' || statusFilter !== 'All' || jobFilter !== 'All') && (
                              <button
                                onClick={() => { setSearchTerm(''); setStatusFilter('All'); setJobFilter('All'); }}
                                className="mt-2 text-indigo-600 hover:text-indigo-800 font-medium"
                                >
                                Reset Filters
                                </button>
                         )}
                     </div>
                 )}
                 {applications.length === 0 && initialApplications.length > 0 && searchTerm === '' && statusFilter === 'All' && jobFilter === 'All' && (
                     <div className="text-center py-8">
                        <p className="text-slate-500">All applications have been cleared.</p>
                     </div>
                 )}
            </div>
        </motion.div>
    );
};


// Tickets Page (as provided, with state props added)
const TicketsPage = ({ tickets, setTickets }) => {
  const { addNotification } = useNotifications();
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredTickets = useMemo(() => {
    return tickets.filter(ticket => {
      const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            ticket.customer.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || ticket.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [tickets, searchTerm, statusFilter]);

  const handleTicketResponse = (ticketId, responseText) => {
    setTickets(tickets.map(ticket => {
      if (ticket.id === ticketId) {
        return {
          ...ticket,
          status: 'In Progress', // Mark as in progress when responded to
          lastResponse: new Date().toISOString().split('T')[0],
          messages: [...(ticket.messages || []), {
            id: Date.now(),
            text: responseText,
            timestamp: new Date().toISOString(),
            sender: 'Admin'
          }]
        };
      }
      return ticket;
    }));
    setShowResponseModal(false);
     setSelectedTicket(null);
    addNotification({
      type: 'success',
      message: `Response sent for Ticket ${ticketId}`
    });
  };

  const closeTicket = (ticketId) => {
      const ticket = tickets.find(t => t.id === ticketId);
    if (window.confirm(`Are you sure you want to close ticket ${ticketId}: "${ticket?.subject}"?`)) {
        setTickets(tickets.map(ticket =>
        ticket.id === ticketId ? { ...ticket, status: 'Closed' } : ticket
        ));
        addNotification({
        type: 'info',
        message: `Ticket ${ticketId} closed`
        });
    }
  };

  const openTicket = (ticketId) => {
      setTickets(tickets.map(ticket =>
        ticket.id === ticketId ? { ...ticket, status: 'Open' } : ticket
      ));
      addNotification({
        type: 'success',
        message: `Ticket ${ticketId} reopened`
      });
  }


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-white rounded-lg shadow gap-4">
        <div className="relative w-full md:w-auto">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search tickets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full md:w-72 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="flex items-center space-x-4 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-[#3554a6]/20 rounded-lg focus:ring-2 focus:ring-[#3554a6] focus:border-[#399b24] transition-all duration-300"
          >
            <option value="All">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-xl overflow-hidden border border-slate-200/50">
        <table className="min-w-full divide-y divide-slate-200/50">
          <thead className="bg-slate-50/50 backdrop-blur-sm">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Ticket ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Subject</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Priority</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Created</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            <AnimatePresence>
              {filteredTickets.map(ticket => (
                <motion.tr
                  key={ticket.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="hover:bg-slate-50/50 backdrop-blur-sm transition-colors duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{ticket.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{ticket.subject}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{ticket.customer}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={ticket.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={ticket.priority} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{ticket.created}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {ticket.status !== 'Closed' && (
                         <motion.button
                           whileHover={{ scale: 1.1 }}
                           whileTap={{ scale: 0.9 }}
                            onClick={() => { setSelectedTicket(ticket); setShowResponseModal(true); }}
                            className="text-blue-600 hover:text-blue-900 p-1"
                             title="Respond"
                        >
                            <FiMessageSquare size={18} />
                        </motion.button>
                    )}

                     {ticket.status !== 'Closed' ? (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                             onClick={() => closeTicket(ticket.id)}
                             className="text-red-600 hover:text-red-900 p-1"
                             title="Close Ticket"
                         >
                             <FiX size={18} />
                         </motion.button>
                     ) : (
                         <motion.button
                           whileHover={{ scale: 1.1 }}
                           whileTap={{ scale: 0.9 }}
                            onClick={() => openTicket(ticket.id)}
                            className="text-green-600 hover:text-green-900 p-1"
                            title="Open Ticket"
                        >
                            <FiCheck size={18} />
                        </motion.button>
                     )}

                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
         {filteredTickets.length === 0 && (
             <div className="text-center py-8">
                <p className="text-slate-500">No tickets found</p>
                 {(searchTerm !== '' || statusFilter !== 'All') && (
                     <button
                        onClick={() => { setSearchTerm(''); setStatusFilter('All'); }}
                        className="mt-2 text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                        Reset Filters
                        </button>
                 )}
             </div>
         )}
          {tickets.length === 0 && initialTickets.length > 0 && searchTerm === '' && statusFilter === 'All' && (
             <div className="text-center py-8">
                <p className="text-slate-500">All tickets have been managed.</p>
             </div>
         )}
      </div>

      <AnimatePresence>
        {showResponseModal && (
          <TicketResponseModal
            isOpen={showResponseModal}
            onClose={() => { setShowResponseModal(false); setSelectedTicket(null); }}
            onSubmit={handleTicketResponse}
            ticket={selectedTicket}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Invoices Page
const InvoicesPage = ({ invoices, setInvoices }) => {
     const { addNotification } = useNotifications();
     const [showInvoiceFormModal, setShowInvoiceFormModal] = useState(false);
     const [invoiceToEdit, setInvoiceToEdit] = useState(null);
     const [searchTerm, setSearchTerm] = useState('');
     const [statusFilter, setStatusFilter] = useState('All');

     const filteredInvoices = useMemo(() => {
        return invoices.filter(invoice => {
            const matchesSearch = invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 invoice.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 invoice.items.some(item => item.description.toLowerCase().includes(searchTerm.toLowerCase()));
            const matchesStatus = statusFilter === 'All' || invoice.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
     }, [invoices, searchTerm, statusFilter]);


     const handleAddInvoice = (newInvoice) => {
         setInvoices([...invoices, newInvoice]);
         setShowInvoiceFormModal(false);
         addNotification({ type: 'success', message: `Invoice ${newInvoice.id} created.` });
     };

     const handleEditInvoice = (updatedInvoice) => {
         setInvoices(invoices.map(invoice => invoice.id === updatedInvoice.id ? updatedInvoice : invoice));
         setInvoiceToEdit(null);
         setShowInvoiceFormModal(false);
         addNotification({ type: 'success', message: `Invoice ${updatedInvoice.id} updated.` });
     };

     const handleDeleteInvoice = (invoiceId) => {
        if(window.confirm(`Are you sure you want to delete invoice ${invoiceId}?`)) {
            setInvoices(invoices.filter(invoice => invoice.id !== invoiceId));
            addNotification({ type: 'info', message: `Invoice ${invoiceId} deleted.` });
        }
     };


    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
        >
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-white rounded-lg shadow gap-4">
                <div className="relative w-full md:w-auto">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search invoices..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 w-full md:w-72 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                 <div className="flex items-center space-x-4 w-full md:w-auto">
                     <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border border-[#3554a6]/20 rounded-lg focus:ring-2 focus:ring-[#3554a6] focus:border-[#399b24] transition-all duration-300"
                    >
                        <option value="All">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="Paid">Paid</option>
                        <option value="Overdue">Overdue</option>
                    </select>
                     <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                             setInvoiceToEdit(null);
                             setShowInvoiceFormModal(true);
                        }}
                        className="flex items-center bg-gradient-to-r from-[#3554a6] to-[#399b24] hover:from-[#399b24] hover:to-[#3554a6] text-white font-semibold py-2 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                        <FiPlus size={18} className="mr-2" />
                        Create Invoice
                    </motion.button>
                 </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-xl overflow-hidden border border-slate-200/50">
                <table className="min-w-full divide-y divide-slate-200/50">
                    <thead className="bg-slate-50/50 backdrop-blur-sm">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Invoice ID</th>
                             <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Customer</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                             <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                             <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Due Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        <AnimatePresence>
                            {filteredInvoices.map(invoice => (
                                <motion.tr
                                    key={invoice.id}
                                     initial={{ opacity: 0 }}
                                     animate={{ opacity: 1 }}
                                     exit={{ opacity: 0 }}
                                    className="hover:bg-slate-50/50 backdrop-blur-sm transition-colors duration-200"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{invoice.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{invoice.customer}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">${invoice.amount.toFixed(2)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <StatusBadge status={invoice.status} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{invoice.date}</td>
                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{invoice.dueDate}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <motion.button
                                          whileHover={{ scale: 1.1 }}
                                          whileTap={{ scale: 0.9 }}
                                            onClick={() => { setInvoiceToEdit(invoice); setShowInvoiceFormModal(true); }}
                                            className="text-indigo-600 hover:text-indigo-900 p-1"
                                            title="Edit"
                                        >
                                            <FiEdit2 size={18} />
                                        </motion.button>
                                        <motion.button
                                          whileHover={{ scale: 1.1 }}
                                          whileTap={{ scale: 0.9 }}
                                            onClick={() => handleDeleteInvoice(invoice.id)}
                                            className="text-red-600 hover:text-red-900 p-1"
                                             title="Delete"
                                        >
                                            <FiTrash2 size={18} />
                                        </motion.button>
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>
                 {filteredInvoices.length === 0 && (
                     <div className="text-center py-8">
                        <p className="text-slate-500">No invoices found</p>
                         {(searchTerm !== '' || statusFilter !== 'All') && (
                              <button
                                onClick={() => { setSearchTerm(''); setStatusFilter('All'); setShowInvoiceFormModal(true); }}
                                className="mt-2 text-indigo-600 hover:text-indigo-800 font-medium"
                                >
                                Reset Filters and Create a New Invoice
                                </button>
                         )}
                     </div>
                 )}
                 {invoices.length === 0 && initialInvoices.length > 0 && searchTerm === '' && statusFilter === 'All' && (
                     <div className="text-center py-8">
                        <p className="text-slate-500">All invoices have been processed.</p>
                     </div>
                 )}
            </div>

             <AnimatePresence>
                 {showInvoiceFormModal && (
                     <InvoiceFormModal
                         isOpen={showInvoiceFormModal}
                         onClose={() => { setShowInvoiceFormModal(false); setInvoiceToEdit(null); }}
                         onSubmit={invoiceToEdit ? handleEditInvoice : handleAddInvoice}
                         initialData={invoiceToEdit}
                     />
                 )}
             </AnimatePresence>
        </motion.div>
    );
};


// Payments Page
const PaymentsPage = ({ payments }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
     const [methodFilter, setMethodFilter] = useState('All');

    const filteredPayments = useMemo(() => {
        return payments.filter(payment => {
            const matchesSearch = payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 payment.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 payment.method.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 payment.invoiceId.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'All' || payment.status === statusFilter;
            const matchesMethod = methodFilter === 'All' || payment.method === methodFilter;
            return matchesSearch && matchesStatus && matchesMethod;
        });
    }, [payments, searchTerm, statusFilter, methodFilter]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
        >
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-white rounded-lg shadow gap-4">
                <div className="relative w-full md:w-auto">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search payments..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 w-full md:w-72 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                 <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto">
                     <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border border-[#3554a6]/20 rounded-lg focus:ring-2 focus:ring-[#3554a6] focus:border-[#399b24] transition-all duration-300"
                    >
                        <option value="All">All Statuses</option>
                        <option value="Completed">Completed</option>
                        <option value="Pending">Pending</option>
                    </select>
                     <select
                        value={methodFilter}
                        onChange={(e) => setMethodFilter(e.target.value)}
                        className="px-4 py-2 border border-[#3554a6]/20 rounded-lg focus:ring-2 focus:ring-[#3554a6] focus:border-[#399b24] transition-all duration-300"
                    >
                        <option value="All">All Methods</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                        <option value="M-Pesa">M-Pesa</option>
                        <option value="Credit Card">Credit Card</option>
                         {/* Add other methods as needed */}
                    </select>
                 </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-xl overflow-hidden border border-slate-200/50">
                <table className="min-w-full divide-y divide-slate-200/50">
                    <thead className="bg-slate-50/50 backdrop-blur-sm">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Payment ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Invoice ID</th>
                             <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Customer</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Method</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                        </tr>
                    </thead>
                     <tbody className="bg-white divide-y divide-slate-200">
                        <AnimatePresence>
                            {filteredPayments.map(payment => (
                                <motion.tr
                                    key={payment.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="hover:bg-slate-50/50 backdrop-blur-sm transition-colors duration-200"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{payment.id}</td>
                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-600 hover:underline cursor-pointer">{payment.invoiceId}</td> {/* Could link to invoice */}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{payment.customer}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{payment.currency} {payment.amount.toFixed(2)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{payment.method}</td>
                                     <td className="px-6 py-4 whitespace-nowrap">
                                        <StatusBadge status={payment.status} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{payment.date}</td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>
                 {filteredPayments.length === 0 && (
                     <div className="text-center py-8">
                        <p className="text-slate-500">No payments found</p>
                         {(searchTerm !== '' || statusFilter !== 'All' || methodFilter !== 'All') && (
                              <button
                                onClick={() => { setSearchTerm(''); setStatusFilter('All'); setMethodFilter('All'); }}
                                className="mt-2 text-indigo-600 hover:text-indigo-800 font-medium"
                                >
                                Reset Filters
                                </button>
                         )}
                     </div>
                 )}
                   {payments.length === 0 && initialPayments.length > 0 && searchTerm === '' && statusFilter === 'All' && methodFilter === 'All' && (
                     <div className="text-center py-8">
                        <p className="text-slate-500">No payment records available.</p>
                     </div>
                 )}
            </div>
        </motion.div>
    );
};


// Admin Profile Page (Updated)
const AdminProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'Super Admin',
    phone: '+1 (555) 123-4567',
    location: 'New York, USA',
    bio: 'Experienced administrator with a focus on system optimization and team management.',
    avatar: 'https://placehold.co/200x200/6366F1/FFFFFF?text=A'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsEditing(false);
    // Add actual update logic here
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-xl border border-[#3554a6]/10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-slate-700">Profile Details</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-[#3554a6] to-[#399b24] hover:from-[#399b24] hover:to-[#3554a6] text-white rounded-lg"
          >
            {isEditing ? (
              <>
                <FiX className="mr-2" /> Cancel
              </>
            ) : (
              <>
                <FiEdit2 className="mr-2" /> Edit Profile
              </>
            )}
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="space-y-4">
              <div className="relative group">
                <img
                  src={formData.avatar}
                  alt="Admin Avatar"
                  className="w-full rounded-xl shadow-lg border-4 border-[#3554a6]/20"
                />
                {isEditing && (
                  <button className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                    <FiCamera className="text-white text-2xl" />
                  </button>
                )}
              </div>
              {!isEditing && (
                <div className="bg-[#3554a6]/5 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-[#3554a6] mb-2">Role</h3>
                  <p className="text-slate-600">{formData.role}</p>
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-2">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="mt-1 block w-full border border-slate-300 rounded-lg px-4 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="mt-1 block w-full border border-slate-300 rounded-lg px-4 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Phone</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="mt-1 block w-full border border-slate-300 rounded-lg px-4 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Location</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="mt-1 block w-full border border-slate-300 rounded-lg px-4 py-2"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Bio</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows="4"
                    className="mt-1 block w-full border border-slate-300 rounded-lg px-4 py-2"
                  ></textarea>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-[#3554a6] to-[#399b24] text-white rounded-lg"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-500">Name</h3>
                    <p className="mt-1 text-slate-900">{formData.name}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-500">Email</h3>
                    <p className="mt-1 text-slate-900">{formData.email}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-500">Phone</h3>
                    <p className="mt-1 text-slate-900">{formData.phone}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-500">Location</h3>
                    <p className="mt-1 text-slate-900">{formData.location}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-500">Bio</h3>
                  <p className="mt-1 text-slate-900">{formData.bio}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};


// --- Main App Component ---

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  // State for mock data
  const [users, setUsers] = useState(initialUsers);
  const [invoices, setInvoices] = useState(initialInvoices);
  const [jobVacancies, setJobVacancies] = useState(initialJobVacancies);
  const [tickets, setTickets] = useState(initialTickets);
  const [payments, setPayments] = useState(initialPayments);
  const [applications, setApplications] = useState(initialApplications);


  // Determine the current page title for the Header
  const currentPageTitle = useMemo(() => {
    const item = SIDENAV_ITEMS.find(item => item.path === currentPage);
    return item ? item.title : 'Dashboard'; // Default to Dashboard
  }, [currentPage]);


  // Render the appropriate page component
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage users={users} jobs={jobVacancies} tickets={tickets} invoices={invoices} />;
      case 'users':
        return <UserListPage users={users} setUsers={setUsers} />;
      case 'profile':
        return <AdminProfilePage />;
      case 'jobs':
        return <JobVacanciesPage jobVacancies={jobVacancies} setJobVacancies={setJobVacancies} />;
      case 'applications':
        return <ApplicationsPage applications={applications} jobs={jobVacancies} />;
      case 'tickets':
        return <TicketsPage tickets={tickets} setTickets={setTickets} />;
      case 'invoices':
         return <InvoicesPage invoices={invoices} setInvoices={setInvoices} />;
      case 'payments':
         return <PaymentsPage payments={payments} />;
      default:
        return <DashboardPage users={users} jobs={jobVacancies} tickets={tickets} invoices={invoices} />;
    }
  };

  return (
    <NotificationProvider>
      <div className="flex min-h-screen bg-gradient-to-br from-[#3554a6]/5 to-[#399b24]/5">
        <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
        <div className="flex-1 flex flex-col md:ml-64"> {/* Add ml-64 to main content on medium+ screens */}
          <Header title={currentPageTitle} setCurrentPage={setCurrentPage} />
          <main className="flex-1 p-6 overflow-y-auto">
            <AnimatePresence mode="wait">
              {renderPage()}
            </AnimatePresence>
          </main>
          {/* Add Notifications component here if it's a fixed element */}
          {/* <Notifications /> */}
        </div>
      </div>
       {/* Modals will be rendered by the specific pages */}
    </NotificationProvider>
  );
}

export default App;