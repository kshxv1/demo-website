const business = {
  name: "Verdant Home Care",
  wordmark: "Verdant",
  tagline: "Residential and commercial cleaning.",
  hero: {
    headline: "Your home,\ntaken care of.",
    lead: "Careful, consistent cleaning for households and small offices across the {{area}}. Written estimates, a crew that learns your space, no upsells during the job."
  },
  phone: "+1 (555) 012-3456",
  email: "hello@verdanthomecare.example",
  serviceArea: {
    headline: "Where we work",
    intro: "We serve homes and small offices across the greater Portland metro area.",
    locations: [
      "Portland — Southeast & Inner Neighborhoods",
      "Beaverton",
      "Lake Oswego",
      "Tigard",
      "Milwaukie",
      "Oregon City"
    ],
    zipCodes: ["97202", "97206", "97214", "97215", "97219", "97223", "97005", "97006", "97035", "97068"]
  },
  hours: [
    { day: "Monday – Friday", time: "7:00 AM – 6:00 PM" },
    { day: "Saturday", time: "8:00 AM – 4:00 PM" },
    { day: "Sunday", time: "Closed" }
  ],
  social: [],
  brand: {
    bg: "#FAF9F6",
    surface: "#FFFFFF",
    fg: "#1E2320",
    muted: "#6B7370",
    border: "#E3E1DB",
    accent: "#245744",
    accentOn: "#FFFFFF"
  },
  images: {
    hero: "assets/images/hero.webp",
    about: "assets/images/about.webp",
    services: [
      "assets/images/service-regular.webp",
      "assets/images/service-deep.webp",
      "assets/images/service-move.webp",
      "assets/images/service-commercial.webp"
    ]
  },
  testimonials: [],
  services: [
    {
      id: "regular-home-cleaning",
      name: "Regular Home Cleaning",
      description: "Weekly or bi-weekly upkeep for kitchens, bathrooms, floors, and living areas. Consistent checklist, no surprises.",
      startingFrom: "$120 / visit",
      imageIndex: 0
    },
    {
      id: "deep-cleaning",
      name: "Deep Cleaning",
      description: "Seasonal reset inside cabinets, behind appliances, grout, baseboards, and window tracks. Built for homes that need a thorough top-to-bottom pass.",
      startingFrom: "$240 / session",
      imageIndex: 1
    },
    {
      id: "move-in-out",
      name: "Move-In / Move-Out",
      description: "Empty-home clean done to landlord standards so deposits come back whole. Includes appliance interiors, closets, and all fixtures.",
      startingFrom: "$180 / home",
      imageIndex: 2
    },
    {
      id: "commercial-cleaning",
      name: "Commercial Cleaning",
      description: "Offices, studios, and retail spaces on a scheduled basis. After-hours availability, floor care, restroom sanitation, and trash recycling included.",
      startingFrom: "$150 / visit",
      imageIndex: 3
    }
  ],
  whyUs: [
    { title: "Straightforward estimates", body: "You get a written quote before anyone shows up. No pressure, no upsells during the visit." },
    { title: "Same crew, every time", body: "Recurring clients keep the same team. They learn your home, your preferences, and what you'd rather we skip." },
    { title: "Local, not a franchise", body: "We live and work in the neighborhoods we serve. When you call, a person picks up." },
    { title: "Flexible scheduling", body: "Evenings and Saturdays available. Reschedule with 24 hours' notice at no charge." }
  ],
  howItWorks: [
    { step: "01", title: "Request a quote", body: "Tell us about your space through the form below or by phone. We reply within one business day." },
    { step: "02", title: "Confirm details", body: "A short conversation about access, pets, priorities, and timing. You approve the estimate before anything is booked." },
    { step: "03", title: "We arrive on schedule", body: "Your crew shows up with their own supplies. Recurring visits follow the same checklist every time." }
  ],
  ctas: {
    primary: "Request a Quote",
    secondary: "Call Us Now"
  },
  formHandlerUrl: null
};