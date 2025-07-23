import { useState } from 'react';

interface RegisterAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RegisterAgentModal({ isOpen, onClose }: RegisterAgentModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    vpsIp: '',
    sshKey: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/agents/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        onClose();
      }
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='w-full max-w-md rounded-lg bg-white p-6'>
        <div className='mb-4 flex items-center justify-between'>
          <h2 className='text-xl font-bold'>Register New Agent</h2>
          <button onClick={onClose} className='text-gray-500 hover:text-gray-700'>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700'>Agent Name</label>
            <input
              type='text'
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>VPS IP Address</label>
            <input
              type='text'
              value={formData.vpsIp}
              onChange={(e) => setFormData({ ...formData, vpsIp: e.target.value })}
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>SSH Public Key</label>
            <textarea
              value={formData.sshKey}
              onChange={(e) => setFormData({ ...formData, sshKey: e.target.value })}
              rows={4}
              className='mt-1 block w-full rounded-md border-gray-300 font-mono text-xs shadow-sm focus:border-blue-500 focus:ring-blue-500'
              required
            />
          </div>

          <div className='flex justify-end space-x-3'>
            <button
              type='button'
              onClick={onClose}
              className='rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50'
            >
              Cancel
            </button>
            <button
              type='submit'
              className='rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700'
            >
              Register Agent
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
