import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface ErrorDisplayProps {
  message: string;
  retryAction?: () => void;
}

const ErrorDisplay = ({ message, retryAction }: ErrorDisplayProps) => {
  return (
    <Alert variant='destructive' className='my-4'>
      <AlertCircle className='h-4 w-4' />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription className='flex flex-col gap-2'>
        <p>{message}</p>
        {retryAction && (
          <Button variant='outline' size='sm' onClick={retryAction} className='self-start'>
            Try Again
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default ErrorDisplay;
