interface PaginationProps {
    canGoBack: boolean;
    canGoForward: boolean;
    onBack: () => void;
    onForward: () => void;
  }
  
  const Pagination: React.FC<PaginationProps> = ({ canGoBack, canGoForward, onBack, onForward }) => (
    <div className="flex justify-between">
    <button
      onClick={canGoBack ? onBack : undefined}
      disabled={!canGoBack}
      className={`px-4 py-2 rounded-md ${
        canGoBack
        ? 'bg-emerald-600 text-gray-100 hover:bg-emerald-700 border-2 border-emerald-800'
        : 'bg-gray-400 text-gray-600 border-2 border-gray-500 cursor-not-allowed'
      }`}
    >
      Previous
    </button>
    <button
      onClick={canGoForward ? onForward : undefined}
      disabled={!canGoForward}
      className={`px-4 py-2 rounded-md ${
        canGoForward
        ? 'bg-emerald-600 text-gray-100 hover:bg-emerald-700 border-2 border-emerald-800'
        : 'bg-gray-400 text-gray-600 border-2 border-gray-500 cursor-not-allowed'
      }`}
    >
      Next
    </button>
  </div>
  );
  
  export default Pagination;