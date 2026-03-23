"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
// Grab these from your Supabase Dashboard -> Project Settings -> API
// Note: In Next.js, these should ideally live in a .env.local file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);


const CATEGORIES = ["Flood", "Earthquake", "Wildfire", "Hurricane / Cyclone", "Landslide", "Medical Emergency", "Infrastructure Collapse", "Other"];
const STATUSES = ["All", "SOS Sent", "Assessing", "Relief Dispatched", "Resolved"];
const NEEDS_OPTIONS = ["Search & Rescue", "Food & Water", "Medical Supplies", "Evacuation Transport", "Shelter", "Volunteers"];

const SAMPLE_REPORTS = [
  { id: "SOS-001", title: "Flash flood trapping 20 people", category: "Flood", status: "Relief Dispatched", date: "2024-03-10", location: "River Bank, Block 4", priority: "Critical", description: "Water levels rose suddenly. People trapped on the second floor of the community hall.", needs: ["Search & Rescue", "Evacuation Transport"], upvotes: 24, lat: 28.6, lng: 77.2 },
  { id: "SOS-002", title: "Building partial collapse after tremor", category: "Earthquake", status: "Assessing", date: "2024-03-12", location: "Industrial Area, Sector 7", priority: "Critical", description: "Old textile factory roof collapsed. Suspected 5 people inside.", needs: ["Search & Rescue", "Medical Supplies"], upvotes: 47, lat: 28.62, lng: 77.22 },
  { id: "SOS-003", title: "Main bridge washed away", category: "Infrastructure Collapse", status: "SOS Sent", date: "2024-03-14", location: "MG Road, Near River Crossing", priority: "High", description: "Bridge completely destroyed by landslide debris. Village is cut off.", needs: ["Food & Water", "Evacuation Transport"], upvotes: 38, lat: 28.58, lng: 77.19 },
  { id: "SOS-004", title: "Forest fire spreading near school", category: "Wildfire", status: "Assessing", date: "2024-03-15", location: "Rajpur Hillside Lane", priority: "Critical", description: "Strong winds pushing fire towards the residential area.", needs: ["Evacuation Transport", "Volunteers"], upvotes: 115, lat: 28.61, lng: 77.25 },
  { id: "SOS-005", title: "Temporary shelter needs supplies", category: "Other", status: "SOS Sent", date: "2024-03-16", location: "Sector 14 Relief Camp", priority: "Medium", description: "We have 50 evacuated families here but running out of clean drinking water.", needs: ["Food & Water", "Volunteers"], upvotes: 89, lat: 28.59, lng: 77.21 },
  { id: "SOS-006", title: "Injured elderly unable to move", category: "Medical Emergency", status: "Resolved", date: "2024-03-08", location: "Lower Colony, Main Road", priority: "High", description: "Grandfather suffered head injury during the storm. Needs immediate attention.", needs: ["Medical Supplies", "Evacuation Transport"], upvotes: 56, lat: 28.63, lng: 77.18 },
  { id: "SOS-007", title: "Mudslide blocked highway", category: "Landslide", status: "SOS Sent", date: "2024-03-17", location: "Highway 42, Mile 12", priority: "High", description: "Massive mudslide blocking the only exit route for the town.", needs: ["Volunteers", "Search & Rescue"], upvotes: 82, lat: 28.57, lng: 77.23 },
];

const SAMPLE_PREDICTIONS = [
  { id: "WARN-092", type: "Flash Flood", region: "Alapuzha", probability: 88, eta: "4 Hours", severity: "Critical", trend: "rising", action: "Issue Immediate Evacuation Alert" },
  { id: "WARN-093", type: "Wildfire Spread", region: "Idukki", probability: 65, eta: "24 Hours", severity: "High", trend: "steady", action: "Deploy Firebreaks & Stage Water Drops" },
  { id: "WARN-094", type: "Cyclone Landfall", region: "Kozhikode", probability: 42, eta: "5 Days", severity: "Medium", trend: "rising", action: "Monitor Pressure Systems & Prepare Shelters" },
  { id: "WARN-095", type: "Landslide Risk", region: "Wayanad", probability: 75, eta: "12 Hours", severity: "High", trend: "rising", action: "Close Roadway & Reroute Traffic" },
];

const SAMPLE_REQUESTS = [
  { id: "REQ-101", title: "Blankets for Shelter Alpha", type: "Donate", urgency: "High", description: "Need heavy winter blankets for the upcoming storm drop at the northern community hall.", goal: "50 Items", current: 12 },
  { id: "REQ-102", title: "Medical Volunteers Needed", type: "Volunteer", urgency: "Critical", description: "Registered nurses and EMTs needed immediately at Sector 7 triage center.", goal: "10 People", current: 3 },
  { id: "REQ-103", title: "Clean Drinking Water", type: "Donate", urgency: "Critical", description: "Bottled water needed for 200 evacuated families trapped near the eastern riverbank.", goal: "500 Liters", current: 200 },
  { id: "REQ-104", title: "Debris Clearing Team", type: "Volunteer", urgency: "Medium", description: "Able-bodied individuals needed to clear fallen trees blocking Route 4 access.", goal: "20 People", current: 15 },
  { id: "REQ-105", title: "Non-Perishable Food", type: "Donate", urgency: "High", description: "Canned goods, energy bars, and baby food needed for the central relief camp.", goal: "300 Boxes", current: 85 },
  { id: "REQ-106", title: "Evacuation Drivers", type: "Volunteer", urgency: "High", description: "Drivers with 4x4 vehicles needed to transport elderly residents from flood zones.", goal: "15 Drivers", current: 12 },
];

const PRIORITY_COLOR = { Critical: "#ff4444", High: "#ff8800", Medium: "#f5c518", Low: "#ff6a00" };
const STATUS_CONFIG = {
  "SOS Sent": { color: "#ff4444", bg: "rgba(255,68,68,0.12)", icon: "🚨" },
  "Assessing": { color: "#f5c518", bg: "rgba(245,197,24,0.12)", icon: "🔍" },
  "Relief Dispatched": { color: "#ff6a00", bg: "rgba(255,106,0,0.12)", icon: "🚁" },
  "Resolved": { color: "#00e676", bg: "rgba(0,230,118,0.12)", icon: "✅" },
};

