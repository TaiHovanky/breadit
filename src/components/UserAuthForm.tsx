'use client'

import { cn } from '@/lib/utils';
import { signIn } from 'next-auth/react';
/* Because this component involves client interactivity, we "use client". This is because user does
something on this component and it updates state */
import React, { FC } from 'react'
import { Button } from './ui/Button';
import { Icons } from './Icons';
import { toast } from '@/hooks/use-toast';

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {} // key typescript concept of extension

const UserAuthForm: FC<UserAuthFormProps> = ({ className, ...props }) => {

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const loginWithGoogle = async () => {
    setIsLoading(true);
  
    try {
      await signIn('google'); // Comes from nextjs
      // throw new Error();
    } catch(error) {
      toast({
        title: 'Error',
        description: 'There was an error logging in with Google',
        variant: 'destructive',
      });
    } finally { // note the Finally as a way to have code after a try/catch block
      setIsLoading(false);
    }
  }

  return (
    <div className={cn('flex justify-center', className)} {...props}>
      <Button
        isLoading={isLoading}
        type='button'
        size='sm'
        className='w-full'
        onClick={loginWithGoogle}
        disabled={isLoading}>
        {isLoading ? null : <Icons.google className='h-4 w-4 mr-2' />}
        Google
      </Button>
    </div>
  );
}

export default UserAuthForm