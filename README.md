# Runi

Runi is a comprehensive business management application built with modern web technologies. This project serves as a robust template for managing various aspects of a business, including inventory, sales, customers, and expenses.

## 🚀 Features

- **Dashboard**: Real-time overview of business performance and metrics.
- **Products**: Comprehensive inventory management (add, edit, tracking).
- **Sales**: Process and track sales orders.
- **Expenses**: Record and categorize business expenses.
- **Documents**: File management system for business records.
- **Reports**: Data visualization and business analytics.
- **Users**: Manage team members, roles, and permissions.
- **Settings**: Application configuration and preferences.
- **Transactions**: Financial history and transaction logs.
- **Authentication**: Secure sign-in and session management via Convex Auth.

## 🛠️ Tech Stack

- **Frontend**: 
  - [React 19](https://react.dev/)
  - [Vite](https://vitejs.dev/)
  - [Tailwind CSS](https://tailwindcss.com/)
  - [Lucide React](https://lucide.dev/) (Icons)
  - [Sonner](https://sonner.emilkowal.ski/) (Toast notifications)
- **Backend & Database**: 
  - [Convex](https://convex.dev/) (Real-time database, server functions, and auth)
- **Language**: TypeScript

## 📂 Project Structure

```
├── convex/               # Backend code (Schema, API functions, Auth)
│   ├── schema.ts         # Database schema definition
│   ├── auth.ts           # Authentication logic
│   └── ...               # Context-specific API modules (products, sales, etc.)
├── src/                  # Frontend source code
│   ├── components/       # Shared UI components
│   │   ├── layout/       # App shell, Sidebar, Navbar
│   │   └── ui/           # Reusable design system components
│   ├── features/         # Feature-based architecture
│   │   ├── auth/         # Authentication flows
│   │   ├── dashboard/    # Dashboard widgets
│   │   ├── products/     # Product management
│   │   ├── sales/        # Sales operations
│   │   ├── ...           # Other domain features (users, settings, etc.)
│   ├── lib/              # Utility functions and types
│   ├── App.tsx           # Main application component
│   └── main.tsx          # Application entry point
├── public/               # Static assets
└── package.json          # Project dependencies and scripts
```

## ⚡ Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   This command runs both the frontend (Vite) and backend (Convex) concurrently.
   ```bash
   npm run dev
   ```

   - Frontend: http://localhost:5173
   - Convex Dashboard: Automatically opens or runs in the background

### Build for Production

To build the application for production:

```bash
npm run build
```

## 📜 Scripts

- `npm run dev`: Starts both frontend and backend in development mode.
- `npm run dev:frontend`: Starts only the Vite frontend server.
- `npm run dev:backend`: Starts only the Convex backend server.
- `npm run build`: Builds the project for production.
- `npm run lint`: Runs type checking and linting.

## 🔒 Authentication

This project uses `@convex-dev/auth` for handling user authentication. Ensure you have configured your Convex project correctly to handle auth providers if needed.

## � Author

**Ntwari K. Brian**


## �📄 License

[MIT](LICENSE)
