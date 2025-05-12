import React, { useState, useEffect } from 'react';
import { FiUsers, FiUser, FiGrid, FiPlus, FiEdit2, FiTrash2, FiChevronDown, FiChevronUp, FiBriefcase, FiFileText, FiDollarSign, FiMessageSquare, FiLogOut, FiSettings, FiBell, FiSearch } from 'react-icons/fi'; // Using react-icons/fi for a consistent set
import { motion, AnimatePresence } from 'framer-motion';
import { NotificationProvider, useNotifications } from './contexts/NotificationContext';
import Notifications from './components/Notifications';

// --- Mock Data (db.json) ---
const initialUsers = [
  { id: 1, name: 'Alice Wonderland', email: 'alice@example.com', role: 'Admin', joinedDate: '2023-01-15', avatar: 'https://placehold.co/100x100/FFC0CB/000000?text=AW' },
  { id: 2, name: 'Bob The Builder', email: 'bob@example.com', role: 'Editor', joinedDate: '2023-02-20', avatar: 'https://placehold.co/100x100/ADD8E6/000000?text=BB' },
  { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', role: 'Viewer', joinedDate: '2023-03-10', avatar: 'https://placehold.co/100x100/90EE90/000000?text=CB' },
  { id: 4, name: 'Diana Prince', email: 'diana@example.com', role: 'Editor', joinedDate: '2023-04-05', avatar: 'https://placehold.co/100x100/FFD700/000000?text=DP' },
  { id: 5, name: 'Edward Scissorhands', email: 'edward@example.com', role: 'Viewer', joinedDate: '2023-05-12', avatar: 'https://placehold.co/100x100/D3D3D3/000000?text=ES' },
];

const initialInvoices = [
  { id: 'INV-001', customer: 'Tech Solutions Inc.', amount: 1200, status: 'Paid', date: '2024-03-15', dueDate: '2024-04-15' },
  { id: 'INV-002', customer: 'Creative Designs LLC', amount: 850, status: 'Pending', date: '2024-03-20', dueDate: '2024-04-20' },
  { id: 'INV-003', customer: 'Global Web Services', amount: 2500, status: 'Overdue', date: '2024-02-10', dueDate: '2024-03-10' },
];

const initialJobVacancies = [
    { id: 1, title: 'Senior Frontend Developer', department: 'Engineering', location: 'Remote', status: 'Open', applications: 25, postedDate: '2024-04-01' },
    { id: 2, title: 'UX/UI Designer', department: 'Design', location: 'New York, NY', status: 'Closed', applications: 42, postedDate: '2024-03-15' },
    { id: 3, title: 'Product Manager', department: 'Product', location: 'San Francisco, CA', status: 'Open', applications: 18, postedDate: '2024-04-10' },
];

const initialTickets = [
  { id: 'TKT-001', subject: 'Payment Issue', customer: 'John Doe', status: 'Open', priority: 'High', created: '2024-05-10', lastResponse: null },
  { id: 'TKT-002', subject: 'Login Problem', customer: 'Jane Smith', status: 'In Progress', priority: 'Medium', created: '2024-05-09', lastResponse: '2024-05-10' },
  { id: 'TKT-003', subject: 'Refund Request', customer: 'Mike Johnson', status: 'Closed', priority: 'Low', created: '2024-05-08', lastResponse: '2024-05-09' }
];

const initialPayments = [
  { id: 'PMT-001', amount: 1500, customer: 'Tech Corp', method: 'Bank Transfer', status: 'Completed', date: '2024-05-10', currency: 'USD' },
  { id: 'PMT-002', amount: 800, customer: 'Digital Solutions', method: 'M-Pesa', status: 'Pending', date: '2024-05-10', currency: 'KES' },
  { id: 'PMT-003', amount: 2000, customer: 'WebTech Inc', method: 'Credit Card', status: 'Completed', date: '2024-05-09', currency: 'USD' }
];

const initialApplications = [
  { id: 'APP-001', jobId: 1, candidate: 'Sarah Wilson', email: 'sarah@example.com', status: 'Under Review', appliedDate: '2024-05-01' },
  { id: 'APP-002', jobId: 1, candidate: 'James Brown', email: 'james@example.com', status: 'Shortlisted', appliedDate: '2024-05-02' },
  { id: 'APP-003', jobId: 3, candidate: 'Emma Davis', email: 'emma@example.com', status: 'Rejected', appliedDate: '2024-05-03' }
];

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

// --- Components ---

// Sidebar Component
const Sidebar = ({ currentPage, setCurrentPage }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-20 p-2 bg-slate-700 text-white rounded-md"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <FiChevronUp size={24} /> : <FiChevronDown size={24} />}
      </button>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: '-100%' }}
        animate={{ x: isMobileMenuOpen || window.innerWidth >= 768 ? 0 : '-100%' }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className={`fixed inset-y-0 left-0 z-10 w-64 bg-slate-800 text-slate-100 p-6 space-y-6 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:block ${isMobileMenuOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full'}`}
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
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ease-in-out hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${currentPage === item.path ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-300 hover:text-white'}`}
            >
              {item.icon}
              <span>{item.title}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-6 left-0 right-0 px-6">
          <button
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onClick={() => alert('Logout clicked!')} // Replace with actual logout logic
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
        ></div>
      )}
    </>
  );
};

