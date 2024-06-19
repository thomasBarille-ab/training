'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, Select, MenuItem, FormControl, InputLabel, Box
} from '@mui/material';

const Training = () => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [weeks, setWeeks] = useState([]);
  const [days, setDays] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState('');
  const [selectedDay, setSelectedDay] = useState('');

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/data')
      .then(response => {
        const allData = response.data;
        setData(allData);

        // Extract unique days
        const daySet = new Set(allData.map(item => item.Jour));
        setDays(Array.from(daySet).sort());

        // Extract unique weeks
        const weekSet = new Set();
        allData.forEach(item => {
          Object.keys(item).forEach(key => {
            if (key.startsWith('Semaine ')) {
              weekSet.add(key);
            }
          });
        });
        const sortedWeeks = Array.from(weekSet).sort((a, b) => {
          const aNum = parseInt(a.match(/\d+/)[0], 10);
          const bNum = parseInt(b.match(/\d+/)[0], 10);
          return aNum - bNum;
        });
        setWeeks(sortedWeeks);

        if (allData.length > 0 && sortedWeeks.length > 0) {
          setColumns(['Jour', sortedWeeks[0]]);
          setSelectedWeek(sortedWeeks[0]);
        }
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleWeekChange = (event) => {
    setSelectedWeek(event.target.value);
    setColumns(['Jour', event.target.value]);
  };

  const handleDayChange = (event) => {
    setSelectedDay(event.target.value);
  };

  const filteredData = data.filter(row => {
    return (selectedDay ? row.Jour === selectedDay : true);
  });

  return (
    <div className="training-container">
      <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', margin: '20px 0' }}>
        Programme Entrainement Semi Marathon - 20 Semaines
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 2 }}>
        <FormControl sx={{ minWidth: 120, marginRight: 2 }}>
          <InputLabel>Semaine</InputLabel>
          <Select value={selectedWeek} onChange={handleWeekChange} label="Semaine">
            {weeks.map((week, index) => (
              <MenuItem key={index} value={week}>{week}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Jour</InputLabel>
          <Select value={selectedDay} onChange={handleDayChange} label="Jour">
            <MenuItem value=""><em>None</em></MenuItem>
            {days.map((day, index) => (
              <MenuItem key={index} value={day}>{day}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper} sx={{ maxWidth: 1200, margin: 'auto' }}>
        <Table className="training-table">
          <TableHead>
            <TableRow>
              {columns.map((col, index) => (
                <TableCell key={index} sx={{ fontWeight: 'bold', backgroundColor: '#f4f4f4' }}>{col}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((col, colIndex) => (
                  <TableCell key={colIndex}>{row[col]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Training;