const styles = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #12100f;
    --bg2: #1c1816;
    --bg3: #292320;
    --primary: #ff6a00; 
    --primary-dim: rgba(255, 106, 0, 0.15);
    --amber: #f5c518;
    --green: #00e676;
    --red: #ff4444;
    --text: #fff3ed;
    --muted: #a39287;
    --border: rgba(255, 106, 0, 0.15);
    --font-display: 'Syne', sans-serif;
    --font-mono: 'DM Mono', monospace;
  }
  body { background: var(--bg); color: var(--text); font-family: var(--font-display); min-height: 100vh; }
  .app { min-height: 100vh; background: var(--bg); display: flex; flex-direction: column; }

  /* NAV */
  nav { position: sticky; top: 0; z-index: 100; background: rgba(18,16,15,0.92); backdrop-filter: blur(16px); border-bottom: 1px solid var(--border); padding: 0 2rem; display: flex; align-items: center; justify-content: space-between; height: 64px; }
  .nav-logo { display: flex; align-items: center; gap: 10px; cursor: pointer; }
  .nav-logo-icon { width: 34px; height: 34px; background: var(--red); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 800; font-size: 16px; box-shadow: 0 0 10px rgba(255,68,68,0.4); }
  .nav-logo-text { font-size: 18px; font-weight: 700; letter-spacing: -0.3px; }
  .nav-logo-text span { color: var(--primary); }
  .nav-links { display: flex; gap: 6px; }
  .nav-btn { background: none; border: none; color: var(--muted); font-family: var(--font-display); font-size: 14px; font-weight: 600; cursor: pointer; padding: 8px 16px; border-radius: 8px; transition: all 0.2s; letter-spacing: 0.3px; }
  .nav-btn:hover { color: var(--text); background: var(--bg3); }
  .nav-btn.active { color: var(--primary); background: var(--primary-dim); }
  .nav-cta { background: var(--red); color: #fff; border: none; font-family: var(--font-display); font-size: 14px; font-weight: 700; padding: 8px 20px; border-radius: 8px; cursor: pointer; transition: all 0.2s; letter-spacing: 0.3px; box-shadow: 0 0 15px rgba(255,68,68,0.3); }
  .nav-cta:hover { background: #ff6666; transform: translateY(-1px); box-shadow: 0 0 20px rgba(255,68,68,0.5); }
  
  /* SHUTTER MENU / AUTH */
  .auth-container { position: relative; }
  .shutter-menu { position: absolute; top: calc(100% + 10px); right: 0; background: var(--bg2); border: 1px solid var(--border); border-radius: 12px; padding: 8px; display: flex; flex-direction: column; gap: 4px; min-width: 160px; opacity: 0; visibility: hidden; transform: translateY(-10px); transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1); box-shadow: 0 10px 40px rgba(0,0,0,0.5); z-index: 200; }
  .shutter-menu.open { opacity: 1; visibility: visible; transform: translateY(0); }
  .shutter-item { background: none; border: none; color: var(--muted); font-family: var(--font-display); font-size: 14px; font-weight: 600; padding: 10px 14px; border-radius: 8px; cursor: pointer; text-align: left; transition: all 0.15s; display: flex; align-items: center; gap: 8px; }
  .shutter-item:hover { background: var(--bg3); color: var(--primary); }
  
  /* AUTH PAGES (New Full Page Styles) */
  .auth-page { flex: 1; display: flex; align-items: center; justify-content: center; padding: 40px 20px; background-image: radial-gradient(ellipse at top, rgba(255,106,0,0.05) 0%, transparent 50%); }
  .auth-card { background: var(--bg2); border: 1px solid var(--border); border-radius: 20px; padding: 40px; width: 100%; max-width: 420px; box-shadow: 0 20px 60px rgba(0,0,0,0.8); animation: fadeIn 0.3s ease-out; }

  /* SETTINGS MODAL STYLES */
  .modal-overlay { position: fixed; inset: 0; background: rgba(10, 8, 7, 0.85); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; animation: fadeIn 0.2s ease-out; }
  .modal-card { background: var(--bg2); border: 1px solid var(--border); border-radius: 20px; padding: 40px; width: 100%; max-width: 420px; position: relative; box-shadow: 0 20px 60px rgba(0,0,0,0.8); animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
  .modal-close { position: absolute; top: 20px; right: 24px; background: none; border: none; color: var(--muted); font-size: 28px; cursor: pointer; transition: color 0.2s; line-height: 1; padding: 0; }
  .modal-close:hover { color: var(--primary); }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideUp { from { opacity: 0; transform: translateY(20px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }

  /* HERO */
  .hero { position: relative; overflow: hidden; padding: 100px 2rem 80px; text-align: center; }
  .hero-grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(255,106,0,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,106,0,0.06) 1px, transparent 1px); background-size: 48px 48px; }
  .hero-glow { position: absolute; top: -100px; left: 50%; transform: translateX(-50%); width: 600px; height: 400px; background: radial-gradient(ellipse, rgba(255,68,68,0.15) 0%, transparent 70%); pointer-events: none; }
  .hero-badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(255,68,68,0.1); border: 1px solid rgba(255,68,68,0.3); color: var(--red); font-family: var(--font-mono); font-size: 12px; padding: 6px 14px; border-radius: 20px; margin-bottom: 28px; letter-spacing: 1px; text-transform: uppercase; font-weight: 600; }
  .hero-badge-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--red); animation: pulse 2s infinite; }
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.3)} }
  .hero h1 { font-size: clamp(40px, 7vw, 80px); font-weight: 800; line-height: 1.05; letter-spacing: -2px; margin-bottom: 24px; }
  .hero h1 .accent { color: var(--primary); display: block; text-shadow: 0 0 30px rgba(255,106,0,0.3); }
  .hero-sub { font-size: 18px; color: var(--muted); max-width: 560px; margin: 0 auto 44px; line-height: 1.7; font-weight: 400; }
  .hero-actions { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
  .btn-primary { background: var(--red); color: #fff; border: none; font-family: var(--font-display); font-size: 15px; font-weight: 700; padding: 14px 30px; border-radius: 10px; cursor: pointer; transition: all 0.2s; letter-spacing: 0.3px; }
  .btn-primary:hover { background: #ff6666; transform: translateY(-2px); box-shadow: 0 8px 30px rgba(255,68,68,0.35); }
  .btn-outline { background: none; color: var(--primary); border: 1.5px solid rgba(255,106,0,0.4); font-family: var(--font-display); font-size: 15px; font-weight: 600; padding: 14px 30px; border-radius: 10px; cursor: pointer; transition: all 0.2s; }
  .btn-outline:hover { background: var(--primary-dim); border-color: var(--primary); transform: translateY(-2px); }

  /* STATS BAR */
  .stats-bar { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: var(--border); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); margin: 0; }
  .stat-item { background: var(--bg2); padding: 28px 24px; text-align: center; transition: background 0.2s; }
  .stat-item:hover { background: var(--bg3); }
  .stat-num { font-size: 36px; font-weight: 800; color: var(--primary); font-family: var(--font-mono); letter-spacing: -1px; }
  .stat-label { font-size: 12px; color: var(--muted); margin-top: 4px; letter-spacing: 1px; text-transform: uppercase; font-weight: 600; }

  /* PREDICTION DASHBOARD ADDITIONS */
  .prediction-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(380px, 1fr)); gap: 20px; }
  .predict-card { background: var(--bg2); border: 1px solid var(--border); border-radius: 16px; padding: 24px; position: relative; overflow: hidden; }
  .predict-card::before { content: ''; position: absolute; top: 0; left: 0; width: 4px; height: 100%; background: var(--red); }
  .predict-card.High::before { background: var(--primary); }
  .predict-card.Medium::before { background: var(--amber); }
  .predict-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; }
  .predict-type { font-size: 18px; font-weight: 800; display: flex; align-items: center; gap: 8px; }
  .predict-eta { font-family: var(--font-mono); font-size: 12px; background: rgba(255,255,255,0.05); padding: 4px 10px; border-radius: 6px; color: var(--muted); }
  .prob-bar-bg { height: 8px; background: var(--bg3); border-radius: 4px; overflow: hidden; margin-top: 8px; }
  .prob-bar-fill { height: 100%; border-radius: 4px; transition: width 1s ease-out; }
  .prob-label { display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 11px; color: var(--muted); margin-bottom: 4px; text-transform: uppercase; letter-spacing: 1px; }
  .predict-action { margin-top: 20px; padding: 12px 16px; background: rgba(255,106,0,0.08); border: 1px dashed rgba(255,106,0,0.3); border-radius: 8px; font-size: 13px; color: var(--primary); font-weight: 600; display: flex; gap: 10px; align-items: center; }

  /* SECTION & FORMS */
  .section { padding: 80px 2rem; max-width: 1200px; margin: 0 auto; }
  .section-label { font-family: var(--font-mono); font-size: 12px; color: var(--primary); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 12px; }
  .section-title { font-size: clamp(28px, 4vw, 44px); font-weight: 800; letter-spacing: -1px; margin-bottom: 16px; }
  .section-sub { color: var(--muted); font-size: 16px; max-width: 520px; line-height: 1.7; margin-bottom: 56px; }
  .steps-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; }
  .step-card { background: var(--bg2); border: 1px solid var(--border); border-radius: 16px; padding: 28px 24px; position: relative; overflow: hidden; transition: border-color 0.2s, transform 0.2s; cursor: default; }
  .step-card:hover { border-color: rgba(255,106,0,0.4); transform: translateY(-4px); box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
  .step-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: var(--primary); opacity: 0; transition: opacity 0.2s; }
  .step-card:hover::before { opacity: 1; }
  .step-num { font-family: var(--font-mono); font-size: 11px; color: var(--primary); letter-spacing: 2px; margin-bottom: 16px; opacity: 0.7; font-weight: 600; }
  .step-icon { font-size: 28px; margin-bottom: 14px; }
  .step-card h3 { font-size: 17px; font-weight: 700; margin-bottom: 8px; }
  .step-card p { font-size: 14px; color: var(--muted); line-height: 1.6; }

  .form-container { max-width: 780px; margin: 0 auto; padding: 40px 2rem; }
  .form-header { margin-bottom: 40px; }
  .form-header h2 { font-size: 36px; font-weight: 800; letter-spacing: -1px; margin-bottom: 8px; }
  .form-header p { color: var(--muted); font-size: 15px; }
  .form-card { background: var(--bg2); border: 1px solid var(--border); border-radius: 20px; padding: 40px; box-shadow: 0 10px 40px rgba(0,0,0,0.3); }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
  .form-group { margin-bottom: 20px; text-align: left; }
  .form-label { display: block; font-size: 13px; font-weight: 600; color: var(--muted); margin-bottom: 8px; letter-spacing: 0.5px; text-transform: uppercase; font-family: var(--font-mono); }
  .form-input, .form-select, .form-textarea { width: 100%; background: var(--bg3); border: 1px solid var(--border); border-radius: 10px; padding: 12px 16px; color: var(--text); font-family: var(--font-display); font-size: 15px; outline: none; transition: border-color 0.2s, box-shadow 0.2s; -webkit-appearance: none; }
  .form-input:focus, .form-select:focus, .form-textarea:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(255,106,0,0.15); }
  .form-input::placeholder, .form-textarea::placeholder { color: rgba(163,146,135,0.4); }
  .form-select option { background: var(--bg3); }
  .form-textarea { resize: vertical; min-height: 110px; line-height: 1.6; }
  .priority-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
  .priority-btn { background: var(--bg3); border: 1.5px solid var(--border); border-radius: 8px; padding: 10px; text-align: center; cursor: pointer; transition: all 0.15s; font-size: 13px; font-weight: 600; color: var(--muted); }
  .priority-btn:hover, .priority-btn.selected { color: var(--text); }
  .needs-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .need-checkbox { display: flex; align-items: center; gap: 10px; background: var(--bg3); border: 1px solid var(--border); padding: 12px 16px; border-radius: 10px; cursor: pointer; transition: all 0.2s; }
  .need-checkbox:hover { border-color: rgba(255,106,0,0.4); }
  .need-checkbox.selected { border-color: var(--primary); background: var(--primary-dim); }
  .need-checkbox input { accent-color: var(--primary); transform: scale(1.2); cursor: pointer; }
  .submit-btn { width: 100%; background: var(--red); color: #fff; border: none; font-family: var(--font-display); font-size: 16px; font-weight: 700; padding: 16px; border-radius: 12px; cursor: pointer; transition: all 0.2s; margin-top: 28px; letter-spacing: 0.3px; text-transform: uppercase; }
  .submit-btn:hover { background: #ff6666; transform: translateY(-2px); box-shadow: 0 8px 30px rgba(255,68,68,0.3); }
  .success-state { text-align: center; padding: 60px 20px; }
  .success-state h3 { font-size: 28px; font-weight: 800; margin: 20px 0 10px; }
  .success-state p { color: var(--muted); font-size: 15px; margin-bottom: 28px; }
  .success-id { font-family: var(--font-mono); font-size: 24px; font-weight: 700; color: var(--red); background: rgba(255,68,68,0.1); border: 1px solid rgba(255,68,68,0.3); padding: 12px 28px; border-radius: 10px; display: inline-block; margin-bottom: 28px; letter-spacing: 2px; }

  /* REPORTS LIST & MAP */
  .reports-container { max-width: 1200px; margin: 0 auto; padding: 40px 2rem; flex: 1; }
  .reports-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; margin-bottom: 32px; flex-wrap: wrap; }
  .reports-header h2 { font-size: 36px; font-weight: 800; letter-spacing: -1px; }
  .reports-header p { color: var(--muted); font-size: 14px; margin-top: 4px; }
  .filters { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 24px; }
  .filter-btn { background: var(--bg2); border: 1px solid var(--border); color: var(--muted); font-family: var(--font-display); font-size: 13px; font-weight: 600; padding: 8px 16px; border-radius: 8px; cursor: pointer; transition: all 0.15s; }
  .filter-btn:hover { border-color: rgba(255,106,0,0.4); color: var(--text); }
  .filter-btn.active { background: var(--primary-dim); border-color: var(--primary); color: var(--primary); }
  .search-box { flex: 1; min-width: 220px; max-width: 340px; }
  .search-input { width: 100%; background: var(--bg2); border: 1px solid var(--border); border-radius: 10px; padding: 10px 16px 10px 40px; color: var(--text); font-family: var(--font-display); font-size: 14px; outline: none; transition: border-color 0.2s; }
  .search-input:focus { border-color: rgba(255,106,0,0.5); }
  .search-input::placeholder { color: rgba(163,146,135,0.4); }
  .search-wrap { position: relative; }
  .search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--muted); font-size: 15px; pointer-events: none; }
  .view-toggle { display: flex; background: var(--bg2); border: 1px solid var(--border); border-radius: 10px; overflow: hidden; }
  .view-btn { background: none; border: none; color: var(--muted); padding: 9px 14px; cursor: pointer; font-size: 16px; transition: all 0.15s; }
  .view-btn.active { background: var(--bg3); color: var(--primary); }
  .reports-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 16px; }
  .report-card { background: var(--bg2); border: 1px solid var(--border); border-radius: 16px; padding: 22px; cursor: pointer; transition: all 0.2s; position: relative; overflow: hidden; display: flex; flex-direction: column; }
  .report-card:hover { border-color: rgba(255,106,0,0.3); transform: translateY(-3px); box-shadow: 0 8px 20px rgba(0,0,0,0.4); }
  .report-card-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 12px; gap: 10px; }
  .report-id { font-family: var(--font-mono); font-size: 12px; color: var(--primary); letter-spacing: 1.5px; font-weight: 600; }
  .status-badge { display: flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 700; white-space: nowrap; }
  .report-title { font-size: 16px; font-weight: 700; margin-bottom: 8px; line-height: 1.4; }
  .report-meta { display: flex; align-items: center; gap: 12px; font-size: 12px; color: var(--muted); flex-wrap: wrap; margin-bottom: 12px; }
  .report-meta span { display: flex; align-items: center; gap: 4px; }
  .priority-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
  .needs-list { display: flex; flex-wrap: wrap; gap: 6px; margin-top: auto; margin-bottom: 14px; }
  .need-badge { background: rgba(255,106,0,0.1); border: 1px solid rgba(255,106,0,0.25); color: var(--primary); padding: 4px 8px; border-radius: 6px; font-size: 10px; font-family: var(--font-mono); text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; }
  .report-footer { display: flex; align-items: center; justify-content: space-between; padding-top: 14px; border-top: 1px solid var(--border); }
  .upvote-btn { background: none; border: 1px solid var(--border); color: var(--muted); font-family: var(--font-display); font-size: 13px; font-weight: 600; padding: 6px 12px; border-radius: 8px; cursor: pointer; transition: all 0.15s; display: flex; align-items: center; gap: 6px; }
  .upvote-btn:hover { border-color: rgba(255,106,0,0.4); color: var(--primary); }
  .report-date { font-family: var(--font-mono); font-size: 11px; color: var(--muted); letter-spacing: 0.5px; }

  /* MAP VIEW - COMMAND CENTER STYLE */
  .map-container { background: var(--bg2); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; margin-bottom: 20px; box-shadow: inset 0 0 40px rgba(0,0,0,0.5); }
  .map-area { position: relative; height: 450px; background: #0a0908; overflow: hidden; }
  .map-grid-bg { position: absolute; inset: 0; background-image: linear-gradient(rgba(255,106,0,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,106,0,0.08) 1px, transparent 1px); background-size: 50px 50px; }
  .map-radar { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 800px; height: 800px; border-radius: 50%; border: 1px solid rgba(255,106,0,0.05); box-shadow: inset 0 0 100px rgba(255,106,0,0.02); pointer-events: none; }
  .map-pin { position: absolute; transform: translate(-50%, -50%); cursor: pointer; transition: transform 0.15s; z-index: 5; }
  .map-pin:hover { transform: translate(-50%, -50%) scale(1.3); z-index: 10; }
  .map-pin-inner { width: 16px; height: 16px; border-radius: 50%; border: 3px solid rgba(18,16,15,0.9); box-shadow: 0 0 15px currentColor; animation: mapPulse 2s infinite; }
  @keyframes mapPulse { 0% { box-shadow: 0 0 0 0 rgba(currentColor, 0.4); } 70% { box-shadow: 0 0 0 10px rgba(currentColor, 0); } 100% { box-shadow: 0 0 0 0 rgba(currentColor, 0); } }
  .map-pin-label { position: absolute; bottom: 24px; left: 50%; transform: translateX(-50%); background: var(--bg); border: 1px solid var(--border); border-radius: 6px; padding: 6px 10px; font-size: 11px; white-space: nowrap; font-family: var(--font-mono); font-weight: 600; opacity: 0; transition: opacity 0.2s; pointer-events: none; box-shadow: 0 4px 12px rgba(0,0,0,0.5); }
  .map-pin:hover .map-pin-label { opacity: 1; }
  .map-legend { position: absolute; bottom: 16px; right: 16px; background: rgba(18,16,15,0.95); border: 1px solid var(--border); border-radius: 10px; padding: 12px 16px; backdrop-filter: blur(4px); }
  .map-legend-item { display: flex; align-items: center; gap: 8px; font-size: 11px; color: var(--text); margin-bottom: 8px; font-family: var(--font-mono); font-weight: 600; }
  .map-legend-item:last-child { margin-bottom: 0; }
  .legend-dot { width: 12px; height: 12px; border-radius: 50%; box-shadow: 0 0 8px currentColor; }

  /* TRACKER */
  .tracker-container { max-width: 720px; margin: 0 auto; padding: 40px 2rem; flex: 1; }
  .tracker-header { margin-bottom: 40px; }
  .tracker-header h2 { font-size: 36px; font-weight: 800; letter-spacing: -1px; margin-bottom: 8px; }
  .tracker-header p { color: var(--muted); font-size: 15px; }
  .tracker-search { display: flex; gap: 12px; margin-bottom: 40px; }
  .tracker-input { flex: 1; background: var(--bg2); border: 1px solid var(--border); border-radius: 12px; padding: 14px 18px; color: var(--text); font-family: var(--font-mono); font-size: 15px; outline: none; transition: border-color 0.2s; letter-spacing: 1px; }
  .tracker-input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(255,106,0,0.15); }
  .tracker-input::placeholder { color: rgba(163,146,135,0.4); letter-spacing: 1px; }
  .track-btn { background: var(--primary); color: #fff; border: none; font-family: var(--font-display); font-size: 15px; font-weight: 700; padding: 14px 28px; border-radius: 12px; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
  .track-btn:hover { background: #ff8833; box-shadow: 0 4px 15px rgba(255,106,0,0.3); }
  .report-detail-card { background: var(--bg2); border: 1px solid var(--border); border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.2); }
  .detail-header { background: var(--bg3); padding: 28px 32px; border-bottom: 1px solid var(--border); }
  .detail-id-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; flex-wrap: wrap; gap: 10px; }
  .detail-id { font-family: var(--font-mono); font-size: 14px; font-weight: 600; color: var(--primary); letter-spacing: 2px; }
  .detail-title { font-size: 22px; font-weight: 800; letter-spacing: -0.5px; margin-bottom: 8px; }
  .detail-body { padding: 32px; }
  .detail-meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 32px; }
  .detail-meta-item { background: var(--bg3); border-radius: 10px; padding: 14px 16px; border: 1px solid rgba(255,255,255,0.02); }
  .detail-meta-label { font-size: 11px; color: var(--muted); letter-spacing: 1.5px; text-transform: uppercase; font-family: var(--font-mono); margin-bottom: 6px; }
  .detail-meta-value { font-size: 14px; font-weight: 600; }
  .timeline { position: relative; }
  .timeline-title { font-size: 13px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: var(--muted); font-family: var(--font-mono); margin-bottom: 24px; }
  .timeline-step { display: flex; gap: 16px; margin-bottom: 0; position: relative; }
  .timeline-step:not(:last-child) .timeline-line { flex: 1; }
  .timeline-marker { display: flex; flex-direction: column; align-items: center; flex-shrink: 0; }
  .timeline-dot { width: 14px; height: 14px; border-radius: 50%; border: 2px solid; flex-shrink: 0; position: relative; z-index: 1; }
  .timeline-connector { width: 2px; background: var(--border); flex: 1; margin: 4px 0; min-height: 28px; }
  .timeline-content { padding-bottom: 28px; padding-top: 0; flex: 1; }
  .timeline-step-title { font-size: 15px; font-weight: 700; margin-bottom: 3px; }
  .timeline-step-desc { font-size: 13px; color: var(--muted); line-height: 1.5; }
  .timeline-step-date { font-family: var(--font-mono); font-size: 11px; color: var(--muted); margin-top: 5px; letter-spacing: 0.5px; }

  /* FOOTER */
  footer { background: var(--bg2); border-top: 1px solid var(--border); padding: 48px 2rem 32px; margin-top: auto; }
  .footer-inner { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 40px; }
  .footer-brand p { font-size: 14px; color: var(--muted); line-height: 1.7; margin-top: 12px; max-width: 260px; }
  .footer-col h4 { font-size: 13px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted); font-family: var(--font-mono); margin-bottom: 16px; }
  .footer-col a { display: block; font-size: 14px; color: var(--muted); text-decoration: none; margin-bottom: 10px; transition: color 0.15s; cursor: pointer; }
  .footer-col a:hover { color: var(--primary); }
  .footer-bottom { max-width: 1200px; margin: 40px auto 0; padding-top: 24px; border-top: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; font-size: 12px; color: var(--muted); font-family: var(--font-mono); flex-wrap: wrap; gap: 10px; }
  .footer-status { display: flex; align-items: center; gap: 6px; color: var(--primary); font-weight: 600; }
  .status-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--primary); animation: pulse 2s infinite; box-shadow: 0 0 8px var(--primary); }
  
  /* REQUESTS & DONATIONS */
  .request-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px; }
  .req-card { background: var(--bg2); border: 1px solid var(--border); border-radius: 16px; padding: 24px; display: flex; flex-direction: column; transition: transform 0.2s, box-shadow 0.2s; }
  .req-card:hover { transform: translateY(-4px); box-shadow: 0 10px 30px rgba(0,0,0,0.3); border-color: rgba(255,106,0,0.4); }
  .req-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
  .req-type { font-family: var(--font-mono); font-size: 11px; font-weight: 700; text-transform: uppercase; padding: 6px 12px; border-radius: 20px; letter-spacing: 1px; }
  .req-type.Donate { background: rgba(0, 230, 118, 0.1); color: var(--green); border: 1px solid rgba(0, 230, 118, 0.3); }
  .req-type.Volunteer { background: rgba(245, 197, 24, 0.1); color: var(--amber); border: 1px solid rgba(245, 197, 24, 0.3); }
  .req-title { font-size: 18px; font-weight: 800; margin-bottom: 8px; line-height: 1.3; }
  .req-desc { color: var(--muted); font-size: 14px; line-height: 1.6; margin-bottom: 24px; flex: 1; }
  .req-progress-bar { background: var(--bg3); height: 6px; border-radius: 4px; overflow: hidden; margin-bottom: 8px; }
  .req-progress-fill { height: 100%; border-radius: 4px; transition: width 0.5s ease-out; }
  .req-progress-text { display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 12px; color: var(--muted); margin-bottom: 20px; }
  .req-btn { width: 100%; padding: 14px; border-radius: 10px; font-family: var(--font-display); font-weight: 700; font-size: 14px; cursor: pointer; transition: all 0.2s; border: none; letter-spacing: 0.5px; }
  .req-btn.Donate { background: var(--green); color: #000; }
  .req-btn.Donate:hover { background: #00ff83; box-shadow: 0 4px 15px rgba(0,230,118,0.3); transform: translateY(-1px); }
  .req-btn.Volunteer { background: var(--amber); color: #000; }
  .req-btn.Volunteer:hover { background: #ffcf33; box-shadow: 0 4px 15px rgba(245,197,24,0.3); transform: translateY(-1px); }

  @media (max-width: 768px) {
    .stats-bar { grid-template-columns: repeat(2,1fr); }
    .form-row, .needs-grid { grid-template-columns: 1fr; }
    .footer-inner { grid-template-columns: 1fr 1fr; }
    .detail-meta-grid { grid-template-columns: 1fr; }
    .rli-cat, .rli-date { display: none; }
    nav .nav-links { display: none; }
  }
`;

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG["SOS Sent"];
  return (
    <span className="status-badge" style={{ background: cfg.bg, color: cfg.color }}>
      {cfg.icon} {status}
    </span>
  );
}

function SettingsModal({ isOpen, onClose, userEmail }) {
  const [newPassword, setNewPassword] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // Feature 1: Change Password
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password: newPassword });
    
    setLoading(false);
    if (error) alert("Error updating password: " + error.message);
    else {
      alert("Password updated successfully!");
      setNewPassword("");
    }
  };

  // Feature 2: Delete Account (With Password Verification)
  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    if (!confirm("Are you absolutely sure you want to delete your account? This cannot be undone.")) return;
    
    setLoading(true);

    // Step A: Verify the password by trying to log in again
    const { error: verifyError } = await supabase.auth.signInWithPassword({ 
      email: userEmail, 
      password: deletePassword 
    });

    if (verifyError) {
      setLoading(false);
      return alert("Incorrect password. We cannot delete your account.");
    }

    // Step B: Call your custom Supabase RPC function to delete the user
    // Note: You must create a Postgres function called 'delete_user' in Supabase SQL Editor for this to work.
    const { error: deleteError } = await supabase.rpc('delete_user');

    if (deleteError) {
      setLoading(false);
      return alert("Failed to delete account: " + deleteError.message);
    }

    // Step C: Log them out locally
    await supabase.auth.signOut();
    setLoading(false);
    alert("Your account has been permanently deleted.");
    window.location.reload(); // Refresh app state
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>Account Settings</h2>
        
        {/* Change Password Form */}
        <div style={{ background: "var(--bg3)", padding: 20, borderRadius: 12, marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Change Password</h3>
          <form onSubmit={handleUpdatePassword}>
            <input type="password" placeholder="New Password (min 6 chars)" className="form-input mb-4" value={newPassword} onChange={e => setNewPassword(e.target.value)} required minLength={6} />
            <button type="submit" className="submit-btn" disabled={loading} style={{ padding: "10px", fontSize: 13 }}>Update Password</button>
          </form>
        </div>

        {/* Delete Account Form */}
        <div style={{ border: "1px dashed var(--red)", padding: 20, borderRadius: 12 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--red)", marginBottom: 8 }}>Danger Zone</h3>
          <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>Permanently delete your account. Enter password to confirm.</p>
          <form onSubmit={handleDeleteAccount}>
            <input type="password" placeholder="Current Password" className="form-input mb-4" value={deletePassword} onChange={e => setDeletePassword(e.target.value)} required />
            <button type="submit" className="submit-btn btn-danger" disabled={loading} style={{ padding: "10px", fontSize: 13, background: "transparent", color: "var(--red)", border: "1px solid var(--red)" }}>
              Permanently Delete Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// NEW FULL PAGE VIEWS FOR AUTH
function LoginView({ onLoginSuccess, onSwitchToSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setLoading(true);
    
    // Supabase Auth: Sign In
    const { error } = await supabase.auth.signInWithPassword({ 
      email, 
      password 
    });
    
    setLoading(false);
    
    if (error) {
      alert("Login Failed: " + error.message);
    } else {
      onLoginSuccess();
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div className="nav-logo-icon" style={{ margin: "0 auto 16px", width: 48, height: 48, fontSize: 20 }}>RT</div>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Command Login</h2>
          <p style={{ color: "var(--muted)", fontSize: 14 }}>Access the emergency coordination dashboard.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" className="form-input" placeholder="responder@relieftrack.org" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          
          <div className="form-group" style={{ marginBottom: 32 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <label className="form-label" style={{ marginBottom: 0 }}>Password</label>
              <span style={{ fontSize: 12, color: "var(--primary)", cursor: "pointer", fontFamily: "var(--font-mono)" }}>Forgot?</span>
            </div>
            <input type="password" className="form-input" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>

          <button type="submit" className="submit-btn" disabled={loading} style={{ marginTop: 0 }}>
            {loading ? "⏳ Authenticating..." : "🔐 Access System →"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: 24, fontSize: 13, color: "var(--muted)" }}>
          Don't have clearance? <span style={{ color: "var(--primary)", cursor: "pointer", fontWeight: 600 }} onClick={onSwitchToSignup}>Apply for access</span>
        </div>
      </div>
    </div>
  );
}

function SignupView({ onSignupSuccess, onSwitchToLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Volunteer");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || !name) return;
    
    setLoading(true);
    
    // Supabase Auth: Sign Up
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name, role: role } // Save extra details here
      }
    });
    
    setLoading(false);
    
    if (error) {
      alert("Signup Failed: " + error.message);
    } else {
      alert("Success! Check your email for a verification link (if enabled).");
      onSignupSuccess();
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: 500 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div className="nav-logo-icon" style={{ margin: "0 auto 16px", width: 48, height: 48, fontSize: 20 }}>RT</div>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Request Access</h2>
          <p style={{ color: "var(--muted)", fontSize: 14 }}>Join the emergency response network.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input type="text" className="form-input" placeholder="Jane Doe" value={name} onChange={e => setName(e.target.value)} required />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" className="form-input" placeholder="responder@relieftrack.org" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>

          <div className="form-row" style={{ marginBottom: 0 }}>
            <div className="form-group" style={{ marginBottom: 32 }}>
              <label className="form-label">Role</label>
              <select className="form-select" value={role} onChange={e => setRole(e.target.value)}>
                <option value="Volunteer">Volunteer / Citizen</option>
                <option value="Medical">Medical Professional</option>
                <option value="Authority">Local Authority / Rescue</option>
              </select>
            </div>
            
            <div className="form-group" style={{ marginBottom: 32 }}>
              <label className="form-label">Password</label>
              <input type="password" className="form-input" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={loading} style={{ marginTop: 0 }}>
            {loading ? "⏳ Registering..." : "📝 Create Account →"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: 24, fontSize: 13, color: "var(--muted)" }}>
          Already registered? <span style={{ color: "var(--primary)", cursor: "pointer", fontWeight: 600 }} onClick={onSwitchToLogin}>Log In</span>
        </div>
      </div>
    </div>
  );
}

function ForecastView() {
  return (
    <div className="reports-container">
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--primary)", letterSpacing: 2, marginBottom: 8 }}>// PREDICTIVE ANALYTICS</div>
      <div className="reports-header" style={{ marginBottom: 40 }}>
        <div>
          <h2>Early Warning System</h2>
          <p>Analyzing weather patterns, geological sensors, and historical data to forecast imminent threats.</p>
        </div>
      </div>

      <div className="prediction-grid">
        {SAMPLE_PREDICTIONS.map((pred) => (
          <div key={pred.id} className={`predict-card ${pred.severity}`}>
            <div className="predict-header">
              <div className="predict-type">
                {pred.type === "Flash Flood" ? "🌊" : pred.type === "Wildfire Spread" ? "🔥" : pred.type === "Cyclone Landfall" ? "🌀" : "⚠️"} 
                {pred.type}
              </div>
              <div className="predict-eta">ETA: {pred.eta}</div>
            </div>
            
            <div style={{ fontSize: 14, color: "var(--muted)", marginBottom: 16 }}>
              📍 <strong>Predicted Impact Zone:</strong> {pred.region}
            </div>

            <div>
              <div className="prob-label">
                <span>Probability of Event</span>
                <span style={{ color: pred.probability > 75 ? "var(--red)" : "var(--primary)" }}>{pred.probability}%</span>
              </div>
              <div className="prob-bar-bg">
                <div 
                  className="prob-bar-fill" 
                  style={{ 
                    width: `${pred.probability}%`, 
                    background: pred.probability > 75 ? "var(--red)" : pred.probability > 50 ? "var(--primary)" : "var(--amber)"
                  }} 
                />
              </div>
            </div>

            <div className="predict-action">
              <span>{pred.probability > 75 ? "🚨" : "📢"}</span> 
              {pred.action}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LandingPage({ onNavigate }) {
  return (
    <div>
      <div className="hero">
        <div className="hero-grid" />
        <div className="hero-glow" />
        <div style={{ position: "relative" }}>
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            LIVE SOS MONITORING — ACTIVE EMERGENCIES
          </div>
          <h1>
            Report Disasters.
            <span className="accent">Request Immediate Aid.</span>
          </h1>
          <p className="hero-sub">
            A rapid-response network linking disaster victims to rescue teams, volunteers, and critical relief supplies in real-time.
          </p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => onNavigate("report")}>🚨 Send SOS Report</button>
            <button className="btn-outline" onClick={() => onNavigate("reports")}>🗺 View Active Map</button>
          </div>
        </div>
      </div>

      <div className="stats-bar">
        {[["847", "Active SOS"], ["12,404", "People Rescued"], ["38", "Teams Deployed"], ["4m", "Avg Response Time"]].map(([n, l]) => (
          <div className="stat-item" key={l}>
            <div className="stat-num">{n}</div>
            <div className="stat-label">{l}</div>
          </div>
        ))}
      </div>

      <div className="section">
        <div className="section-label">// EMERGENCY PROTOCOL</div>
        <h2 className="section-title">From disaster to rescue — instantly.</h2>
        <p className="section-sub">Every second counts. Our platform connects your needs directly to mobilized relief forces via our command center.</p>
        <div className="steps-grid">
          {[
            { icon: "🚨", title: "Submit an SOS", desc: "Report the disaster type, your location, and select exactly what supplies or help you need." },
            { icon: "📡", title: "Broadcasted Live", desc: "Your request is instantly mapped and broadcasted to local authorities and verified volunteers." },
            { icon: "🚁", title: "Relief Dispatched", desc: "Response teams accept the request and dispatch the requested medical, food, or rescue aid." },
            { icon: "✅", title: "Safe & Resolved", desc: "Once physical contact and aid are provided, the SOS ticket is closed and marked safe." },
          ].map((s, i) => (
            <div className="step-card" key={i}>
              <div className="step-num">STEP {String(i + 1).padStart(2, "0")}</div>
              <div className="step-icon">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="section" style={{ textAlign: "center" }}>
        <h2 className="section-title">Stay Ahead of the Threat</h2>
        <p className="section-sub" style={{ margin: "0 auto 36px" }}>Our AI Early Warning system constantly analyzes environmental data to predict imminent disasters before they happen.</p>
        <div className="hero-actions">
          <button className="btn-primary" onClick={() => onNavigate("forecast")}>View Disaster Forecast →</button>
          <button className="btn-outline" onClick={() => onNavigate("tracker")}>Track Existing SOS</button>
        </div>
      </div>
    </div>
  );
}

function ReportForm({ onSuccess }) {
  const [form, setForm] = useState({ title: "", category: "", location: "", priority: "Critical", description: "", name: "", phone: "", needs: [] });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reportId] = useState("SOS-" + String(Math.floor(Math.random() * 900) + 100));

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  
  const toggleNeed = (need) => {
    setForm(f => ({
      ...f,
      needs: f.needs.includes(need) ? f.needs.filter(n => n !== need) : [...f.needs, need]
    }));
  };

  const handleSubmit = () => {
    if (!form.title || !form.category || !form.location) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 1600);
  };

  if (submitted) return (
    <div className="form-container">
      <div className="form-card">
        <div className="success-state">
          <div style={{ fontSize: 56 }}>📡</div>
          <h3>SOS Broadcast Successful!</h3>
          <p>Your emergency report and resource requests have been sent to local rescue networks. Keep this ID to track updates:</p>
          <div className="success-id">{reportId}</div>
          <p style={{ marginBottom: 24 }}>Stay calm and remain in the safest possible location. Help is being organized.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn-primary" onClick={() => onSuccess(reportId)}>Track Rescue Status →</button>
            <button className="btn-outline" onClick={() => setSubmitted(false)}>Submit Another</button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="form-container">
      <div className="form-header">
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--red)", letterSpacing: 2, marginBottom: 8 }}>// FILE EMERGENCY REPORT</div>
        <h2>Request Disaster Relief</h2>
        <p>This form goes directly to emergency response coordinators and registered volunteers.</p>
      </div>
      <div className="form-card">
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--primary)", letterSpacing: 2, marginBottom: 24, opacity: 0.7 }}>SECTION 01 — EMERGENCY DETAILS</div>
        <div className="form-group">
          <label className="form-label">Situation Title *</label>
          <input className="form-input" placeholder="e.g. 5 People trapped on roof" value={form.title} onChange={e => set("title", e.target.value)} />
        </div>
        <div className="form-row">
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Disaster Type *</label>
            <select className="form-select" value={form.category} onChange={e => set("category", e.target.value)}>
              <option value="">Select category</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Location *</label>
            <input className="form-input" placeholder="Street, landmark, coordinates" value={form.location} onChange={e => set("location", e.target.value)} />
          </div>
        </div>
        
        <div className="form-group" style={{ marginTop: 24 }}>
          <label className="form-label">Urgency Level</label>
          <div className="priority-grid">
            {["Low","Medium","High","Critical"].map(p => (
              <div key={p} className={`priority-btn ${form.priority === p ? "selected" : ""}`}
                onClick={() => set("priority", p)}
                style={form.priority === p ? { borderColor: PRIORITY_COLOR[p], color: PRIORITY_COLOR[p], background: `${PRIORITY_COLOR[p]}18` } : {}}>
                {p}
              </div>
            ))}
          </div>
        </div>

        <div className="form-group" style={{ marginTop: 32 }}>
          <label className="form-label">Assistance & Resources Needed</label>
          <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 12 }}>Select all the resources you currently require.</p>
          <div className="needs-grid">
            {NEEDS_OPTIONS.map(n => (
              <label key={n} className={`need-checkbox ${form.needs.includes(n) ? "selected" : ""}`}>
                <input type="checkbox" checked={form.needs.includes(n)} onChange={() => toggleNeed(n)} />
                <span style={{ fontSize: 14 }}>{n}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="form-group" style={{ marginTop: 20 }}>
          <label className="form-label">Additional Context</label>
          <textarea className="form-textarea" placeholder="Describe injuries, number of people, specific hazards..." value={form.description} onChange={e => set("description", e.target.value)} />
        </div>

        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--primary)", letterSpacing: 2, marginBottom: 24, marginTop: 32, opacity: 0.7 }}>SECTION 02 — CONTACT INFO</div>
        <div className="form-row">
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Contact Name</label>
            <input className="form-input" placeholder="Name or Alias" value={form.name} onChange={e => set("name", e.target.value)} />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Phone Number / Radio Freq</label>
            <input className="form-input" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={e => set("phone", e.target.value)} />
          </div>
        </div>

        <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
          {loading ? "📡  Broadcasting SOS..." : "🚨  Send Emergency SOS →"}
        </button>
      </div>
    </div>
  );
}

function ReportsView({ onTrack }) {
  const [viewMode, setViewMode] = useState("map");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [upvoted, setUpvoted] = useState({});

  const filtered = SAMPLE_REPORTS.filter(r => {
    if (statusFilter !== "All" && r.status !== statusFilter) return false;
    if (categoryFilter !== "All" && r.category !== categoryFilter) return false;
    if (search && !r.title.toLowerCase().includes(search.toLowerCase()) && !r.location.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleUpvote = (id, e) => {
    e.stopPropagation();
    setUpvoted(u => ({ ...u, [id]: !u[id] }));
  };

  const categories = ["All", ...CATEGORIES.slice(0, 6)];

  return (
    <div className="reports-container">
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--primary)", letterSpacing: 2, marginBottom: 8 }}>// LIVE INCIDENT MAP</div>
      <div className="reports-header">
        <div>
          <h2>Active Emergencies</h2>
          <p>{filtered.length} distress calls currently monitored in this sector</p>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <div className="search-wrap search-box">
            <span className="search-icon">🔍</span>
            <input className="search-input" placeholder="Search areas or needs..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="view-toggle">
            <button className={`view-btn ${viewMode === "map" ? "active" : ""}`} onClick={() => setViewMode("map")}>🗺</button>
            <button className={`view-btn ${viewMode === "grid" ? "active" : ""}`} onClick={() => setViewMode("grid")}>⊞</button>
            <button className={`view-btn ${viewMode === "list" ? "active" : ""}`} onClick={() => setViewMode("list")}>≡</button>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--muted)", letterSpacing: 1, display: "flex", alignItems: "center" }}>STATUS:</span>
        {STATUSES.map(s => <button key={s} className={`filter-btn ${statusFilter === s ? "active" : ""}`} onClick={() => setStatusFilter(s)}>{s}</button>)}
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--muted)", letterSpacing: 1, display: "flex", alignItems: "center" }}>TYPE:</span>
        {categories.map(c => <button key={c} className={`filter-btn ${categoryFilter === c ? "active" : ""}`} onClick={() => setCategoryFilter(c)}>{c}</button>)}
      </div>

      {viewMode === "map" && (
        <div className="map-container">
          <div className="map-area">
            <div className="map-grid-bg" />
            <div className="map-radar" />
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ opacity: 0.03, fontSize: 240, userSelect: "none", filter: "blur(2px)" }}>🗺</div>
            </div>
            <div style={{ position: "absolute", top: 16, left: 16, fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--primary)", letterSpacing: 1, background: "rgba(18,16,15,0.8)", padding: "6px 12px", borderRadius: 6, border: "1px solid var(--border)", backdropFilter: "blur(4px)" }}>
              RADAR: RELIEF SECTOR ALPHA — {filtered.length} SIGNALS
            </div>
            {filtered.map((r, i) => {
              const x = 10 + ((r.lng - 77.15) / 0.12) * 80;
              const y = 15 + ((r.lat - 28.55) / 0.12) * 70;
              return (
                <div key={r.id} className="map-pin" style={{ left: `${Math.max(5, Math.min(92, x))}%`, top: `${Math.max(5, Math.min(88, y))}%` }} onClick={() => onTrack(r.id)}>
                  <div className="map-pin-inner" style={{ background: PRIORITY_COLOR[r.priority], color: PRIORITY_COLOR[r.priority] }} />
                  <div className="map-pin-label">{r.id} · {r.title.slice(0, 20)}...</div>
                </div>
              );
            })}
            <div className="map-legend">
              {Object.entries(PRIORITY_COLOR).map(([p, c]) => (
                <div key={p} className="map-legend-item">
                  <div className="legend-dot" style={{ background: c, color: c }} /> {p} Priority
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {viewMode === "grid" && (
        <div className="reports-grid">
          {filtered.map(r => (
            <div key={r.id} className="report-card" onClick={() => onTrack(r.id)}>
              <div className="report-card-top">
                <div>
                  <div className="report-id">{r.id}</div>
                </div>
                <StatusBadge status={r.status} />
              </div>
              <div className="report-title">{r.title}</div>
              <div className="report-meta">
                <span><div className="priority-dot" style={{ background: PRIORITY_COLOR[r.priority] }} /> {r.priority}</span>
                <span>📍 {r.location}</span>
                <span>🏷 {r.category}</span>
              </div>
              
              <div className="needs-list">
                {r.needs && r.needs.map(n => <span key={n} className="need-badge">{n}</span>)}
              </div>

              <div className="report-footer">
                <button className="upvote-btn" onClick={e => handleUpvote(r.id, e)} style={upvoted[r.id] ? { color: "var(--primary)", borderColor: "rgba(255,106,0,0.4)" } : {}}>
                  ▲ Verify Info ({r.upvotes + (upvoted[r.id] ? 1 : 0)})
                </button>
                <span className="report-date">{r.date}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {viewMode === "list" && (
        <div className="reports-list-view">
          <div style={{ display: "flex", gap: 20, padding: "0 22px 10px", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--muted)", letterSpacing: 1, textTransform: "uppercase", borderBottom: "1px solid var(--border)", marginBottom: 4 }}>
            <span style={{ width: 80 }}>ID</span>
            <span style={{ flex: 1 }}>Title & Needs</span>
            <span style={{ width: 150 }}>Category</span>
            <span style={{ width: 140 }}>Status</span>
            <span style={{ width: 90, textAlign: "right" }}>Date</span>
          </div>
          {filtered.map(r => (
            <div key={r.id} className="report-list-item" onClick={() => onTrack(r.id)}>
              <div className="rli-id">{r.id}</div>
              <div className="rli-title">
                {r.title}
                <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
                   {r.needs && r.needs.slice(0, 3).map(n => <span key={n} className="need-badge">{n}</span>)}
                </div>
              </div>
              <div className="rli-cat">{r.category}</div>
              <div className="rli-status"><StatusBadge status={r.status} /></div>
              <div className="rli-date">{r.date}</div>
            </div>
          ))}
        </div>
      )}

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--muted)" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
          <p style={{ fontSize: 18, fontWeight: 700, color: "var(--text)", marginBottom: 8 }}>No reports found</p>
          <p>Adjust filters or zoom map to find active signals.</p>
        </div>
      )}
    </div>
  );
}

function TrackerView({ preloadId = "" }) {
  const [query, setQuery] = useState(preloadId);
  const [tracked, setTracked] = useState(preloadId ? SAMPLE_REPORTS.find(r => r.id === preloadId) || null : null);
  const [notFound, setNotFound] = useState(false);

  const doTrack = () => {
    const found = SAMPLE_REPORTS.find(r => r.id.toLowerCase() === query.toUpperCase().trim());
    if (found) { setTracked(found); setNotFound(false); }
    else { setTracked(null); setNotFound(true); }
  };

  const getTimeline = (report) => {
    const base = [
      { title: "SOS Broadcasted", desc: "Emergency signal registered and placed on the central map.", date: report.date, done: true },
      { title: "Authorities Assessing", desc: "Local volunteer networks and teams are reviewing required needs.", date: report.status !== "SOS Sent" ? "Verified" : "—", done: report.status !== "SOS Sent" },
      { title: "Relief Dispatched", desc: "Resources or rescue teams are en route to the designated coordinates.", date: report.status === "Resolved" ? "Completed" : report.status === "Relief Dispatched" ? "In Progress" : "—", done: report.status === "Resolved" || report.status === "Relief Dispatched" },
      { title: "Evacuated / Resolved", desc: "Physical contact made, aid provided, area marked safe.", date: report.status === "Resolved" ? "Safe ✓" : "—", done: report.status === "Resolved" },
    ];
    return base;
  };

  const currentStep = tracked ? (tracked.status === "SOS Sent" ? 0 : tracked.status === "Assessing" ? 1 : tracked.status === "Relief Dispatched" ? 2 : 3) : 0;

  return (
    <div className="tracker-container">
      <div className="tracker-header">
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--primary)", letterSpacing: 2, marginBottom: 8 }}>// RELIEF TRACKER</div>
        <h2>Track Rescue Status</h2>
        <p>Enter an SOS ID to monitor the dispatch status of aid and rescue teams.</p>
      </div>

      <div className="tracker-search">
        <input className="tracker-input" placeholder="SOS-001" value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === "Enter" && doTrack()} />
        <button className="track-btn" onClick={doTrack}>Track Aid →</button>
      </div>

      {!tracked && !notFound && (
        <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 16, padding: "32px", textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🔎</div>
          <p style={{ color: "var(--muted)", fontSize: 15 }}>Enter a report ID to view status. Try <span style={{ color: "var(--primary)", fontFamily: "var(--font-mono)" }}>SOS-001</span> through <span style={{ color: "var(--primary)", fontFamily: "var(--font-mono)" }}>SOS-007</span></p>
        </div>
      )}

      {notFound && (
        <div className="not-found">
          <div style={{ fontSize: 48 }}>❌</div>
          <h3>Record Not Found</h3>
          <p>No emergency signal with ID "{query}" was found. Check the ID and try again.</p>
        </div>
      )}

      {tracked && (
        <div className="report-detail-card">
          <div className="detail-header">
            <div className="detail-id-row">
              <span className="detail-id">{tracked.id}</span>
              <StatusBadge status={tracked.status} />
            </div>
            <div className="detail-title">{tracked.title}</div>
            <div style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 13, color: "var(--muted)", flexWrap: "wrap" }}>
              <span>🏷 {tracked.category}</span>
              <span style={{ opacity: 0.4 }}>·</span>
              <span>📍 {tracked.location}</span>
              <span style={{ opacity: 0.4 }}>·</span>
              <span style={{ color: PRIORITY_COLOR[tracked.priority] }}>⚡ {tracked.priority} Urgency</span>
            </div>
          </div>
          <div className="detail-body">
            
            <div style={{ background: "rgba(255,106,0,0.05)", border: "1px solid rgba(255,106,0,0.2)", borderRadius: 10, padding: "16px 18px", marginBottom: 24 }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--primary)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12 }}>Requested Aid / Needs</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {tracked.needs && tracked.needs.map(n => (
                  <span key={n} style={{ background: "var(--bg3)", color: "var(--text)", padding: "6px 12px", borderRadius: "6px", fontSize: "13px", fontWeight: "600", border: "1px solid var(--border)" }}>✓ {n}</span>
                ))}
              </div>
            </div>

            <div className="detail-meta-grid">
              {[["Broadcast Time", tracked.date], ["Coordinates", `${tracked.lat}, ${tracked.lng}`], ["Disaster Type", tracked.category], ["Info Verifications", `${tracked.upvotes} confirmations`]].map(([l, v]) => (
                <div key={l} className="detail-meta-item">
                  <div className="detail-meta-label">{l}</div>
                  <div className="detail-meta-value">{v}</div>
                </div>
              ))}
            </div>

            {tracked.description && (
              <div style={{ background: "var(--bg3)", borderRadius: 10, padding: "16px 18px", marginBottom: 32 }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--muted)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>Situation Description</div>
                <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.7 }}>{tracked.description}</p>
              </div>
            )}

            <div className="timeline">
              <div className="timeline-title">// RESCUE PROGRESS TIMELINE</div>
              {getTimeline(tracked).map((step, i) => (
                <div key={i} className="timeline-step">
                  <div className="timeline-marker">
                    <div className="timeline-dot" style={{
                      background: step.done ? (i <= currentStep ? "var(--primary)" : "var(--green)") : "transparent",
                      borderColor: step.done ? (i === currentStep ? "var(--primary)" : "var(--green)") : "var(--border)",
                      boxShadow: step.done && i <= currentStep ? "0 0 12px rgba(255,106,0,0.5)" : "none"
                    }} />
                    {i < 3 && <div className="timeline-connector" style={{ background: i < currentStep ? "rgba(255,106,0,0.3)" : "var(--border)" }} />}
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-step-title" style={{ color: step.done ? "var(--text)" : "var(--muted)" }}>{step.title}</div>
                    <div className="timeline-step-desc">{step.desc}</div>
                    {step.date !== "—" && <div className="timeline-step-date">{step.date}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function RequestsView() {
  return (
    <div className="reports-container">
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--primary)", letterSpacing: 2, marginBottom: 8 }}>// COMMUNITY NEEDS</div>
      <div className="reports-header" style={{ marginBottom: 40 }}>
        <div>
          <h2>Volunteer & Donate</h2>
          <p>Directly support ongoing relief efforts by fulfilling specific community requests.</p>
        </div>
      </div>

      <div className="request-grid">
        {SAMPLE_REQUESTS.map(req => {
          // Parse goal amount roughly to calculate a percentage
          const goalNum = parseInt(req.goal.replace(/\D/g, ''));
          const percent = Math.min(100, Math.round((req.current / goalNum) * 100)) || 0;
          
          return (
            <div key={req.id} className="req-card">
              <div className="req-header">
                <span className={`req-type ${req.type}`}>{req.type}</span>
                <span style={{ fontSize: 12, color: "var(--muted)", fontFamily: "var(--font-mono)" }}>⚡ {req.urgency}</span>
              </div>
              <h3 className="req-title">{req.title}</h3>
              <p className="req-desc">{req.description}</p>
              
              <div>
                <div className="req-progress-bar">
                  <div className="req-progress-fill" style={{ 
                    width: `${percent}%`, 
                    background: req.type === "Donate" ? "var(--green)" : "var(--amber)" 
                  }} />
                </div>
                <div className="req-progress-text">
                  <span>{req.current} / {req.goal} Fulfilled</span>
                  <span>{percent}%</span>
                </div>
              </div>

              <button 
                className={`req-btn ${req.type}`} 
                onClick={() => alert(`Opening ${req.type} flow for: ${req.title}`)}
              >
                {req.type === "Donate" ? "📦 Make a Donation" : "🤝 Sign Up to Volunteer"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("home");
  const [trackId, setTrackId] = useState("");
  const [isShutterOpen, setIsShutterOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [session, setSession] = useState(null);
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) setIsLoggedIn(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setIsLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Update your Logout button function:
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setIsShutterOpen(false);
    navigate("home");
  };
  const navigate = (p, id = "") => {
    setPage(p);
    if (id) setTrackId(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFormSuccess = (id) => navigate("tracker", id);
  const handleTrack = (id) => navigate("tracker", id);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      
      <div className="app">
        <nav>
          <div className="nav-logo" onClick={() => navigate("home")}>
            <div className="nav-logo-icon">RT</div>
            <div className="nav-logo-text">Relief<span>Track</span></div>
          </div>
          
          <div className="nav-links">
            <button className={`nav-btn ${page === "home" ? "active" : ""}`} onClick={() => navigate("home")}>Home</button>
            <button className={`nav-btn ${page === "reports" ? "active" : ""}`} onClick={() => navigate("reports")}>Live Map</button>
            <button className={`nav-btn ${page === "forecast" ? "active" : ""}`} onClick={() => navigate("forecast")}>Forecast</button>
            <button className={`nav-btn ${page === "tracker" ? "active" : ""}`} onClick={() => navigate("tracker")}>Track SOS</button>
            <button className={`nav-btn ${page === "requests" ? "active" : ""}`} onClick={() => navigate("requests")}>Help Out</button>
          </div>

          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <div className="auth-container">
              <button 
                className={`nav-btn ${isShutterOpen ? "active" : ""}`} 
                onClick={() => setIsShutterOpen(!isShutterOpen)}
              >
                ⚙️ Account ▾
              </button>
              
              <div className={`shutter-menu ${isShutterOpen ? "open" : ""}`}>
                <button className="shutter-item" onClick={() => { setIsShutterOpen(false); setIsSettingsOpen(true); }}>🎛️ Preferences</button>
                
                {isLoggedIn ? (
                  <button className="shutter-item" onClick={() => { setIsLoggedIn(false); setIsShutterOpen(false); navigate("home"); }}>🚪 Log Out</button>
                ) : (
                  <>
                    <button className="shutter-item" onClick={() => { navigate("login"); setIsShutterOpen(false); }}>🔐 Log In</button>
                    <button className="shutter-item" onClick={() => { navigate("signup"); setIsShutterOpen(false); }}>📝 Sign Up</button>
                  </>
                )}
              </div>
            </div>
            <button className="nav-cta" onClick={() => navigate("report")}>🚨 Send SOS</button>
          </div>
        </nav>

        <SettingsModal 
          isOpen={isSettingsOpen} 
          onClose={() => setIsSettingsOpen(false)} 
        />
        
        {page === "login" && (
          <LoginView 
            onLoginSuccess={() => { setIsLoggedIn(true); navigate("home"); }} 
            onSwitchToSignup={() => navigate("signup")} 
          />
        )}
        
        {page === "signup" && (
          <SignupView 
            onSignupSuccess={() => { setIsLoggedIn(true); navigate("home"); }} 
            onSwitchToLogin={() => navigate("login")} 
          />
        )}

        {page === "home" && <LandingPage onNavigate={navigate} />}
        {page === "report" && <ReportForm onSuccess={handleFormSuccess} />}
        {page === "reports" && <ReportsView onTrack={handleTrack} />}
        {page === "forecast" && <ForecastView />}
        {page === "tracker" && <TrackerView key={trackId} preloadId={trackId} />}
        {page === "requests" && <RequestsView />}

        <footer>
          <div className="footer-inner">
            <div className="footer-brand">
              <div className="nav-logo">
                <div className="nav-logo-icon">RT</div>
                <div className="nav-logo-text">Relief<span>Track</span></div>
              </div>
              <p>An emergency coordination platform mapping critical needs to willing volunteers and rescue authorities in real-time.</p>
            </div>
            <div className="footer-col">
              <h4>Platform</h4>
              <a onClick={() => navigate("report")}>Send SOS Signal</a>
              <a onClick={() => navigate("reports")}>View Active Map</a>
              <a onClick={() => navigate("forecast")}>View AI Forecast</a>
              <a onClick={() => navigate("requests")}>Volunteer & Donate</a>
            </div>
            <div className="footer-col">
              <h4>Emergencies</h4>
              <a>Flood Relief</a>
              <a>Earthquake Response</a>
              <a>Wildfire Evacuation</a>
              <a>Medical Triage</a>
            </div>
            <div className="footer-col">
              <h4>Resources</h4>
              <a>Volunteer Guidelines</a>
              <a>Safety Protocols</a>
              <a>Open Data API</a>
              <a>Contact Admins</a>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 ReliefTrack — Ready to Respond</span>
            <div className="footer-status"><div className="status-dot" /> Network Systems Online</div>
          </div>
        </footer>
      </div>
    </>
  );
}