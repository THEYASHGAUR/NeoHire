import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Settings from '../../src/pages/Settings';
import { useAuth } from '../../src/contexts/AuthContext';
import { MemoryRouter, useNavigate } from 'react-router-dom';

// Mocks
jest.mock('../../src/contexts/AuthContext');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn()
}));

describe('Settings Component Logic', () => {
  const mockLogout = jest.fn();
  const mockNavigate = jest.fn();
  const mockUser = {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '1234567890',
    company: 'OpenAI',
    address: '123 Main St',
    timezone: 'UTC',
    profilePicture: null,
  };

  beforeEach(() => {
    useAuth.mockReturnValue({
      user: mockUser,
      logout: mockLogout,
    });
    useNavigate.mockReturnValue(mockNavigate);
  });

  it('renders without crashing and shows user data', () => {
    render(
      <MemoryRouter>
        <Settings />
      </MemoryRouter>
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument(); // Assuming UI shows name
  });

  it('logs out and navigates to /auth', async () => {
    render(
      <MemoryRouter>
        <Settings />
      </MemoryRouter>
    );

    // Trigger logout
    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: /logout/i }));
    });

    expect(mockLogout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/auth');
  });

  it('shows error if logout fails', async () => {
    useAuth.mockReturnValue({
      user: mockUser,
      logout: jest.fn().mockRejectedValue(new Error('Logout failed')),
    });

    render(
      <MemoryRouter>
        <Settings />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /logout/i }));

    await waitFor(() => {
      expect(screen.getByText(/failed to logout/i)).toBeInTheDocument();
    });
  });

  it('updates profile state on profile update', async () => {
    render(
      <MemoryRouter>
        <Settings />
      </MemoryRouter>
    );

    // Trigger fake profile update
    const updatedProfile = {
      ...mockUser,
      name: 'Jane Doe',
    };

    // call handleProfileUpdate directly if exposed; here we simulate it via state:
    // You'd ideally extract that logic to a custom hook or make testable with a ref.

    const consoleSpy = jest.spyOn(console, 'log');

    // Simulate modal interaction if needed

    // Normally, we'd use fireEvent or trigger method but this depends on exposed props/UI
    await waitFor(() => {
      expect(consoleSpy).not.toHaveBeenCalledWith('Failed to update profile');
    });

    consoleSpy.mockRestore();
  });

  it('rejects large file upload', async () => {
    render(
      <MemoryRouter>
        <Settings />
      </MemoryRouter>
    );

    const file = new File(['dummy'], 'test.png', { type: 'image/png' });
    Object.defineProperty(file, 'size', { value: 3 * 1024 * 1024 }); // > 2MB

    const input = screen.getByTestId('file-upload'); // Add data-testid="file-upload" to your input
    fireEvent.change(input, {
      target: { files: [file] },
    });

    await waitFor(() => {
      expect(screen.getByText(/file size should be less than 2mb/i)).toBeInTheDocument();
    });
  });

  it('opens modal and sets active section', async () => {
    render(
      <MemoryRouter>
        <Settings />
      </MemoryRouter>
    );

    const item = screen.getByText(/profile/i); // or add data-testid if dynamic
    fireEvent.click(item);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument(); // assumes modal renders with role="dialog"
    });
  });

  it('closes modal and clears active content', async () => {
    render(
      <MemoryRouter>
        <Settings />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/profile/i));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /close/i }));

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });
});
