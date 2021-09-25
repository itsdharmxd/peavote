import { render, screen } from '@testing-library/react';
import App from './App';

test('check basic rendering', () => {
  render(<App />);
  const linkElement = screen.getByText(/peavote/i);
  expect(linkElement).toBeInTheDocument();
});
