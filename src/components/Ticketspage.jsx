// import { useState } from "react";
// import { useNavigate } from "react-router-dom";


// export default function TicketsPage({ movie, theater, showDateTime, seats, totalAmount, posterUrl }) {
//   const navigate  = useNavigate();
//   const [showQR, setShowQR] = useState(false);

//   const seatArr   = Array.isArray(seats) ? seats : seats?.split(",").map(s => s.trim());
//   const seatList  = seatArr?.join(", ");
//   const seatCount = seatArr?.length ?? 0;
//   const formatted = Number(totalAmount).toFixed(2);
//   const bookingId = `GOKU${Date.now().toString().slice(-10)}`;

//   return (
//     <div style={S.page}>

//       {/* ── Navbar ── */}
//       <nav style={S.nav}>
//         <button onClick={() => navigate(-1)} style={S.iconBtn}>
//           <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
//             <path d="M13 4l-6 6 6 6" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
//           </svg>
//         </button>
//         <span style={S.navTitle}>My Tickets</span>
//         <span style={S.navBadge}>{seatCount}</span>
//       </nav>

//       {/* ── Dark hero: poster + movie info ── */}
//       <div style={S.hero}>
//         <div style={S.heroGlow}/>
//         <img src={posterUrl} alt="poster" style={S.poster}/>
//         <div>
//           <p style={S.nowShowing}>NOW SHOWING</p>
//           <h2 style={S.movieTitle}>{movie?.title ?? movie}</h2>
//           <p style={S.movieMeta}>{movie?.language ?? "Telugu"} &middot; {movie?.format ?? "2D"}</p>
//         </div>
//       </div>

//       {/* ── White Ticket Card ── */}
//       <div style={S.card}>

//         {/* Yellow banner */}
//         <div style={S.banner}>
//           <div style={S.bannerIcon}><QRIcon/></div>
//           <p style={S.bannerText}>Ticket sent to your contact — keep it handy at the venue</p>
//         </div>

//         {/* Detail rows */}
//         <div style={S.rows}>
//           {[
//             ["Date & Time", showDateTime],
//             ["Venue",       theater?.name ?? theater],
//             ["Address",     theater?.address ?? "—"],
//             ["Seats",       seatList],
//           ].map(([label, val]) => (
//             <div key={label} style={S.row}>
//               <span style={S.rowLabel}>{label}</span>
//               <span style={S.rowVal}>{val}</span>
//             </div>
//           ))}
//         </div>

//         {/* Tear perforated line */}
//         <div style={S.tear}>
//           <div style={S.circle}/>
//           <div style={S.dash}/>
//           <div style={S.circle}/>
//         </div>

//         {/* Stub */}
//         <div style={S.stub}>
//           <div style={{ flex:1 }}>
//             <p style={S.stubCount}>{seatCount} Ticket{seatCount > 1 ? "s" : ""}</p>
//             <p style={S.stubTheater}>{theater?.name ?? theater}</p>
//             <p style={S.stubSeats}>{seatList}</p>
//             <p style={S.stubId}>BOOKING ID: {bookingId}</p>
//           </div>
//           {/* QR toggle */}
//           <button onClick={() => setShowQR(q => !q)} style={S.qrBox}>
//             {showQR
//               ? <QRIcon size={52} color="#db2777"/>
//               : <><QRIcon size={22} color="#db2777"/><span style={S.qrHint}>Show QR</span></>}
//           </button>
//         </div>

//         {/* Total */}
//         <div style={S.footer}>
//           <span style={S.cancelNote}>Cancellation not available for this venue</span>
//           <div style={S.totalRow}>
//             <span style={S.totalLabel}>Total Amount</span>
//             <span style={S.totalAmt}>₹{formatted}</span>
//           </div>
//         </div>
//       </div>

//       {/* ── CTA buttons ── */}
//       <div style={S.actions}>
//         <button onClick={() => navigate("/")} style={S.btnPink}>Book Another Movie</button>
//         <button style={S.btnGhost}>Download Ticket</button>
//       </div>
//     </div>
//   );
// }

// function QRIcon({ size = 24, color = "#333" }) {
//   return (
//     <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
//       <rect x="2" y="2" width="10" height="10" rx="1.5" stroke={color} strokeWidth="1.6"/>
//       <rect x="4" y="4" width="6"  height="6"  fill={color} rx="0.5"/>
//       <rect x="16" y="2" width="10" height="10" rx="1.5" stroke={color} strokeWidth="1.6"/>
//       <rect x="18" y="4" width="6"  height="6"  fill={color} rx="0.5"/>
//       <rect x="2" y="16" width="10" height="10" rx="1.5" stroke={color} strokeWidth="1.6"/>
//       <rect x="4" y="18" width="6"  height="6"  fill={color} rx="0.5"/>
//       <rect x="16" y="16" width="3" height="3" fill={color} rx="0.5"/>
//       <rect x="22" y="16" width="3" height="3" fill={color} rx="0.5"/>
//       <rect x="19" y="19" width="3" height="3" fill={color} rx="0.5"/>
//       <rect x="22" y="22" width="3" height="3" fill={color} rx="0.5"/>
//     </svg>
//   );
// }

