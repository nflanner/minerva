import React, { Component, ReactNode } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  handleRetry = () => {
    // Save the currently saved data if needed
    window.location.reload();
  };

  handleRestart = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <Modal
          isOpen={true}
          onClose={this.handleRestart}
          title="An Error Occurred"
          customActions={
            <div className="flex flex-row space-x-2 justify-end p-4 border-t">
              <Button color="blue" onClick={this.handleRetry}>
                Retry
              </Button>
              <Button color="red" onClick={this.handleRestart}>
                Restart
              </Button>
            </div>
          }
        >
          <div className='flex flex-col space-y-2'>
            <p>Something went wrong.</p>
            <p>Please click 'Retry' to refresh the current page or click 'Restart' so start from the beginning.</p>
            <p>
              <span className='font-bold pr-1'>
                Note:
              </span> 
              All current data will be lost if you click 'Restart'
            </p>
          </div>
        </Modal>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;