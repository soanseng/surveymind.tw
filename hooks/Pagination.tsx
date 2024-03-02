interface PaginationProps {
    canGoBack: boolean;
    canGoForward: boolean;
    onBack: () => void;
    onForward: () => void;
  }
  
  const Pagination: React.FC<PaginationProps> = ({ canGoBack, canGoForward, onBack, onForward }) => (
    <div className="flex justify-between">
      {canGoBack && (
        <button onClick={onBack} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700">
          Previous
        </button>
      )}
      {canGoForward && (
        <button onClick={onForward} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
          Next
        </button>
      )}
    </div>
  );
  
  export default Pagination;