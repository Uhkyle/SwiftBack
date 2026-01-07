import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  X,
  Clock,
  Car,
  User,
  Calendar as CalendarIcon,
  Grid3X3,
  List,
  Wrench,
  Bell,
  Ban,
  MapPin,
  Phone,
  Edit,
  Trash2
} from 'lucide-react';

function Calendar({ navigateTo }) {
  const { state, dispatch } = useCRM();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [viewMode, setViewMode] = useState('month');
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventForm, setEventForm] = useState({
    title: '',
    time: '09:00',
    endTime: '10:00',
    duration: '60',
    type: 'job',
    description: '',
    customerName: '',
    vehicleReg: '',
    phone: '',
    location: '',
    priority: 'normal',
  });

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const monthNamesShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getEventsForDate = (day) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return state.calendarEvents.filter(event => event.date === dateStr);
  };

  const getJobsForDate = (day) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return state.jobs.filter(job => job.scheduledDate === dateStr);
  };

  const handleDayClick = (day) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(dateStr);
    setEventForm({ ...eventForm, date: dateStr });
  };

  const handleAddEvent = () => {
    if (!eventForm.title || !selectedDate) return;
    
    dispatch({
      type: 'ADD_CALENDAR_EVENT',
      payload: {
        ...eventForm,
        date: selectedDate,
      }
    });
    
    setEventForm({
      title: '',
      time: '09:00',
      duration: '60',
      type: 'job',
      description: '',
      customerName: '',
      vehicleReg: '',
    });
    setShowEventModal(false);
  };

  const handleDeleteEvent = (eventId) => {
    dispatch({ type: 'DELETE_CALENDAR_EVENT', payload: eventId });
  };

  const isToday = (day) => {
    const today = new Date();
    return day === today.getDate() && 
           currentDate.getMonth() === today.getMonth() && 
           currentDate.getFullYear() === today.getFullYear();
  };

  const getEventTypeColor = (type) => {
    switch (type) {
      case 'job': return 'bg-blue-500';
      case 'appointment': return 'bg-emerald-500';
      case 'reminder': return 'bg-amber-500';
      case 'blocked': return 'bg-red-500';
      default: return 'bg-slate-500';
    }
  };

  const getEventTypeBorder = (type) => {
    switch (type) {
      case 'job': return 'border-l-blue-500 bg-blue-50';
      case 'appointment': return 'border-l-emerald-500 bg-emerald-50';
      case 'reminder': return 'border-l-amber-500 bg-amber-50';
      case 'blocked': return 'border-l-red-500 bg-red-50';
      default: return 'border-l-slate-500 bg-slate-50';
    }
  };

  const getEventTypeIcon = (type) => {
    switch (type) {
      case 'job': return Wrench;
      case 'appointment': return User;
      case 'reminder': return Bell;
      case 'blocked': return Ban;
      default: return CalendarIcon;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'normal': return 'text-slate-600';
      case 'low': return 'text-slate-400';
      default: return 'text-slate-600';
    }
  };

  const openEditModal = (event) => {
    setEditingEvent(event);
    setEventForm({
      title: event.title || '',
      time: event.time || '09:00',
      endTime: event.endTime || '10:00',
      duration: event.duration || '60',
      type: event.type || 'job',
      description: event.description || '',
      customerName: event.customerName || '',
      vehicleReg: event.vehicleReg || '',
      phone: event.phone || '',
      location: event.location || '',
      priority: event.priority || 'normal',
    });
    setShowEventModal(true);
  };

  const handleUpdateEvent = () => {
    if (!eventForm.title || !selectedDate) return;
    
    dispatch({
      type: 'UPDATE_CALENDAR_EVENT',
      payload: {
        id: editingEvent.id,
        ...eventForm,
        date: selectedDate,
      }
    });
    
    resetForm();
  };

  const resetForm = () => {
    setEventForm({
      title: '',
      time: '09:00',
      endTime: '10:00',
      duration: '60',
      type: 'job',
      description: '',
      customerName: '',
      vehicleReg: '',
      phone: '',
      location: '',
      priority: 'normal',
    });
    setShowEventModal(false);
    setEditingEvent(null);
  };

  const getWeekDates = () => {
    const dates = [];
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const timeSlots = [];
  for (let i = 6; i <= 20; i++) {
    timeSlots.push(`${String(i).padStart(2, '0')}:00`);
  }

  const renderCalendarDays = () => {
    const days = [];
    const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    const prevMonthDays = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
    
    for (let i = adjustedFirstDay - 1; i >= 0; i--) {
      const day = prevMonthDays - i;
      days.push(
        <div key={`prev-${i}`} className="min-h-[120px] bg-slate-50/50 border border-slate-100 p-2 opacity-50">
          <div className="text-sm text-slate-400">{day}</div>
        </div>
      );
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const events = getEventsForDate(day);
      const jobs = getJobsForDate(day);
      const allEvents = [...events, ...jobs.map(j => ({ ...j, type: 'job', title: `${j.customerName} - ${j.vehicleReg}` }))];
      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isSelected = selectedDate === dateStr;
      const dayIsToday = isToday(day);
      
      days.push(
        <div 
          key={day}
          onClick={() => handleDayClick(day)}
          className={`min-h-[120px] border p-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
            dayIsToday 
              ? 'bg-blue-50 border-blue-200' 
              : isSelected 
                ? 'bg-white border-blue-400 shadow-md' 
                : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold ${
              dayIsToday 
                ? 'bg-blue-600 text-white' 
                : isSelected 
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-slate-700 hover:bg-slate-100'
            }`}>
              {day}
            </div>
            {allEvents.length > 0 && (
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span className="text-xs text-slate-500">{allEvents.length}</span>
              </div>
            )}
          </div>
          <div className="space-y-1 overflow-hidden">
            {allEvents.slice(0, 2).map((event, idx) => (
              <div 
                key={idx}
                className={`${getEventTypeColor(event.type)} text-white text-xs px-2 py-1 rounded-md truncate flex items-center gap-1 shadow-sm`}
              >
                {event.time && <span className="font-medium">{event.time}</span>}
                <span className="truncate">{event.title}</span>
              </div>
            ))}
            {allEvents.length > 2 && (
              <div className="text-xs text-blue-600 font-medium px-1 hover:underline">
                +{allEvents.length - 2} more
              </div>
            )}
          </div>
        </div>
      );
    }

    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push(
        <div key={`next-${i}`} className="min-h-[120px] bg-slate-50/50 border border-slate-100 p-2 opacity-50">
          <div className="text-sm text-slate-400">{i}</div>
        </div>
      );
    }
    
    return days;
  };

  const renderWeekView = () => {
    const weekDates = getWeekDates();
    
    return (
      <div className="overflow-auto">
        <div className="grid grid-cols-8 min-w-[900px]">
          <div className="border-b border-r border-slate-200 p-2 bg-slate-50"></div>
          {weekDates.map((date, idx) => {
            const dateStr = date.toISOString().split('T')[0];
            const isSelected = selectedDate === dateStr;
            const dayIsToday = date.toDateString() === new Date().toDateString();
            
            return (
              <div 
                key={idx}
                onClick={() => setSelectedDate(dateStr)}
                className={`border-b border-r border-slate-200 p-3 text-center cursor-pointer transition-colors ${
                  dayIsToday ? 'bg-blue-50' : isSelected ? 'bg-blue-50' : 'bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <div className="text-xs text-slate-500 uppercase">{dayNames[date.getDay()]}</div>
                <div className={`text-xl font-bold mt-1 ${
                  dayIsToday ? 'text-blue-600' : isSelected ? 'text-blue-600' : 'text-slate-700'
                }`}>
                  {date.getDate()}
                </div>
              </div>
            );
          })}
          
          {timeSlots.map((time, timeIdx) => (
            <React.Fragment key={time}>
              <div className="border-r border-b border-slate-200 p-2 text-xs text-slate-500 text-right pr-3 bg-slate-50">
                {time}
              </div>
              {weekDates.map((date, dateIdx) => {
                const dateStr = date.toISOString().split('T')[0];
                const events = [...state.calendarEvents.filter(e => e.date === dateStr && e.time?.startsWith(time.split(':')[0])),
                               ...state.jobs.filter(j => j.scheduledDate === dateStr && j.scheduledTime?.startsWith(time.split(':')[0])).map(j => ({
                                 ...j, type: 'job', title: `${j.customerName} - ${j.vehicleReg}`
                               }))];
                
                return (
                  <div 
                    key={`${time}-${dateIdx}`}
                    onClick={() => { setSelectedDate(dateStr); setEventForm({...eventForm, time}); }}
                    className="border-r border-b border-slate-200 p-1 min-h-[60px] hover:bg-slate-50 cursor-pointer"
                  >
                    {events.map((event, idx) => (
                      <div 
                        key={idx}
                        onClick={(e) => { e.stopPropagation(); openEditModal(event); }}
                        className={`${getEventTypeColor(event.type)} text-white text-xs p-1.5 rounded mb-1 truncate shadow-sm cursor-pointer hover:opacity-90`}
                      >
                        {event.title}
                      </div>
                    ))}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  const selectedDateEvents = selectedDate ? [
    ...state.calendarEvents.filter(e => e.date === selectedDate),
    ...state.jobs.filter(j => j.scheduledDate === selectedDate).map(j => ({
      ...j,
      type: 'job',
      title: `${j.customerName} - ${j.vehicleReg}`,
      isJob: true
    }))
  ] : [];

  return (
    <div className="flex gap-6 h-full">
      <div className="flex-1 card overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-slate-800">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button onClick={goToToday} className="btn-secondary text-sm py-1.5 px-3">
              Today
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-slate-100 rounded-lg p-1">
              <button 
                onClick={() => setViewMode('month')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'month' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                <Grid3X3 className="w-4 h-4 inline mr-1" />
                Month
              </button>
              <button 
                onClick={() => setViewMode('week')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'week' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                <List className="w-4 h-4 inline mr-1" />
                Week
              </button>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={prevMonth} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={nextMonth} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {viewMode === 'month' ? (
          <>
            <div className="grid grid-cols-7 gap-0 mb-2 border-b border-slate-200 pb-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                <div key={day} className="text-center text-sm font-semibold text-slate-600 py-2">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-0">
              {renderCalendarDays()}
            </div>
          </>
        ) : (
          renderWeekView()
        )}

        <div className="mt-4 pt-4 border-t border-slate-200">
          <div className="flex items-center gap-6 text-sm">
            <span className="text-slate-500 font-medium">Event Types:</span>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-slate-600">Job</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span className="text-slate-600">Appointment</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span className="text-slate-600">Reminder</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-slate-600">Blocked</span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-96 card flex flex-col">
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-200">
          <div>
            <h3 className="font-bold text-lg text-slate-800">
              {selectedDate ? new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-GB', { 
                weekday: 'long',
                day: 'numeric',
                month: 'long'
              }) : 'Select a date'}
            </h3>
            {selectedDate && (
              <p className="text-sm text-slate-500 mt-1">
                {selectedDateEvents.length} event{selectedDateEvents.length !== 1 ? 's' : ''} scheduled
              </p>
            )}
          </div>
          {selectedDate && (
            <button 
              onClick={() => setShowEventModal(true)}
              className="btn-primary text-sm py-2"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          )}
        </div>

        <div className="flex-1 overflow-auto">
          {selectedDate ? (
            <div className="space-y-3">
              {selectedDateEvents.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <CalendarIcon className="w-16 h-16 mx-auto mb-4 text-slate-200" />
                  <p className="font-medium text-slate-600">No events scheduled</p>
                  <p className="text-sm mt-1">Click below to add your first event</p>
                  <button 
                    onClick={() => setShowEventModal(true)}
                    className="btn-primary mt-4"
                  >
                    <Plus className="w-4 h-4" /> Add Event
                  </button>
                </div>
              ) : (
                selectedDateEvents.sort((a, b) => (a.time || '').localeCompare(b.time || '')).map((event) => {
                  const EventIcon = getEventTypeIcon(event.type);
                  return (
                    <div 
                      key={event.id}
                      className={`p-4 rounded-xl border-l-4 ${getEventTypeBorder(event.type)} border border-slate-200 hover:shadow-md transition-shadow`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${getEventTypeColor(event.type)}`}>
                            <EventIcon className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <span className="font-semibold text-slate-800 block">{event.title}</span>
                            <span className="text-xs text-slate-500 capitalize">{event.type}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {!event.isJob && (
                            <>
                              <button 
                                onClick={() => openEditModal(event)}
                                className="p-1.5 hover:bg-white rounded-lg transition-colors"
                              >
                                <Edit className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                              </button>
                              <button 
                                onClick={() => handleDeleteEvent(event.id)}
                                className="p-1.5 hover:bg-white rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-500" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-3 space-y-2">
                        {event.time && (
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Clock className="w-4 h-4 text-slate-400" />
                            <span className="font-medium">{event.time}</span>
                            {event.endTime && <span>- {event.endTime}</span>}
                            {!event.endTime && event.duration && <span className="text-slate-400">({event.duration} min)</span>}
                          </div>
                        )}
                        {event.customerName && (
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <User className="w-4 h-4 text-slate-400" />
                            {event.customerName}
                          </div>
                        )}
                        {event.vehicleReg && (
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Car className="w-4 h-4 text-slate-400" />
                            <span className="font-mono bg-slate-100 px-2 py-0.5 rounded">{event.vehicleReg}</span>
                          </div>
                        )}
                        {event.phone && (
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Phone className="w-4 h-4 text-slate-400" />
                            {event.phone}
                          </div>
                        )}
                        {event.location && (
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <MapPin className="w-4 h-4 text-slate-400" />
                            {event.location}
                          </div>
                        )}
                        {event.description && (
                          <p className="text-sm text-slate-500 mt-2 pl-6 border-l-2 border-slate-200">{event.description}</p>
                        )}
                      </div>
                      
                      {event.isJob && (
                        <button 
                          onClick={() => navigateTo('create-job', event)}
                          className="mt-3 w-full text-sm text-center py-2 bg-white border border-slate-200 rounded-lg text-blue-600 hover:bg-blue-50 font-medium transition-colors"
                        >
                          View Full Job Details →
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500">
              <CalendarIcon className="w-16 h-16 mx-auto mb-4 text-slate-200" />
              <p className="font-medium text-slate-600">Select a Date</p>
              <p className="text-sm mt-1">Click on any date to view or add events</p>
            </div>
          )}
        </div>
      </div>

      {showEventModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-800">
                  {editingEvent ? 'Edit Event' : 'New Event'}
                </h3>
                <p className="text-sm text-slate-500 mt-0.5">
                  {selectedDate && new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-GB', { 
                    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                  })}
                </p>
              </div>
              <button onClick={resetForm} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              <div>
                <label className="label">Event Title *</label>
                <input
                  type="text"
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  className="input-field text-lg"
                  placeholder="e.g., MOT Service, Brake Replacement"
                  autoFocus
                />
              </div>

              <div>
                <label className="label">Event Type</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { value: 'job', label: 'Job', icon: Wrench, color: 'blue' },
                    { value: 'appointment', label: 'Appt', icon: User, color: 'emerald' },
                    { value: 'reminder', label: 'Reminder', icon: Bell, color: 'amber' },
                    { value: 'blocked', label: 'Blocked', icon: Ban, color: 'red' },
                  ].map((type) => {
                    const Icon = type.icon;
                    const isSelected = eventForm.type === type.value;
                    return (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setEventForm({ ...eventForm, type: type.value })}
                        className={`p-3 rounded-xl border-2 transition-all ${
                          isSelected 
                            ? `border-${type.color}-500 bg-${type.color}-50` 
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <Icon className={`w-5 h-5 mx-auto mb-1 ${isSelected ? `text-${type.color}-600` : 'text-slate-400'}`} />
                        <span className={`text-xs font-medium ${isSelected ? `text-${type.color}-700` : 'text-slate-600'}`}>
                          {type.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Start Time</label>
                  <input
                    type="time"
                    value={eventForm.time}
                    onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="label">End Time</label>
                  <input
                    type="time"
                    value={eventForm.endTime}
                    onChange={(e) => setEventForm({ ...eventForm, endTime: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="label">Priority</label>
                <div className="flex gap-2">
                  {['low', 'normal', 'high'].map((priority) => (
                    <button
                      key={priority}
                      type="button"
                      onClick={() => setEventForm({ ...eventForm, priority })}
                      className={`flex-1 py-2 px-4 rounded-lg border-2 font-medium text-sm capitalize transition-all ${
                        eventForm.priority === priority
                          ? priority === 'high' 
                            ? 'border-red-500 bg-red-50 text-red-700'
                            : priority === 'normal'
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-slate-400 bg-slate-50 text-slate-700'
                          : 'border-slate-200 text-slate-500 hover:border-slate-300'
                      }`}
                    >
                      {priority}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-200 pt-5">
                <h4 className="text-sm font-semibold text-slate-700 mb-3">Customer & Vehicle (Optional)</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Customer Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={eventForm.customerName}
                        onChange={(e) => setEventForm({ ...eventForm, customerName: e.target.value })}
                        className="input-field pl-10"
                        placeholder="John Smith"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="label">Vehicle Reg</label>
                    <div className="relative">
                      <Car className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={eventForm.vehicleReg}
                        onChange={(e) => setEventForm({ ...eventForm, vehicleReg: e.target.value.toUpperCase() })}
                        className="input-field pl-10 uppercase"
                        placeholder="AB12 CDE"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div>
                    <label className="label">Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="tel"
                        value={eventForm.phone}
                        onChange={(e) => setEventForm({ ...eventForm, phone: e.target.value })}
                        className="input-field pl-10"
                        placeholder="07123 456789"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="label">Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={eventForm.location}
                        onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                        className="input-field pl-10"
                        placeholder="Bay 1, Workshop"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="label">Notes</label>
                <textarea
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  className="input-field"
                  rows="3"
                  placeholder="Additional details about this event..."
                ></textarea>
              </div>
            </div>
            
            <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-6 py-4 flex gap-3">
              <button onClick={resetForm} className="btn-secondary flex-1">
                Cancel
              </button>
              <button 
                onClick={editingEvent ? handleUpdateEvent : handleAddEvent} 
                className="btn-primary flex-1"
              >
                {editingEvent ? 'Update Event' : 'Add Event'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Calendar;
