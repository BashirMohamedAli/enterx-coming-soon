import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteConfig = {
  name: "enterx",
  description: "EnterX is an AI-first technology company delivering intelligent software solutions that empower businesses, governments, and organizations globally.",
  url: "https://enterx.so",
  links: {
    twitter: "https://x.com/mrbashirx",
    github: "https://github.com/BashirMohamedAli",
    linkedin: "https://www.linkedin.com/in/mrbashirx/",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: siteConfig.name + " | AI-First Technology Solutions",
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "AI",
    "Artificial Intelligence",
    "Software Solutions",
    "Workflow Automation",
    "Technology LLC",
    "Intelligent Software",
    "EnterX",
    "enterx",
    "enterx.so",
    "enterx.com",
    "enterx.net",
    "enterx.org",
    "enterx.io",
    "enterx.tech",
    "enterx.ai",
    "enterx.solutions",
    "enterx.services",
    "enterx.products",
    "enterx.projects",
    "enterx.platforms",
    "enterx.systems",
    "enterx.networks",
    "enterx.organizations",
    "enterx.enterprises",
    "enterx.app",
    "enterx.xyz",
    "enterx.zone",
    "enterx.space",
    "enterx.club",
    "enterx.group",
    "enterx.team",
    "Government",
    "Government Solutions",
    "Government Technology",
    "Government Technology Solutions",
    "Government Technology Services",
    "Government Technology Products",
    "Government Technology Projects",
    "Government Technology Platforms",
    "Government Technology Systems",
    "Government Technology Networks",
    "Government Technology Organizations",
    "Government Technology Enterprises",
  ],
  authors: [
    {
      name: "Bashir Mohamed Ali",
      url: "https://github.com/BashirMohamedAli",
    },
  ],
  creator: "enterx",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(siteConfig.url),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    creator: "@mrbashirx",
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "yandex-verification-code",
    me: "your-email@example.com",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon0.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    title: siteConfig.name,
    statusBarStyle: "default",
    capable: true,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
      logo: `${siteConfig.url}/icon1.png`,
      description: siteConfig.description,
      sameAs: [
        siteConfig.links.twitter,
        siteConfig.links.github,
        siteConfig.links.linkedin,
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
      description: siteConfig.description,
      publisher: {
        "@type": "Organization",
        name: siteConfig.name,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: siteConfig.name,
      operatingSystem: "Web",
      applicationCategory: "BusinessApplication",
      description: "AI-first intelligent software solutions for businesses and organizations.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    },
  ];

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
