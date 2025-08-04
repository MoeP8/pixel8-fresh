import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useOnboarding } from '@/hooks/useOnboarding';
import { TourOverlay } from './TourOverlay';
import { WelcomeTour } from './WelcomeTour';
import { FeatureDiscovery } from './FeatureDiscovery';
import { TooltipManager } from './InteractiveTooltip';
import { allTours, allTooltips } from '@/data/tours';

export function OnboardingManager() {
  const location = useLocation();
  const { 
    isOnboardingActive, 
    progress, 
    availableTours,
    tooltips,
  } = useOnboarding();
  
  const [showWelcome, setShowWelcome] = useState(false);
  const [showFeatureDiscovery, setShowFeatureDiscovery] = useState(false);

  // Get current page name from location
  const getCurrentPage = () => {
    const path = location.pathname.slice(1); // Remove leading slash
    if (path === '') return 'dashboard';
    return path;
  };

  const currentPage = getCurrentPage();

  // Initialize tours and tooltips
  useEffect(() => {
    // This would ideally be done in the onboarding provider
    // but for demonstration, we'll handle it here
    if (availableTours.length === 0) {
      // Register tours (in a real app, this would be done in the provider)
      console.log('Registering tours:', allTours.length);
    }
    
    if (tooltips.length === 0) {
      // Register tooltips (in a real app, this would be done in the provider)
      console.log('Registering tooltips:', allTooltips.length);
    }
  }, [availableTours.length, tooltips.length]);

  // Show welcome tour for new users
  useEffect(() => {
    const isNewUser = progress.completedTours.length === 0;
    const isLandingPage = currentPage === 'dashboard' || currentPage === '';
    
    if (isNewUser && isLandingPage && !isOnboardingActive) {
      setShowWelcome(true);
    }
  }, [progress.completedTours.length, currentPage, isOnboardingActive]);

  // Show feature discovery on relevant pages
  useEffect(() => {
    const relevantPages = ['brand-hub', 'content-studio', 'analytics', 'clients'];
    const hasCompletedBasicTour = progress.completedTours.includes('getting-started');
    
    if (relevantPages.includes(currentPage) && hasCompletedBasicTour && !isOnboardingActive) {
      setShowFeatureDiscovery(true);
    } else {
      setShowFeatureDiscovery(false);
    }
  }, [currentPage, progress.completedTours, isOnboardingActive]);

  // Add tour data attributes to navigation elements
  useEffect(() => {
    // Add data-tour attributes to navigation elements for targeting
    const addTourAttributes = () => {
      // Main navigation
      const mainNav = document.querySelector('nav');
      if (mainNav) {
        mainNav.setAttribute('data-tour', 'main-nav');
      }

      // Navigation links
      const navLinks = {
        'clients': '[href*="/clients"]',
        'brand-hub': '[href*="/brand-hub"]',
        'content-studio': '[href*="/content-studio"]',
        'analytics': '[href*="/analytics"]',
        'scheduler': '[href*="/scheduler"]',
        'settings': '[href*="/settings"]',
      };

      Object.entries(navLinks).forEach(([key, selector]) => {
        const element = document.querySelector(selector);
        if (element) {
          element.setAttribute('data-tour', `${key}-nav`);
        }
      });

      // Page-specific elements based on current page
      if (currentPage === 'brand-hub') {
        const brandElements = {
          'voice-profile': '.voice-profile, [class*="voice"]',
          'color-palette': '.color-palette, [class*="color"]',
          'brand-guidelines': '.guidelines, [class*="guideline"]',
        };
        
        Object.entries(brandElements).forEach(([key, selector]) => {
          const element = document.querySelector(selector);
          if (element) {
            element.setAttribute('data-tour', key);
          }
        });
      }

      if (currentPage === 'content-studio') {
        const contentElements = {
          'content-editor': '.editor, [class*="editor"]',
          'ai-assistant': '.ai-assistant, [class*="ai"]',
          'templates': '.templates, [class*="template"]',
        };
        
        Object.entries(contentElements).forEach(([key, selector]) => {
          const element = document.querySelector(selector);
          if (element) {
            element.setAttribute('data-tour', key);
          }
        });
      }

      if (currentPage === 'analytics') {
        const analyticsElements = {
          'performance-overview': '.performance, [class*="metric"]',
          'roi-tracker': '.roi, [class*="roi"]',
          'export-button': '[class*="export"], [class*="download"]',
        };
        
        Object.entries(analyticsElements).forEach(([key, selector]) => {
          const element = document.querySelector(selector);
          if (element) {
            element.setAttribute('data-tour', key);
          }
        });
      }
    };

    // Add attributes after a short delay to ensure DOM is ready
    const timer = setTimeout(addTourAttributes, 1000);
    return () => clearTimeout(timer);
  }, [currentPage]);

  return (
    <>
      {/* Welcome Tour Modal */}
      {showWelcome && (
        <WelcomeTour onClose={() => setShowWelcome(false)} />
      )}

      {/* Tour Overlay */}
      {isOnboardingActive && <TourOverlay />}

      {/* Feature Discovery */}
      {showFeatureDiscovery && (
        <FeatureDiscovery 
          page={currentPage} 
          onClose={() => setShowFeatureDiscovery(false)} 
        />
      )}

      {/* Tooltip Manager */}
      <TooltipManager />
    </>
  );
}

// Hook for pages to easily access onboarding features
export function usePageOnboarding(page: string) {
  const { 
    startTour, 
    showTooltip, 
    isFeatureUnlocked, 
    discoverFeature,
    progress 
  } = useOnboarding();

  const startPageTour = () => {
    const tourId = `${page}-deep-dive`;
    startTour(tourId);
  };

  const showPageTooltip = (tooltipId: string) => {
    showTooltip(`${page}-${tooltipId}`);
  };

  const isPageFeatureUnlocked = (featureId: string) => {
    return isFeatureUnlocked(`${page}-${featureId}`);
  };

  const discoverPageFeature = (featureId: string) => {
    discoverFeature(`${page}-${featureId}`);
  };

  const getPageProgress = () => {
    const pageSpecificTours = progress.completedTours.filter(
      tourId => tourId.includes(page)
    );
    return {
      toursCompleted: pageSpecificTours.length,
      hasBasicTour: progress.completedTours.includes('getting-started'),
      isExperienced: progress.completedTours.length >= 3,
    };
  };

  return {
    startPageTour,
    showPageTooltip,
    isPageFeatureUnlocked,
    discoverPageFeature,
    getPageProgress,
  };
}