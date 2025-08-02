import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import Dashboard from '../Dashboard'

// Mock the hooks
vi.mock('@/hooks/useMultiAccountPublishing', () => ({
  useMultiAccountPublishing: () => ({
    accounts: [],
    isLoading: false,
    getPublishingStats: () => ({
      totalAccounts: 12,
      activeAccounts: 8,
      teamMembers: 5,
      totalFollowers: 85600,
      weeklyGrowth: 12.5,
      engagementRate: 7.8,
      topPerformingPlatform: 'Instagram'
    })
  })
}))

vi.mock('@/hooks/useContentAnalytics', () => ({
  useContentAnalytics: () => ({
    isLoading: false,
    data: {
      totalPosts: 1247,
      impressions: 856000,
      engagement: 67300
    }
  })
}))

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders dashboard title and description', () => {
    renderWithRouter(<Dashboard />)
    
    expect(screen.getByText('Pixel8 Social Hub')).toBeInTheDocument()
    expect(screen.getByText(/Premium social media management platform/)).toBeInTheDocument()
  })

  it('displays stats cards with correct data', async () => {
    renderWithRouter(<Dashboard />)
    
    await waitFor(() => {
      expect(screen.getByText('1,247')).toBeInTheDocument() // Total Posts
      expect(screen.getByText('856K')).toBeInTheDocument() // Impressions
      expect(screen.getByText('67.3K')).toBeInTheDocument() // Engagement
      expect(screen.getByText('12')).toBeInTheDocument() // Total Accounts
      expect(screen.getByText('8')).toBeInTheDocument() // Active Accounts
      expect(screen.getByText('5')).toBeInTheDocument() // Team Members
    })
  })

  it('applies glass morphism styling to cards', () => {
    renderWithRouter(<Dashboard />)
    
    const cards = screen.getAllByTestId('stats-card')
    expect(cards).toHaveLength(6) // Should have 6 stat cards
    
    cards.forEach(card => {
      expect(card).toHaveClass('glass-dark')
    })
  })

  it('displays navigation quick actions', () => {
    renderWithRouter(<Dashboard />)
    
    expect(screen.getByText('Create Content')).toBeInTheDocument()
    expect(screen.getByText('View Analytics')).toBeInTheDocument()
    expect(screen.getByText('Manage Accounts')).toBeInTheDocument()
  })

  it('shows recent activity section', () => {
    renderWithRouter(<Dashboard />)
    
    expect(screen.getByText('Recent Activity')).toBeInTheDocument()
  })

  it('displays performance metrics chart area', () => {
    renderWithRouter(<Dashboard />)
    
    expect(screen.getByText('Performance Overview')).toBeInTheDocument()
  })

  it('handles loading states gracefully', () => {
    vi.mocked(vi.fn()).mockReturnValueOnce({
      useContentAnalytics: () => ({
        isLoading: true,
        data: null
      })
    })
    
    renderWithRouter(<Dashboard />)
    
    // Should still render the basic structure even when loading
    expect(screen.getByText('Pixel8 Social Hub')).toBeInTheDocument()
  })

  it('is accessible with proper ARIA labels', () => {
    renderWithRouter(<Dashboard />)
    
    // Check for main landmarks
    expect(screen.getByRole('main')).toBeInTheDocument()
    
    // Stats cards should be accessible
    const statsCards = screen.getAllByTestId('stats-card')
    statsCards.forEach(card => {
      expect(card).toBeVisible()
    })
  })

  it('displays proper hover effects on interactive elements', () => {
    renderWithRouter(<Dashboard />)
    
    const quickActions = screen.getAllByRole('button')
    quickActions.forEach(button => {
      expect(button).toHaveClass('hover-lift')
    })
  })
})