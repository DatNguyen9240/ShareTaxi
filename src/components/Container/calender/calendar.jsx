import React, { useEffect, useRef, useState } from 'react';
import './calendar.css';

export default function Calendar({ onDateChange, initialDate }) {
  const [selectedDate, setSelectedDate] = useState( new Date());
  const [year, setYear] = useState(selectedDate.getFullYear());
  const [month, setMonth] = useState(selectedDate.getMonth());
  const [isDatepickerVisible, setDatepickerVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const dateInputRef = useRef(null);
  const datesRef = useRef(null);
  const datepickerRef = useRef(null);

  useEffect(() => {
    if (isDatepickerVisible) {
      displayDates();
      const handleClickOutside = (event) => {
        if (datepickerRef.current && !datepickerRef.current.contains(event.target)) {
          setDatepickerVisible(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [year, month, isDatepickerVisible]);

  useEffect(() => {
    if (initialDate) {
      setSelectedDate(initialDate);
      setYear(initialDate.getFullYear());
      setMonth(initialDate.getMonth());
      updateInputValue(initialDate);
    }
  }, [initialDate]);

  const toggleDatepicker = () => {
    setYear(selectedDate.getFullYear());
    setMonth(selectedDate.getMonth());
    setDatepickerVisible(!isDatepickerVisible);
  };

  const handleDateClick = (day) => {
    const date = new Date(year, month, day);
    const today = new Date();
    const twoWeeksFromNow = new Date();
    twoWeeksFromNow.setDate(today.getDate() + 14);

    const isToday = date.getDate() === today.getDate() &&
                    date.getMonth() === today.getMonth() &&
                    date.getFullYear() === today.getFullYear();

    if ((date >= today && date <= twoWeeksFromNow) || isToday) {
      setSelectedDate(date);
      updateInputValue(date);
      setDatepickerVisible(false);
      onDateChange(date);
      setErrorMessage('');
    }
  };

  const updateInputValue = (date) => {
    dateInputRef.current.value = date.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    const [day, month, year] = inputValue.split('/').map(Number);

    if (day && month && year) {
      const inputDate = new Date(year, month - 1, day);
      const today = new Date();
      const twoWeeksFromNow = new Date();
      twoWeeksFromNow.setDate(today.getDate() + 14);

      if (inputDate >= today && inputDate <= twoWeeksFromNow) {
        setSelectedDate(inputDate);
        setYear(inputDate.getFullYear());
        setMonth(inputDate.getMonth());
        updateInputValue(inputDate);
        onDateChange(inputDate);
        setErrorMessage('');
      }
    }
  };

  const displayDates = () => {
    if (datesRef.current) {
      datesRef.current.innerHTML = '';
      const today = new Date();
      const twoWeeksFromNow = new Date();
      twoWeeksFromNow.setDate(today.getDate() + 14);
      const lastOfPrevMonth = new Date(year, month, 0);

      for (let i = 0; i < lastOfPrevMonth.getDay() + 1; i++) {
        const day = lastOfPrevMonth.getDate() - lastOfPrevMonth.getDay() + i;
        datesRef.current.appendChild(createButton(day, true, -1));
      }

      const lastOfMonth = new Date(year, month + 1, 0);
      for (let i = 1; i <= lastOfMonth.getDate(); i++) {
        const date = new Date(year, month, i);
        const isDisabled = date < today || date > twoWeeksFromNow;
        const button = createButton(i, isDisabled);
        button.addEventListener('click', () => handleDateClick(i));
        datesRef.current.appendChild(button);
      }

      // const firstOfNextMonth = new Date(year, month + 1, 1);
      // for (let i = firstOfNextMonth.getDay(); i < 7; i++) {
      //   const day = firstOfNextMonth.getDate() - firstOfNextMonth.getDay() + i;
      //   datesRef.current.appendChild(createButton(day, true, 1));
      // }
    }
  };

  const createButton = (day, isDisabled = false) => {
    const button = document.createElement('button');
    button.textContent = day;
    button.disabled = isDisabled;
    if (isDisabled) button.classList.add('disabled');

    const currentDate = new Date();
    if (currentDate.getDate() === day && currentDate.getFullYear() === year && currentDate.getMonth() === month) {
      button.classList.add('today');
      button.disabled = false;
    }

    if (selectedDate.getDate() === day && selectedDate.getMonth() === month && selectedDate.getFullYear() === year) {
      button.classList.add('selected');
    }

    return button;
  };

  const handlePrevMonth = (event) => {
    event.preventDefault();
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNextMonth = (event) => {
    event.preventDefault();
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  return (
    <div className='body'>
      <div className="datepicker-container">
        <input
          type="text"
          className="date-input"
          placeholder="DD/MM/YYYY"
          ref={dateInputRef}
          onClick={toggleDatepicker}
          onBlur={handleInputChange}
        />
        {errorMessage && <div className="error-message">{errorMessage}</div>}

        {isDatepickerVisible && (
          <div className="datepicker" ref={datepickerRef}>
            <div className="month-nav-container">
              <button onClick={handlePrevMonth} className="month-nav">
                <i style={{fontSize: '1.2rem'}} className="fas fa-chevron-left"></i>
              </button>
              <span style={{fontSize: '1.2rem', paddingLeft: '100px'}} className="current-month">{new Date(year, month).toLocaleString('default', { month: 'long' })} {year}</span>
              <button onClick={handleNextMonth} className="month-nav">
                <i style={{fontSize: '1.2rem', paddingLeft: '80px'}} className="fas fa-chevron-right"></i>
              </button>
            </div>
            <div className="days">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>
            <div className="dates" ref={datesRef}></div>
          </div>
        )}
      </div>
    </div>
  );
}
