import { BLOG_AUTHORS } from '../../config/blog';
import { getBlurDataURL } from '../../lib/utils';
import BlurImage from '@/components/shared/blur-image';
import Link from 'next/link';

// Create a type for the author usernames based on BLOG_AUTHORS keys
type AuthorUsername = keyof typeof BLOG_AUTHORS;

// Type for the author data structure
interface AuthorData {
  name: string;
  image: string;
  twitter: string;
}

// Props type definition
interface AuthorProps {
  username: AuthorUsername;
  imageOnly?: boolean;
}

export default async function Author({ username, imageOnly }: AuthorProps) {
  // Get the specific author data
  const author: AuthorData = BLOG_AUTHORS[username];

  // If imageOnly is true, render just the avatar
  if (imageOnly) {
    return (
      <BlurImage
        src={author.image}
        alt={author.name}
        width={32}
        height={32}
        priority
        placeholder='blur'
        blurDataURL={await getBlurDataURL(author.image)}
        className='size-8 rounded-full transition-all group-hover:brightness-90'
      />
    );
  }

  // Full author card with name and Twitter handle
  return (
    <Link
      href={`https://twitter.com/${author.twitter}`}
      className='group flex w-max items-center space-x-2.5'
      target='_blank'
      rel='noopener noreferrer'
      legacyBehavior
    >
      <BlurImage
        src={author.image}
        alt={author.name}
        width={40}
        height={40}
        priority
        placeholder='blur'
        blurDataURL={await getBlurDataURL(author.image)}
        className='size-8 rounded-full transition-all group-hover:brightness-90 md:size-10'
      />
      <div className='flex flex-col -space-y-0.5'>
        <p className='font-semibold text-foreground max-md:text-sm'>{author.name}</p>
        <p className='text-sm text-muted-foreground'>@{author.twitter}</p>
      </div>
    </Link>
  );
}
