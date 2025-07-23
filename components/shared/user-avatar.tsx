import { User } from '@/lib/types';
import { AvatarProps } from '@radix-ui/react-avatar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Icons } from '@/components/shared/icons';

interface UserAvatarProps extends AvatarProps {
  user: {
    name: string;
    image?: string | null;
  };
  fallbackIcon?: React.ReactNode;
}

export function UserAvatar({
  user,
  fallbackIcon = <Icons.user className='size-4' />,
  ...props
}: UserAvatarProps) {
  // Normalize image source - handle undefined/null/empty strings
  const imageSrc = user.image?.trim() || undefined;

  return (
    <Avatar {...props}>
      {imageSrc ? (
        <AvatarImage
          alt={`${user.name}'s profile picture`}
          src={imageSrc}
          referrerPolicy='no-referrer'
          onError={(e) => {
            // Fallback if image fails to load
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
      ) : (
        <AvatarFallback>
          <span className='sr-only'>{user.name}</span>
          {fallbackIcon}
        </AvatarFallback>
      )}
    </Avatar>
  );
}
