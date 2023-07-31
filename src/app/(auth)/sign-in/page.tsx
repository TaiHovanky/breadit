import SignIn from '@/components/SignIn';
import { buttonVariants } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { FC } from 'react'

const page: FC = ({}) => {
  return (
    <div className="absolute inset-0">
      <div className='h-full max-w-2xl mx-auto flex flex-col items-center justify-center gap-20'>
        {/* there should be a link in your login page to the home page for good UX */}
        <Link href='/' className={cn(buttonVariants({ variant: 'ghost'}), 'self-start -mt-20')}>
          <ChevronLeft className='mr-2 h-4 w-4' />
          Home
        </Link>
        <SignIn></SignIn>
      </div>
    </div>
  );
}

export default page;
/** all pages in the route folder in nextjs need to be named page.tsx. The (auth) for the folder
 * name makes it so that a route isn't created for auth. This is for organizational purpose
  */
