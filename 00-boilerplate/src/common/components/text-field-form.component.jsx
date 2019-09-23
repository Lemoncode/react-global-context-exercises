import React from 'react';
import TextField from '@material-ui/core/TextField';

export const TextFieldForm = props => {
  const { name, label, onChange, value, error, type, onBlur } = props;

  const handleChange = e => {
    onChange(name, e.target.value);
  };

  const handleBlur = e => {
    if (onBlur) {
      onBlur(name, e.target.value);
    }
  };

  return (
    <TextField
      label={label}
      margin="normal"
      value={value}
      type={type}
      onChange={handleChange}
      onBlur={handleBlur}
      error={Boolean(error)}
      helperText={error}
    />
  );
};

TextFieldForm.defaultProps = {
  type: 'text',
};
