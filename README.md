# TalentFlow HR - Frontend

![TalentFlow HR](https://img.shields.io/badge/React-18.2.0-blue)
![Vite](https://img.shields.io/badge/Vite-4.4.5-purple)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.0-purple)
![License](https://img.shields.io/badge/License-MIT-green)

## 🚀 Live Demo

**Live Application:** [https://talenthr-front.onrender.com/](https://talenthr-front.onrender.com/)

**Demo Accounts:**
- **Admin:** admin@talentflow.com / password
- **HR Manager:** hr@talentflow.com / password  
- **Employee:** employee@talentflow.com / password

## 📖 Overview

TalentFlow HR is a comprehensive Human Resource Management System designed to streamline HR operations for modern organizations. The frontend is built with React and provides an intuitive, responsive interface for managing employees, feedback, leaves, skills, and more.

## ✨ Key Features

### 🏢 Core HR Management
- **Employee Database** - Complete employee profiles with role-based access
- **Leave Management** - Automated leave requests and approval workflows
- **Skills Inventory** - Track and verify employee competencies
- **Performance Feedback** - 360-degree feedback system

### 🏆 Employee Engagement
- **Recognition System** - Peer-to-peer recognition with points and leaderboard
- **Training Management** - Course enrollment and progress tracking
- **Goal Setting** - OKR (Objectives and Key Results) framework
- **Employee Surveys** - Anonymous feedback collection with analytics

### 📢 Communication & Resources
- **Announcements** - Company-wide communication platform
- **Document Management** - Secure file sharing with access control
- **Real-time Dashboard** - Analytics and insights for decision making

## 🛠 Technology Stack

- **Frontend Framework:** React 18 with Hooks
- **Build Tool:** Vite (Fast development and optimized builds)
- **Styling:** Bootstrap 5 + Custom CSS
- **Icons:** Font Awesome
- **HTTP Client:** Axios with interceptors
- **Routing:** React Router DOM
- **State Management:** React Context API
- **Deployment:** Vercel

## 🎯 Why Choose TalentFlow HR Frontend?

### ⚡ Performance Advantages
- **Lightning Fast** - Vite build tool for instant hot reload and optimized production builds
- **Responsive Design** - Mobile-first approach works seamlessly on all devices
- **Component-Based Architecture** - Reusable components for maintainable code
- **Lazy Loading** - Optimized bundle splitting for faster initial loads

### 🎨 User Experience
- **Intuitive Interface** - Clean, modern design with smooth animations
- **Role-Based Access** - Different views for Admin, HR, and Employees
- **Real-time Updates** - Live data synchronization across modules
- **Accessibility** - WCAG compliant with keyboard navigation support

### 🔧 Development Advantages
- **TypeScript Ready** - Full TypeScript support for type safety
- **Modular Structure** - Well-organized folder structure for scalability
- **API Integration** - Centralized API service with error handling
- **Environment Configuration** - Easy configuration for different environments

## 📁 Project Structure
frontend/
├── public/ # Static assets
├── src/
│ ├── components/ # Reusable UI components
│ │ ├── Navbar.jsx # Main navigation
│ │ └── ...
│ ├── pages/ # Route components
│ │ ├── Dashboard.jsx # Main dashboard
│ │ ├── Employees.jsx # Employee management
│ │ ├── Feedback.jsx # Feedback system
│ │ ├── Leaves.jsx # Leave management
│ │ ├── Skills.jsx # Skills inventory
│ │ ├── Recognition.jsx # Employee recognition
│ │ ├── Training.jsx # Training management
│ │ ├── Goals.jsx # Goal tracking
│ │ ├── Surveys.jsx # Employee surveys
│ │ ├── Announcements.jsx # Company announcements
│ │ ├── Documents.jsx # Document management
│ │ ├── Login.jsx # Authentication
│ │ └── Register.jsx # User registration
│ ├── context/ # React context
│ │ └── AuthContext.jsx # Authentication state
│ ├── services/ # API services
│ │ └── api.js # Axios configuration
│ ├── styles/ # CSS files
│ │ └── main.css # Custom styles
│ └── utils/ # Utility functions
└── package.json

## 🚀 Quick Start

### Prerequisites
- Node.js 16.0 or higher
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/talentflow-hr.git
   cd talentflow-hr/frontend
2.**Install dependencies**
  npm install
*** 3.Environment Setup**
Create .env file:
VITE_API_BASE_URL=http://localhost:5000
 *** 4.Start development server**
 npm run dev
 *** 5Build for production**
 npm run build
 🤝 Contributing
Fork the repository

Create feature branch (git checkout -b feature/AmazingFeature)

Commit changes (git commit -m 'Add AmazingFeature')

Push to branch (git push origin feature/AmazingFeature)

Open Pull Request

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

👥 Team
Raviteja Ungrala - Full Stack Developer

Neuzen AI - Project Assessment

🔗 Links
Backend Repository: https://github.com/ravitejaungrala/talentflowhr_backend


