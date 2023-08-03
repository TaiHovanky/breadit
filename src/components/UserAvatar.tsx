import { User } from '@prisma/client'
import { AvatarProps } from '@radix-ui/react-avatar'

import { Icons } from '@/components/Icons'
import { Avatar, AvatarFallback } from '@/components/ui/Avatar'
import Image from 'next/image'

interface UserAvatarProps extends AvatarProps {
  user: Pick<User, 'image' | 'name'>
}

export function UserAvatar({ user, ...props }: UserAvatarProps) {
  return (
    <Avatar {...props}>
      {user.image ? (
        <div className='relative aspect-square h-full w-full'>
          <Image
            fill
            src={user.image} // using the image from the user's Google profile
            alt='profile picture'
            referrerPolicy='no-referrer' // needed because google gives errors without referrerpolicy
          />
        </div>
      ) : (
        <AvatarFallback>
          {/* class sr-only is for screenreaders as an accessibility piece */}
          <span className='sr-only'>{user?.name}</span>
          <Icons.user className='h-4 w-4' />
        </AvatarFallback>
      )}
    </Avatar>
  )
}