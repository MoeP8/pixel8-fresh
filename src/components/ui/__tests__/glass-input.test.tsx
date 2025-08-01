import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { GlassInput } from '../glass-input'

describe('GlassInput', () => {
  it('renders input with default props', () => {
    render(<GlassInput placeholder="Enter text" />)
    
    const input = screen.getByPlaceholderText('Enter text')
    expect(input).toBeInTheDocument()
    expect(input).toHaveClass('glass-input')
  })

  it('handles value changes', async () => {
    const handleChange = vi.fn()
    const user = userEvent.setup()
    
    render(<GlassInput onChange={handleChange} placeholder="Test input" />)
    
    const input = screen.getByPlaceholderText('Test input')
    await user.type(input, 'Hello World')
    
    expect(handleChange).toHaveBeenCalled()
    expect(input).toHaveValue('Hello World')
  })

  it('applies size variants correctly', () => {
    const { rerender } = render(<GlassInput size="sm" placeholder="Small" />)
    expect(screen.getByPlaceholderText('Small')).toHaveClass('h-8', 'px-3', 'text-sm')

    rerender(<GlassInput size="lg" placeholder="Large" />)
    expect(screen.getByPlaceholderText('Large')).toHaveClass('h-12', 'px-4', 'text-base')
  })

  it('shows error state correctly', () => {
    render(<GlassInput error placeholder="Error input" />)
    const input = screen.getByPlaceholderText('Error input')
    expect(input).toHaveClass('border-red-400', 'focus:border-red-500')
  })

  it('shows success state correctly', () => {
    render(<GlassInput success placeholder="Success input" />)
    const input = screen.getByPlaceholderText('Success input')
    expect(input).toHaveClass('border-green-400', 'focus:border-green-500')
  })

  it('renders with icon', () => {
    const TestIcon = () => <span data-testid="test-icon">Icon</span>
    
    render(
      <GlassInput 
        icon={<TestIcon />} 
        placeholder="Input with icon" 
      />
    )
    
    expect(screen.getByTestId('test-icon')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Input with icon')).toBeInTheDocument()
  })

  it('handles disabled state', () => {
    render(<GlassInput disabled placeholder="Disabled input" />)
    
    const input = screen.getByPlaceholderText('Disabled input')
    expect(input).toBeDisabled()
    expect(input).toHaveClass('cursor-not-allowed', 'opacity-50')
  })

  it('supports different input types', () => {
    const { rerender } = render(<GlassInput type="email" placeholder="Email" />)
    expect(screen.getByPlaceholderText('Email')).toHaveAttribute('type', 'email')

    rerender(<GlassInput type="password" placeholder="Password" />)
    expect(screen.getByPlaceholderText('Password')).toHaveAttribute('type', 'password')

    rerender(<GlassInput type="number" placeholder="Number" />)
    expect(screen.getByPlaceholderText('Number')).toHaveAttribute('type', 'number')
  })

  it('applies focus styles correctly', async () => {
    const user = userEvent.setup()
    render(<GlassInput placeholder="Focus test" />)
    
    const input = screen.getByPlaceholderText('Focus test')
    await user.click(input)
    
    expect(input).toHaveFocus()
  })

  it('forwards ref correctly', () => {
    const ref = vi.fn()
    render(<GlassInput ref={ref} placeholder="Ref test" />)
    expect(ref).toHaveBeenCalled()
  })

  it('renders with helper text', () => {
    render(
      <div>
        <GlassInput placeholder="Input" aria-describedby="helper" />
        <p id="helper">Helper text</p>
      </div>
    )
    
    const input = screen.getByPlaceholderText('Input')
    const helper = screen.getByText('Helper text')
    
    expect(input).toHaveAttribute('aria-describedby', 'helper')
    expect(helper).toBeInTheDocument()
  })

  it('supports controlled and uncontrolled modes', async () => {
    const user = userEvent.setup()
    
    // Uncontrolled
    render(<GlassInput placeholder="Uncontrolled" />)
    const uncontrolled = screen.getByPlaceholderText('Uncontrolled')
    await user.type(uncontrolled, 'test')
    expect(uncontrolled).toHaveValue('test')

    // Controlled
    const ControlledInput = () => {
      const [value, setValue] = React.useState('')
      return (
        <GlassInput 
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Controlled"
        />
      )
    }
    
    render(<ControlledInput />)
    const controlled = screen.getByPlaceholderText('Controlled')
    await user.type(controlled, 'controlled')
    expect(controlled).toHaveValue('controlled')
  })
})