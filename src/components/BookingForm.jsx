import { useState } from 'react';

export default function BookingForm({ movie, seats, onComplete, onBack }) {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleOrder = () => {
    if (!name || !mobile || !email) {
      setError('Please fill all fields');
      return;
    }
    // Simulate booking success
    alert(`Booking confirmed for ${movie.title} seats: ${seats.join(', ')}`);
    onComplete();
  };

  return (
    <div>
      <button onClick={onBack} className="mb-4 text-blue-600 underline">Back to seat selection</button>
      <h2 className="mb-2">Booking Details</h2>
      {error && <div className="mb-2 text-red-600">{error}</div>}
      <div className="flex flex-col max-w-md gap-2">
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={e => setName(e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="tel"
          placeholder="Mobile Number"
          value={mobile}
          onChange={e => setMobile(e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="p-2 border rounded"
        />
        <button
          onClick={handleOrder}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Confirm Booking
        </button>
      </div>
    </div>
  );
}