// Header Component
const Header = ({ title }) => {
  return (
    <header className="bg-white shadow-sm p-6 mb-6 rounded-lg">
      <div className="container mx-auto flex justify-between items-center">
        <h2 className="text-3xl font-semibold text-slate-700">{title}</h2>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 w-64 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
          </div>
          <button className="relative text-slate-500 hover:text-indigo-600">
            <FiBell size={24} />
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
          </button>
          <div className="flex items-center space-x-2">
            <img
              src="https://placehold.co/40x40/6366F1/FFFFFF?text=A"
              alt="Admin Avatar"
              className="w-10 h-10 rounded-full border-2 border-indigo-500"
            />
            <span className="text-slate-700 font-medium">Admin User</span>
          </div>
        </div>
      </div>
    </header>
  );
};

// --- Page Components ---

// Dashboard Page (Placeholder)
const DashboardPage = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
    className="p-6 bg-white rounded-lg shadow"
  >
    <h3 className="text-2xl font-semibold text-slate-700 mb-4">Dashboard Overview</h3>
    <p className="text-slate-600">Welcome to your admin dashboard. Here you'll find a summary of your site's activity.</p>
    {/* Add more dashboard widgets here */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {['Total Users', 'Sales Today', 'New Tickets', 'Pending Applications'].map((item, index) => (
            <div key={index} className="bg-slate-50 p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
                <h4 className="text-slate-500 text-sm font-medium">{item}</h4>
                <p className="text-3xl font-bold text-indigo-600 mt-1">
                    {index === 0 ? initialUsers.length : (index === 1 ? '$1,234' : (index === 2 ? '5' : '12'))}
                </p>
            </div>
        ))}
    </div>
  </motion.div>
);

// Admin Profile Page (Placeholder)
const AdminProfilePage = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
    className="p-8 bg-white rounded-xl shadow-lg max-w-2xl mx-auto"
  >
    <div className="flex flex-col items-center">
        <img 
            src="https://placehold.co/120x120/6366F1/FFFFFF?text=AU" 
            alt="Admin Avatar" 
            className="w-32 h-32 rounded-full border-4 border-indigo-500 shadow-md mb-6"
        />
        <h3 className="text-3xl font-bold text-slate-800">Admin User</h3>
        <p className="text-slate-500 text-lg">admin@example.com</p>
        <p className="text-sm text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full mt-2">Super Administrator</p>
    </div>

    <div className="mt-10 space-y-6">
        <div>
            <h4 className="text-xl font-semibold text-slate-700 mb-2">Account Details</h4>
            <div className="bg-slate-50 p-6 rounded-lg shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-500">Full Name</label>
                        <p className="text-slate-700 text-lg">Admin User</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-500">Email Address</label>
                        <p className="text-slate-700 text-lg">admin@example.com</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-500">Role</label>
                        <p className="text-slate-700 text-lg">Super Administrator</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-500">Joined Date</label>
                        <p className="text-slate-700 text-lg">January 1, 2023</p>
                    </div>
                </div>
            </div>
        </div>

        <div>
            <h4 className="text-xl font-semibold text-slate-700 mb-2">Settings</h4>
            <div className="bg-slate-50 p-6 rounded-lg shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                    <span className="text-slate-600">Enable Two-Factor Authentication</span>
                    <button className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors">Enable</button>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-slate-600">Change Password</span>
                    <button className="px-4 py-2 bg-slate-200 text-slate-700 text-sm rounded-lg hover:bg-slate-300 transition-colors">Change</button>
                </div>
            </div>
        </div>
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full mt-8 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
            Update Profile
        </motion.button>
    </div>
  </motion.div>
);

