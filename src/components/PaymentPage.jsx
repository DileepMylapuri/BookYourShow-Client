import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContent";
import { ImageData } from "../assets/assets";
import { QRCodeCanvas } from "qrcode.react";
import API_BASE_URL from "../config";

export default function PaymentPage() {
  const [showQR, setShowQR] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
// null | 'processing' | 'success' | 'error'
  const { state } = useLocation();
  const navigate = useNavigate();
  const booking = state;
  const { user } = useAuth();

  const [selectedMethod, setSelectedMethod] = useState("Pay by any UPI App");

  if (!booking) {
    return (
      <div className="text-white p-6">
        <h2>No booking data found.</h2>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-4 py-2 bg-red-600 rounded">
          Back to Home
        </button>
      </div>
    );
  }

  const {
    movie = {},
    theater = {},
    showDateTime = {},
    seats = [],
    storageKey = null,
  } = booking;

  
  const gstRate = 0.09; 
  const baseAmount  = seats.reduce((sum, seat) => sum + (seat.price || 0), 0);
  const gstAmount = baseAmount  * gstRate;
  const totalAmount = baseAmount + gstAmount;

  // Sample payment options
  const paymentMethods = [
    { label: "Pay by any UPI App", icon: "UPI" },
    { label: "Debit/Credit Card", icon: "Card" },
    { label: "Mobile Wallets", icon: "Wallet" },
    { label: "Gift Voucher", icon: "Gift" },
    { label: "Net Banking", icon: "NetBank" },
    { label: "Pay Later", icon: "PayLater" },
    { label: "Redeem Points", icon: "Points" },
  ];

  const languageMap = {
    en: "English",
    hi: "Hindi",
    te: "Telugu",
    ta: "Tamil",
    ml: "Malayalam",
    kn: "Kannada",
  };


// const handlePayClick = () => {
//   const amount = totalAmount.toFixed(2);
//   const upiLink = `upi://pay?pa=${encodeURIComponent(payeeUPI)}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=Movie%20Ticket%20Booking`;
//   // Open the link to trigger the UPI app
//   window.location.href = upiLink;
// };

  const payeeUPI = "6360261790@ybl";
  const payeeName = "BookYourShow";
  const amount = totalAmount.toFixed(2);

  const upiLink = `upi://pay?pa=${encodeURIComponent(
    payeeUPI
  )}&pn=${encodeURIComponent(
    payeeName
  )}&am=${amount}&cu=INR&tn=Movie%20Ticket%20Booking`;
  

const proceedtoPay = async () => {
  setPaymentStatus('processing');
  try {
    // Save booking first — this is critical
    const bookingRes = await fetch(`${API_BASE_URL}/api/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        movieId: String(movie.id),
        movieTitle: movie.title,
        posterPath: movie.poster_path,
        theater: theater.name,
        date: showDateTime?.split(" | ")?.[0] ?? "",
        time: showDateTime?.split(" | ")?.[1] ?? "",
        seats: seats.map((s) => s.seatId),
        email: user?.email ?? "",
        totalAmount,
      }),
    });

    if (!bookingRes.ok) throw new Error("Booking failed");
    if (storageKey) sessionStorage.removeItem(storageKey);

    // Send email separately — don't fail payment if email fails
    fetch(`${API_BASE_URL}/api/send-booking-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: user.email,
        username: user.username,
        movie,
        theater,
        showDateTime,
        seats,
        totalAmount,
      }),
    }).catch((err) => console.warn("Email send failed (non-critical):", err));

    setPaymentStatus('success');
  } catch {
    setPaymentStatus('error');
  }
};

  return (
    <>
      <div className=" flex flex-row ml-3 text-gray-200">
        <button onClick={() => navigate(-1)} className="mb-2 text-gray-200 hover:text-blue-400 hover:underline font-semibold cursor-pointer">← Back to SeatSelection</button>
      </div>
    <div className="bg-black border-t min-h-screen flex flex-col md:flex-row gap-8 p-6 max-w-7xl mx-auto text-gray-500">
      {/* Left: Payment methods sidebar */}

      <aside className="hidden md:flex flex-col w-1/4 bg-gray-950 rounded-lg shadow-md divide-y divide-pink-300">
        {paymentMethods.map((method) => (
          <button
            key={method.label}
            onClick={() => setSelectedMethod(method.label)}
            className={`flex items-center gap-3 px-4 py-4 font-semibold text-left rounded-md hover:bg-gray-900 transition ${
              selectedMethod === method.label
                ? "bg-gray-900 border-l-4 border-pink-600 text-pink-700"
                : ""
            }`}
          >
            {/* Placeholder icon */}
            <span
        
              className={`inline-block w-6 h-6 bg-gray-300 rounded ${selectedMethod === method.label
                ? "bg-pink-900 border-l-4 border-pink-600 text-pink-500"
                : ""}`}
              aria-hidden="true"
            />
            {method.label}
          </button>
        ))}
      </aside>

      {/* Middle: Payment details */}
      <section className="bg-gray-950 rounded-lg shadow-md p-6 flex-1 min-w-0">
        <h2 className="font-bold text-xl text-gray-200 mb-6">Payment options</h2>
        {selectedMethod === "Pay by any UPI App" && (
          <div className="space-y-6">
            <button onClick={() => setShowQR(!showQR)} className="flex items-center w-full px-4 py-2 gap-3  bg-black-50 border border-violet-800 rounded-lg font-semibold text-pink-100 hover:border-violet-600 cursor-pointer transition">
              <img
                src={ImageData.PhonePay}
                alt="UPI"
                className="w-8 h-8 text-gray-300 bg-white rounded-full"
              />
              Pay by UPI
            </button>

            <div className="bg-gray-950 rounded-lg p-4 space-y-4">
              <button onClick={() => setShowQR(!showQR)} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg shadow text-gray-300 hover:bg-gray-900 transition cursor-pointer">
                <img src={ImageData.GooglePay} alt="GooglePay" className="w-8 h-8 rounded-full"/>Google Pay
              </button>

              <button className="flex gap-2 items-center px-4 py-2 border border-gray-300 rounded-lg shadow text-pink-600 font-semibold cursor-pointer hover:bg-gray-900 transition">
                <span className="text-2xl font-bold">+</span> Add new UPI
              </button>

              <div className="flex justify-center text-gray-200">Or</div>

              <button onClick={() => setShowQR(!showQR)} className="flex gap-2 items-center px-4 py-2 border border-gray-300 rounded-lg shadow text-gray-300 cursor-pointer hover:bg-gray-900 transition">
                <img src={ImageData.QRcode} alt="QR Code" className="w-8 h-8 rounded-full bg-amber-50"/>
                {showQR ? "Scan QR Code" : "Scan QR Code"}
              </button>
               {/* Show QR Code */}
              {showQR && (
                <div className="fixed inset-0 bg-black/70 bg-opacity-30 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg shadow-lg p-6 relative w-[320px] flex flex-col items-center">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">Scan to Pay with UPI</h2>
                    <QRCodeCanvas value={upiLink} size={250} bgColor="#ffffff" fgColor="#000000" includeMargin={true} />
                    <button onClick={() => setShowQR(false)} className="mt-6 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Close</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Placeholder for other payment methods */}
        {selectedMethod !== "Pay by any UPI App" && (
          <div className="text-center text-gray-300 py-10">Payment option <strong>{selectedMethod}</strong> details coming soon.</div>
        )}
      </section>

      {/* Right: Booking summary */}
      <aside className="bg-gray-950 rounded-lg shadow-md w-full md:w-1/4 p-6 flex flex-col gap-6 min-w-[280px]">
        <div className="flex items-start justify-between gap-4">
          {/* Left: Movie Details */}
          <div className="flex-1">
            <h3 className="font-bold text-lg text-gray-300">{movie.title} - {languageMap[movie.original_language] || movie.original_language} - (2D)</h3>
            <p className="text-sm text-gray-300">{showDateTime}</p>
            <p className="text-sm text-gray-300"></p>
            <p className="text-sm text-gray-300">
              {theater.name} ({theater.screen || "SCREEN 1"})
            </p>
            <p className="text-xs text-pink-600 mt-1">M-Ticket</p>
            <div className="mt-2 text-xs text-red-700 bg-red-100 px-2 py-1 rounded">
              Cancellation Unavailable
            </div>
          </div>
          {/* Right: Poster */}
          <div className="w-20 h-28 flex-shrink-0">
            <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title}className="w-full h-full object-cover rounded"/>
          </div>
        </div>
        <hr />

        <div className="flex flex-col gap-2 text-sm text-gray-300 mb-2">
          <div className="flex justify-between">
            <span>Ticket(s) price</span>
            <span>₹{baseAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Give to Underprivileged Musicians</span>
             <p>GST (0.9%) ₹{gstAmount.toFixed(2)}</p>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>Order total</span>
            <span>₹{totalAmount.toFixed(2)}</span>
          </div>
        </div>
        <hr />

        <div className="bg-gray-950 rounded shadow">
          <div className="font-semibold mb-2 text-gray-300">
            Your details <span className="text-red-600 text-xs ml-1">(For sending booking details)</span>
          </div>
          <div className="text-sm">{user?.email}</div>
          <div className="text-sm">{user?.username}</div>
          <div className="text-sm">{user?.phone} | {user?.region}</div>
          <div className="text-sm mt-1">
            <strong>Theater: </strong> {theater.name}, {theater.address}
          </div>
          <div className="text-sm">
            <strong>ShowTime: </strong> {showDateTime}
          </div>
          <div className="flex flex-wrap gap-1 mt-1">
            <strong>Seats: </strong>
            {seats.map((s) => (
              <span key={s.seatId} className="inline-block px-2 py-1 rounded text-sm border bg-gray-900 cursor-pointer text-indigo-600">
                {s.seatId} 
              </span>
            ))}
          </div>
        </div>

        {/* Apply Offers section */}
        <button className="flex items-center gap-2 text-yellow-500 font-semibold mt-4">
          <span>🌟</span> Apply Offers
        </button>

        {/* Proceed to Pay Button (shown on mobile only) */}
        <button onClick={proceedtoPay}
         className="block md:block cursor-pointer w-full mt-6 py-3 bg-pink-600 text-white font-bold rounded-lg shadow-lg hover:bg-pink-700 transition">
          Proceed to Pay ₹{totalAmount.toFixed(2)}
        </button>
      </aside>





      {/* Popup overlay */}
{paymentStatus && (
  <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4">
    <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden">

      {/* ── PROCESSING ── */}
      {paymentStatus === 'processing' && (
        <>
          {/* Pink header band */}
          <div className="bg-gradient-to-r from-pink-600 to-rose-500 px-6 pt-6 pb-10 text-center">
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
              <svg className="animate-spin w-8 h-8 text-white" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="13" stroke="rgba(255,255,255,0.3)" strokeWidth="3"/>
                <path d="M16 3 A13 13 0 0 1 29 16" stroke="white" strokeWidth="3" strokeLinecap="round"/>
              </svg>
            </div>
            <p className="text-white text-lg font-bold">Processing Payment</p>
            <p className="text-pink-100 text-xs mt-1">Please wait, do not close this window</p>
          </div>

          {/* White card pulled up over the band */}
          <div className="-mt-5 mx-4 bg-white rounded-xl shadow-md p-4 mb-4">
            {/* Movie row with poster */}
            <div className="flex items-center gap-3 mb-3">
              {movie.poster_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                  alt={movie.title}
                  className="w-10 h-14 rounded object-cover flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm truncate">{movie.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{showDateTime}</p>
                <p className="text-xs text-gray-400">{theater.name}</p>
              </div>
            </div>

            {/* Seat chips */}
            <div className="flex flex-wrap gap-1 mb-3">
              {seats.map((s) => (
                <span key={s.seatId} className="px-2 py-0.5 bg-pink-50 border border-pink-200 text-pink-700 text-xs rounded-full font-medium">
                  {s.seatId}
                </span>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
              <span className="text-sm text-gray-500">{seats.length} Ticket{seats.length > 1 ? 's' : ''}</span>
              <span className="text-base font-bold text-pink-600">₹{totalAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* Animated steps */}
          <div className="px-6 pb-6 flex flex-col gap-2">
            {[
              { label: 'Verifying booking details', icon: '🔍' },
              { label: 'Securing your seats', icon: '🪑' },
              { label: 'Sending confirmation email', icon: '📧' },
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-base">{step.icon}</span>
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-pink-400 to-rose-500 rounded-full animate-pulse"
                    style={{ width: `${40 + i * 20}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500 w-32 text-right">{step.label}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── SUCCESS ── */}
      {paymentStatus === 'success' && (
        <>
          {/* Green header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-400 px-6 pt-6 pb-10 text-center">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
              <svg className="w-9 h-9 text-white" viewBox="0 0 36 36" fill="none">
                <path d="M8 18.5L14.5 25L28 11" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p className="text-white text-xl font-bold">Booking Confirmed!</p>
            <p className="text-green-100 text-xs mt-1">Your tickets are on their way 🎉</p>
          </div>

          {/* Summary pulled up */}
          <div className="-mt-5 mx-4 bg-white rounded-xl shadow-md p-4 mb-4">
            <div className="flex items-center gap-3 mb-3">
              {movie.poster_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                  alt={movie.title}
                  className="w-10 h-14 rounded object-cover flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 text-sm truncate">{movie.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{showDateTime}</p>
                <p className="text-xs text-gray-400">{theater.name}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-1 mb-3">
              {seats.map((s) => (
                <span key={s.seatId} className="px-2 py-0.5 bg-green-50 border border-green-200 text-green-700 text-xs rounded-full font-medium">
                  {s.seatId}
                </span>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-3 flex justify-between">
              <span className="text-sm text-gray-500">Total Paid</span>
              <span className="text-sm font-bold text-green-600">₹{totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <div className="px-6 pb-6">
            <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-3 text-center mb-4">
              <p className="text-xs text-green-700 font-medium">📧 Ticket sent to <span className="font-bold">{user?.email}</span></p>
              <p className="text-xs text-green-500 mt-0.5">Check your inbox for the ticket</p>
            </div>
            <button
              onClick={() => navigate("/")}
              className="w-full py-2.5 bg-green-500 text-white text-sm font-semibold rounded-xl hover:bg-green-600 transition"
            >
              Back to Home
            </button>
          </div>
        </>
      )}

      {/* ── ERROR ── */}
      {paymentStatus === 'error' && (
        <>
          <div className="bg-gradient-to-r from-red-500 to-rose-600 px-6 pt-6 pb-10 text-center">
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
              <svg className="w-8 h-8 text-white" viewBox="0 0 28 28" fill="none">
                <path d="M8 8L20 20M20 8L8 20" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </div>
            <p className="text-white text-lg font-bold">Payment Failed</p>
            <p className="text-red-100 text-xs mt-1">Something went wrong. Please try again.</p>
          </div>
          <div className="-mt-5 mx-4 bg-white rounded-xl shadow-md p-4 mb-4 text-center">
            <p className="text-sm text-gray-500 mb-1">Your seats were not booked.</p>
            <p className="text-xs text-gray-400">No charges were made to your account.</p>
          </div>
          <div className="px-6 pb-6">
            <button
              onClick={() => setPaymentStatus(null)}
              className="w-full py-2.5 bg-pink-600 text-white text-sm font-semibold rounded-xl hover:bg-pink-700 transition"
            >
              Try Again
            </button>
          </div>
        </>
      )}

    </div>
  </div>
)}
    </div>
  </>
  );
}
