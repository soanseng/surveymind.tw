'use client'
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from  '@/components/ui/alert-dialog';

interface PaginationProps {
    canGoBack: boolean;
    canGoForward: boolean;
    onBack: () => void;
    onForward: () => void;
  }
  
  const Pagination: React.FC<PaginationProps> = ({ canGoBack, canGoForward, onBack, onForward }) => { 
    const [isAlertDialogOpen, setAlertDialogOpen] = useState(false);
    const handleForwardClick = () => {
      if (canGoForward) {
        onForward();
      } else {
        setAlertDialogOpen(true);
      }
    };

    return (
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
      上一頁
    </button>
    <button
      onClick={handleForwardClick}
      className={`px-4 py-2 rounded-md ${
        canGoForward
        ? 'bg-emerald-600 text-gray-100 hover:bg-emerald-700 border-2 border-emerald-800'
        : 'bg-gray-400 text-gray-600 border-2 border-gray-500 cursor-not-allowed'
      }`}
    >
      下一頁
    </button>
    <AlertDialog open={isAlertDialogOpen} onOpenChange={setAlertDialogOpen}>
        <AlertDialogTrigger asChild>
          <button className="hidden">Open Alert Dialog</button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>Cannot Proceed</AlertDialogTitle>
          <AlertDialogDescription>
            You cannot go forward from this point.
          </AlertDialogDescription>
          <AlertDialogCancel onClick={() => setAlertDialogOpen(false)}>Close</AlertDialogCancel>
        </AlertDialogContent>
      </AlertDialog>
  </div>
  )
};

export default Pagination;

