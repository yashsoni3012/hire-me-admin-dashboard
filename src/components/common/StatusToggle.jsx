import React from 'react';
import SwitchButton from './SwitchButton';

const StatusToggle = ({
  value,
  onToggle,
  type = 'status', // 'status' or 'trending'
  label = '',
  loading = false,
  className = '',
  size = 'md',
}) => {
  return (
    <SwitchButton
      value={value}
      onToggle={onToggle}
      type={type}
      label={label}
      loading={loading}
      className={className}
      size={size}
    />
  );
};

export default StatusToggle;