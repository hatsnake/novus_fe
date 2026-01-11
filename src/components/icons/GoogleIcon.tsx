import * as React from 'react';

export const GoogleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width={(props.width as number) ?? 56}
    height={(props.height as number) ?? 56}
    viewBox="0 0 56 56"
    xmlns="http://www.w3.org/2000/svg"
    aria-labelledby="googleTitle"
    fill="none"
    {...props}
  >
    <title id="googleTitle">Google</title>
    <path fillRule="evenodd" clipRule="evenodd" d="M22.0242 28.003C22.0242 27.321 22.1374 26.6671 22.3397 26.0538L18.8009 23.3516C18.1112 24.7518 17.7227 26.3298 17.7227 28.003C17.7227 29.6749 18.1108 31.2517 18.7994 32.6512L22.3363 29.9437C22.1359 29.3332 22.0242 28.6817 22.0242 28.003Z" fill="#FBBC05" />
    <path fillRule="evenodd" clipRule="evenodd" d="M28.2414 21.7954C29.7231 21.7954 31.0613 22.3204 32.1128 23.1794L35.1716 20.125C33.3077 18.5022 30.9179 17.5 28.2414 17.5C24.086 17.5 20.5147 19.8763 18.8047 23.3484L22.3434 26.0507C23.1587 23.5756 25.483 21.7954 28.2414 21.7954Z" fill="#EA4335" />
    <path fillRule="evenodd" clipRule="evenodd" d="M28.2414 34.2005C25.4832 34.2005 23.1589 32.4203 22.3435 29.9453L18.8047 32.6471C20.5147 36.1197 24.086 38.496 28.2414 38.496C30.806 38.496 33.2547 37.5853 35.0923 35.879L31.7333 33.2823C30.7855 33.8793 29.592 34.2005 28.2414 34.2005Z" fill="#34A853" />
    <path fillRule="evenodd" clipRule="evenodd" d="M38.2732 28.0028C38.2732 27.3823 38.1775 26.7141 38.0341 26.0938H28.2363V30.1505H33.8761C33.5941 31.5337 32.8266 32.5969 31.7282 33.2889L35.0872 35.8857C37.0176 34.0942 38.2732 31.4252 38.2732 28.0028Z" fill="#4285F4" />
    <circle cx="28" cy="28" r="27.5" stroke="#DCE0E5" />
  </svg>
);

export default GoogleIcon;
