import CoursesView from "@/components/Sections/CoursesView";

// src/components/Sections/Courses.jsx
export const metadata = {
  title: 'پارسا اسدزاده | دوره‌های آموزش برنامه‌نویسی',
  description:
    'دوره‌های آموزشی React.js، Next.js، TypeScript و CSS پیشرفته توسط پارسا اسدزاده — یادگیری عملی و حرفه‌ای فرانت‌اند',
  keywords: [
    'دوره React',
    'آموزش Next.js',
    'دوره TypeScript',
    'آموزش CSS',
    'دوره فرانت اند',
    'پارسا اسدزاده',
    'آموزش برنامه نویسی',
  ],
  openGraph: {
    title: 'دوره‌های آموزشی پارسا اسدزاده',
    description: 'یادگیری React، Next.js، TypeScript و CSS به شکل حرفه‌ای',
    url: 'https://parsaasadzadeh.ir/courses',
    images: [{ url: 'https://parsaasadzadeh.ir/icon.svg' }],
  },
};
export default function Courses() {
  return <CoursesView />;
}
