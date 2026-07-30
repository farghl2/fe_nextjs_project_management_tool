'use client';

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/src/shared/components/ui/avatar';
import { cn } from '@/src/lib/utils';

export function resolveUserAvatar(userOrImage?: any): string | null {
  if (!userOrImage) return null;

  const raw =
    typeof userOrImage === 'string'
      ? userOrImage
      : userOrImage.image ||
        userOrImage.avatar ||
        userOrImage.avatarUrl ||
        userOrImage.userImage ||
        userOrImage.profileImage ||
        userOrImage.picture ||
        null;

  if (!raw || typeof raw !== 'string') return null;

  const trimmed = raw.trim();
  if (!trimmed) return null;

  // Unsplash web page URL transformer (e.g. https://unsplash.com/photos/some-title-jOSpWMCtGR8 -> https://images.unsplash.com/photo-jOSpWMCtGR8)
  const unsplashMatch = trimmed.match(/^https?:\/\/(?:www\.)?unsplash\.com\/photos\/(?:.*[-/])?([a-zA-Z0-9_-]{8,})\/?$/);
  if (unsplashMatch && unsplashMatch[1]) {
    const photoId = unsplashMatch[1];
    return `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&w=256&q=80`;
  }

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:')) {
    return trimmed;
  }

  // Relative path (e.g. /uploads/avatar.jpg)
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const baseUrl = apiBase.replace(/\/api\/?$/, '');
  return `${baseUrl}${trimmed.startsWith('/') ? '' : '/'}${trimmed}`;
}

interface UserAvatarProps {
  name?: string;
  image?: string | null;
  user?: any;
  className?: string;
  sizeClassName?: string;
}

export function UserAvatar({
  name,
  image,
  user,
  className,
  sizeClassName = 'h-9 w-9',
}: UserAvatarProps) {
  const resolvedName = name || user?.name || user?.userName || '';
  const resolvedImage = resolveUserAvatar(image || user);

  const getInitials = (strName?: string) => {
    if (!strName) return 'U';
    const parts = strName.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return strName.slice(0, 2).toUpperCase();
  };

  return (
    <Avatar className={cn(sizeClassName, 'border border-border/50 shadow-2xs shrink-0', className)}>
      {resolvedImage && <AvatarImage src={resolvedImage} alt={resolvedName || 'User avatar'} />}
      <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
        {getInitials(resolvedName)}
      </AvatarFallback>
    </Avatar>
  );
}
