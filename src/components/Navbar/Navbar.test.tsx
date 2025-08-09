import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Navbar } from './Navbar';

describe('Navbar', () => {
  it('renders brand', () => {
    render(<Navbar brand="MyApp" />);
    expect(screen.getByText('MyApp')).toBeInTheDocument();
  });
}); 