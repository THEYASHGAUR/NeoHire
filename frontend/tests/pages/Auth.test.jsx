import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import Auth from '../../src/pages/Auth';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../src/contexts/AuthContext';
import { MemoryRouter } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

jest.mock('../../src/contexts/AuthContext');

describe('Auth Component Logic', () => {
  const mockLogin = jest.fn();
  const mockNavigate = jest.fn();

  const DEMO_USER = {
    email: 'demo@neohire.io',
    password: 'demo123',
  };

  beforeEach(() => {
    useAuth.mockReturnValue({ login: mockLogin });
    useNavigate.mockReturnValue(mockNavigate);
  });

  const setup = () => {
    render(
      <MemoryRouter>
        <Auth />
      </MemoryRouter>
    );
  };

  it('shows error for incorrect login credentials', async () => {
    setup();

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: 'wrong@user.com' },
    });

    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'wrongpass' },
    });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument();
    });
  });

  it('logs in successfully with correct demo credentials', async () => {
    setup();

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: DEMO_USER.email },
    });

    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: DEMO_USER.password },
    });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
    });
  });

  it('shows password mismatch error when registering', async () => {
    setup();

    // Switch to Register mode
    fireEvent.click(screen.getByText(/register/i));

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: 'new@user.com' },
    });

    fireEvent.change(screen.getByPlaceholderText(/^password/i), {
      target: { value: 'pass123' },
    });

    fireEvent.change(screen.getByPlaceholderText(/confirm password/i), {
      target: { value: 'different123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(screen.getByText(/passwords don't match/i)).toBeInTheDocument();
    });
  });

  it('blocks registration with hardcoded error message', async () => {
    setup();

    fireEvent.click(screen.getByText(/register/i));

    fireEvent.change(screen.getByPlaceholderText(/^password/i), {
      target: { value: 'match123' },
    });

    fireEvent.change(screen.getByPlaceholderText(/confirm password/i), {
      target: { value: 'match123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/registration is currently disabled/i)
      ).toBeInTheDocument();
    });
  });
});
