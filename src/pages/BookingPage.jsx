import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCategories, getServices, getEmployees, createBooking } from '../services/api';
import { CheckCircle, Loader2, AlertCircle, X, Clock, Calendar, ChevronRight } from 'lucide-react';

const BookingPage = () => {
  const navigate = useNavigate();
  
  // Data States
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Selection States
  const [activeCategory, setActiveCategory] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  
  const [submitting, setSubmitting] = useState(false);

  // Modal State
  const [conflictData, setConflictData] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [catData, srvData, empData] = await Promise.all([
          getCategories(), getServices(), getEmployees()
        ]);
        setCategories(catData);
        setServices(srvData);
        setEmployees(empData);
        if(catData.length > 0) setActiveCategory(catData[0].id);
      } catch (error) { console.error(error); } 
      finally { setLoading(false); }
    };
    loadData();
  }, []);

  const toggleService = (id) => {
    if (selectedServices.includes(id)) {
      setSelectedServices(selectedServices.filter(s => s !== id));
    } else {
      setSelectedServices([...selectedServices, id]);
    }
  };

  const calculateTotal = () => {
    return services
      .filter(s => selectedServices.includes(s.id))
      .reduce((sum, s) => sum + Number(s.price), 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedServices.length === 0) return alert("Please select at least one service.");
    if (!selectedEmployee) return alert("Please select a stylist.");
    if (!date || !time) return alert("Please select date and time.");

    setSubmitting(true);
    
    let cleanTime = Array.isArray(time) ? time[0] : time;
    cleanTime = String(cleanTime);

    const bookingPayload = {
      service_ids: selectedServices.map(id => Number(id)), 
      employee: Number(selectedEmployee),     
      booking_date: date,            
      booking_time: cleanTime 
    };

    try {
      const response = await createBooking(bookingPayload);
      navigate('/success', { state: { booking: response } }); 
    } catch (error) {
      console.error("Booking Error:", error);
      if (error.response && error.response.data) {
          const errData = error.response.data;
          if (errData.suggested_time) {
              const rawSuggestion = errData.suggested_time;
              const suggestedTime = Array.isArray(rawSuggestion) ? rawSuggestion[0] : rawSuggestion;
              setConflictData({
                  requestedTime: cleanTime,
                  suggestedTime: String(suggestedTime)
              });
              setShowModal(true);
          } else if (errData.message) {
              alert(errData.message);
          } else {
              alert("Booking Failed. Check inputs.");
          }
      } else {
          alert("Network Error.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleSwitchTime = () => {
      if (conflictData) {
          setTime(conflictData.suggestedTime);
          setShowModal(false);
          setConflictData(null);
      }
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-[#3F0D12]" size={40}/></div>;

  return (
    // 🔥 FIX: Added 'pt-24' to push content down (avoids navbar overlap)
    // 🔥 FIX: Removed hardcoded 'bg-[#FBE4E3]' so global theme works
    <div className="min-h-screen pt-24 pb-32 md:pb-10 px-4 md:px-8 transition-colors duration-300">
      
      {/* Custom Modal */}
      {showModal && conflictData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 relative z-10 animate-fade-in-up border border-[#EACCCC]">
                <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <X size={24} />
                </button>
                <div className="text-center mb-6">
                    <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <AlertCircle className="text-[#D72638]" size={28} />
                    </div>
                    <h3 className="text-xl font-serif font-bold text-[#3F0D12]">Slot Unavailable</h3>
                    <p className="text-sm text-gray-500 mt-2">
                        Time <span className="font-bold text-[#3F0D12]">{conflictData.requestedTime}</span> is busy.
                    </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl flex items-center justify-between mb-6 border border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="bg-white p-2 rounded-lg text-[#D72638]"><Clock size={18} /></div>
                        <div>
                            <p className="text-[10px] text-gray-500 font-bold uppercase">Next Available</p>
                            <p className="text-lg font-black text-[#3F0D12]">{conflictData.suggestedTime}</p>
                        </div>
                    </div>
                    <button onClick={handleSwitchTime} className="text-xs bg-[#3F0D12] text-white px-3 py-1.5 rounded-lg font-bold shadow-md hover:bg-[#5a1a20]">
                        Switch
                    </button>
                </div>
                <button onClick={() => setShowModal(false)} className="w-full py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-50 text-sm">
                    Cancel
                </button>
            </div>
        </div>
      )}

      {/* Main Content Wrapper */}
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        
        {/* Header - 🔥 Removed 'sticky top-0' to fix overlap */}
        <div className="bg-[#3F0D12] p-6 text-center text-white relative">
          <h1 className="text-2xl md:text-3xl font-serif font-bold">Book Appointment</h1>
          <p className="opacity-80 text-sm mt-1">Select services & stylist.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-5 md:p-8 space-y-8">
          
          {/* 1. Services */}
          <section>
            <h3 className="text-lg font-bold text-[#3F0D12] mb-3 flex items-center gap-2">
                <span className="bg-gray-100 text-[#3F0D12] w-6 h-6 flex items-center justify-center rounded-full text-xs">1</span> 
                Select Services
            </h3>
            
            <div className="flex gap-2 overflow-x-auto pb-2 mb-3 scrollbar-hide">
              {categories.map(cat => (
                <button type="button" key={cat.id} onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all flex-shrink-0
                  ${activeCategory === cat.id ? 'bg-[#3F0D12] text-white shadow-md' : 'bg-gray-100 text-gray-500'}`}>
                  {cat.name}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {services.filter(s => s.category === activeCategory).map(service => (
                <div key={service.id} onClick={() => toggleService(service.id)}
                  className={`p-4 border rounded-2xl cursor-pointer flex justify-between items-center transition-all active:scale-95
                  ${selectedServices.includes(service.id) ? 'border-[#D72638] bg-red-50 shadow-sm' : 'border-gray-100 hover:border-gray-300'}`}>
                  <div>
                    <h4 className="font-bold text-[#3F0D12] text-sm">{service.name}</h4>
                    <p className="text-xs text-gray-500 mt-1">₹{service.price} • {service.duration_minutes} mins</p>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center 
                      ${selectedServices.includes(service.id) ? 'border-[#D72638] bg-[#D72638]' : 'border-gray-300'}`}>
                      {selectedServices.includes(service.id) && <CheckCircle className="text-white" size={14}/>}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 2. Stylist */}
          <section>
            <h3 className="text-lg font-bold text-[#3F0D12] mb-3 flex items-center gap-2">
                <span className="bg-gray-100 text-[#3F0D12] w-6 h-6 flex items-center justify-center rounded-full text-xs">2</span> 
                Choose Stylist
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {employees.map(emp => (
                <div key={emp.id} onClick={() => setSelectedEmployee(emp.id)}
                  className={`p-3 border rounded-xl cursor-pointer text-center transition-all active:scale-95
                  ${selectedEmployee === emp.id ? 'border-[#D72638] bg-red-50 shadow-md ring-1 ring-[#D72638]' : 'border-gray-200'}`}>
                  <div className="w-10 h-10 bg-[#3F0D12] text-white rounded-full flex items-center justify-center mx-auto mb-2 font-bold text-sm uppercase">
                      {emp.user_details?.username?.[0]}
                  </div>
                  <h4 className="font-bold text-xs text-[#3F0D12] truncate">{emp.user_details?.username}</h4>
                  <p className="text-[10px] text-gray-500 truncate">{emp.job_title}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 3. Date & Time */}
          <section>
            <h3 className="text-lg font-bold text-[#3F0D12] mb-3 flex items-center gap-2">
                <span className="bg-gray-100 text-[#3F0D12] w-6 h-6 flex items-center justify-center rounded-full text-xs">3</span> 
                Date & Time
            </h3>
            <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                    <label className="text-xs font-bold text-gray-500 mb-1 block">Date</label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-3 text-gray-400" size={16}/>
                        <input type="date" className="w-full pl-10 p-3 border rounded-xl bg-gray-50 text-sm font-bold text-[#3F0D12] outline-none focus:ring-1 focus:ring-[#3F0D12]"
                            min={new Date().toISOString().split('T')[0]}
                            value={date} onChange={(e) => setDate(e.target.value)} required />
                    </div>
                </div>
                <div>
                    <label className="text-xs font-bold text-gray-500 mb-1 block">Time</label>
                    <div className="relative">
                        <Clock className="absolute left-3 top-3 text-gray-400" size={16}/>
                        <input type="time" className="w-full pl-10 p-3 border rounded-xl bg-gray-50 text-sm font-bold text-[#3F0D12] outline-none focus:ring-1 focus:ring-[#3F0D12]"
                            value={Array.isArray(time) ? time[0] : time} 
                            onChange={(e) => setTime(e.target.value)} required />
                    </div>
                </div>
            </div>
          </section>

          {/* Desktop Submit Button */}
          <button type="submit" disabled={submitting} 
            className="hidden md:flex w-full bg-[#3F0D12] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#5a1a20] transition-all items-center justify-center gap-2 shadow-lg">
            {submitting ? <Loader2 className="animate-spin" /> : "Confirm Booking"}
          </button>

        </form>

        {/* 🔥 MOBILE STICKY FOOTER (Fixed Bottom) */}
        <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-20">
            <div className="flex justify-between items-center mb-2">
                <p className="text-xs text-gray-500 font-bold">{selectedServices.length} Services Selected</p>
                <p className="text-xl font-black text-[#3F0D12]">₹{calculateTotal()}</p>
            </div>
            <button onClick={handleSubmit} disabled={submitting} 
                className="w-full bg-[#3F0D12] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all">
                {submitting ? <Loader2 className="animate-spin" size={20}/> : <>Confirm Booking <ChevronRight size={18}/></>}
            </button>
        </div>

      </div>
    </div>
  );
};

export default BookingPage;