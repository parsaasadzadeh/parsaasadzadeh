// src/app/sitemap.js
export default function sitemap() {
  return [
    {
      url: 'https://parsaasadzadeh.ir',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: 'https://parsaasadzadeh.ir/#about',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://parsaasadzadeh.ir/#projects',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: 'https://parsaasadzadeh.ir/#contact',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.6,
    },{
      url: 'https://parsaasadzadeh.ir/courses',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];
}