import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { GlassButton } from '../glass-button'

describe('GlassButton', () => {
  it('renders button with default props', () => {
    render(<GlassButton>Click me</GlassButton>)
    
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent('Click me')
    expect(button).toHaveClass('backdrop-blur-md')
  })

  it('applies variant classes correctly', () => {
    const { rerender } = render(<GlassButton variant="primary">Test</GlassButton>)
    expect(screen.getByRole('button')).toHaveClass('bg-gradient-to-r', 'from-blue-500', 'to-purple-600')

    rerender(<GlassButton variant="secondary">Test</GlassButton>)
    expect(screen.getByRole('button')).toHaveClass('bg-gradient-to-r', 'from-purple-500', 'to-pink-600')

    rerender(<GlassButton variant="accent">Test</GlassButton>)
    expect(screen.getByRole('button')).toHaveClass('bg-gradient-to-r', 'from-green-400', 'to-blue-500')

    rerender(<GlassButton variant="danger">Test</GlassButton>)
    expect(screen.getByRole('button')).toHaveClass('bg-gradient-to-r', 'from-red-500', 'to-pink-600')
  })

  it('applies size classes correctly', () => {
    const { rerender } = render(<GlassButton size="sm">Test</GlassButton>)
    expect(screen.getByRole('button')).toHaveClass('h-8', 'px-3', 'text-xs')

    rerender(<GlassButton size="lg">Test</GlassButton>)
    expect(screen.getByRole('button')).toHaveClass('h-12', 'px-8', 'text-base')

    rerender(<GlassButton size="icon">Test</GlassButton>)
    expect(screen.getByRole('button')).toHaveClass('h-9', 'w-9')
  })

  it('shows loading state correctly', () => {
    render(<GlassButton loading>Click me</GlassButton>)
    
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button).toHaveClass('opacity-70')
    
    // Check for loading spinner
    const spinner = button.querySelector('.animate-spin')
    expect(spinner).toBeInTheDocument()
  })

  it('handles click events', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()
    
    render(<GlassButton onClick={handleClick}>Click me</GlassButton>)
    
    const button = screen.getByRole('button')
    await user.click(button)
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('prevents click when disabled', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()
    
    render(<GlassButton disabled onClick={handleClick}>Click me</GlassButton>)
    
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    
    await user.click(button)
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('prevents click when loading', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()
    
    render(<GlassButton loading onClick={handleClick}>Click me</GlassButton>)
    
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    
    await user.click(button)
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('renders with icons', () => {
    const TestIcon = () => <span data-testid="test-icon">Icon</span>
    
    render(
      <GlassButton>
        <TestIcon />
        Button text
      </GlassButton>
    )
    
    expect(screen.getByTestId('test-icon')).toBeInTheDocument()
    expect(screen.getByText('Button text')).toBeInTheDocument()
  })

  it('applies glow effect when enabled', () => {
    render(<GlassButton glow>Test</GlassButton>)
    expect(screen.getByRole('button')).toHaveClass('hover-glow')
  })

  it('supports keyboard navigation', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()
    
    render(<GlassButton onClick={handleClick}>Click me</GlassButton>)
    
    const button = screen.getByRole('button')
    button.focus()
    
    await user.keyboard('{Enter}')
    expect(handleClick).toHaveBeenCalledTimes(1)
    
    await user.keyboard(' ')
    expect(handleClick).toHaveBeenCalledTimes(2)
  })

  it('forwards ref correctly', () => {
    const ref = vi.fn()
    render(<GlassButton ref={ref}>Test</GlassButton>)
    expect(ref).toHaveBeenCalled()
  })
})