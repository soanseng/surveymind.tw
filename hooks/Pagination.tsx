interface PaginationProps {
    canGoBack: boolean;
    canGoForward: boolean;
    onBack: () => void;
    onForward: () => void;
  }
  
  const Pagination: React.FC<PaginationProps> = ({ canGoBack, canGoForward, onBack, onForward }) => (
    <div className="flex justify-between">
        <button 
        onClick={ canGoBack ? onBack : undefined} 
        disabled={!canGoBack}
        className={`px-4 py-2 text-red rounded ${canGoBack ? 'bg- hover:bg-gray-700' : 'bg-gray-300 cursor-not-allowed'}`}
        >
          Previous
        </button>
        <button 
        onClick={canGoForward ? onForward : undefined}
        disabled={!canGoForward}
        className={`px-4 py-2 text-red rounded ${canGoForward ? 'bg-gray-500 hover:bg-gray-700' : 'bg-gray-300 cursor-not-allowed'}`}
        >
          Next
        </button>
    </div>
  );
  
  export default Pagination;