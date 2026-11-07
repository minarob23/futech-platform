import React, { useState, useEffect } from 'react';

export interface UserAvatarProps {
  src?: string | null;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  shape?: 'circle' | 'rounded';
  className?: string;
  indicator?: boolean;
  indicatorColor?: string;
}

export function UserAvatar({
  src,
  name = '',
  size = 'sm',
  shape = 'circle',
  className = '',
  indicator = false,
  indicatorColor = 'bg-emerald-500',
}: UserAvatarProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [activeSrc, setActiveSrc] = useState<string | null>(src || null);

  useEffect(() => {
    setActiveSrc(src || null);
    setImageLoaded(false);
    setHasError(false);
  }, [src]);

  // Check if activeSrc is potentially a valid URL format
  const isCandidateUrl = Boolean(
    activeSrc &&
      typeof activeSrc === 'string' &&
      activeSrc.trim() !== '' &&
      (activeSrc.startsWith('data:image') ||
        activeSrc.startsWith('blob:') ||
        activeSrc.startsWith('/') ||
        activeSrc.startsWith('http://') ||
        activeSrc.startsWith('https://'))
  );

  // Preload image in memory with no-referrer to prevent Google CDN 403 Forbidden errors
  useEffect(() => {
    setImageLoaded(false);
    setHasError(false);

    if (!isCandidateUrl || !activeSrc) {
      return;
    }

    let isMounted = true;
    const img = new Image();
    img.referrerPolicy = 'no-referrer';
    img.crossOrigin = 'anonymous';
    img.src = activeSrc;

    img.onload = () => {
      if (isMounted) {
        setImageLoaded(true);
        setHasError(false);
      }
    };

    img.onerror = () => {
      if (isMounted) {
        // If Google CDN failed or was blocked, attempt local mirror of owner Google photo
        if (activeSrc && activeSrc.includes('googleusercontent.com')) {
          setActiveSrc('/images/owner-google-avatar.png');
        } else {
          setImageLoaded(false);
          setHasError(true);
        }
      }
    };

    return () => {
      isMounted = false;
      img.onload = null;
      img.onerror = null;
    };
  }, [activeSrc, isCandidateUrl]);

  // Size configurations
  const sizeClasses = {
    xs: 'h-6 w-6 text-[10px]',
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-14 w-14 text-xl',
    xl: 'h-20 w-20 text-2xl',
  };

  const roundedClasses = shape === 'circle' ? 'rounded-full' : 'rounded-2xl';
  const currentSizeClass = sizeClasses[size] || sizeClasses.sm;

  // Extract initial letter (prefer first Arabic / Latin letter)
  const cleanName = name ? name.trim() : '';
  const initial = cleanName ? cleanName.charAt(0).toUpperCase() : 'ف';

  return (
    <div
      className={`relative inline-flex shrink-0 select-none items-center justify-center ${className}`}
      aria-label={cleanName || 'صورة الحساب'}
    >
      {imageLoaded && !hasError && activeSrc ? (
        <img
          src={activeSrc}
          alt={cleanName || 'الصورة الشخصية'}
          role="presentation"
          loading="lazy"
          referrerPolicy="no-referrer"
          crossOrigin="anonymous"
          onError={() => {
            if (activeSrc && activeSrc.includes('googleusercontent.com')) {
              setActiveSrc('/images/owner-google-avatar.png');
            } else {
              setImageLoaded(false);
              setHasError(true);
            }
          }}
          className={`${currentSizeClass} ${roundedClasses} object-cover ring-1 ring-[#2798a0]/40 shadow-xs`}
        />
      ) : (
        <div
          className={`grid ${currentSizeClass} ${roundedClasses} place-items-center bg-gradient-to-br from-[#122438] via-[#1a385c] to-[#208f97] font-black text-white ring-1 ring-[#2798a0]/40 shadow-xs`}
        >
          <span>{initial}</span>
        </div>
      )}

      {indicator && (
        <span
          className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ${indicatorColor} ring-2 ring-white dark:ring-[#0c1524]`}
        />
      )}
    </div>
  );
}
