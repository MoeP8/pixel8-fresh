import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { GlassCard } from '../glass-card'

describe('GlassCard', () => {
  it('renders with default props', () => {
    render(<GlassCard data-testid="glass-card">Test content</GlassCard>)
    
    const card = screen.getByTestId('glass-card')
    expect(card).toBeInTheDocument()
    expect(card).toHaveTextContent('Test content')
    expect(card).toHaveClass('glass')
  })

  it('applies variant classes correctly', () => {
    const { rerender } = render(
      <GlassCard variant="strong" data-testid="glass-card">Test</GlassCard>
    )
    expect(screen.getByTestId('glass-card')).toHaveClass('glass-strong')

    rerender(<GlassCard variant="subtle" data-testid="glass-card">Test</GlassCard>)
    expect(screen.getByTestId('glass-card')).toHaveClass('glass-subtle')

    rerender(<GlassCard variant="gradient" data-testid="glass-card">Test</GlassCard>)
    expect(screen.getByTestId('glass-card')).toHaveClass('glass-gradient')
  })

  it('applies size classes correctly', () => {
    const { rerender } = render(
      <GlassCard size="sm" data-testid="glass-card">Test</GlassCard>
    )
    expect(screen.getByTestId('glass-card')).toHaveClass('p-4')

    rerender(<GlassCard size="lg" data-testid="glass-card">Test</GlassCard>)
    expect(screen.getByTestId('glass-card')).toHaveClass('p-8')
  })

  it('applies hover effect when enabled', () => {
    render(<GlassCard hover data-testid="glass-card">Test</GlassCard>)
    expect(screen.getByTestId('glass-card')).toHaveClass('hover-lift')
  })

  it('applies glow effect when enabled', () => {
    render(<GlassCard glow data-testid="glass-card">Test</GlassCard>)
    expect(screen.getByTestId('glass-card')).toHaveClass('hover-glow')
  })

  it('forwards additional props', () => {
    render(
      <GlassCard 
        data-testid="glass-card" 
        aria-label="Test card"
        role="article"
      >
        Test
      </GlassCard>
    )
    
    const card = screen.getByTestId('glass-card')
    expect(card).toHaveAttribute('aria-label', 'Test card')
    expect(card).toHaveAttribute('role', 'article')
  })

  it('combines multiple props correctly', () => {
    render(
      <GlassCard 
        variant="strong"
        size="lg"
        hover
        glow
        data-testid="glass-card"
      >
        Test
      </GlassCard>
    )
    
    const card = screen.getByTestId('glass-card')
    expect(card).toHaveClass('glass-strong', 'p-8', 'hover-lift', 'hover-glow')
  })
})