import React, { useState, useEffect } from 'react';
import { ChevronLeft, Calendar, Clock, User, Scissors, CheckCircle, Loader2, Star, AlertCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createBooking, getServices, getEmployees } from '../services/api';

const BookingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedService, setSelectedService] = useState(location.state?.selectedService || null);
  const [servicesList, setServicesList] = useState([]);
  const [isFetchingServices, setIsFetchingServices] = useState(false);

  const [dates, setDates] = useState([]);
  const [stylists, setStylists] = useState([]);
  const [isFetchingStylists, setIsFetchingStylists] = useState(true);

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedStylist, setSelectedStylist] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 🔥 NEW: State for Conflict Popup
  const [conflict, setConflict] = useState(null);

  // 1. Fetch Services (Fallback)
  useEffect(() => {
    if (!selectedService) {
      const fetchServices = async () => {
        setIsFetchingServices(true);
        try {
          const data = await getServices();
          setServicesList(data);
        } catch (err) {
          console.error(err);
        } finally {
          setIsFetchingServices(false);
        }
      };
      fetchServices();
    }
  }, [selectedService]);

  // 2. Fetch Stylists (REAL DATA)
  useEffect(() => {
    const fetchStylists = async () => {
      try {
        const data = await getEmployees();
        setStylists(data);
      } catch (err) {
        console.error("Failed to load stylists", err);
      } finally {
        setIsFetchingStylists(false);
      }
    };
    fetchStylists();
  }, []);

  // 3. Generate Dates
  useEffect(() => {
    const d = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      d.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        date: date.getDate(),
        fullDate: date.toISOString().split('T')[0]
      });
    }
    setDates(d);
    setSelectedDate(d[0].fullDate);
  }, []);

  const times = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];

  // ✅ HANDLE CONFIRM (Fixed Logic)
  const handleConfirm = async (overrideTime = null) => {

    // 1. Fix Circular JSON Error: Check if overrideTime is a string (retry) or Event object (click)
    let timeToBook = selectedTime;
    if (typeof overrideTime === 'string') {
      timeToBook = overrideTime;
    }

    if (!selectedService || !selectedDate || !timeToBook || !selectedStylist) return;

    setLoading(true);
    setError('');
    setConflict(null); // Close any existing popup

    try {
      const bookingData = {
        booking_date: selectedDate,
        booking_time: timeToBook,
        employee: selectedStylist,
        items: [{ service: selectedService.id, price: selectedService.price }],
        total_price: selectedService.price
      };

      const response = await createBooking(bookingData);

      navigate('/success', { state: { booking: response, service: selectedService } });

    } catch (err) {
      console.error("Booking Error:", err);

      if (err.response && err.response.data) {
        const data = err.response.data;

        // 2. Fix Array vs String Parsing Logic
        const errorType = Array.isArray(data.error) ? data.error[0] : data.error;
        const msg = Array.isArray(data.message) ? data.message[0] : data.message;
        const suggestion = Array.isArray(data.suggested_time) ? data.suggested_time[0] : data.suggested_time;

        // 3. If Slot Taken, Show Custom UI Popup
        if (errorType === "Slot Taken" && suggestion) {
          setConflict({
            message: msg,
            suggestedTime: suggestion
          });
        } else {
          // Other errors
          setError(msg || "Booking failed.");
        }
      } else {
        setError("Booking failed. Please check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] transition-colors duration-300 pb-32">

      <div className="pt-24 md:pt-32 max-w-xl mx-auto px-5 animate-fade-in">

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(-1)} className="p-2.5 bg-[var(--card-bg)] rounded-xl border border-[var(--border-color)] hover:bg-crimson hover:text-white transition-colors">
            <ChevronLeft size={20} className="text-[var(--text-primary)]" />
          </button>
          <h1 className="text-2xl font-serif font-bold text-[var(--text-primary)]">Book Appointment</h1>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-200 text-red-700 rounded-xl text-sm flex items-center gap-2">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        {/* 1. SERVICE SELECTION */}
        {!selectedService ? (
          <div className="mb-8">
            <h3 className="font-bold text-lg text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <Scissors size={18} className="text-crimson" /> Select Service
            </h3>
            {isFetchingServices ? (
              <div className="text-center py-8"><Loader2 className="animate-spin text-crimson mx-auto" /></div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {servicesList.map((srv) => (
                  <div key={srv.id} onClick={() => setSelectedService(srv)} className="p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] cursor-pointer flex justify-between items-center hover:border-crimson transition-colors shadow-sm">
                    <div><span className="font-bold text-[var(--text-primary)] block">{srv.name}</span><span className="text-xs text-[var(--text-secondary)]">{srv.duration_minutes || 30} mins</span></div>
                    <span className="text-crimson font-bold text-lg">₹{srv.price}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-[var(--text-primary)] p-5 rounded-3xl text-[var(--bg-primary)] shadow-xl mb-8 flex justify-between items-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-crimson/20 rounded-full blur-3xl group-hover:bg-crimson/30 transition"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-1">
                <p className="opacity-70 text-xs font-bold uppercase tracking-wider">Selected Service</p>
                <button onClick={() => setSelectedService(null)} className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-white hover:bg-crimson transition">Change</button>
              </div>
              <h2 className="text-2xl font-serif font-bold">{selectedService.name}</h2>
            </div>
            <span className="text-2xl font-bold relative z-10">₹{selectedService.price}</span>
          </div>
        )}

        {/* 2. DATE PICKER */}
        <div className="mb-8">
          <h3 className="font-bold text-lg text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <Calendar size={18} className="text-crimson" /> Pick Date
          </h3>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            {dates.map((d, i) => (
              <button key={i} onClick={() => setSelectedDate(d.fullDate)} className={`min-w-[72px] p-3 rounded-2xl border transition-all duration-300 flex flex-col items-center gap-1 ${selectedDate === d.fullDate ? 'bg-crimson text-white border-crimson shadow-lg scale-105' : 'bg-[var(--card-bg)] border-[var(--border-color)] text-[var(--text-primary)] opacity-70'}`}>
                <span className="text-xs font-medium uppercase">{d.day}</span>
                <span className="text-xl font-bold">{d.date}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 3. TIME PICKER */}
        <div className="mb-8">
          <h3 className="font-bold text-lg text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <Clock size={18} className="text-crimson" /> Pick Time
          </h3>
          <div className="grid grid-cols-4 gap-3">
            {times.map((t) => (
              <button key={t} onClick={() => setSelectedTime(t)} className={`py-2.5 rounded-xl text-sm font-bold border transition-all duration-300 ${selectedTime === t ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] border-[var(--text-primary)] shadow-md' : 'bg-[var(--card-bg)] border-[var(--border-color)] text-[var(--text-primary)] hover:border-crimson/50'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* 4. REAL STYLIST SELECTION */}
        <div className="mb-10">
          <h3 className="font-bold text-lg text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <User size={18} className="text-crimson" /> Choose Stylist
          </h3>

          {isFetchingStylists ? (
            <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              <Loader2 className="animate-spin text-crimson" size={18} /> Loading staff...
            </div>
          ) : (
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
              {stylists.length > 0 ? stylists.map((emp) => (
                <div
                  key={emp.id}
                  onClick={() => setSelectedStylist(emp.id)}
                  className={`min-w-[140px] p-4 rounded-2xl border cursor-pointer transition-all duration-300 relative group
                    ${selectedStylist === emp.id
                      ? 'border-crimson bg-[var(--card-bg)] ring-2 ring-crimson/20 shadow-lg'
                      : 'border-[var(--border-color)] bg-[var(--card-bg)] hover:border-crimson/50 hover:shadow-md'}`}
                >
                  {selectedStylist === emp.id && (
                    <div className="absolute top-3 right-3 w-3 h-3 bg-crimson rounded-full animate-pulse"></div>
                  )}

                  <img
                    src={emp.user_details?.profile_picture || `https://ui-avatars.com/api/?name=${emp.user_details?.username || 'Staff'}&background=random`}
                    alt={emp.user_details?.username}
                    className="w-16 h-16 rounded-full mx-auto mb-3 object-cover border-2 border-[var(--bg-primary)] shadow-sm group-hover:scale-105 transition-transform"
                  />

                  <div className="text-center">
                    <p className="text-sm font-bold text-[var(--text-primary)] truncate">
                      {emp.user_details?.username || "Stylist"}
                    </p>
                    <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wide mb-2">
                      {emp.job_title || "Barber"}
                    </p>
                  </div>

                  <div className="flex justify-between items-center bg-[var(--bg-primary)] rounded-lg px-2 py-1 mt-1">
                    <div className="flex items-center gap-1 text-[10px] font-bold text-[var(--text-primary)]">
                      <Star size={10} className="text-yellow-500 fill-current" />
                      {emp.rating || "5.0"}
                    </div>
                    <div className="text-[10px] text-[var(--text-secondary)]">
                      {emp.years_of_experience || 1}y exp
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-sm text-[var(--text-secondary)] p-2">No stylists available right now.</div>
              )}
            </div>
          )}
        </div>

      </div>

      {/* 🔥 CONFLICT POPUP MODAL (Light Theme for Visibility) */}
      {conflict && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">

          {/* Card: Pure White Background */}
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl transform scale-100 transition-transform">

            {/* Icon Circle */}
            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mb-4 mx-auto border border-red-100">
              <Clock className="text-crimson" size={28} />
            </div>

            {/* Title: Dark Black Text */}
            <h3 className="text-xl font-serif font-bold text-center text-black mb-2">
              Slot Unavailable
            </h3>

            {/* Message: Dark Grey Text */}
            <div className="text-center mb-6">
              <p className="text-sm text-gray-600 leading-relaxed px-2">
                {conflict.message}
              </p>

              {/* Suggested Time Box */}
              <div className="mt-4 bg-gray-50 border border-gray-200 rounded-xl py-3 mx-4">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Available at</p>
                <p className="text-3xl font-black text-crimson">
                  {conflict.suggestedTime}
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setConflict(null)}
                className="flex-1 py-3 bg-gray-100 text-gray-800 rounded-xl font-bold text-sm hover:bg-gray-200 transition border border-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleConfirm(conflict.suggestedTime)}
                className="flex-1 py-3 bg-crimson text-white rounded-xl font-bold text-sm shadow-lg shadow-red-200 hover:bg-red-700 transition"
              >
                Book Now
              </button>
            </div>

          </div>
        </div>
      )}

      {/* FOOTER */}
      <div className="fixed bottom-0 w-full bg-[var(--card-bg)]/90 backdrop-blur-xl p-4 border-t border-[var(--border-color)] z-50 pb-safe">
        <div className="max-w-xl mx-auto flex justify-between items-center">
          <div>
            <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wider font-bold">Total Pay</p>
            <h2 className="text-2xl font-bold text-crimson">₹{selectedService ? selectedService.price : 0}</h2>
          </div>

          <button
            onClick={() => handleConfirm(null)} // 👈 Fix: Pass null explicity
            disabled={!selectedDate || !selectedTime || !selectedStylist || !selectedService || loading}
            className="px-8 py-3.5 bg-crimson hover:bg-ruby text-white rounded-2xl font-bold shadow-lg shadow-crimson/30 disabled:bg-gray-300 disabled:shadow-none disabled:cursor-not-allowed transition-all active:scale-95 flex items-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : <>Confirm Booking <CheckCircle size={18} /></>}
          </button>
        </div>
      </div>

    </div>
  );
};

export default BookingPage;