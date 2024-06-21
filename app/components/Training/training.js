'use client';

import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, Select, MenuItem, FormControl, InputLabel, Box, Container, AppBar, Toolbar
} from '@mui/material';

const Training = () => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [weeks, setWeeks] = useState([]);
  const [days, setDays] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState('');
  const [selectedDay, setSelectedDay] = useState('');

  useEffect(() => {
    fetch('/programme_entrainement_semi_marathon_20_semaines.xlsx')
      .then(response => response.arrayBuffer())
      .then(buffer => {
        const workbook = XLSX.read(buffer, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });

        const headers = worksheet[0];
        const rows = worksheet.slice(1).map(row => {
          const rowData = {};
          headers.forEach((header, index) => {
            rowData[header] = row[index];
          });
          return rowData;
        });

        setData(rows);

        // Extract unique days
        const daySet = new Set(rows.map(item => item.Jour));
        setDays(Array.from(daySet).sort());

        // Extract unique weeks
        const weekSet = new Set();
        rows.forEach(item => {
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

        if (rows.length > 0 && sortedWeeks.length > 0) {
          setColumns(['Jour', sortedWeeks[0]]);
          setSelectedWeek(sortedWeeks[0]);
        }
      })
      .catch(error => console.error('Error fetching or parsing Excel file:', error));
  }, []);

  const handleWeekChange = (event) => {
    setSelectedWeek(event.target.value);
    setColumns(['Jour', event.target.value]);
  };

  const handleDayChange = (event) => {
    setSelectedDay(event.target.value);
  };

  const filteredData = data.filter(row => {
    return (selectedWeek ? row[selectedWeek] !== undefined : true) && (selectedDay ? row.Jour === selectedDay : true);
  });

  return (
    <Container maxWidth="lg">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Programme Entrainement Semi Marathon
          </Typography>
        </Toolbar>
      </AppBar>
      <Box mt={4} mb={4}>
        <Paper elevation={3} sx={{ padding: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <FormControl sx={{ minWidth: 120, mr: 2 }}>
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
                {days.map((day, index) => (
                  <MenuItem key={index} value={day}>{day}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <TableContainer component={Paper}>
            <Table>
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
        </Paper>
      </Box>
    </Container>
  );
};

export default Training;
