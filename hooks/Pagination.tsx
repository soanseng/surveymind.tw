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

import { Button } from "@/components/ui/button"


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
    <Button
      onClick={ (e) => {
        e.preventDefault();
        if (canGoBack) {
          onBack();
        }
      }}
      disabled={!canGoBack}
      className={` ${
        canGoBack
        ? ''
        : 'bg-gray-400 text-gray-600 border-2 border-gray-500 cursor-not-allowed'
      }`}
    >
      上一頁
    </Button>
    <Button
      onClick={(e) => {
        e.preventDefault();
        handleForwardClick()}}
      className={`${
        canGoForward
        ? ''
        : 'cursor-not-allowed'
      }`}
    >
      下一頁
    </Button>
    <AlertDialog open={isAlertDialogOpen} onOpenChange={setAlertDialogOpen}>
        <AlertDialogTrigger asChild>
          <button className="hidden">Open Alert Dialog</button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>請回答所有問題</AlertDialogTitle>
          <AlertDialogDescription>
            請回答本頁所有問題。
          </AlertDialogDescription>
          <AlertDialogCancel onClick={() => setAlertDialogOpen(false)}>Close</AlertDialogCancel>
        </AlertDialogContent>
      </AlertDialog>
  </div>
  )
};

export default Pagination;