// Job Vacancies Page
const JobVacanciesPage = () => {
    const { addNotification } = useNotifications();
    const [vacancies, setVacancies] = useState(initialJobVacancies);
    const [showModal, setShowModal] = useState(false);
    const [jobToEdit, setJobToEdit] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredVacancies = vacancies.filter(vacancy =>
        vacancy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vacancy.department.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddJob = (newJob) => {
        setVacancies([...vacancies, { ...newJob, id: Date.now() }]);
        setShowModal(false);
        addNotification({
            type: 'success',
            message: 'Job vacancy posted successfully'
        });
    };

    const handleEditJob = (updatedJob) => {
        setVacancies(vacancies.map(job => 
            job.id === updatedJob.id ? updatedJob : job
        ));
        setJobToEdit(null);
        setShowModal(false);
        addNotification({
            type: 'success',
            message: 'Job vacancy updated successfully'
        });
    };

    const handleDeleteJob = (jobId) => {
        if (window.confirm('Are you sure you want to delete this job vacancy?')) {
            setVacancies(vacancies.filter(job => job.id !== jobId));
            addNotification({
                type: 'info',
                message: 'Job vacancy deleted successfully'
            });
        }
    };

    const openEditModal = (job) => {
        setJobToEdit(job);
        setShowModal(true);
    };

    const openAddModal = () => {
        setJobToEdit(null);
        setShowModal(true);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
        >
            <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow">
                <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search vacancies..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 w-72 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={openAddModal}
                    className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow"
                >
                    <FiPlus size={18} className="mr-2" />
                    Post Vacancy
                </motion.button>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
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
                            {filteredVacancies.map(vacancy => (
                                <motion.tr 
                                    key={vacancy.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="hover:bg-slate-50"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{vacancy.title}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{vacancy.department}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{vacancy.location}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs rounded-full ${
                                            vacancy.status === 'Open' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                            {vacancy.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{vacancy.applications}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{vacancy.postedDate}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => openEditModal(vacancy)}
                                            className="text-indigo-600 hover:text-indigo-900 p-1"
                                        >
                                            <FiEdit2 size={18} />
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => handleDeleteJob(vacancy.id)}
                                            className="text-red-600 hover:text-red-900 p-1"
                                        >
                                            <FiTrash2 size={18} />
                                        </motion.button>
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>
                {filteredVacancies.length === 0 && (
                    <p className="text-center py-4 text-slate-500">No job vacancies found.</p>
                )}
            </div>

            <AnimatePresence>
                {showModal && (
                    <JobFormModal
                        isOpen={showModal}
                        onClose={() => {
                            setShowModal(false);
                            setJobToEdit(null);
                        }}
                        onSubmit={jobToEdit ? handleEditJob : handleAddJob}
                        initialData={jobToEdit}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
};

// Placeholder for other pages
const PlaceholderPage = ({ title }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
    className="p-6 bg-white rounded-lg shadow"
  >
    <h3 className="text-2xl font-semibold text-slate-700 mb-4">{title}</h3>
    <p className="text-slate-600">Content for {title.toLowerCase()} will be here. This is a placeholder.</p>
  </motion.div>
);

// --- Main App Component ---
function App() {
  const [currentPage, setCurrentPage] = useState('dashboard'); // Default page
  const [users, setUsers] = useState(initialUsers); // Manage users state here
  const { addNotification } = useNotifications();
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  const handleAddUser = (newUser) => {
    setUsers([...users, { ...newUser, id: Date.now() }]);
    setShowAddUserModal(false);
    addNotification({
        type: 'success',
        message: `New user ${newUser.name} added successfully`
    });
  };

  const handleTicketResponse = (ticketId, response) => {
    // Update ticket logic here
    addNotification({
        type: 'success',
        message: 'Ticket response sent successfully'
    });
  };

  // Function to render current page based on state
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'users':
        return <UserListPage users={users} setUsers={setUsers} />;
      case 'profile':
        return <AdminProfilePage />;
      case 'jobs':
        return <JobVacanciesPage />;
      case 'applications':
        return <ApplicationsPage />;
      case 'tickets':
        return <TicketsPage />;
      case 'invoices':
        return <InvoicesPage />;
      case 'payments':
        return <PaymentsPage />;
      default:
        return <DashboardPage />;
    }
  };

  const pageTitles = {
    dashboard: 'Dashboard',
    users: 'User Management',
    profile: 'Admin Profile',
    jobs: 'Job Vacancies',
    applications: 'Job Applications',
    tickets: 'Customer Service Tickets',
    invoices: 'Invoicing System',
    payments: 'Payment Overview',
  }

  return (
    <NotificationProvider>
      <div className="flex h-screen bg-slate-100 font-inter">
        {/* Sidebar */}
        <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <Header title={pageTitles[currentPage] || 'Admin'} />
          
          {/* Page Content */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-100 p-6">
            <AnimatePresence mode="wait"> {/* mode="wait" ensures one component exits before the next enters */}
              {React.cloneElement(renderPage(), { key: currentPage })}
            </AnimatePresence>
          </main>
        </div>
        <Notifications />
      </div>
    </NotificationProvider>
  );
}

export default App;

// To make this runnable, ensure you have:
// 1. React and ReactDOM installed.
// 2. Tailwind CSS setup in your project (e.g., via PostCSS).
//    Your tailwind.config.js should include 'Inter' font if you want to use it:
//    theme: { extend: { fontFamily: { inter: ['Inter', 'sans-serif'] } } }
//    And your main CSS file (e.g., index.css) should have:
//    @tailwind base;
//    @tailwind components;
//    @tailwind utilities;
//    body { font-family: 'Inter', sans-serif; }
// 3. Framer Motion installed: `npm install framer-motion` or `yarn add framer-motion`
// 4. React Icons installed: `npm install react-icons` or `yarn add react-icons`
//
// You would typically render this App component in your main index.js or main.jsx:
// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import App from './App'; // Assuming this file is App.jsx
// import './index.css'; // Your main CSS with Tailwind imports
//
// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
// );
