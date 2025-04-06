'use client';

import { useState } from 'react';
// Import the new client creation function
import { createClientComponentClient } from '@/lib/supabase/client';

export default function ResendConfirmation({ email }: { email: string }) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  // Create client instance within the component
  const [supabase] = useState(() => createClientComponentClient());

  const handleResend = async () => {
    setStatus('sending');
    setError(null);

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email
      });

      if (error) throw error;
      setStatus('sent');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      setStatus('error');
    }
  };

  if (status === 'sent') {
    return (
      <div className="text-sm text-green-600 mt-2">
        Confirmation email resent. Please check your inbox.
      </div>
    );
  }

  return (
    <div className="mt-2">
      <button
        onClick={handleResend}
        disabled={status === 'sending'}
        className="text-sm text-amber-600 hover:text-amber-500"
      >
        {status === 'sending' ? 'Sending...' : 'Resend confirmation email'}
      </button>
      {error && (
        <div className="text-sm text-red-600 mt-1">
          {error}
        </div>
      )}
    </div>
  );
}
