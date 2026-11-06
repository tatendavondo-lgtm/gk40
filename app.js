/**
 * ==============================================================================
 * BIRTHDAY INVITATION APPLICATION ENGINE
 * Handles: Envelope opening, Supabase RSVP, Countdown, Audio, Admin Dashboard
 * ==============================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  const config = window.EVENT_CONFIG || {};

  // 1. POPULATE DYNAMIC CONFIGURATION
  populateEventDetails(config);

  // 2. INITIALIZE COUNTDOWN TIMER
  initCountdown(config.eventDate);

  // 3. INITIALIZE INTERACTIVE ENVELOPE / WAX SEAL
  initEnvelopeExperience();

  // 4. INITIALIZE CALENDAR INTEGRATIONS
  setupCalendarLinks(config);

  // 5. INITIALIZE SUPABASE CLIENT
  const supabaseClient = initSupabase(config.supabase);

  // 6. INITIALIZE RSVP FORM HANDLER
  setupRsvpForm(supabaseClient);

  // 7. INITIALIZE ADMIN / HOST DASHBOARD
  setupAdminDashboard(supabaseClient, config.adminPasscode);

  // 8. INTERACTIVE AMBIENT SOUND & MOUSE GLOW
  setupMouseGlow();
});

/**
 * Populate DOM with details from config.js
 */
function populateEventDetails(config) {
  // Envelope
  if (config.eventTitle) {
    const el = document.getElementById("envelopeCelebrant");
    if (el) el.textContent = config.eventTitle;
  }
  
  // Monogram seal (e.g. "GK")
  const monogramEl = document.getElementById("sealMonogram");
  if (monogramEl) {
    monogramEl.textContent = config.celebrantMonogram || "GK";
  }

  // Hero
  setText("cardCelebrantName", config.celebrantName ? `${config.celebrantName}'s 40th` : "GK's 40th");
  setText("cardEventTitle", "Birthday Dinner");
  setText("cardTagline", config.tagline);
  setText("cardSubMotto", config.subMotto);

  // Surprise Banner
  const surpriseCard = document.getElementById("surpriseCard");
  if (surpriseCard && config.isSurprise === false) {
    surpriseCard.style.display = "none";
  }

  // Details
  setText("cardDateFormatted", config.dateFormatted);
  setText("cardTimeFormatted", config.timeFormatted);
  setText("cardVenueName", config.venueName);
  setText("cardVenueAddress", config.venueAddress);
  setText("cardDressCode", config.dressCode);
  setText("cardDressCodeDesc", config.dressCodeDescription);
  setText("cardRsvpDeadline", config.rsvpDeadline);

  // Host Details (Sarah Mudzingwa)
  setText("rsvpHostName", config.rsvpHost);
  const phoneLink = document.getElementById("rsvpPhoneLink");
  if (phoneLink && config.rsvpPhone) {
    phoneLink.textContent = `📞 ${config.rsvpPhone}`;
    phoneLink.href = `tel:${config.rsvpPhone.replace(/\s+/g, '')}`;
  }

  // Map link
  const mapLink = document.getElementById("venueMapLink");
  if (mapLink && config.googleMapsUrl) {
    mapLink.href = config.googleMapsUrl;
  }

  // Itinerary
  const itineraryContainer = document.getElementById("itineraryContainer");
  if (itineraryContainer && Array.isArray(config.itinerary)) {
    itineraryContainer.innerHTML = config.itinerary.map(item => `
      <div class="timeline-item">
        <div class="timeline-bullet"></div>
        <div class="timeline-content">
          <div class="timeline-time">${escapeHtml(item.time)}</div>
          <div class="timeline-heading">${escapeHtml(item.title)}</div>
          <div class="timeline-desc">${escapeHtml(item.desc)}</div>
        </div>
      </div>
    `).join("");
  }

  // Check if Supabase keys are configured
  const isSupabaseConfigured = config.supabase && 
    config.supabase.url && 
    !config.supabase.url.includes("YOUR_PROJECT_ID") &&
    config.supabase.anonKey &&
    !config.supabase.anonKey.includes("YOUR_SUPABASE_ANON_KEY");

  const banner = document.getElementById("supabaseBanner");
  if (banner && isSupabaseConfigured) {
    banner.classList.add("hidden");
  }
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el && text) el.textContent = text;
}

