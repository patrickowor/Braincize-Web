export const site = {
  name: "Braincize",
  description: "AI-powered brain atrophy detection from MRI scans.",
  contact: {
    supportEmail: "info@braincize.com",
    phone: "+1 (305) 604-453",
    email: "info@braincize.com",
  },
  social: {
    twitter: "#",
    facebook: "#",
  },
} as const;

export interface NavItem {
  label: string;
  href: string;
}

export const mainNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About us", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Research", href: "/research" },
];

export const footerColumns = {
  quickLinks: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Research", href: "/research" },
  ],
  legal: [
    { label: "Terms of service", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Research", href: "/research" },
  ],
} satisfies Record<string, NavItem[]>;

export const authLinks = {
  login: "/login",
  signup: "/signup",
} as const;
