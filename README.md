# Runi

Runi is a comprehensive business management application built with modern web technologies. This project serves as a robust template for managing various aspects of a business, including inventory, sales, customers, and expenses.

## 🚀 Features

- **Dashboard**: Overview of business performance.
- **Product Management**: Track inventory, pricing, and product details.
- **Customer CRM**: Manage customer profiles, contact info, and balances.
- **Supplier Management**: Keep track of suppliers and payment terms.
- **Sales & Orders**: Process sales, track status, and manage payments.
- **Expense Tracking**: Record and categorize business expenses.
- **Document Management**: Store and organize business documents.
- **Authentication**: Secure sign-in and user management via Convex Auth.

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
├── convex/              # Backend code (Schema, API functions, Auth)
│   ├── schema.ts        # Database schema definition
│   ├── auth.ts          # Authentication logic
│   └── ...              # Domain-specific modules (products, sales, etc.)
├── src/                 # Frontend source code
│   ├── components/      # React components
│   ├── lib/             # Utility functions
│   ├── App.tsx          # Main application component
│   └── main.tsx         # Entry point
├── public/              # Static assets
└── package.json         # Project dependencies and scripts
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
