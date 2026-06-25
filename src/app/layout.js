
import Footer from "@/components/Layouts/Footer";
import "./globals.css";
import NavHighlight from "@/components/NavHighlight";
import CustomCursor from "@/components/CustomCursor";


import "@fortawesome/fontawesome-free/css/all.min.css";
import Header from "@/components/Layouts/Header";
import NavSite from "@/components/ui/NavSite";
import SocialSidebar from "@/components/ui/SocialSidebar";
import AosProvider from "@/components/providers/AosProvider";
import AosInit from "@/components/providers/AosProvider";



export const metadata = {
  title: "پارسا اسدزاده | برنامه‌نویس فول‌استک طراحی سایت   ",
  description:
    "من پارسا اسدزاده، برنامه‌نویس فول‌استک هستم . در این سایت نمونه‌کارها، مهارت‌ها و خدمات طراحی سایت و آموزش برنامه‌نویسی را ببینید.",
  metadataBase: new URL("https://parsaasadzadeh.ir"),
  alternates: {
    canonical: "https://parsaasadzadeh.ir",
  },
  keywords: [
    "پارسا اسدزاده",
    "برنامه نویس",
    "فول استک",
    "طراح سایت",
    "آموزش برنامه نویسی",
    "فرانت اند",
    "طراحی وب",
    "نمونه کار برنامه نویسی",
  ],
  authors: [
    {
      name: "پارسا اسدزاده",
      url: "https://parsaasadzadeh.ir",
    },
  ],

  openGraph: {
    title: "پارسا اسدزاده - برنامه‌نویس فول‌استک طراحی سایت ",
    description:
      "طراحی سایت، توسعه وب و آموزش برنامه‌نویسی توسط پارسا اسدزاده.",
    url: "https://parsaasadzadeh.ir",
    siteName: "پارسا اسدزاده",
    type: "profile",
    locale: "fa_IR",
    images: [
      {
        url: "https://parsaasadzadeh.ir/parsaasad.jpg",
        width: 1200,
        height: 630,
        alt: "پارسا اسدزاده - برنامه نویس",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "پارسا اسدزاده - برنامه‌نویس  طراحی سایت    ",
    description:
      "مشاهده نمونه‌کارها و خدمات طراحی سایت و آموزش برنامه‌نویسی.",
    images: ["https://parsaasadzadeh.ir/parsaasad.jpg"],
  },

  icons: {
    icon: "/icon.svg",
  },

  other: {
    "instagram:username": "parsa.asadzadeh",
    "instagram:url": "https://www.instagram.com/parsa.asadzadeh",
  },
};


export default function RootLayout({ children }) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`h-full antialiased`}
    >
      <head>
        <meta name="google-site-verification" content="RYln8ZjWFySIUm7lOuwQD3G5CejItyIGW8JzFIK6DkY" />
      </head>
      <body className="min-h-full flex flex-col">
    
    <AosInit/>
        <CustomCursor/>
        <NavHighlight/>
        <SocialSidebar/>

        <NavSite />
        <Header/>
        {children}
        <Footer/>
        
        </body>
    </html>
  );
}
