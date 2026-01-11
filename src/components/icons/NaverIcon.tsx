import * as React from 'react';

export const NaverIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width={(props.width as number) ?? 56}
    height={(props.height as number) ?? 56}
    viewBox="0 0 56 56"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-labelledby="naverTitle"
    {...props}
  >
    <title id="naverTitle">Naver</title>
    <circle cx="28" cy="28" r="28" fill="#03C75A" />
    <path
      fill="#ffffff"
      d="M18.5 39V17h5.2l6.9 11.1V17h5.2v22h-5.2l-6.9-11.1V39h-5.2z"
      transform="translate(28,28) scale(1,0.8) translate(-28,-28)"
    />
  </svg>
);

export default NaverIcon;
