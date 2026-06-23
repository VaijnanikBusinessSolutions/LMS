import React, { useState } from 'react';
import { Clock, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface ScheduleItem {
  time: string;
  title: string;
  type: string;
}

interface ScheduleData {
  [key: string]: ScheduleItem[];
}

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const CalendarSidebar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const getCurrentDateKey = () => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  };

  const scheduleData: ScheduleData = {
    [getCurrentDateKey()]: [
      { time: '9:30 AM - 11:00 AM', title: 'Advanced React Components', type: 'Workshop' },
      { time: '2:30 PM - 4:00 PM', title: 'State Management with Redux', type: 'Practical' }
    ],
    '2024-11-25': [
      { time: '9:00 AM - 10:30 AM', title: 'Web Design - From Figma to Web', type: 'Lecture' }
    ]
  };

  const generateCalendarDays = () => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const startDate = new Date(firstDay);
    const dayOfWeek = firstDay.getDay();
    startDate.setDate(startDate.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    
    const days = [];
    const currentDate = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return days;
  };

  const formatDateKey = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const getScheduleForDate = (date: Date): ScheduleItem[] => {
    const dateKey = formatDateKey(date);
    return scheduleData[dateKey] || [];
  };

  const hasSchedule = (date: Date) => {
    return getScheduleForDate(date).length > 0;
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentMonth(parseInt(e.target.value));
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentYear(parseInt(e.target.value));
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const calendarDays = generateCalendarDays();
  const today = new Date();

  const yearOptions = [];
  for (let i = currentYear - 5; i <= currentYear + 5; i++) {
    yearOptions.push(i);
  }

  const selectedDateSchedules = selectedDate ? getScheduleForDate(selectedDate) : [];

  return (
    <div className="lg:w-80 space-y-6">
      {/* Calendar */}
      <div className="bg-surface rounded-3xl border border-border p-6 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-text font-bold text-lg">Calendar</h3>
          <div className="flex gap-1">
            <button 
              onClick={handlePrevMonth} 
              className="p-2 hover:bg-background rounded-xl text-muted hover:text-text transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button 
              onClick={handleNextMonth} 
              className="p-2 hover:bg-background rounded-xl text-muted hover:text-text transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
        
        {/* Dropdowns */}
        <div className="flex gap-3 mb-6">
          <select
            value={currentMonth}
            onChange={handleMonthChange}
            className="flex-1 px-4 py-2.5 bg-background border border-border rounded-xl text-sm text-text focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 transition-all cursor-pointer"
          >
            {months.map((month, index) => (
              <option key={index} value={index}>{month}</option>
            ))}
          </select>
          
          <select
            value={currentYear}
            onChange={handleYearChange}
            className="px-4 py-2.5 bg-background border border-border rounded-xl text-sm text-text focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 transition-all cursor-pointer"
          >
            {yearOptions.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        {/* Days header */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day, i) => (
            <div key={i} className="text-center text-xs font-bold text-muted py-1 uppercase tracking-wide">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((date, i) => {
            const isCurrentMonth = date.getMonth() === currentMonth;
            const isToday = date.toDateString() === today.toDateString();
            const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
            const hasScheduleForDate = hasSchedule(date);
            
            return (
              <button
                key={i}
                onClick={() => handleDateClick(date)}
                className={`aspect-square rounded-xl text-xs flex items-center justify-center relative transition-all duration-200 font-medium
                  ${!isCurrentMonth ? 'text-muted/30' :
                    isSelected ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md transform scale-105' :
                    isToday ? 'bg-purple-100 text-purple-700 font-bold' :
                    hasScheduleForDate ? 'text-text font-bold bg-orange-50 hover:bg-orange-100' :
                    'text-muted hover:bg-background hover:text-text'}`}
              >
                {date.getDate()}
                {hasScheduleForDate && isCurrentMonth && !isSelected && (
                  <div className="absolute bottom-1.5 w-1 h-1 bg-orange-500 rounded-full"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Schedule */}
      <div className="bg-surface rounded-3xl border border-border p-6 h-80 shadow-lg flex flex-col">
        <h4 className="text-text font-bold mb-4 flex items-center gap-2 text-lg">
          <Clock size={20} className="text-purple-600" />
          Schedules
        </h4>
        
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {selectedDateSchedules.length > 0 ? (
            <div className="space-y-3">
              {selectedDateSchedules.map((schedule, index) => (
                <div 
                  key={index} 
                  className="bg-background rounded-2xl p-4 border-l-4 border-purple-500 shadow-sm hover:shadow-md transition-all group"
                >
                  <p className="text-xs text-muted mb-1 font-medium flex items-center gap-1">
                    <Clock size={12} /> {schedule.time}
                  </p>
                  <p className="text-sm text-text font-bold mb-2 group-hover:text-purple-700 transition-colors">
                    {schedule.title}
                  </p>
                  <span className="px-2.5 py-1 bg-purple-50 text-purple-700 text-[10px] uppercase tracking-wider rounded-lg font-bold inline-block border border-purple-100">
                    {schedule.type}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted space-y-3">
              <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center">
                <Calendar size={24} className="opacity-30" />
              </div>
              <p className="text-sm font-medium">No schedules for this date</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarSidebar;