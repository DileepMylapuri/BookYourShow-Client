import React from "react";

const seatIcons = ["🎟️", "👥", "👨‍👩‍👦", "👨‍👩‍👧‍👦", "🎭", "🏟️"];

const TicketModel = ({ maxTickets, initialSelected = 1, onConfirm, onSelect }) => {
  const [selectedCount, setSelectedCount] = React.useState(initialSelected);

  React.useEffect(() => {
    setSelectedCount(initialSelected);
  }, [initialSelected]);

  const handleSelect = (num) => {
    setSelectedCount(num);
    onSelect(num);
  };

  return (
    <div className="flex flex-col items-center gap-5 py-2">
      <div className="text-center">
        <h2 className="font-bold text-xl text-gray-800">How Many Seats?</h2>
        <p className="text-sm text-gray-400 mt-1">Select up to {maxTickets} seats</p>
      </div>

      <div className="flex gap-3">
        {Array.from({ length: maxTickets }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            onClick={() => handleSelect(num)}
            aria-label={`Select ${num} tickets`}
            className={`flex flex-col items-center justify-center w-14 h-16 rounded-xl border-2 transition-all
              ${selectedCount === num
                ? "border-pink-500 bg-pink-50 text-pink-600 shadow-md scale-105"
                : "border-gray-200 bg-gray-50 text-gray-600 hover:border-pink-300 hover:bg-pink-50"
              }`}
          >
            <span className="text-xl">{seatIcons[num - 1]}</span>
            <span className="text-sm font-bold mt-1">{num}</span>
          </button>
        ))}
      </div>

      <div className="text-sm text-gray-500 bg-gray-50 rounded-lg px-4 py-2">
        {selectedCount} seat{selectedCount > 1 ? "s" : ""} · ₹{selectedCount <= 3 ? 200 : selectedCount <= 6 ? 100 : 50} per seat (varies by row)
      </div>

      <button
        onClick={onConfirm}
        className="w-full bg-gradient-to-r from-pink-600 to-rose-500 text-white font-bold py-2.5 rounded-xl hover:from-pink-700 hover:to-rose-600 transition cursor-pointer shadow"
      >
        Confirm {selectedCount} Seat{selectedCount > 1 ? "s" : ""}
      </button>
    </div>
  );
};

export default TicketModel;
