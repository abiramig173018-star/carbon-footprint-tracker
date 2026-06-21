import { render, screen, fireEvent } from '@testing-library/react'
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

test('renders all 5 quiz categories', () => {
  render(<App />)
  const button = screen.getByText(/Calculate My Footprint/i)
  fireEvent.click(button)
  expect(screen.getByText(/Transport/i)).toBeInTheDocument()
})

test('shows result after completing quiz', () => {
  render(<App />)
  expect(screen.getByText(/Carbon/i)).toBeInTheDocument()
})
