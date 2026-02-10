import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCategories, getServices, getEmployees, createBooking } from '../services/api';
import { Loader2, ChevronRight, ChevronLeft, CheckCircle, User } from 'lucide-react';
import toast from 'react-hot-toast';

// Components
import ServiceSelection from '../components/booking/ServiceSelection';
import StylistSelection from '../components/booking/StylistSelection';
import TimeSelection from '../components/booking/TimeSelection';
import BookingSummary from '../components/booking/BookingSummary';
import SelectionPreview from '../components/booking/SelectionPreview';

const BookingPage = () => {
  const navigate = useNavigate();

  // Data States
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Wizard State
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  // Selection States
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [catData, srvData, empData] = await Promise.all([
          getCategories(), getServices(), getEmployees()
        ]);
        setCategories(catData);
        setServices(srvData);
        setEmployees(empData);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load salon data");
      }
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

  const handleNext = () => {
    if (step === 1 && selectedServices.length === 0) return toast.error("Please select at least one service! ✂️");
    if (step === 2 && !selectedEmployee) return toast.error("Please choose a stylist! 👤");
    if (step === 3 && (!date || !time)) return toast.error("Please pick a date and time! 📅");

    setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const toastId = toast.loading("Confirming your booking...");

    const cleanTime = Array.isArray(time) ? time[0] : time;
    const bookingPayload = {
      service_ids: selectedServices.map(id => Number(id)),
      employee: Number(selectedEmployee),
      booking_date: date,
      booking_time: String(cleanTime)
    };

    try {
      const response = await createBooking(bookingPayload);
      toast.success("Booking Confirmed! 🎉", { id: toastId });
      navigate('/success', { state: { booking: response } });
    } catch (error) {
      console.error("Booking Error:", error);
      let errorMsg = "Something went wrong.";

      if (error.response && error.response.data) {
        const errData = error.response.data;

        // Handle Suggestion Logic
        if (errData.suggested_time) {
          const suggestion = Array.isArray(errData.suggested_time) ? errData.suggested_time[0] : errData.suggested_time;
          errorMsg = `Slot busy! 😓 Try ${suggestion}?`;
          toast((t) => (
            <div className="flex flex-col gap-2">
              <span>Slot <b>{cleanTime}</b> is taken.</span>
              <span className="font-bold">Next available: {suggestion}</span>
              <button onClick={() => { setTime(suggestion); toast.dismiss(t.id); }}
                className="bg-[#3F0D12] text-white px-3 py-1 rounded-lg text-xs font-bold mt-1">
                Switch to {suggestion}
              </button>
            </div>
          ), { id: toastId, duration: 6000, icon: '⚠️' });
          return; // Exit here, let user switch
        }
        else if (errData.message) {
          errorMsg = errData.message;
        }
      }
      toast.error(errorMsg, { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[#D72638]" size={40} /></div>;

  return (
    <div className="min-h-screen pt-24 pb-32 md:pb-12 px-4 md:px-8 bg-gray-50 transition-colors duration-300 md:flex md:justify-center">

      {/* Grid Container */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

        {/* Main Wizard Area */}
        <div className="lg:col-span-2">

          {/* Progress Bar */}
          <div className="flex justify-between items-center mb-8 px-4 max-w-lg mx-auto lg:mx-0">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className={`flex flex-col items-center gap-2 relative z-10 w-full`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-500
                              ${step >= i ? 'bg-[#3F0D12] text-white scale-110 shadow-lg' : 'bg-gray-200 text-gray-400'}`}>
                  {i < step ? <CheckCircle size={14} /> : i}
                </div>
                {/* Connector Line */}
                {i < 4 && (
                  <div className={`absolute top-4 left-1/2 w-full h-0.5 -z-10 transition-all duration-500
                                  ${step > i ? 'bg-[#3F0D12]' : 'bg-gray-200'}`}></div>
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <div className="bg-white rounded-[2rem] shadow-xl p-6 md:p-8 min-h-[500px] flex flex-col justify-between relative overflow-hidden ring-1 ring-gray-100/50">
            <div className="flex-1">
              {step === 1 && <ServiceSelection categories={categories} services={services} selectedServices={selectedServices} toggleService={toggleService} />}
              {step === 2 && <StylistSelection employees={employees} selectedEmployee={selectedEmployee} setSelectedEmployee={setSelectedEmployee} />}
              {step === 3 && <TimeSelection date={date} setDate={setDate} time={time} setTime={setTime} />}
              {step === 4 && <BookingSummary services={services} selectedServices={selectedServices} selectedEmployee={selectedEmployee} employees={employees} date={date} time={time} />}
            </div>

            {/* Desktop Navigation (Moved inside content for mobile feeling but cleaner) */}
            <div className="hidden md:flex mt-10 justify-between items-center pt-6 border-t border-gray-100">
              <button
                onClick={handleBack}
                disabled={step === 1}
                className={`flex items-center gap-2 font-bold px-5 py-2.5 rounded-xl transition-all
                        ${step === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <ChevronLeft size={20} /> Back
              </button>

              <button
                onClick={step === 4 ? handleSubmit : handleNext}
                disabled={submitting}
                className="bg-[#3F0D12] text-white px-10 py-3.5 rounded-xl font-bold hover:bg-[#5a1a20] transition shadow-xl hover:shadow-2xl flex items-center gap-2 active:scale-95 disabled:opacity-70 text-lg"
              >
                {submitting ? <Loader2 className="animate-spin" size={24} /> :
                  step === 4 ? "Confirm Booking" : "Next Step"}
                {!submitting && step < 4 && <ChevronRight size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Summary (Desktop) */}
        <div className="hidden lg:block sticky top-24">
          <SelectionPreview
            services={services}
            selectedServices={selectedServices}
            employees={employees}
            selectedEmployee={selectedEmployee}
            date={date}
            time={time}
            toggleService={toggleService}
          />
        </div>

      </div>

      {/* Mobile Bottom Bar (Sticky) */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 shadow-[0_-5px_20px_rgba(0,0,0,0.1)] z-50 rounded-t-3xl">
        <div className="flex items-center justify-between gap-4">
          {/* Mini Preview */}
          <div className="flex-1">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{selectedServices.length} Selected • {step}/4</p>
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="text-xl font-black text-[#3F0D12]">
                ₹{services.filter(s => selectedServices.includes(s.id)).reduce((sum, s) => sum + Number(s.price), 0)}
              </span>
              {/* Stylist Pip (if selected) */}
              {selectedEmployee && (
                <div className="bg-gray-100 px-2 py-0.5 rounded-full text-[10px] font-bold text-gray-600 flex items-center gap-1">
                  <User size={10} className="text-[#D72638]" />
                  {employees.find(e => e.id === Number(selectedEmployee))?.user_details?.username}
                </div>
              )}
            </div>
          </div>

          {/* Nav Buttons */}
          <div className="flex gap-2">
            {step > 1 && (
              <button onClick={handleBack} className="p-3 rounded-xl bg-gray-100 text-gray-600">
                <ChevronLeft size={20} />
              </button>
            )}
            <button
              onClick={step === 4 ? handleSubmit : handleNext}
              disabled={submitting}
              className="bg-[#3F0D12] text-white px-6 py-3 rounded-xl font-bold shadow-lg flex items-center gap-2 disabled:opacity-80"
            >
              {submitting ? <Loader2 className="animate-spin" size={18} /> :
                step === 4 ? "Confirm" : "Next"}
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default BookingPage;