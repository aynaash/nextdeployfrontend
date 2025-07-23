'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface PasswordStrengthIndicatorProps {
  password: string;
  id?: string;
}

export function PasswordStrengthIndicator({ password, id }: PasswordStrengthIndicatorProps) {
  const [strength, setStrength] = useState(0);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!password) {
      setStrength(0);
      setMessage('');
      return;
    }

    // Calculate password strength
    let score = 0;

    // Length check
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;

    // Complexity checks
    if (/[A-Z]/.test(password)) score += 1; // Has uppercase
    if (/[a-z]/.test(password)) score += 1; // Has lowercase
    if (/[0-9]/.test(password)) score += 1; // Has number
    if (/[^A-Za-z0-9]/.test(password)) score += 1; // Has special char

    // Normalize score to 0-4 range
    const normalizedScore = Math.min(4, Math.floor(score / 1.5));
    setStrength(normalizedScore);

    // Set appropriate message
    const messages = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'];

    setMessage(messages[normalizedScore]);
  }, [password]);

  if (!password) return null;

  return (
    <div className='mt-2 space-y-1' id={id}>
      <div className='flex h-1.5 w-full gap-1'>
        {[0, 1, 2, 3].map((index) => (
          <div
            key={index}
            className={cn('h-full w-1/4 rounded-full transition-all duration-300', {
              'bg-red-500': strength === 1 && index === 0,
              'bg-orange-500': strength === 2 && index <= 1,
              'bg-yellow-500': strength === 3 && index <= 2,
              'bg-green-500': strength === 4 && index <= 3,
              'bg-slate-600': index >= strength || strength === 0,
            })}
          />
        ))}
      </div>
      <p
        className={cn('text-xs', {
          'text-red-500': strength === 1,
          'text-orange-500': strength === 2,
          'text-yellow-500': strength === 3,
          'text-green-500': strength === 4,
          'text-slate-400': strength === 0,
        })}
      >
        {message}
      </p>
    </div>
  );
}
