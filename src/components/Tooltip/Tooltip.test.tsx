import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Tooltip } from './Tooltip';

describe('Tooltip', () => {
  it('renders tooltip content', () => {
    render(
      <Tooltip text="Hello">
        <span>Hover</span>
      </Tooltip>
    );
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
}); 