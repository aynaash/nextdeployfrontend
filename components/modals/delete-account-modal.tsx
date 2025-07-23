'use client';

import { Dispatch, SetStateAction, useCallback, useMemo, useState } from 'react';
import { signOut, useSession } from '../../auth-client.ts';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { UserAvatar } from '@/components/shared/user-avatar';
interface DeleteAccountModalProps {
  showDeleteAccountModal: boolean;
  setShowDeleteAccountModal: Dispatch<SetStateAction<boolean>>;
}
interface User {
  name: string;
  image: string | null;
}
function DeleteAccountModal({
  showDeleteAccountModal,
  setShowDeleteAccountModal,
}: DeleteAccountModalProps) {
  const { data: session } = useSession();
  const [deleting, setDeleting] = useState(false);

  const user: User = useMemo(
    () => ({
      name: session?.user?.name || 'User',
      image: typeof session?.user.image === 'string' ? session?.user?.image : null,
    }),
    [session?.user]
  );

  const deleteAccount = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/user`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        const error = await res.text();
        throw new Error(error);
      }

      await signOut();
      setTimeout(() => {
        window.location.href = `${window.location.origin}/`;
      }, 500);
    } catch (error) {
      setDeleting(false);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.promise(deleteAccount(), {
      loading: 'Deleting account...',
      success: 'Account deleted successfully!',
      error: (err) => err.message,
    });
  };

  return (
    <Modal
      showModal={showDeleteAccountModal}
      setShowModal={setShowDeleteAccountModal}
      className='gap-0'
    >
      <div className='flex flex-col items-center justify-center space-y-3 border-b p-4 pt-8 sm:px-16'>
        <UserAvatar user={user} />
        <h3 className='text-lg font-semibold'>Delete Account</h3>
        <p className='text-center text-sm text-muted-foreground'>
          <b>Warning:</b> This will permanently delete your account and your active subscription!
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className='flex flex-col space-y-6 bg-accent px-4 py-8 text-left sm:px-16'
      >
        <div>
          <label htmlFor='verification' className='block text-sm'>
            To verify, type{' '}
            <span className='font-semibold text-black dark:text-white'>confirm delete account</span>{' '}
            below
          </label>
          <Input
            type='text'
            name='verification'
            id='verification'
            pattern='confirm delete account'
            required
            autoFocus={false}
            autoComplete='off'
            className='mt-1 w-full border bg-background'
          />
        </div>

        <Button variant={deleting ? 'disable' : 'destructive'} disabled={deleting} type='submit'>
          {deleting ? 'Deleting...' : 'Confirm delete account'}
        </Button>
      </form>
    </Modal>
  );
}

export function useDeleteAccountModal() {
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);

  const DeleteAccountModalCallback = useCallback(
    () => (
      <DeleteAccountModal
        showDeleteAccountModal={showDeleteAccountModal}
        setShowDeleteAccountModal={setShowDeleteAccountModal}
      />
    ),
    [showDeleteAccountModal]
  );

  return useMemo(
    () => ({
      setShowDeleteAccountModal,
      DeleteAccountModal: DeleteAccountModalCallback,
    }),
    [DeleteAccountModalCallback]
  );
}
