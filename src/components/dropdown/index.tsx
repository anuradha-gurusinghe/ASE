import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function DropDown(props) {
  const { select, setSelect, items = [], label, disabled = false } = props;

  const handleChange = (event) => {
    setSelect(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 120, margin: '1rem 0 1rem 0.5rem' }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">{label}</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={select}
          label={label}
          onChange={handleChange}
          disabled={disabled}
        >
          {items.length > 0 &&
            items.map((item, index) => (
              <MenuItem key={index} value={item.replace(' ', '-')}>
                {item}{' '}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    </Box>
  );
}
