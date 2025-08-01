import { useState, useEffect } from 'react';

// Mock data for when database is empty or unavailable
export const useMockData = () => {
  const [mockClients] = useState([
    {
      id: 'demo-client-1',
      name: 'Demo Client',
      slug: 'demo-client',
      description: 'Demo client for testing purposes',
      user_id: 'demo-user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: 'active' as const,
      industry: 'Technology',
      contactEmail: 'client@demo.com',
      brandColors: ['#FF1254', '#0C0A3E'],
      logo_url: undefined,
    },
    {
      id: 'techcorp-solutions',
      name: 'TechCorp Solutions',
      slug: 'techcorp-solutions',
      description: 'Technology consulting company',
      user_id: 'demo-user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: 'active' as const,
      industry: 'Technology',
      contactEmail: 'contact@techcorp.com',
      brandColors: ['#3B82F6', '#1E40AF'],
      logo_url: undefined,
    },
    {
      id: 'green-energy-co',
      name: 'Green Energy Co.',
      slug: 'green-energy-co',
      description: 'Renewable energy solutions',
      user_id: 'demo-user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: 'active' as const,
      industry: 'Energy',
      contactEmail: 'info@greenenergy.com',
      brandColors: ['#10B981', '#059669'],
      logo_url: undefined,
    }
  ]);

  const [mockCampaigns] = useState([
    {
      id: 'campaign-1',
      campaign_name: 'Holiday Promotion',
      client_id: 'demo-client-1',
      campaign_type: 'brand_awareness',
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      total_posts: 15,
      total_engagement: 2500,
      brand_consistency_avg: 85,
      content_pillar_distribution: { educational: 40, promotional: 35, behind_scenes: 25 },
      platform_performance: { instagram: 65, facebook: 45, linkedin: 30 },
      roi_metrics: { roas: 3.2, conversion_rate: 2.1 },
      brand_kpis: { awareness: 78, consideration: 65 },
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'campaign-2',
      campaign_name: 'Product Launch',
      client_id: 'techcorp-solutions',
      campaign_type: 'conversions',
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
      total_posts: 20,
      total_engagement: 4200,
      brand_consistency_avg: 92,
      content_pillar_distribution: { promotional: 50, educational: 30, product_showcase: 20 },
      platform_performance: { linkedin: 85, facebook: 55, instagram: 40 },
      roi_metrics: { roas: 4.5, conversion_rate: 3.8 },
      brand_kpis: { awareness: 88, consideration: 75 },
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  ]);

  const [mockApprovals] = useState([
    {
      id: 'approval-1',
      title: 'Instagram Holiday Post',
      client_id: 'demo-client-1',
      content_type: 'social_post',
      approval_status: 'pending',
      priority: 'medium',
      created_by: 'demo-user',
      deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      content_data: {
        caption: 'Get ready for our biggest holiday sale yet! 🎄✨',
        platform: 'instagram_business',
        media_url: null
      }
    },
    {
      id: 'approval-2',
      title: 'LinkedIn Campaign Draft',
      client_id: 'techcorp-solutions',
      content_type: 'campaign',
      approval_status: 'pending',
      priority: 'high',
      created_by: 'demo-user',
      deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      content_data: {
        title: 'Professional Services Campaign',
        platform: 'linkedin_company',
        budget: 5000
      }
    }
  ]);

  const [mockScheduledPosts] = useState([
    {
      id: 'post-1',
      title: 'Holiday Greeting',
      client_id: 'demo-client-1',
      platform: 'instagram_business',
      posting_status: 'scheduled',
      scheduled_at: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
      created_by: 'demo-user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      content_data: {
        caption: 'Wishing everyone happy holidays! 🎉',
        hashtags: ['#holidays', '#celebration', '#grateful']
      }
    },
    {
      id: 'post-2',
      title: 'Product Feature Highlight',
      client_id: 'techcorp-solutions',
      platform: 'linkedin_company',
      posting_status: 'published',
      scheduled_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      posted_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      created_by: 'demo-user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      content_data: {
        caption: 'Introducing our latest feature that will revolutionize your workflow.',
        link: 'https://techcorp.com/new-feature'
      }
    }
  ]);

  const [mockSocialAccounts] = useState([
    {
      account_id: 'instagram-1',
      platform: 'instagram_business' as const,
      platform_account_id: 'demo_business_ig',
      account_name: 'Demo Business',
      account_username: '@demo_business',
      account_avatar_url: undefined,
      connection_status: 'connected' as const,
      health_status: 'healthy' as const,
      last_health_check: new Date().toISOString(),
      health_issues: {},
      client_name: 'Demo Client',
      client_id: 'demo-client-1',
      created_at: new Date().toISOString(),
    },
    {
      account_id: 'facebook-1',
      platform: 'facebook_pages' as const,
      platform_account_id: 'demo_business_fb',
      account_name: 'Demo Business Page',
      account_username: undefined,
      account_avatar_url: undefined,
      connection_status: 'connected' as const,
      health_status: 'healthy' as const,
      last_health_check: new Date().toISOString(),
      health_issues: {},
      client_name: 'Demo Client',
      client_id: 'demo-client-1',
      created_at: new Date().toISOString(),
    },
    {
      account_id: 'linkedin-1',
      platform: 'linkedin_company' as const,
      platform_account_id: 'techcorp_linkedin',
      account_name: 'TechCorp Solutions',
      account_username: undefined,
      account_avatar_url: undefined,
      connection_status: 'connected' as const,
      health_status: 'healthy' as const,
      last_health_check: new Date().toISOString(),
      health_issues: {},
      client_name: 'TechCorp Solutions',
      client_id: 'techcorp-solutions',
      created_at: new Date().toISOString(),
    }
  ]);

  return {
    mockClients,
    mockCampaigns,
    mockApprovals,
    mockScheduledPosts,
    mockSocialAccounts,
  };
};