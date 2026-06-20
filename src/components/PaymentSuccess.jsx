import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config";

export default function PaymentSuccess() {
  const params = new URLSearchParams(window.location.search);
  const sessionId = params.get("session_id");
  const [status, setStatus] = useState("checking"); // checking, paid, failed
  const [booking, setBooking] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    const checkStatus = async () => {
      if (!sessionId) {
        setStatus("failed");
        return;
      }

      try {
        // Retrieve Stripe session (server returns session with metadata)
        const r = await fetch(`${API_BASE_URL}/checkout-session?sessionId=${sessionId}`);
        const session = await r.json();
        const bookingId = session?.metadata?.bookingId;
        if (!bookingId) {
          setStatus("failed");
          return;
        }

        // Poll booking until it's marked PAID
        const poll = async () => {
          const res = await fetch(`${API_BASE_URL}/api/bookings/${bookingId}`);
          const bk = await res.json();
          if (cancelled) return;

          setBooking(bk);
          if (bk.status === "PAID") {
            setStatus("paid");
            return;
          } else {
            setStatus("checking");
            setTimeout(poll, 2000);
          }
        };

        poll();
      } catch (err) {
        console.error("Error checking payment:", err);
        setStatus("failed");
      }
    };

    checkStatus();
    return () => { cancelled = true; };
  }, [sessionId]);

  if (status === "checking") {
    return <div className="p-6 text-center">Checking payment status...</div>;
  }

  if (status === "paid") {
    return (
      <div className="p-6 text-center">
        <div className="mx-auto w-28 h-28 rounded-full bg-green-500 flex items-center justify-center text-white text-4xl animate-pulse">✓</div>
        <h2 className="mt-4 font-bold text-2xl">Payment Successful!</h2>
        <p className="mt-2">Booking ID: {booking?._id}</p>

        <button
          onClick={() => navigate(`/booking/${booking._id}`)}
          className="mt-6 px-6 py-3 bg-pink-600 text-white rounded"
        >
          Get Your Tickets
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 text-center">
      <h2 className="text-xl font-bold">Payment verification failed or cancelled.</h2>
      <button onClick={() => navigate("/")} className="mt-4 px-4 py-2 bg-gray-700 text-white rounded">
        Back Home
      </button>
    </div>
  );
}
