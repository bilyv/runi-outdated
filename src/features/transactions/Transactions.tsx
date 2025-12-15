export function Transactions() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text">Transactions</h1>
      </div>
      
      <div className="bg-white dark:bg-dark-card rounded-lg border border-gray-200 dark:border-dark-border p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-dark-text mb-2">Under Development</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The Transactions feature is currently under development. Please check back later.
          </p>
        </div>
      </div>
    </div>
  );
}