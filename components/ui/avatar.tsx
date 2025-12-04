'use client'

import * as React from 'react'
import * as AvatarPrimitive from '@radix-ui/react-avatar'

import { cn } from '@/lib/utils'

function Avatar({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        'relative flex size-8 shrink-0 overflow-hidden rounded-full',
        className,
      )}
      {...props}
    />
  )
}

function AvatarImage({
  className,
  fit = 'cover',
  position = 'center',
  zoom = 1,
  style,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image> & {
  fit?: 'cover' | 'contain' | 'fill'
  position?: 'center' | 'top' | 'bottom' | 'left' | 'right'
  zoom?: number
  style?: React.CSSProperties
}) {
  const pos = position === 'top'
    ? 'center top'
    : position === 'bottom'
      ? 'center bottom'
      : position === 'left'
        ? 'left center'
        : position === 'right'
          ? 'right center'
          : 'center'
  const mergedStyle: React.CSSProperties = {
    objectFit: fit,
    objectPosition: pos,
    transform: zoom !== 1 ? `scale(${zoom})` : undefined,
    transformOrigin: pos,
    ...style,
  }
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn('aspect-square size-full', className)}
      style={mergedStyle}
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        'bg-muted flex size-full items-center justify-center rounded-full',
        className,
      )}
      {...props}
    />
  )
}

export { Avatar, AvatarImage, AvatarFallback }