// const S = {
//   page:        { minHeight:"100vh", background:"#0f0f13", fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", paddingBottom:48 },

//   // Navbar
//   nav:         { display:"flex", alignItems:"center", gap:12, padding:"0 16px", height:56, background:"rgba(15,15,19,0.96)", backdropFilter:"blur(10px)", position:"sticky", top:0, zIndex:100, borderBottom:"1px solid rgba(255,255,255,0.07)" },
//   iconBtn:     { background:"none", border:"none", cursor:"pointer", padding:"6px 4px", display:"flex", alignItems:"center" },
//   navTitle:    { flex:1, fontSize:17, fontWeight:700, color:"#fff" },
//   navBadge:    { background:"#db2777", color:"#fff", fontSize:12, fontWeight:700, borderRadius:20, padding:"2px 10px" },

//   // Hero
//   hero:        { position:"relative", overflow:"hidden", padding:"28px 18px 24px", display:"flex", gap:16, alignItems:"flex-end" },
//   heroGlow:    { position:"absolute", inset:0, background:"linear-gradient(135deg,rgba(219,39,119,0.2) 0%,transparent 70%)", pointerEvents:"none" },
//   poster:      { width:76, height:104, borderRadius:10, objectFit:"cover", flexShrink:0, boxShadow:"0 8px 28px rgba(0,0,0,0.55)", position:"relative", zIndex:1 },
//   nowShowing:  { margin:"0 0 5px", fontSize:10, fontWeight:700, color:"#db2777", letterSpacing:2, textTransform:"uppercase" },
//   movieTitle:  { margin:"0 0 6px", fontSize:20, fontWeight:800, color:"#fff", lineHeight:1.25, position:"relative", zIndex:1 },
//   movieMeta:   { margin:0, fontSize:12.5, color:"rgba(255,255,255,0.42)" },

//   // Card
//   card:        { margin:"0 14px", background:"#fff", borderRadius:20, overflow:"hidden", boxShadow:"0 6px 36px rgba(0,0,0,0.4)" },

//   // Banner
//   banner:      { background:"#FFD740", display:"flex", alignItems:"center", gap:10, padding:"11px 14px" },
//   bannerIcon:  { background:"#fff", borderRadius:7, width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 },
//   bannerText:  { margin:0, fontSize:12, fontWeight:500, color:"#1a1a1a", lineHeight:1.45 },

//   // Rows
//   rows:        { padding:"14px 16px 4px" },
//   row:         { display:"flex", justifyContent:"space-between", alignItems:"baseline", padding:"7px 0", borderBottom:"1px solid #f4f4f4" },
//   rowLabel:    { fontSize:12, color:"#aaa", flexShrink:0, marginRight:8 },
//   rowVal:      { fontSize:13, fontWeight:600, color:"#1a1a1a", textAlign:"right" },

//   // Tear
//   tear:        { display:"flex", alignItems:"center", margin:"14px 0 0" },
//   circle:      { width:16, height:16, borderRadius:"50%", background:"#0f0f13", flexShrink:0, margin:"0 -8px" },
//   dash:        { flex:1, borderTop:"2px dashed #e4e4e4" },

//   // Stub
//   stub:        { padding:"16px 16px 12px", display:"flex", alignItems:"center", gap:12 },
//   stubCount:   { margin:"0 0 2px", fontSize:12, color:"#aaa" },
//   stubTheater: { margin:"0 0 3px", fontSize:17, fontWeight:800, color:"#1a1a1a", letterSpacing:0.3, textTransform:"uppercase" },
//   stubSeats:   { margin:"0 0 6px", fontSize:12, color:"#888", textTransform:"uppercase", letterSpacing:0.3 },
//   stubId:      { margin:0, fontSize:11, fontWeight:700, color:"#777", letterSpacing:0.3 },

//   // QR
//   qrBox:       { background:"#fdf0f6", border:"1.5px dashed #f9a8d4", borderRadius:10, width:72, height:72, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:4, cursor:"pointer", flexShrink:0 },
//   qrHint:      { margin:0, fontSize:10, color:"#db2777", fontWeight:600 },

//   // Footer
//   footer:      { borderTop:"1px solid #f0f0f0", padding:"10px 16px 16px" },
//   cancelNote:  { display:"block", textAlign:"center", fontSize:11, color:"#bbb", marginBottom:10 },
//   totalRow:    { display:"flex", justifyContent:"space-between", alignItems:"center" },
//   totalLabel:  { fontSize:14, fontWeight:600, color:"#1a1a1a" },
//   totalAmt:    { fontSize:16, fontWeight:800, color:"#1a1a1a" },

//   // Actions
//   actions:     { display:"flex", flexDirection:"column", gap:10, padding:"20px 14px 0" },
//   btnPink:     { width:"100%", padding:"14px 0", background:"#db2777", color:"#fff", fontSize:15, fontWeight:700, border:"none", borderRadius:13, cursor:"pointer" },
//   btnGhost:    { width:"100%", padding:"13px 0", background:"transparent", color:"rgba(255,255,255,0.55)", fontSize:14, fontWeight:500, border:"1px solid rgba(255,255,255,0.15)", borderRadius:13, cursor:"pointer" },
// };