/**
 * Wax seal & Envelope interaction
 */
function initEnvelopeExperience() {
  const overlay = document.getElementById("envelopeOverlay");
  const container = document.getElementById("envelopeContainer");
  const seal = document.getElementById("waxSeal");

  if (!overlay || !container) return;

  function triggerFullScreen() {
    try {
      const docEl = document.documentElement;
      if (!document.fullscreenElement && !document.webkitFullscreenElement) {
        if (docEl.requestFullscreen) {
          docEl.requestFullscreen().catch(() => {});
        } else if (docEl.webkitRequestFullscreen) {
          docEl.webkitRequestFullscreen();
        } else if (docEl.msRequestFullscreen) {
          docEl.msRequestFullscreen();
        }
      }
    } catch (err) {
      // Browsers handle fullscreen silently if not allowed
    }
  }

  function openEnvelope() {
    // 1. Mobile Haptic Vibration
    if (navigator.vibrate) {
      try { navigator.vibrate([35, 45, 35]); } catch (e) {}
    }

    // 2. Enter Full Screen Mode
    triggerFullScreen();

    // 3. Play celebratory break sound effect
    playWaxSealSound();

    // 4. Trigger golden celebratory confetti burst on opening
    triggerGoldConfetti();

    // 5. Open flap animation
    container.classList.add("opened");

    // 6. Smoothly fade overlay to reveal main card
    setTimeout(() => {
      overlay.classList.add("opened");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 450);
  }

  container.addEventListener("click", openEnvelope);
  if (seal) seal.addEventListener("click", (e) => {
    e.stopPropagation();
    openEnvelope();
  });
}

/**
 * Countdown Timer
 */
function initCountdown(targetDateStr) {
  if (!targetDateStr) return;

  const targetDate = new Date(targetDateStr).getTime();

  function update() {
    const now = new Date().getTime();
    const diff = targetDate - now;

    if (diff <= 0) {
      document.getElementById("cdDays").textContent = "00";
      document.getElementById("cdHours").textContent = "00";
      document.getElementById("cdMinutes").textContent = "00";
      document.getElementById("cdSeconds").textContent = "00";
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById("cdDays").textContent = String(days).padStart(2, "0");
    document.getElementById("cdHours").textContent = String(hours).padStart(2, "0");
    document.getElementById("cdMinutes").textContent = String(minutes).padStart(2, "0");
    document.getElementById("cdSeconds").textContent = String(seconds).padStart(2, "0");
  }

  update();
  setInterval(update, 1000);
}

/**
 * Add-to-Calendar Links (Google + Apple/iCal .ics)
 */
function setupCalendarLinks(config) {
  const gcalBtn = document.getElementById("googleCalBtn");
  const icalBtn = document.getElementById("icalBtn");

  const start = new Date(config.eventDate);
  const end = new Date(start.getTime() + 5 * 60 * 60 * 1000); // 5 hours duration

  function toIsoClean(d) {
    return d.toISOString().replace(/-|:|\.\d\d\d/g, "");
  }

  const startIso = toIsoClean(start);
  const endIso = toIsoClean(end);

  // Google Calendar URL
  if (gcalBtn) {
    const title = encodeURIComponent(config.eventTitle + " - " + config.celebrantName);
    const details = encodeURIComponent(config.tagline + "\nDress Code: " + config.dressCode);
    const location = encodeURIComponent(config.venueName + ", " + config.venueAddress);
    gcalBtn.href = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startIso}/${endIso}&details=${details}&location=${location}`;
  }

  // Apple / iCal .ics file download
  if (icalBtn) {
    icalBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const icsContent = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//High-End Invitation//EN",
        "BEGIN:VEVENT",
        `UID:${Date.now()}@birthday-invitation.com`,
        `DTSTAMP:${startIso}`,
        `DTSTART:${startIso}`,
        `DTEND:${endIso}`,
        `SUMMARY:${config.eventTitle} - ${config.celebrantName}`,
        `DESCRIPTION:${config.tagline}\\nDress Code: ${config.dressCode}`,
        `LOCATION:${config.venueName}\\, ${config.venueAddress}`,
        "END:VEVENT",
        "END:VCALENDAR"
      ].join("\r\n");

      const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.setAttribute("download", "birthday-invitation.ics");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }
}

/**
 * Supabase Client Initialization
 */
function initSupabase(supabaseConfig) {
  if (
    window.supabase &&
    supabaseConfig &&
    supabaseConfig.url &&
    !supabaseConfig.url.includes("YOUR_PROJECT_ID") &&
    supabaseConfig.anonKey &&
    !supabaseConfig.anonKey.includes("YOUR_SUPABASE_ANON_KEY")
  ) {
    try {
      const cleanUrl = supabaseConfig.url.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
      return window.supabase.createClient(cleanUrl, supabaseConfig.anonKey);
    } catch (err) {
      console.warn("Supabase init error:", err);
      return null;
    }
  }
  return null;
}

/**
 * RSVP Form Handler
 */
function setupRsvpForm(supabaseClient) {
  const form = document.getElementById("rsvpForm");
  const attendanceRadios = document.querySelectorAll('input[name="attendance"]');
  const attendingDetails = document.getElementById("attendingDetails");
  const guestCountSelect = document.getElementById("guestCount");
  const plusOneGroup = document.getElementById("plusOneGroup");
  const submitBtn = document.getElementById("submitBtn");
  const btnText = document.getElementById("btnText");
  const btnSpinner = document.getElementById("btnSpinner");
  const alertBox = document.getElementById("formAlert");

  if (!form) return;

  // Toggle attending details (hide diet/plus-one if declining)
  attendanceRadios.forEach(radio => {
    radio.addEventListener("change", () => {
      if (radio.value === "declined" && radio.checked) {
        attendingDetails.style.display = "none";
        btnText.textContent = "Send Regrets";
      } else if (radio.value === "attending" && radio.checked) {
        attendingDetails.style.display = "block";
        btnText.textContent = "Confirm RSVP";
      }
    });
  });

  // Toggle plus-one name input
  if (guestCountSelect && plusOneGroup) {
    guestCountSelect.addEventListener("change", () => {
      plusOneGroup.style.display = guestCountSelect.value === "2" ? "block" : "none";
    });
  }

  // Handle Form Submission
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Disable button & show spinner
    submitBtn.disabled = true;
    btnSpinner.style.display = "inline-block";
    alertBox.className = "alert-box";
    alertBox.style.display = "none";

    const attendance = document.querySelector('input[name="attendance"]:checked')?.value || "attending";
    const fullName = document.getElementById("fullName").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const guestCount = attendance === "attending" ? parseInt(document.getElementById("guestCount").value, 10) : 0;
    const plusOneName = (attendance === "attending" && guestCount === 2) ? document.getElementById("plusOneName").value.trim() : null;
    const wishes = document.getElementById("wishes") ? document.getElementById("wishes").value.trim() : "";

    const rsvpData = {
      full_name: fullName,
      phone: phone,
      attendance: attendance,
      guest_count: guestCount,
      plus_one_name: plusOneName,
      wishes: wishes,
      created_at: new Date().toISOString()
    };

    try {
      if (supabaseClient) {
        // Send to Live Supabase Database
        const { error } = await supabaseClient.from("rsvps").insert([rsvpData]);
        if (error) throw error;
      } else {
        // Fallback to LocalStorage for preview mode
        const existing = JSON.parse(localStorage.getItem("preview_rsvps") || "[]");
        existing.unshift(rsvpData);
        localStorage.setItem("preview_rsvps", JSON.stringify(existing));
      }

      // Success feedback
      if (navigator.vibrate) {
        try { navigator.vibrate([40, 60, 40]); } catch (e) {}
      }
      triggerGoldConfetti();
      alertBox.textContent = attendance === "attending" 
        ? `Thank you, ${fullName}! Your RSVP has been confirmed. We look forward to celebrating with you in style!`
        : `Thank you for letting us know, ${fullName}. You will be warmly missed!`;
      alertBox.className = "alert-box success";
      alertBox.style.display = "block";

      form.reset();
      if (plusOneGroup) plusOneGroup.style.display = "none";
      if (attendingDetails) attendingDetails.style.display = "block";
      btnText.textContent = "Confirm RSVP";

    } catch (err) {
      console.error("RSVP Submission Error:", err);
      alertBox.textContent = "An error occurred while saving your RSVP: " + (err.message || "Please check your connection and try again.");
      alertBox.className = "alert-box error";
      alertBox.style.display = "block";
    } finally {
      submitBtn.disabled = false;
      btnSpinner.style.display = "none";
    }
  });
}

/**
 * Host Admin Dashboard (Guest List & Metrics)
 */
function setupAdminDashboard(supabaseClient, adminPasscode) {
  const secretCrownBtn = document.getElementById("secretCrownAdmin");
  const modalBtn = document.getElementById("adminModalBtn");
  const modal = document.getElementById("adminModal");
  const closeBtn = document.getElementById("adminCloseBtn");
  const authSection = document.getElementById("adminAuthSection");
  const dataSection = document.getElementById("adminDataSection");
  const passInput = document.getElementById("adminPassInput");
  const unlockBtn = document.getElementById("adminUnlockBtn");
  const errorMsg = document.getElementById("adminErrorMsg");
  const refreshBtn = document.getElementById("refreshRsvpBtn");
  const exportBtn = document.getElementById("exportCsvBtn");

  if (!modal) return;

  function openModal() {
    modal.classList.add("active");
  }

  // Hidden secret trigger on the Crown
  if (secretCrownBtn) {
    secretCrownBtn.addEventListener("click", openModal);
    secretCrownBtn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") openModal();
    });
  }

  if (modalBtn) {
    modalBtn.addEventListener("click", openModal);
  }

  closeBtn.addEventListener("click", () => {
    modal.classList.remove("active");
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.remove("active");
  });

  let currentRsvps = [];

  async function loadData() {
    const tbody = document.getElementById("guestTableBody");
    tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted);">Fetching RSVP list...</td></tr>`;

    let data = [];
    if (supabaseClient) {
      try {
        const { data: records, error } = await supabaseClient
          .from("rsvps")
          .select("*")
          .order("created_at", { ascending: false });
        if (error) throw error;
        data = records || [];
      } catch (err) {
        console.error("Failed to fetch RSVPs from Supabase:", err);
        tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #f87171;">Error loading data: ${err.message}</td></tr>`;
        return;
      }
    } else {
      data = JSON.parse(localStorage.getItem("preview_rsvps") || "[]");
    }

    currentRsvps = data;

    // Compute Stats
    let total = data.length;
    let attending = 0;
    let totalHeadcount = 0;
    let declined = 0;

    data.forEach(item => {
      if (item.attendance === "attending") {
        attending++;
        totalHeadcount += (item.guest_count || 1);
      } else {
        declined++;
      }
    });

    document.getElementById("statTotal").textContent = total;
    document.getElementById("statAttending").textContent = attending;
    document.getElementById("statHeadcount").textContent = totalHeadcount;
    document.getElementById("statDeclined").textContent = declined;

    // Render Table
    if (data.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 24px;">No RSVP submissions yet.</td></tr>`;
      return;
    }

    tbody.innerHTML = data.map(item => `
      <tr>
        <td style="font-weight: 600; color: var(--text-main);">
          ${escapeHtml(item.full_name)}
          ${item.plus_one_name ? `<br><small style="color: var(--gold-sheen);">+1: ${escapeHtml(item.plus_one_name)}</small>` : ""}
        </td>
        <td>
          <span class="status-badge ${item.attendance === "attending" ? "attending" : "declined"}">
            ${item.attendance === "attending" ? "Attending" : "Declined"}
          </span>
        </td>
        <td>${item.attendance === "attending" ? (item.guest_count || 1) : 0}</td>
        <td>
          <div style="font-size: 0.9rem; font-weight: 600; color: var(--gold-light);">${escapeHtml(item.phone || "-")}</div>
        </td>
        <td style="font-size: 0.85rem; color: var(--text-gold); font-style: italic;">
          ${escapeHtml(item.wishes || "—")}
        </td>
      </tr>
    `).join("");
  }

  unlockBtn.addEventListener("click", () => {
    if (passInput.value.trim() === (adminPasscode || "gk40th")) {
      authSection.style.display = "none";
      dataSection.style.display = "block";
      errorMsg.style.display = "none";
      loadData();
    } else {
      errorMsg.style.display = "block";
    }
  });

  if (refreshBtn) refreshBtn.addEventListener("click", loadData);

  // CSV Export
  if (exportBtn) {
    exportBtn.addEventListener("click", () => {
      if (!currentRsvps.length) {
        alert("No RSVP data to export.");
        return;
      }

      const headers = ["Name", "Status", "Guest Count", "Plus One Name", "Phone / WhatsApp", "Birthday Wish", "Submitted At"];
      const rows = currentRsvps.map(r => [
        `"${(r.full_name || "").replace(/"/g, '""')}"`,
        r.attendance || "",
        r.guest_count || 0,
        `"${(r.plus_one_name || "").replace(/"/g, '""')}"`,
        `"${(r.phone || "").replace(/"/g, '""')}"`,
        `"${(r.wishes || "").replace(/"/g, '""')}"`,
        r.created_at || ""
      ]);

      const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `gk_40th_rsvp_guest_list_${new Date().toISOString().split("T")[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }
}

/**
 * Luxury Gold Confetti Explosion
 */
function triggerGoldConfetti() {
  if (typeof confetti === "function") {
    // Elegant gold and champagne sparkles
    const colors = ["#d4af37", "#fcf6ba", "#aa771c", "#ffffff", "#e5c158"];
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: colors,
      disableForReducedMotion: true
    });
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });
    }, 250);
  }
}

/**
 * Web Audio API Wax Seal Break Sound (Synthesized, no external files)
 */
function playWaxSealSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    // Soft resonant pop
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(320, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.2);

    // Shimmer chime
    setTimeout(() => {
      const chime = ctx.createOscillator();
      const chimeGain = ctx.createGain();
      chime.type = "triangle";
      chime.frequency.setValueAtTime(880, ctx.currentTime); // A5
      chime.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.4);

      chimeGain.gain.setValueAtTime(0.15, ctx.currentTime);
      chimeGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

      chime.connect(chimeGain);
      chimeGain.connect(ctx.destination);
      chime.start();
      chime.stop(ctx.currentTime + 0.6);
    }, 80);

  } catch (e) {
    // Audio context may require user gesture in some browsers
  }
}

/**
 * Ambient Audio Loop (Warm synthetic jazz lounge chords)
 */
function setupAmbientAudio() {
  const btn = document.getElementById("audioToggleBtn");
  if (!btn) return;

  let isPlaying = false;
  let audioCtx = null;
  let masterGain = null;
  let chordInterval = null;

  const chords = [
    [261.63, 329.63, 392.00, 493.88], // Cmaj7
    [220.00, 261.63, 329.63, 392.00], // Am7
    [174.61, 220.00, 261.63, 329.63], // Fmaj7
    [196.00, 246.94, 293.66, 349.23]  // G7
  ];

  function playChord(frequencies) {
    if (!audioCtx || !masterGain) return;
    frequencies.forEach(freq => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      gain.gain.setValueAtTime(0, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.02, audioCtx.currentTime + 1.2);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 3.8);

      osc.connect(gain);
      gain.connect(masterGain);
      osc.start();
      osc.stop(audioCtx.currentTime + 4.0);
    });
  }

  btn.addEventListener("click", () => {
    if (!isPlaying) {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtxClass) return;
      if (!audioCtx) {
        audioCtx = new AudioCtxClass();
        masterGain = audioCtx.createGain();
        masterGain.gain.value = 0.5;
        masterGain.connect(audioCtx.destination);
      } else if (audioCtx.state === "suspended") {
        audioCtx.resume();
      }

      let chordIndex = 0;
      playChord(chords[chordIndex]);
      chordInterval = setInterval(() => {
        chordIndex = (chordIndex + 1) % chords.length;
        playChord(chords[chordIndex]);
      }, 3500);

      isPlaying = true;
      btn.style.borderColor = "var(--gold-sheen)";
      btn.style.boxShadow = "0 0 15px rgba(212, 175, 55, 0.6)";
    } else {
      if (chordInterval) clearInterval(chordInterval);
      if (audioCtx) audioCtx.suspend();
      isPlaying = false;
      btn.style.borderColor = "var(--gold-border)";
      btn.style.boxShadow = "none";
    }
  });
}

/**
 * Interactive cursor glow follower
 */
function setupMouseGlow() {
  const glow = document.getElementById("ambientGlow");
  if (!glow) return;
  window.addEventListener("pointermove", (e) => {
    glow.style.setProperty("--mouse-x", `${e.clientX}px`);
    glow.style.setProperty("--mouse-y", `${e.clientY}px`);
  });
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
