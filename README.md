# 👑 GK's 40th Birthday Dinner — Luxury Invitation & Supabase RSVP

An exclusive, high-end Black & Gold digital invitation for **GK's 40th Birthday Dinner** at **Hyatt Regency Harare The Meikles**, complete with an interactive 3D wax-seal envelope ceremony, surprise party banner, live countdown, and direct **Supabase-powered RSVP database**.

---

## 📋 Event Information Configured

- **Celebrant**: GK (40th Birthday Dinner)
- **Tagline**: *Good Food • Great Company • A Night to Remember*
- **Motto**: *A Memorable Night — Life Begins at 40*
- **Surprise Party**: 🎁 *Please don't tell the birthday boy!*
- **Date**: Thursday, 17 December 2026
- **Time**: 5:00 PM – 10:00 PM
- **Venue**: Hyatt Regency Harare The Meikles (Harare, Zimbabwe)
- **Dress Code**: Black Tie (Tuxedos & Formal Evening Gowns)
- **RSVP Contact**: Sarah Mudzingwa (`077 307 2444`) with direct WhatsApp & Phone links
- **RSVP Deadline**: 31 October 2026
- **Host Dashboard Passcode**: `gk40th` (unlocks the guest list & stats)

---

## ✨ Interactive Features

- **Wax-Seal Opening**: Guests tap the gold `GK` seal to break open the envelope with sound and gold confetti.
- **Surprise Banner**: Prominent gold-accented reminder that this is a surprise party.
- **Calendar & Directions**:
  - One-click **+ Google Calendar** link with pre-filled details.
  - Downloadable **Apple / iCal `.ics`** event file.
  - Direct **View on Map** button for Hyatt Regency Harare The Meikles.
- **RSVP Submission**:
  - Direct submission into your Supabase `rsvps` table (attendance, headcount, companion name, dietary requirements, song request, and personal birthday message).
  - WhatsApp quick-link directly to Sarah Mudzingwa.
- **Host Dashboard Secret Trigger**: Click the **Royal Crown** at the top of the card and enter passcode `gk40th` to unlock real-time headcount and download the attendee CSV spreadsheet.
- **Clean RSVP Form**: Streamlined to Full Name, Phone/WhatsApp, Email, Party Size (+1 companion name), and a Birthday Wish for GK.

---

## 🗄️ Supabase Setup (2 Minutes)

1. Open your [Supabase Dashboard](https://supabase.com/dashboard).
2. Go to **SQL Editor** -> **New query**, paste the contents of [`supabase_setup.sql`](file:///c:/Users/HomePC/Downloads/Birthday%20card/supabase_setup.sql), and click **Run**.
3. In **Project Settings** -> **API**, copy your **Project URL** and **`anon` public key**.
4. Paste them into [`config.js`](file:///c:/Users/HomePC/Downloads/Birthday%20card/config.js):

```javascript
supabase: {
  url: "https://your-project-id.supabase.co",
  anonKey: "eyJhbGciOi..."
}
```

*Note: Before adding Supabase keys, the invitation runs in preview mode and stores submissions locally in your browser so you can test it immediately!*
