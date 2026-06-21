import { render, screen } from '@testing-library/react'
import App from './App'

test('renders intro screen', () => {
  render(<App />)
  expect(screen.getByText(/Carbon/i)).toBeInTheDocument()
})

test('shows calculate button', () => {
  render(<App />)
  expect(screen.getByText(/Calculate My Footprint/i)).toBeInTheDocument()
})

test('renders without crashing', () => {
  render(<App />)
})
