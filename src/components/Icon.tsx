export type IconName = "mail" | "phone" | "pin" | "linkedin" | "github" | "behance" | "arrow-up-right" | "download";

const paths: Record<IconName, React.ReactNode> = {
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </>
  ),
  phone: (
    <path d="M6.6 10.8a15.3 15.3 0 0 0 6.6 6.6l2.2-2.2a1.2 1.2 0 0 1 1.2-.3c1.3.4 2.7.7 4.1.7a1.2 1.2 0 0 1 1.2 1.2V21a1.2 1.2 0 0 1-1.2 1.2C10.8 22.2 1.8 13.2 1.8 2.4A1.2 1.2 0 0 1 3 1.2h4.2a1.2 1.2 0 0 1 1.2 1.2c0 1.4.2 2.8.7 4.1.1.4 0 .9-.3 1.2z" />
  ),
  pin: (
    <>
      <path d="M20 10.5c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10.5" r="2.5" />
    </>
  ),
  linkedin: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M7.5 10v6.5M7.5 7.2v.1M11.5 16.5V13c0-1.4.9-2.3 2.2-2.3s2.1.9 2.1 2.3v3.5" strokeLinecap="round" />
      <path d="M11.5 10v6.5" />
    </>
  ),
  github: (
    <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.3 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.75c0 .26.18.58.69.48A10 10 0 0 0 12 2Z" />
  ),
  behance: (
    <>
      <path d="M2.5 6.5h5.3c2.6 0 3.9 1.1 3.9 2.9 0 1.2-.6 2-1.7 2.5 1.5.4 2.3 1.4 2.3 2.9 0 2.1-1.6 3.2-4.3 3.2H2.5Zm3 6.7h2.1c1.1 0 1.7-.5 1.7-1.4s-.6-1.4-1.7-1.4H5.5Zm0 4.7h2.3c1.3 0 1.9-.5 1.9-1.5s-.7-1.5-1.9-1.5H5.5Z" />
      <path d="M14.3 8.5h5.6M13.9 14.3c0-2.5 1.6-4.2 3.9-4.2 2.5 0 3.8 1.7 3.8 4.3v.5h-6a1.9 1.9 0 0 0 2 1.9c.8 0 1.4-.3 1.7-.9h2.1c-.5 1.6-1.9 2.6-3.8 2.6-2.5 0-3.9-1.7-3.9-4.2Zm2.1-.9h3.7c-.1-1-.8-1.7-1.8-1.7s-1.7.6-1.9 1.7Z" />
    </>
  ),
  "arrow-up-right": <path d="M7 17 17 7M8 7h9v9" strokeLinecap="round" strokeLinejoin="round" />,
  download: (
    <path
      d="M12 3v12m0 0-4-4m4 4 4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
};

export function Icon({ name, className = "h-4 w-4" }: { name: IconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
