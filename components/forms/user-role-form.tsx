'use client';

import { useState, useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SectionColumns } from '@/components/dashboard/section-columns';
import { Icons } from '@/components/shared/icons';

// 1. Define UserRole enum and types
enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
}

const userRoleLabels: Record<UserRole, string> = {
  [UserRole.USER]: 'User',
  [UserRole.ADMIN]: 'Admin',
  [UserRole.SUPER_ADMIN]: 'Super Admin',
};

type User = {
  id: string;
  role: UserRole;
};

type FormData = {
  role: UserRole;
};

// 2. Create validation schema
const userRoleSchema = z.object({
  role: z.nativeEnum(UserRole),
});

// 3. Mock update functions (replace with your actual implementations)
const updateUserRole = async (userId: string, data: FormData) => {
  // Your actual implementation here
  return { status: 'success' };
};

const useSession = () => {
  // Your actual session implementation here
  return {
    update: async () => {},
  };
};

// 4. Main component
interface UserRoleFormProps {
  user: Pick<User, 'id' | 'role'>;
}

export function UserRoleForm({ user }: UserRoleFormProps) {
  const { update } = useSession();
  const [updated, setUpdated] = useState(false);
  const [isPending, startTransition] = useTransition();
  const updateUserRoleWithId = updateUserRole.bind(null, user.id);

  const roles = Object.values(UserRole);
  const [role, setRole] = useState<UserRole>(user.role);

  const form = useForm<FormData>({
    resolver: zodResolver(userRoleSchema),
    defaultValues: {
      role: user.role,
    },
  });

  const onSubmit = (data: z.infer<typeof userRoleSchema>) => {
    startTransition(async () => {
      try {
        const { status } = await updateUserRoleWithId(data);

        if (status !== 'success') {
          toast.error('Something went wrong.', {
            description: 'Your role was not updated. Please try again.',
          });
        } else {
          await update();
          setUpdated(false);
          toast.success('Your role has been updated.');
        }
      } catch (error) {
        toast.error('An unexpected error occurred.');
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <SectionColumns
          title='Your Role'
          description='Select the role what you want for test the app.'
        >
          <div className='flex w-full items-center gap-2'>
            <FormField
              control={form.control}
              name='role'
              render={({ field }) => (
                <FormItem className='w-full space-y-0'>
                  <FormLabel className='sr-only'>Role</FormLabel>
                  <Select
                    onValueChange={(value: UserRole) => {
                      setUpdated(user.role !== value);
                      setRole(value);
                      field.onChange(value);
                    }}
                    value={field.value}
                    defaultValue={user.role}
                  >
                    <FormControl>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Select a role' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roles.map((roleValue) => (
                        <SelectItem key={roleValue} value={roleValue}>
                          {userRoleLabels[roleValue]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type='submit'
              variant={updated ? 'default' : 'secondary'}
              disabled={isPending || !updated}
              className='w-[67px] shrink-0 px-0 sm:w-[130px]'
            >
              {isPending ? (
                <Icons.spinner className='size-4 animate-spin' />
              ) : (
                <p>
                  Save
                  <span className='hidden sm:inline-flex'>&nbsp;Changes</span>
                </p>
              )}
            </Button>
          </div>
          <div className='flex flex-col justify-between p-1'>
            <p className='text-[13px] text-muted-foreground'>
              Remove this field on real production
            </p>
          </div>
        </SectionColumns>
      </form>
    </Form>
  );
}
