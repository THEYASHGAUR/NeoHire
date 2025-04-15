import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../../src/context/AuthProvider';
import '@testing-library/jest-dom';

// Utility: A test component to consume useAuth
const TestComponent = () => {
  const { isAuthenticated, user, login, logout } = useAuth();

  return (
    <div>
      <p data-testid="auth-status">{isAuthenticated ? 'Logged In' : 'Logged Out'}</p>
      <p data-testid="user">{user ? user.name : 'No User'}</p>
      <button onClick={() => login({ name: 'Test User', email: 'test@example.com' })}>
        Login
      </button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe('AuthProvider', () => {
  beforeEach(() => {
    localStorage.clear(); // Reset before each test
  });

  it('should render default values (logged out)', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('auth-status')).toHaveTextContent('Logged Out');
    expect(screen.getByTestId('user')).toHaveTextContent('No User');
  });

  it('should login and update localStorage', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      screen.getByText('Login').click();
    });

    expect(screen.getByTestId('auth-status')).toHaveTextContent('Logged In');
    expect(screen.getByTestId('user')).toHaveTextContent('Test User');

    // Check localStorage
    expect(localStorage.getItem('isAuthenticated')).toBe('true');
    const storedUser = JSON.parse(localStorage.getItem('user'));
    expect(storedUser).toEqual({ name: 'Test User', email: 'test@example.com' });
  });

  it('should logout and clear localStorage', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      screen.getByText('Login').click();
    });

    expect(screen.getByTestId('auth-status')).toHaveTextContent('Logged In');

    act(() => {
      screen.getByText('Logout').click();
    });

    expect(screen.getByTestId('auth-status')).toHaveTextContent('Logged Out');
    expect(screen.getByTestId('user')).toHaveTextContent('No User');

    expect(localStorage.getItem('isAuthenticated')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
  });

  it('should initialize state from localStorage on mount', () => {
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem(
      'user',
      JSON.stringify({ name: 'Stored User', email: 'stored@example.com' })
    );

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('auth-status')).toHaveTextContent('Logged In');
    expect(screen.getByTestId('user')).toHaveTextContent('Stored User');
  });
});
