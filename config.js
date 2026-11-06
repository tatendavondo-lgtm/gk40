/**
 * ==============================================================================
 * BIRTHDAY INVITATION CONFIGURATION
 * Personal details populated from the invitation card
 * ==============================================================================
 */

window.EVENT_CONFIG = {
  // HOST & EVENT DETAILS
  celebrantName: "GK",
  celebrantMonogram: "GK",
  eventTitle: "GK's 40th Birthday Dinner",
  tagline: "Good Food • Great Company • A Night to Remember",
  subMotto: "A Memorable Night — Life Begins at 40",
  
  // SURPRISE PARTY NOTICE
  isSurprise: true,
  surpriseNotice: "Surprise! Please don't tell the birthday boy.",

  // DATE & TIME
  eventDate: "2026-12-17T17:00:00",
  dateFormatted: "Thursday, 17 December 2026",
  timeFormatted: "5:00 PM – 10:00 PM",
  
  // VENUE DETAILS
  venueName: "Hyatt Regency Harare The Meikles",
  venueAddress: "Corner Jason Moyo Ave & Sam Nujoma St, Harare, Zimbabwe",
  googleMapsUrl: "https://maps.google.com/?q=Hyatt+Regency+Harare+The+Meikles",
  
  // DRESS CODE
  dressCode: "Black Tie",
  dressCodeDescription: "Tuxedos, Elegant Formal Gowns & Sophisticated Evening Wear",

  // RSVP HOST & CONTACT
  rsvpHost: "Sarah Mudzingwa",
  rsvpPhone: "077 307 2444",
  rsvpPhoneRaw: "+263773072444", // Zimbabwe country code for WhatsApp / Tel
  rsvpDeadline: "31 October 2026",

  // SUPABASE CONFIGURATION
  supabase: {
    url: "https://gokrqizuiikqxriymszs.supabase.co",
    anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdva3JxaXp1aWlrcXhyaXltc3pzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM5ODA4ODIsImV4cCI6MjEwOTU1Njg4Mn0.MEw7i3e7Hxgm9EsmyoZA3UPgjx35v99mR2eG3QyIFpA"
  },

  // ADMIN PASSCODE (To view submitted RSVPs directly on the site)
  adminPasscode: "gk40th",

  // SCHEDULE / ITINERARY
  itinerary: [
    { time: "05:00 PM", title: "Red Carpet Arrival & Welcome Drinks", desc: "Champagne, cocktails & live instrumental reception" },
    { time: "05:45 PM", title: "Be Seated for the Surprise Arrival", desc: "Gather inside the ballroom before GK arrives" },
    { time: "06:30 PM", title: "Gourmet 40th Birthday Dinner", desc: "Curated fine-dining experience at Hyatt Regency The Meikles" },
    { time: "08:00 PM", title: "Toasts, Speeches & Cake Cutting", desc: "Celebrating 40 remarkable years with champagne toast" },
    { time: "08:45 PM", title: "Music, Dancing & Celebration", desc: "A night to remember until 10:00 PM" }
  ]
};
