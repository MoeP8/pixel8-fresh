export type BrandAssetType = 
  | 'logo'
  | 'graphic'
  | 'template'
  | 'document'
  | 'image'
  | 'video'
  | 'other';

export type ContentPillarType = 
  | 'educational'
  | 'promotional'
  | 'behind_scenes'
  | 'user_generated'
  | 'industry_news'
  | 'company_culture'
  | 'product_showcase'
  | 'testimonials'
  | 'other';

export type VoiceTrait = 
  | 'formal_casual'
  | 'serious_playful'
  | 'authoritative_friendly'
  | 'professional_conversational'
  | 'corporate_personal';

export type ApprovalStatus = 
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'needs_revision';

export interface BrandGuideline {
  id: string;
  client_id: string;
  title: string;
  description?: string;
  file_url?: string;
  file_name?: string;
  file_size?: number;
  file_type?: string;
  version_number: number;
  is_active: boolean;
  created_by?: string;
  approved_at?: string;
  approved_by?: string;
  created_at: string;
  updated_at: string;
}

export interface BrandAsset {
  id: string;
  client_id: string;
  name: string;
  description?: string;
  asset_type: BrandAssetType;
  file_url: string;
  file_name: string;
  file_size?: number;
  file_type?: string;
  thumbnail_url?: string;
  usage_notes?: string;
  tags: string[];
  is_primary: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface BrandColor {
  id: string;
  client_id: string;
  name: string;
  hex_code: string;
  rgb_values?: any;
  cmyk_values?: any;
  usage_notes?: string;
  is_primary: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface BrandTypography {
  id: string;
  client_id: string;
  name: string;
  font_family: string;
  font_weight?: string;
  font_size_px?: number;
  line_height?: number;
  letter_spacing?: number;
  usage_context?: string;
  web_font_url?: string;
  fallback_fonts: string[];
  usage_notes?: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface BrandVoiceProfile {
  id: string;
  client_id: string;
  trait_type: VoiceTrait;
  trait_value: number; // 1-5 scale
  description?: string;
  examples?: any;
  created_at: string;
  updated_at: string;
}

export interface ContentPillar {
  id: string;
  client_id: string;
  name: string;
  pillar_type: ContentPillarType;
  description?: string;
  percentage_target?: number;
  example_topics: string[];
  messaging_framework?: any;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface HashtagStrategy {
  id: string;
  client_id: string;
  platform: 'instagram_business' | 'facebook_pages' | 'tiktok_business' | 'youtube' | 'linkedin_company' | 'twitter' | 'threads' | 'snapchat_business';
  strategy_name: string;
  hashtags: string[];
  max_hashtags: number;
  usage_notes?: string;
  performance_notes?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ComplianceNote {
  id: string;
  client_id: string;
  industry: string;
  regulation_type?: string;
  compliance_rules: string;
  prohibited_terms: string[];
  required_disclaimers: string[];
  approval_requirements?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BrandAssetRequest {
  id: string;
  client_id: string;
  requested_by?: string;
  asset_type: BrandAssetType;
  asset_name: string;
  description?: string;
  priority: string;
  deadline?: string;
  status: ApprovalStatus;
  notes?: string;
  fulfilled_asset_id?: string;
  created_at: string;
  updated_at: string;
}