'use client';

import Image from 'next/image';

const Logo = ({w,h}) => {
  return (
    <img src="/logo.png" alt="logo" width={w} height={h} />
  )
}

export default Logo;