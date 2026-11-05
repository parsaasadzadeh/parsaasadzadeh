// English strings — keep keys identical to fa.js
const en = {
  code: "en",
  dir: "ltr",
  numberLocale: "en-US",

  meta: {
    homeTitle: "Parsa Asadzadeh | Full-Stack Developer & Web Designer",
    homeDesc:
      "I'm Parsa Asadzadeh, a full-stack developer. Browse my portfolio, skills, web design services and programming courses.",
    coursesTitle: "Parsa Asadzadeh | Programming Courses",
    coursesDesc:
      "Courses on React.js, Next.js, TypeScript and advanced CSS by Parsa Asadzadeh — practical, professional front-end learning.",
  },

  header: {
    switchToEnglish: "Switch to English",
    switchToPersian: "Switch to Persian",
    english: "English",
    persian: "فارسی",
    logoLabel: "Parsa logo",
    toggleTheme: "Toggle theme",
  },

  nav: {
    main: "Main navigation",
    mobile: "Mobile navigation",
    home: "Home",
    about: "About",
    projects: "Projects",
    contact: "Contact",
  },

  social: {
    instagram: "Instagram",
    github: "GitHub",
    telegram: "Telegram",
    linkedin: "LinkedIn",
  },

  footer: { credit: "Designed by Parsa Asadzadeh" },

  hero: {
    label: "Introduction",
    role: "FullStack Developer",
    name: "Parsa Asadzadeh",
    desc:
      "Front-end developer specializing in React and Next.js — I build user interfaces that are fast, beautiful and professional.",
    available: "Available for work",
    location: "Iran — Urmia",
    resume: "Download résumé",
    courses: "Courses",
    order: "Order a website",
  },

  about: {
    title: "About me",
    text:
      "Hi, I'm Parsa Asadzadeh. I'm a website and application developer with more than 3 years of experience. I hope we can take big steps toward success together.",
    close: "Close",
    readMore: "Read more",
    specialty: "Specialty",
    specialtyValue: "FullStack Developer",
    experience: "Experience",
    experienceValue: "3+ Years",
    skillsLabel: "Tools & Technologies",
  },

  projects: {
    label: "Projects",
    title: "Portfolio",
    subtitle: "A collection of projects I've worked on",
    view: "View project",
    items: [
      { title: "Blog Website", category: "Blog", description: "A blog website for sharing articles." },
      { title: "Educational Website", category: "Education", description: "An educational website with an advanced system for managing users, videos and subscriptions." },
      { title: "Voxez | Icon Library", category: "Tool", description: "An icon library for front-end developers, making it easy to use icons in any project." },
      { title: "Online Store Website", category: "E-commerce", description: "An advanced online store with management of user addresses and products." },
      { title: "Sablo Personal Finance App", category: "Personal Accounting", description: "A website and application for personal finance management." },
      { title: "Cafe Management Web App", category: "Management", description: "A website and application for managing cafes." },
    ],
  },

  contact: {
    title: "Let's build together!",
    line1: "Need a professional, fast website?",
    line2: "Or want to talk through an idea?",
    accent: "I'm available.",
    email: "Email",
    phone: "Phone",
  },

  courses: {
    title: "Courses",
    view: "View course",
    items: [
      { tags: ["Intermediate", "Web"], title: "HTML Course", desc: "Learn the structure of web pages from scratch with HTML5", hours: "" },
      { tags: ["Popular", "Front-end"], title: "JavaScript Course", desc: "JavaScript programming from beginner to advanced", hours: "In progress" },
      { tags: ["CSS", "Layout"], title: "Flexbox Course", desc: "Master Flexbox for professional layouts", hours: "3 hours" },
    ],
  },

  notFound: {
    eyebrow: "Error 404",
    title: "Page not found",
    text: "The page you're looking for doesn't exist or has been removed. Head back home or check out my portfolio.",
    home: "Back to home",
    projects: "Portfolio",
  },

  order: {
    eyebrow: "Website Design Order",
    title: "Order a Website",
    intro: "A few short questions so I can understand your project and give you a real proposal.",
    stats: [
      { icon: "fa-clock", value: "+50", label: "Projects delivered" },
      { icon: "fa-star", value: "4.9", label: "Client rating" },
      { icon: "fa-bolt", value: "48h", label: "First response" },
    ],
    steps: ["Project type", "Features", "Budget & timeline", "Details", "Contact"],

    siteTypes: {
      landing: { label: "Landing page", desc: "Single-page intro to a product or service" },
      portfolio: { label: "Portfolio", desc: "Showcase your work and skills" },
      store: { label: "Online store", desc: "Sell products with a shopping cart" },
      corporate: { label: "Corporate site", desc: "A complete introduction to your business" },
      blog: { label: "Blog / Magazine", desc: "Publish content and articles" },
      webapp: { label: "Web application", desc: "A complex system with a dashboard" },
    },
    features: {
      auth: "Login / Sign-up",
      panel: "Admin panel",
      payment: "Payment gateway",
      seo: "Advanced SEO",
      blog_f: "Blog system",
      chat: "Live chat",
      map: "Map / Location",
      api: "External API integration",
      multi: "Multilingual",
      pwa: "PWA / Offline",
    },
    budgets: {
      b1: { label: "Under 5M", sub: "Light projects" },
      b2: { label: "5M – 15M", sub: "Medium projects" },
      b3: { label: "15M – 40M", sub: "Complex projects" },
      b4: { label: "Over 40M", sub: "Enterprise systems" },
    },
    deadlines: {
      d1: { label: "Urgent", sub: "Under 2 weeks" },
      d2: { label: "Normal", sub: "1 to 2 months" },
      d3: { label: "No rush", sub: "More than 2 months" },
    },

    q1Title: "What kind of website do you need?",
    q1Hint: "Choose one",
    q2Title: "Which features do you need?",
    q2Hint: "Select as many as you like (optional)",
    featuresSelected: (n) => `${n} feature${n === 1 ? "" : "s"} selected`,
    q3BudgetTitle: "What's your budget?",
    q3BudgetHint: "In Toman (M = million)",
    q3DeadlineTitle: "Expected timeline?",
    q3DeadlineHint: "How much time do you have?",
    q4Title: "Describe your project",
    q4Hint: "Anything you think matters — the site's goal, audience, competitors, ideas",
    descPlaceholder:
      "e.g. I want a store for selling handmade products. My customers are women aged 25 to 45. I'd like the site to feel warm and cozy...",
    charCount: (n) => `${n} character${n === 1 ? "" : "s"}`,
    charsMissing: (n) => `(at least ${n} more)`,
    refLabel: "Reference or example website (optional)",
    q5Title: "Share your contact info",
    q5Hint: "Parsa will get in touch — your information is never sold or shared",
    nameLabel: "What's your name?",
    namePh: "e.g. John Smith",
    contactLabel: "Phone number or Telegram ID",
    contactPh: "e.g. @username or +98 912...",
    summary: "Order summary",
    sumType: "Type",
    sumFeatures: "Features",
    sumBudget: "Budget",
    sumDeadline: "Timeline",
    sumNoFeatures: "No special features",
    sumItems: (n) => `${n} item${n === 1 ? "" : "s"}`,
    next: "Next step",
    prev: "Back",
    submit: "Submit order",
    sending: "Sending...",
    submitError: "Failed to submit the order",

    doneTitle: "Order submitted!",
    doneText1: "Parsa will contact you as soon as possible.",
    doneText2a: "You'll usually get a reply within",
    doneText2b: "24 hours",
    doneText2c: ".",
    doneHome: "Back to home",
  },

  sign: {
    title: "Contract Signature",
    subtitle: "Parsa Asadzadeh – Web Design",
    loading: "Loading...",
    invalidTitle: "Invalid link",
    invalidLink: "The signing link is not valid.",
    serverError: "Server error",
    submitError: "Failed to submit the signature",
    contractInfo: "Contract details",
    client: "Client",
    siteType: "Website type",
    price: "Agreed price",
    currency: "Toman",
    deadline: "Timeline",
    agree: "By signing this contract, you confirm that you agree to all of its terms and conditions.",
    continue: "I've read it — continue to sign →",
    drawHere: "Draw your signature in the box below",
    signHere: "✍ Sign here",
    clear: "Clear",
    confirm: "Confirm and submit signature ✓",
    saving: "Submitting...",
    doneTitle: "Signature submitted!",
    doneText1: "We've received your signature.",
    doneText2: "The contract will be issued after final approval.",
  },
};

export default en;
