export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      ad_accounts: {
        Row: {
          access_token: string | null
          account_id: string
          account_name: string
          account_status: string | null
          client_id: string
          created_at: string
          currency: string | null
          daily_budget_limit: number | null
          id: string
          is_active: boolean | null
          last_sync_at: string | null
          monthly_budget_limit: number | null
          platform: string
          refresh_token: string | null
          timezone: string | null
          token_expires_at: string | null
          updated_at: string
        }
        Insert: {
          access_token?: string | null
          account_id: string
          account_name: string
          account_status?: string | null
          client_id: string
          created_at?: string
          currency?: string | null
          daily_budget_limit?: number | null
          id?: string
          is_active?: boolean | null
          last_sync_at?: string | null
          monthly_budget_limit?: number | null
          platform: string
          refresh_token?: string | null
          timezone?: string | null
          token_expires_at?: string | null
          updated_at?: string
        }
        Update: {
          access_token?: string | null
          account_id?: string
          account_name?: string
          account_status?: string | null
          client_id?: string
          created_at?: string
          currency?: string | null
          daily_budget_limit?: number | null
          id?: string
          is_active?: boolean | null
          last_sync_at?: string | null
          monthly_budget_limit?: number | null
          platform?: string
          refresh_token?: string | null
          timezone?: string | null
          token_expires_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      ad_campaigns: {
        Row: {
          ad_account_id: string
          automation_rules: Json | null
          bid_strategy: string
          brand_compliance_score: number | null
          campaign_name: string
          campaign_settings: Json | null
          campaign_status: string | null
          campaign_type: string
          client_id: string
          created_at: string
          created_by: string | null
          daily_budget: number | null
          end_date: string | null
          id: string
          last_sync_at: string | null
          objective: string
          platform_campaign_id: string
          start_date: string | null
          target_cpa: number | null
          target_roas: number | null
          targeting_data: Json | null
          total_budget: number | null
          updated_at: string
        }
        Insert: {
          ad_account_id: string
          automation_rules?: Json | null
          bid_strategy: string
          brand_compliance_score?: number | null
          campaign_name: string
          campaign_settings?: Json | null
          campaign_status?: string | null
          campaign_type: string
          client_id: string
          created_at?: string
          created_by?: string | null
          daily_budget?: number | null
          end_date?: string | null
          id?: string
          last_sync_at?: string | null
          objective: string
          platform_campaign_id: string
          start_date?: string | null
          target_cpa?: number | null
          target_roas?: number | null
          targeting_data?: Json | null
          total_budget?: number | null
          updated_at?: string
        }
        Update: {
          ad_account_id?: string
          automation_rules?: Json | null
          bid_strategy?: string
          brand_compliance_score?: number | null
          campaign_name?: string
          campaign_settings?: Json | null
          campaign_status?: string | null
          campaign_type?: string
          client_id?: string
          created_at?: string
          created_by?: string | null
          daily_budget?: number | null
          end_date?: string | null
          id?: string
          last_sync_at?: string | null
          objective?: string
          platform_campaign_id?: string
          start_date?: string | null
          target_cpa?: number | null
          target_roas?: number | null
          targeting_data?: Json | null
          total_budget?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ad_campaigns_ad_account_id_fkey"
            columns: ["ad_account_id"]
            isOneToOne: false
            referencedRelation: "ad_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      ad_creative_assets: {
        Row: {
          asset_data: Json | null
          asset_name: string
          asset_type: string
          asset_url: string | null
          brand_compliant: boolean | null
          client_id: string
          created_at: string
          dimensions: string | null
          file_size: number | null
          id: string
          performance_score: number | null
          platform_requirements: Json | null
          tags: string[] | null
          updated_at: string
          usage_count: number | null
        }
        Insert: {
          asset_data?: Json | null
          asset_name: string
          asset_type: string
          asset_url?: string | null
          brand_compliant?: boolean | null
          client_id: string
          created_at?: string
          dimensions?: string | null
          file_size?: number | null
          id?: string
          performance_score?: number | null
          platform_requirements?: Json | null
          tags?: string[] | null
          updated_at?: string
          usage_count?: number | null
        }
        Update: {
          asset_data?: Json | null
          asset_name?: string
          asset_type?: string
          asset_url?: string | null
          brand_compliant?: boolean | null
          client_id?: string
          created_at?: string
          dimensions?: string | null
          file_size?: number | null
          id?: string
          performance_score?: number | null
          platform_requirements?: Json | null
          tags?: string[] | null
          updated_at?: string
          usage_count?: number | null
        }
        Relationships: []
      }
      ad_groups: {
        Row: {
          ad_campaign_id: string
          ad_group_name: string
          ad_group_status: string | null
          audiences: Json | null
          bid_amount: number | null
          created_at: string
          demographics: Json | null
          id: string
          keywords: Json | null
          placements: Json | null
          platform_ad_group_id: string
          updated_at: string
        }
        Insert: {
          ad_campaign_id: string
          ad_group_name: string
          ad_group_status?: string | null
          audiences?: Json | null
          bid_amount?: number | null
          created_at?: string
          demographics?: Json | null
          id?: string
          keywords?: Json | null
          placements?: Json | null
          platform_ad_group_id: string
          updated_at?: string
        }
        Update: {
          ad_campaign_id?: string
          ad_group_name?: string
          ad_group_status?: string | null
          audiences?: Json | null
          bid_amount?: number | null
          created_at?: string
          demographics?: Json | null
          id?: string
          keywords?: Json | null
          placements?: Json | null
          platform_ad_group_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ad_groups_ad_campaign_id_fkey"
            columns: ["ad_campaign_id"]
            isOneToOne: false
            referencedRelation: "ad_campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      ads: {
        Row: {
          ad_group_id: string
          ad_name: string
          ad_status: string | null
          ad_type: string
          ai_generated: boolean | null
          brand_compliance_score: number | null
          call_to_action: string | null
          created_at: string
          creative_assets: Json | null
          descriptions: Json | null
          final_urls: Json | null
          headlines: Json | null
          id: string
          landing_page_url: string | null
          performance_score: number | null
          platform_ad_id: string
          tracking_template: string | null
          updated_at: string
        }
        Insert: {
          ad_group_id: string
          ad_name: string
          ad_status?: string | null
          ad_type: string
          ai_generated?: boolean | null
          brand_compliance_score?: number | null
          call_to_action?: string | null
          created_at?: string
          creative_assets?: Json | null
          descriptions?: Json | null
          final_urls?: Json | null
          headlines?: Json | null
          id?: string
          landing_page_url?: string | null
          performance_score?: number | null
          platform_ad_id: string
          tracking_template?: string | null
          updated_at?: string
        }
        Update: {
          ad_group_id?: string
          ad_name?: string
          ad_status?: string | null
          ad_type?: string
          ai_generated?: boolean | null
          brand_compliance_score?: number | null
          call_to_action?: string | null
          created_at?: string
          creative_assets?: Json | null
          descriptions?: Json | null
          final_urls?: Json | null
          headlines?: Json | null
          id?: string
          landing_page_url?: string | null
          performance_score?: number | null
          platform_ad_id?: string
          tracking_template?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ads_ad_group_id_fkey"
            columns: ["ad_group_id"]
            isOneToOne: false
            referencedRelation: "ad_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      approval_comments: {
        Row: {
          approval_id: string
          author_id: string
          brand_guideline_references: Json | null
          content: string
          created_at: string
          id: string
          is_internal: boolean | null
          parent_comment_id: string | null
          suggested_changes: string | null
          updated_at: string
        }
        Insert: {
          approval_id: string
          author_id: string
          brand_guideline_references?: Json | null
          content: string
          created_at?: string
          id?: string
          is_internal?: boolean | null
          parent_comment_id?: string | null
          suggested_changes?: string | null
          updated_at?: string
        }
        Update: {
          approval_id?: string
          author_id?: string
          brand_guideline_references?: Json | null
          content?: string
          created_at?: string
          id?: string
          is_internal?: boolean | null
          parent_comment_id?: string | null
          suggested_changes?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      approval_notifications: {
        Row: {
          approval_id: string
          brand_guideline_section: string | null
          created_at: string
          id: string
          is_read: boolean | null
          message: string
          notification_type: string
          recipient_id: string
          sent_at: string | null
          title: string
        }
        Insert: {
          approval_id: string
          brand_guideline_section?: string | null
          created_at?: string
          id?: string
          is_read?: boolean | null
          message: string
          notification_type: string
          recipient_id: string
          sent_at?: string | null
          title: string
        }
        Update: {
          approval_id?: string
          brand_guideline_section?: string | null
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string
          notification_type?: string
          recipient_id?: string
          sent_at?: string | null
          title?: string
        }
        Relationships: []
      }
      automation_rules: {
        Row: {
          actions: Json
          applies_to: string
          client_id: string
          conditions: Json
          created_at: string
          id: string
          is_active: boolean | null
          last_triggered_at: string | null
          rule_name: string
          rule_type: string
          target_ids: string[] | null
          trigger_count: number | null
          updated_at: string
        }
        Insert: {
          actions?: Json
          applies_to: string
          client_id: string
          conditions?: Json
          created_at?: string
          id?: string
          is_active?: boolean | null
          last_triggered_at?: string | null
          rule_name: string
          rule_type: string
          target_ids?: string[] | null
          trigger_count?: number | null
          updated_at?: string
        }
        Update: {
          actions?: Json
          applies_to?: string
          client_id?: string
          conditions?: Json
          created_at?: string
          id?: string
          is_active?: boolean | null
          last_triggered_at?: string | null
          rule_name?: string
          rule_type?: string
          target_ids?: string[] | null
          trigger_count?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      brand_asset_requests: {
        Row: {
          asset_name: string
          asset_type: Database["public"]["Enums"]["brand_asset_type"]
          client_id: string
          created_at: string
          deadline: string | null
          description: string | null
          fulfilled_asset_id: string | null
          id: string
          notes: string | null
          priority: string | null
          requested_by: string | null
          status: Database["public"]["Enums"]["approval_status"] | null
          updated_at: string
        }
        Insert: {
          asset_name: string
          asset_type: Database["public"]["Enums"]["brand_asset_type"]
          client_id: string
          created_at?: string
          deadline?: string | null
          description?: string | null
          fulfilled_asset_id?: string | null
          id?: string
          notes?: string | null
          priority?: string | null
          requested_by?: string | null
          status?: Database["public"]["Enums"]["approval_status"] | null
          updated_at?: string
        }
        Update: {
          asset_name?: string
          asset_type?: Database["public"]["Enums"]["brand_asset_type"]
          client_id?: string
          created_at?: string
          deadline?: string | null
          description?: string | null
          fulfilled_asset_id?: string | null
          id?: string
          notes?: string | null
          priority?: string | null
          requested_by?: string | null
          status?: Database["public"]["Enums"]["approval_status"] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "brand_asset_requests_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "brand_asset_requests_fulfilled_asset_id_fkey"
            columns: ["fulfilled_asset_id"]
            isOneToOne: false
            referencedRelation: "brand_assets"
            referencedColumns: ["id"]
          },
        ]
      }
      brand_assets: {
        Row: {
          asset_type: Database["public"]["Enums"]["brand_asset_type"]
          client_id: string
          created_at: string
          created_by: string | null
          description: string | null
          file_name: string
          file_size: number | null
          file_type: string | null
          file_url: string
          id: string
          is_primary: boolean | null
          name: string
          tags: string[] | null
          thumbnail_url: string | null
          updated_at: string
          usage_notes: string | null
        }
        Insert: {
          asset_type: Database["public"]["Enums"]["brand_asset_type"]
          client_id: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          file_name: string
          file_size?: number | null
          file_type?: string | null
          file_url: string
          id?: string
          is_primary?: boolean | null
          name: string
          tags?: string[] | null
          thumbnail_url?: string | null
          updated_at?: string
          usage_notes?: string | null
        }
        Update: {
          asset_type?: Database["public"]["Enums"]["brand_asset_type"]
          client_id?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          file_name?: string
          file_size?: number | null
          file_type?: string | null
          file_url?: string
          id?: string
          is_primary?: boolean | null
          name?: string
          tags?: string[] | null
          thumbnail_url?: string | null
          updated_at?: string
          usage_notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "brand_assets_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      brand_colors: {
        Row: {
          client_id: string
          cmyk_values: Json | null
          created_at: string
          hex_code: string
          id: string
          is_primary: boolean | null
          name: string
          rgb_values: Json | null
          sort_order: number | null
          updated_at: string
          usage_notes: string | null
        }
        Insert: {
          client_id: string
          cmyk_values?: Json | null
          created_at?: string
          hex_code: string
          id?: string
          is_primary?: boolean | null
          name: string
          rgb_values?: Json | null
          sort_order?: number | null
          updated_at?: string
          usage_notes?: string | null
        }
        Update: {
          client_id?: string
          cmyk_values?: Json | null
          created_at?: string
          hex_code?: string
          id?: string
          is_primary?: boolean | null
          name?: string
          rgb_values?: Json | null
          sort_order?: number | null
          updated_at?: string
          usage_notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "brand_colors_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      brand_guidelines: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          client_id: string
          created_at: string
          created_by: string | null
          description: string | null
          file_name: string | null
          file_size: number | null
          file_type: string | null
          file_url: string | null
          id: string
          is_active: boolean | null
          title: string
          updated_at: string
          version_number: number | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          client_id: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          file_name?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          is_active?: boolean | null
          title: string
          updated_at?: string
          version_number?: number | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          client_id?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          file_name?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          is_active?: boolean | null
          title?: string
          updated_at?: string
          version_number?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "brand_guidelines_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      brand_performance_metrics: {
        Row: {
          client_id: string
          created_at: string
          date_recorded: string
          id: string
          metric_data: Json | null
          metric_type: string
          metric_value: number
          time_period: string
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          date_recorded: string
          id?: string
          metric_data?: Json | null
          metric_type: string
          metric_value: number
          time_period: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          date_recorded?: string
          id?: string
          metric_data?: Json | null
          metric_type?: string
          metric_value?: number
          time_period?: string
          updated_at?: string
        }
        Relationships: []
      }
      brand_typography: {
        Row: {
          client_id: string
          created_at: string
          fallback_fonts: string[] | null
          font_family: string
          font_size_px: number | null
          font_weight: string | null
          id: string
          letter_spacing: number | null
          line_height: number | null
          name: string
          sort_order: number | null
          updated_at: string
          usage_context: string | null
          usage_notes: string | null
          web_font_url: string | null
        }
        Insert: {
          client_id: string
          created_at?: string
          fallback_fonts?: string[] | null
          font_family: string
          font_size_px?: number | null
          font_weight?: string | null
          id?: string
          letter_spacing?: number | null
          line_height?: number | null
          name: string
          sort_order?: number | null
          updated_at?: string
          usage_context?: string | null
          usage_notes?: string | null
          web_font_url?: string | null
        }
        Update: {
          client_id?: string
          created_at?: string
          fallback_fonts?: string[] | null
          font_family?: string
          font_size_px?: number | null
          font_weight?: string | null
          id?: string
          letter_spacing?: number | null
          line_height?: number | null
          name?: string
          sort_order?: number | null
          updated_at?: string
          usage_context?: string | null
          usage_notes?: string | null
          web_font_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "brand_typography_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      brand_voice_profiles: {
        Row: {
          client_id: string
          created_at: string
          description: string | null
          examples: Json | null
          id: string
          trait_type: Database["public"]["Enums"]["voice_trait"]
          trait_value: number | null
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          description?: string | null
          examples?: Json | null
          id?: string
          trait_type: Database["public"]["Enums"]["voice_trait"]
          trait_value?: number | null
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          description?: string | null
          examples?: Json | null
          id?: string
          trait_type?: Database["public"]["Enums"]["voice_trait"]
          trait_value?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "brand_voice_profiles_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      budget_tracking: {
        Row: {
          ad_account_id: string
          alert_triggered: boolean | null
          allocated_budget: number
          budget_utilization: number | null
          created_at: string
          id: string
          predicted_spend: number | null
          remaining_budget: number | null
          spent_budget: number | null
          tracking_date: string
        }
        Insert: {
          ad_account_id: string
          alert_triggered?: boolean | null
          allocated_budget: number
          budget_utilization?: number | null
          created_at?: string
          id?: string
          predicted_spend?: number | null
          remaining_budget?: number | null
          spent_budget?: number | null
          tracking_date: string
        }
        Update: {
          ad_account_id?: string
          alert_triggered?: boolean | null
          allocated_budget?: number
          budget_utilization?: number | null
          created_at?: string
          id?: string
          predicted_spend?: number | null
          remaining_budget?: number | null
          spent_budget?: number | null
          tracking_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "budget_tracking_ad_account_id_fkey"
            columns: ["ad_account_id"]
            isOneToOne: false
            referencedRelation: "ad_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_analytics: {
        Row: {
          brand_consistency_avg: number | null
          brand_kpis: Json | null
          campaign_name: string
          campaign_type: string | null
          client_id: string
          content_pillar_distribution: Json | null
          created_at: string
          end_date: string | null
          id: string
          is_active: boolean | null
          platform_performance: Json | null
          roi_metrics: Json | null
          start_date: string
          total_engagement: number | null
          total_posts: number | null
          updated_at: string
        }
        Insert: {
          brand_consistency_avg?: number | null
          brand_kpis?: Json | null
          campaign_name: string
          campaign_type?: string | null
          client_id: string
          content_pillar_distribution?: Json | null
          created_at?: string
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          platform_performance?: Json | null
          roi_metrics?: Json | null
          start_date: string
          total_engagement?: number | null
          total_posts?: number | null
          updated_at?: string
        }
        Update: {
          brand_consistency_avg?: number | null
          brand_kpis?: Json | null
          campaign_name?: string
          campaign_type?: string | null
          client_id?: string
          content_pillar_distribution?: Json | null
          created_at?: string
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          platform_performance?: Json | null
          roi_metrics?: Json | null
          start_date?: string
          total_engagement?: number | null
          total_posts?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      campaign_performance: {
        Row: {
          ad_campaign_id: string
          clicks: number | null
          conversion_rate: number | null
          conversions: number | null
          cost: number | null
          cpa: number | null
          cpc: number | null
          created_at: string
          ctr: number | null
          date_recorded: string
          engagement_rate: number | null
          frequency: number | null
          id: string
          impressions: number | null
          quality_score: number | null
          reach: number | null
          roas: number | null
          video_views: number | null
        }
        Insert: {
          ad_campaign_id: string
          clicks?: number | null
          conversion_rate?: number | null
          conversions?: number | null
          cost?: number | null
          cpa?: number | null
          cpc?: number | null
          created_at?: string
          ctr?: number | null
          date_recorded: string
          engagement_rate?: number | null
          frequency?: number | null
          id?: string
          impressions?: number | null
          quality_score?: number | null
          reach?: number | null
          roas?: number | null
          video_views?: number | null
        }
        Update: {
          ad_campaign_id?: string
          clicks?: number | null
          conversion_rate?: number | null
          conversions?: number | null
          cost?: number | null
          cpa?: number | null
          cpc?: number | null
          created_at?: string
          ctr?: number | null
          date_recorded?: string
          engagement_rate?: number | null
          frequency?: number | null
          id?: string
          impressions?: number | null
          quality_score?: number | null
          reach?: number | null
          roas?: number | null
          video_views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_performance_ad_campaign_id_fkey"
            columns: ["ad_campaign_id"]
            isOneToOne: false
            referencedRelation: "ad_campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          created_at: string
          description: string | null
          id: string
          logo_url: string | null
          name: string
          slug: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name: string
          slug: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          slug?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      compliance_notes: {
        Row: {
          approval_requirements: string | null
          client_id: string
          compliance_rules: string
          created_at: string
          id: string
          industry: string
          is_active: boolean | null
          prohibited_terms: string[] | null
          regulation_type: string | null
          required_disclaimers: string[] | null
          updated_at: string
        }
        Insert: {
          approval_requirements?: string | null
          client_id: string
          compliance_rules: string
          created_at?: string
          id?: string
          industry: string
          is_active?: boolean | null
          prohibited_terms?: string[] | null
          regulation_type?: string | null
          required_disclaimers?: string[] | null
          updated_at?: string
        }
        Update: {
          approval_requirements?: string | null
          client_id?: string
          compliance_rules?: string
          created_at?: string
          id?: string
          industry?: string
          is_active?: boolean | null
          prohibited_terms?: string[] | null
          regulation_type?: string | null
          required_disclaimers?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "compliance_notes_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      content_approvals: {
        Row: {
          approval_status: Database["public"]["Enums"]["approval_status"]
          approved_at: string | null
          approved_by: string | null
          brand_compliance_score: number | null
          brand_issues: Json | null
          client_id: string
          content_data: Json
          content_type: Database["public"]["Enums"]["content_type"]
          created_at: string
          created_by: string
          deadline: string | null
          description: string | null
          id: string
          platform: Database["public"]["Enums"]["social_platform"] | null
          priority: Database["public"]["Enums"]["priority_level"] | null
          rejected_at: string | null
          rejected_by: string | null
          rejection_reason: string | null
          scheduled_date: string | null
          title: string
          updated_at: string
        }
        Insert: {
          approval_status?: Database["public"]["Enums"]["approval_status"]
          approved_at?: string | null
          approved_by?: string | null
          brand_compliance_score?: number | null
          brand_issues?: Json | null
          client_id: string
          content_data?: Json
          content_type: Database["public"]["Enums"]["content_type"]
          created_at?: string
          created_by: string
          deadline?: string | null
          description?: string | null
          id?: string
          platform?: Database["public"]["Enums"]["social_platform"] | null
          priority?: Database["public"]["Enums"]["priority_level"] | null
          rejected_at?: string | null
          rejected_by?: string | null
          rejection_reason?: string | null
          scheduled_date?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          approval_status?: Database["public"]["Enums"]["approval_status"]
          approved_at?: string | null
          approved_by?: string | null
          brand_compliance_score?: number | null
          brand_issues?: Json | null
          client_id?: string
          content_data?: Json
          content_type?: Database["public"]["Enums"]["content_type"]
          created_at?: string
          created_by?: string
          deadline?: string | null
          description?: string | null
          id?: string
          platform?: Database["public"]["Enums"]["social_platform"] | null
          priority?: Database["public"]["Enums"]["priority_level"] | null
          rejected_at?: string | null
          rejected_by?: string | null
          rejection_reason?: string | null
          scheduled_date?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      content_distribution_rules: {
        Row: {
          client_id: string
          created_at: string
          id: string
          is_active: boolean | null
          maximum_posts_per_day: number | null
          minimum_gap_hours: number | null
          name: string
          pillar_distribution: Json
          platform_distribution: Json
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          maximum_posts_per_day?: number | null
          minimum_gap_hours?: number | null
          name: string
          pillar_distribution?: Json
          platform_distribution?: Json
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          maximum_posts_per_day?: number | null
          minimum_gap_hours?: number | null
          name?: string
          pillar_distribution?: Json
          platform_distribution?: Json
          updated_at?: string
        }
        Relationships: []
      }
      content_pillar_performance: {
        Row: {
          avg_brand_score: number | null
          client_id: string
          content_pillar_id: string
          created_at: string
          date_recorded: string
          id: string
          performance_data: Json | null
          posts_count: number | null
          time_period: string
          total_engagement: number | null
          updated_at: string
        }
        Insert: {
          avg_brand_score?: number | null
          client_id: string
          content_pillar_id: string
          created_at?: string
          date_recorded: string
          id?: string
          performance_data?: Json | null
          posts_count?: number | null
          time_period: string
          total_engagement?: number | null
          updated_at?: string
        }
        Update: {
          avg_brand_score?: number | null
          client_id?: string
          content_pillar_id?: string
          created_at?: string
          date_recorded?: string
          id?: string
          performance_data?: Json | null
          posts_count?: number | null
          time_period?: string
          total_engagement?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      content_pillars: {
        Row: {
          client_id: string
          created_at: string
          description: string | null
          example_topics: string[] | null
          id: string
          is_active: boolean | null
          messaging_framework: Json | null
          name: string
          percentage_target: number | null
          pillar_type: Database["public"]["Enums"]["content_pillar_type"]
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          description?: string | null
          example_topics?: string[] | null
          id?: string
          is_active?: boolean | null
          messaging_framework?: Json | null
          name: string
          percentage_target?: number | null
          pillar_type: Database["public"]["Enums"]["content_pillar_type"]
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          description?: string | null
          example_topics?: string[] | null
          id?: string
          is_active?: boolean | null
          messaging_framework?: Json | null
          name?: string
          percentage_target?: number | null
          pillar_type?: Database["public"]["Enums"]["content_pillar_type"]
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_pillars_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      hashtag_strategies: {
        Row: {
          client_id: string
          created_at: string
          hashtags: string[]
          id: string
          is_active: boolean | null
          max_hashtags: number | null
          performance_notes: string | null
          platform: Database["public"]["Enums"]["social_platform"]
          strategy_name: string
          updated_at: string
          usage_notes: string | null
        }
        Insert: {
          client_id: string
          created_at?: string
          hashtags: string[]
          id?: string
          is_active?: boolean | null
          max_hashtags?: number | null
          performance_notes?: string | null
          platform: Database["public"]["Enums"]["social_platform"]
          strategy_name: string
          updated_at?: string
          usage_notes?: string | null
        }
        Update: {
          client_id?: string
          created_at?: string
          hashtags?: string[]
          id?: string
          is_active?: boolean | null
          max_hashtags?: number | null
          performance_notes?: string | null
          platform?: Database["public"]["Enums"]["social_platform"]
          strategy_name?: string
          updated_at?: string
          usage_notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hashtag_strategies_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      oauth_tokens: {
        Row: {
          access_token: string
          created_at: string
          expires_at: string | null
          id: string
          refresh_token: string | null
          scope: string | null
          social_account_id: string
          token_type: string | null
          updated_at: string
        }
        Insert: {
          access_token: string
          created_at?: string
          expires_at?: string | null
          id?: string
          refresh_token?: string | null
          scope?: string | null
          social_account_id: string
          token_type?: string | null
          updated_at?: string
        }
        Update: {
          access_token?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          refresh_token?: string | null
          scope?: string | null
          social_account_id?: string
          token_type?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "oauth_tokens_social_account_id_fkey"
            columns: ["social_account_id"]
            isOneToOne: false
            referencedRelation: "social_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      optimal_posting_times: {
        Row: {
          audience_size_score: number | null
          brand_pillar_id: string | null
          client_id: string
          created_at: string
          day_of_week: number
          engagement_score: number | null
          hour_of_day: number
          id: string
          last_updated: string | null
          performance_data: Json | null
          platform: Database["public"]["Enums"]["social_platform"]
          updated_at: string
        }
        Insert: {
          audience_size_score?: number | null
          brand_pillar_id?: string | null
          client_id: string
          created_at?: string
          day_of_week: number
          engagement_score?: number | null
          hour_of_day: number
          id?: string
          last_updated?: string | null
          performance_data?: Json | null
          platform: Database["public"]["Enums"]["social_platform"]
          updated_at?: string
        }
        Update: {
          audience_size_score?: number | null
          brand_pillar_id?: string | null
          client_id?: string
          created_at?: string
          day_of_week?: number
          engagement_score?: number | null
          hour_of_day?: number
          id?: string
          last_updated?: string | null
          performance_data?: Json | null
          platform?: Database["public"]["Enums"]["social_platform"]
          updated_at?: string
        }
        Relationships: []
      }
      platform_guidelines: {
        Row: {
          api_rate_limits: Json
          character_limits: Json
          created_at: string
          id: string
          platform: Database["public"]["Enums"]["social_platform"]
          posting_guidelines: Json
          supported_media_types: Json
          updated_at: string
        }
        Insert: {
          api_rate_limits?: Json
          character_limits?: Json
          created_at?: string
          id?: string
          platform: Database["public"]["Enums"]["social_platform"]
          posting_guidelines?: Json
          supported_media_types?: Json
          updated_at?: string
        }
        Update: {
          api_rate_limits?: Json
          character_limits?: Json
          created_at?: string
          id?: string
          platform?: Database["public"]["Enums"]["social_platform"]
          posting_guidelines?: Json
          supported_media_types?: Json
          updated_at?: string
        }
        Relationships: []
      }
      recurring_post_rules: {
        Row: {
          client_id: string
          content_pillar_id: string | null
          created_at: string
          created_by: string
          frequency: string
          frequency_config: Json | null
          id: string
          is_active: boolean | null
          last_generated_at: string | null
          name: string
          next_generation_at: string | null
          platforms: Database["public"]["Enums"]["social_platform"][]
          template_data: Json
          time_slots: Json | null
          updated_at: string
        }
        Insert: {
          client_id: string
          content_pillar_id?: string | null
          created_at?: string
          created_by: string
          frequency: string
          frequency_config?: Json | null
          id?: string
          is_active?: boolean | null
          last_generated_at?: string | null
          name: string
          next_generation_at?: string | null
          platforms: Database["public"]["Enums"]["social_platform"][]
          template_data?: Json
          time_slots?: Json | null
          updated_at?: string
        }
        Update: {
          client_id?: string
          content_pillar_id?: string | null
          created_at?: string
          created_by?: string
          frequency?: string
          frequency_config?: Json | null
          id?: string
          is_active?: boolean | null
          last_generated_at?: string | null
          name?: string
          next_generation_at?: string | null
          platforms?: Database["public"]["Enums"]["social_platform"][]
          template_data?: Json
          time_slots?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      scheduled_posts: {
        Row: {
          approval_id: string | null
          brand_compliance_score: number | null
          client_id: string
          content_data: Json
          content_pillar_id: string | null
          created_at: string
          created_by: string
          engagement_data: Json | null
          failure_reason: string | null
          id: string
          optimal_time_score: number | null
          platform: Database["public"]["Enums"]["social_platform"]
          posted_at: string | null
          posting_status: string | null
          recurring_rule_id: string | null
          scheduled_at: string
          title: string
          updated_at: string
        }
        Insert: {
          approval_id?: string | null
          brand_compliance_score?: number | null
          client_id: string
          content_data?: Json
          content_pillar_id?: string | null
          created_at?: string
          created_by: string
          engagement_data?: Json | null
          failure_reason?: string | null
          id?: string
          optimal_time_score?: number | null
          platform: Database["public"]["Enums"]["social_platform"]
          posted_at?: string | null
          posting_status?: string | null
          recurring_rule_id?: string | null
          scheduled_at: string
          title: string
          updated_at?: string
        }
        Update: {
          approval_id?: string | null
          brand_compliance_score?: number | null
          client_id?: string
          content_data?: Json
          content_pillar_id?: string | null
          created_at?: string
          created_by?: string
          engagement_data?: Json | null
          failure_reason?: string | null
          id?: string
          optimal_time_score?: number | null
          platform?: Database["public"]["Enums"]["social_platform"]
          posted_at?: string | null
          posting_status?: string | null
          recurring_rule_id?: string | null
          scheduled_at?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      social_accounts: {
        Row: {
          account_avatar_url: string | null
          account_name: string
          account_username: string | null
          api_limits: Json | null
          client_id: string | null
          connection_status: Database["public"]["Enums"]["connection_status"]
          created_at: string
          health_issues: Json | null
          health_status: Database["public"]["Enums"]["health_status"]
          id: string
          last_health_check: string | null
          platform: Database["public"]["Enums"]["social_platform"]
          platform_account_id: string
          platform_data: Json | null
          posting_permissions: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          account_avatar_url?: string | null
          account_name: string
          account_username?: string | null
          api_limits?: Json | null
          client_id?: string | null
          connection_status?: Database["public"]["Enums"]["connection_status"]
          created_at?: string
          health_issues?: Json | null
          health_status?: Database["public"]["Enums"]["health_status"]
          id?: string
          last_health_check?: string | null
          platform: Database["public"]["Enums"]["social_platform"]
          platform_account_id: string
          platform_data?: Json | null
          posting_permissions?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          account_avatar_url?: string | null
          account_name?: string
          account_username?: string | null
          api_limits?: Json | null
          client_id?: string | null
          connection_status?: Database["public"]["Enums"]["connection_status"]
          created_at?: string
          health_issues?: Json | null
          health_status?: Database["public"]["Enums"]["health_status"]
          id?: string
          last_health_check?: string | null
          platform?: Database["public"]["Enums"]["social_platform"]
          platform_account_id?: string
          platform_data?: Json | null
          posting_permissions?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "social_accounts_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      voice_tone_analytics: {
        Row: {
          analyzed_at: string | null
          brand_voice_alignment: number | null
          client_id: string
          content_id: string | null
          created_at: string
          id: string
          overall_voice_score: number | null
          tone_consistency_score: number | null
          voice_trait_scores: Json
        }
        Insert: {
          analyzed_at?: string | null
          brand_voice_alignment?: number | null
          client_id: string
          content_id?: string | null
          created_at?: string
          id?: string
          overall_voice_score?: number | null
          tone_consistency_score?: number | null
          voice_trait_scores?: Json
        }
        Update: {
          analyzed_at?: string | null
          brand_voice_alignment?: number | null
          client_id?: string
          content_id?: string | null
          created_at?: string
          id?: string
          overall_voice_score?: number | null
          tone_consistency_score?: number | null
          voice_trait_scores?: Json
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_brand_consistency_score: {
        Args: { p_client_id: string; p_start_date: string; p_end_date: string }
        Returns: number
      }
      get_user_social_accounts: {
        Args: Record<PropertyKey, never>
        Returns: {
          account_id: string
          platform: Database["public"]["Enums"]["social_platform"]
          platform_account_id: string
          account_name: string
          account_username: string
          account_avatar_url: string
          connection_status: Database["public"]["Enums"]["connection_status"]
          health_status: Database["public"]["Enums"]["health_status"]
          last_health_check: string
          health_issues: Json
          client_name: string
          client_id: string
          created_at: string
        }[]
      }
    }
    Enums: {
      approval_status: "pending" | "approved" | "rejected" | "needs_revision"
      brand_asset_type:
        | "logo"
        | "graphic"
        | "template"
        | "document"
        | "image"
        | "video"
        | "other"
      connection_status:
        | "connected"
        | "disconnected"
        | "needs_reauth"
        | "error"
        | "pending"
      content_pillar_type:
        | "educational"
        | "promotional"
        | "behind_scenes"
        | "user_generated"
        | "industry_news"
        | "company_culture"
        | "product_showcase"
        | "testimonials"
        | "other"
      content_type:
        | "social_post"
        | "campaign"
        | "asset"
        | "story"
        | "reel"
        | "video"
        | "image"
      health_status: "healthy" | "warning" | "critical" | "unknown"
      priority_level: "low" | "medium" | "high" | "urgent"
      social_platform:
        | "instagram_business"
        | "facebook_pages"
        | "tiktok_business"
        | "youtube"
        | "linkedin_company"
        | "twitter"
        | "threads"
        | "snapchat_business"
      voice_trait:
        | "formal_casual"
        | "serious_playful"
        | "authoritative_friendly"
        | "professional_conversational"
        | "corporate_personal"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      approval_status: ["pending", "approved", "rejected", "needs_revision"],
      brand_asset_type: [
        "logo",
        "graphic",
        "template",
        "document",
        "image",
        "video",
        "other",
      ],
      connection_status: [
        "connected",
        "disconnected",
        "needs_reauth",
        "error",
        "pending",
      ],
      content_pillar_type: [
        "educational",
        "promotional",
        "behind_scenes",
        "user_generated",
        "industry_news",
        "company_culture",
        "product_showcase",
        "testimonials",
        "other",
      ],
      content_type: [
        "social_post",
        "campaign",
        "asset",
        "story",
        "reel",
        "video",
        "image",
      ],
      health_status: ["healthy", "warning", "critical", "unknown"],
      priority_level: ["low", "medium", "high", "urgent"],
      social_platform: [
        "instagram_business",
        "facebook_pages",
        "tiktok_business",
        "youtube",
        "linkedin_company",
        "twitter",
        "threads",
        "snapchat_business",
      ],
      voice_trait: [
        "formal_casual",
        "serious_playful",
        "authoritative_friendly",
        "professional_conversational",
        "corporate_personal",
      ],
    },
  },
} as const
