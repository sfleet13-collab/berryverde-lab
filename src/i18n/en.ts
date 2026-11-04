import type { Dictionary } from "./de";

const en: Dictionary = {
  meta: {
    title: "Susan App Starter – The foundation for fast, secure web apps",
    description:
      "A template for modern web apps: sign-in, database, roles, SEO and privacy are built in from day one. You only build what makes your app truly special.",
  },
  nav: {
    skip: "Skip to content",
    home: "Home",
    app: "My area",
    contact: "Contact",
    language: "Choose language",
    themeToLight: "Switch to light theme",
    themeToDark: "Switch to dark theme",
    menu: "Menu",
  },
  home: {
    title: "Your app doesn't start from zero.",
    lead: "Sign-in, database, roles, SEO and privacy are already in place. You only build what makes your app special.",
    ctaPrimary: "Open my area",
    ctaSecondary: "Get in touch",
    demo: {
      signIn: "Sign in",
      email: "lena@example.com",
      codeLabel: "Code from your email",
      signedIn: "Signed in",
      hello: "Hi Lena",
      entriesTitle: "My entries",
      entries: ["Quote for Café Moonlight", "October invoice", "Prepare client meeting"],
      role: "User",
    },
    featuresTitle: "Everything important is built in",
    auth: {
      title: "Sign-in with roles",
      text: "Sign in with an email code or Google. Everyone only sees their own data, admins see everything.",
      people: [
        { name: "Lena Meier", role: "Admin" },
        { name: "Tom Keller", role: "User" },
        { name: "Aylin Demir", role: "User" },
      ],
    },
    seo: {
      title: "Found on Google",
      text: "Clean headings, metadata, sitemap and preview images on every page.",
      serpQuery: "my app contact",
      serpUrl: "my-app.com › contact",
      serpTitle: "Contact | My App",
      serpText: "Send us a message. We'll get back to you as soon as possible.",
    },
    privacy: {
      title: "Privacy built in",
      text: "Tracking only with consent, legal pages prepared.",
      stats: [
        { value: "0", label: "cookies before consent" },
        { value: "0", label: "Google connections" },
      ],
    },
    lang: {
      title: "Bilingual",
      text: "German and English with a switch, including Swiss spelling.",
      de: "Deine App startet hier.",
      en: "Your app starts here.",
    },
    stepsTitle: "How a new app comes together",
    steps: [
      { title: "Copy the template", text: "One click on GitHub and the project is ready." },
      { title: "Apply the brand", text: "Change colours, fonts and copy in one place." },
      { title: "Build the feature", text: "Only what makes this app unique." },
      { title: "Check and launch", text: "Run the launch check, then go live." },
    ],
    ctaBandTitle: "Ready for the next app?",
    ctaBandText: "Tell me what your app should be able to do.",
  },
  app: {
    title: "My area",
    description: "Your personal area.",
    setupTitle: "Sign-in not set up yet",
    setupText:
      "As soon as NEON_AUTH_COOKIE_SECRET is set in the environment variables, this area is protected. Until then you see a preview here.",
    addLabel: "New idea",
    addPlaceholder: "Idea, e.g. booking app for photo shoots",
    noteLabel: "Details about the idea",
    notePlaceholder: "Details (optional): Who is it for? What should it do? What's annoying today?",
    add: "Save",
    saving: "Saving …",
    saved: "Saved ✓",
    errors: { empty: "Please write your idea first.", failed: "That didn't work. Please try again." },
    introTitle: "Your idea collection",
    introText:
      "Note every idea for an app or website here – on your phone, iPad or Mac, everything stays in sync. “To Claude” opens a chat with Claude with your idea already filled in. Once it's done, tick it off.",
    introAdmin: "As an admin you also see other users' ideas – with the sender.",
    introNote: "Only you have access. This page is private and not shown on Google.",
    count: "{open} open · {done} done",
    markDone: "Mark as done",
    markOpen: "Reopen",
    remove: "Delete",
    toClaude: "To Claude",
    toClaudeHint: "Opens Claude with this idea",
    claudePrompt:
      "I have an idea for an app or website and want to build it with my susan-app-starter template.\n\nIdea: {title}\n\nDetails: {note}\n\nPlease help me step by step: what is needed, how would you build it, and what is the first step?",
    noDetails: "(none yet)",
    from: "by",
    allItems: "All ideas",
    signedInAs: "Signed in as",
    dbMissing: "Database not connected yet. Add DATABASE_URL and your entries will appear here.",
    empty: "No ideas yet. Write your first one above – half a thought is enough.",
    itemsTitle: "My ideas",
    signIn: "Sign in",
    role: "Role",
    roles: { user: "User", admin: "Admin" },
  },
  auth: {
    title: "Sign in",
    description: "Sign in with a code sent to your email or with Google.",
    google: "Continue with Google",
    or: "or",
    email: "Email address",
    sendCode: "Send code",
    codeSent: "We sent a code to {email}.",
    code: "Code from the email",
    verify: "Sign in",
    resend: "Send a new code",
    otherEmail: "Use a different email",
    signOut: "Sign out",
    errors: {
      email: "Please enter a valid email address.",
      code: "The code is wrong or has expired.",
      send: "The code couldn't be sent. Please try again.",
      notAllowed: "This email address has no access.",
      config: "Sign-in isn't set up yet.",
      google: "Signing in with Google didn't work.",
    },
  },
  seo: {
    app: {
      title: "My ideas – collect, sort and build them",
      description:
        "Your private idea collection: note ideas for apps and websites, keep them at hand on every device and hand them to Claude for building with one click.",
    },
    auth: {
      title: "Sign in with an email code or Google",
      description:
        "Sign in without a password: we send you a one-time code by email, or you use your Google account. Fast, secure and done in just a few seconds, on any device.",
    },
    contact: {
      title: "Contact – send us your request today",
      description:
        "Have a question or a project in mind? Write to us using the contact form. We read every message personally and get back to you as quickly as we possibly can.",
    },
    imprint: {
      title: "Legal notice – provider information",
      description:
        "Legal notice with all required details about the provider: name, address, contact and responsible person. So you always know exactly who is behind this app.",
    },
    privacy: {
      title: "Privacy policy – how we handle your data",
      description:
        "Which data we store, what we use it for and which rights you have: our privacy policy explains it all clearly and simply, without legal jargon or fine print.",
    },
    terms: {
      title: "Terms – the terms and conditions of use",
      description:
        "The terms and conditions govern the use of this app: services, obligations, liability and termination. Clearly worded and available here for you at any time.",
    },
    notFound: {
      title: "Page not found – back to the homepage",
      description:
        "This page doesn't exist or no longer exists. The address may have changed. From the homepage you can quickly find everything you are looking for again.",
    },
  },
  contact: {
    title: "Contact",
    description: "Send us a message. We'll get back to you as soon as possible.",
    formTitle: "Your message",
    nextTitle: "What happens next",
    next: ["We read your message personally.", "You get a reply within two working days.", "We only use your details for your request."],
    name: "Name",
    email: "Email address",
    message: "Message",
    consent: "I agree that my details are stored to handle my request.",
    privacyLink: "Privacy policy",
    submit: "Send message",
    sending: "Sending …",
    success: "Thank you! Your message has arrived.",
    errors: {
      name: "Please enter your name.",
      email: "Please enter a valid email address.",
      message: "Please write a message (at least 10 characters).",
      consent: "Please confirm your consent.",
      generic: "Something went wrong. Please try again.",
    },
  },
  legal: {
    imprint: "Legal notice",
    privacy: "Privacy",
    terms: "Terms",
    placeholderTitle: "Placeholder",
    placeholderText:
      "This text must be replaced before going live. Create it with a generator or have it reviewed by a lawyer.",
  },
  consent: {
    title: "Cookies & privacy",
    text: "We only use cookies for statistics and advertising if you agree. Essential features work without cookies.",
    accept: "Accept all",
    decline: "Essential only",
    settings: "Cookie settings",
  },
  footer: {
    rights: "All rights reserved.",
  },
  notFound: {
    title: "Page not found",
    text: "This page doesn't exist or no longer exists.",
    back: "Back to home",
  },
  error: {
    title: "Something went wrong",
    text: "Please try again in a moment.",
    retry: "Try again",
  },
  loading: "Loading …",
};

export default en;
