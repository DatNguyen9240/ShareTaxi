import React from 'react';
import { DatePicker } from '@mui/x-date-pickers';
import { TextField } from '@mui/material';

const Calendar = ({ onDateChange, initialDate }) => {
    return (
        <DatePicker
            label="Select Date"
            value={initialDate}
            onChange={(newValue) => onDateChange(newValue)}
            renderInput={(params) => <TextField {...params} />}
        />
    );
};

export default Calendar;
