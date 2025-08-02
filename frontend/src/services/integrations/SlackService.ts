import { errorHandlingService, ErrorCategory, ErrorSeverity } from '../ErrorHandlingService';

export interface SlackChannel {
  id: string;
  name: string;
  is_channel: boolean;
  is_group: boolean;
  is_im: boolean;
  is_private: boolean;
  is_archived: boolean;
  is_general: boolean;
  is_shared: boolean;
  is_org_shared: boolean;
  num_members?: number;
  topic?: {
    value: string;
    creator: string;
    last_set: number;
  };
  purpose?: {
    value: string;
    creator: string;
    last_set: number;
  };
}

export interface SlackUser {
  id: string;
  name: string;
  real_name: string;
  display_name: string;
  email?: string;
  image_24?: string;
  image_32?: string;
  image_48?: string;
  image_72?: string;
  image_192?: string;
  is_admin: boolean;
  is_owner: boolean;
  is_bot: boolean;
  deleted: boolean;
  status?: {
    text: string;
    emoji: string;
  };
}

export interface SlackMessage {
  type: string;
  user: string;
  text: string;
  ts: string;
  channel: string;
  thread_ts?: string;
  reply_count?: number;
  replies?: Array<{
    user: string;
    ts: string;
  }>;
  reactions?: Array<{
    name: string;
    count: number;
    users: string[];
  }>;
}

export interface SlackNotificationPayload {
  channel: string;
  text?: string;
  blocks?: any[];
  attachments?: any[];
  thread_ts?: string;
  reply_broadcast?: boolean;
  unfurl_links?: boolean;
  unfurl_media?: boolean;
}

export interface SlackApprovalRequest {
  title: string;
  content: string;
  platforms: string[];
  scheduled_at?: string;
  requester: string;
  channel: string;
}

class SlackService {
  private static instance: SlackService;
  private readonly baseUrl = 'https://slack.com/api';
  private readonly accessToken: string;
  private readonly webhookUrl: string;

  constructor() {
    // Use environment variables for Slack tokens
    this.accessToken = import.meta.env.VITE_SLACK_BOT_TOKEN || '';
    this.webhookUrl = import.meta.env.VITE_SLACK_WEBHOOK_URL || '';
    
    if (!this.accessToken || !this.webhookUrl) {
      console.warn('Slack tokens not found. Please set VITE_SLACK_BOT_TOKEN and VITE_SLACK_WEBHOOK_URL');
    }
  }

  static getInstance(): SlackService {
    if (!SlackService.instance) {
      SlackService.instance = new SlackService();
    }
    return SlackService.instance;
  }

  private async makeRequest<T>(endpoint: string, data?: any, method: string = 'POST'): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method,
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: data ? JSON.stringify(data) : undefined,
      });

      if (!response.ok) {
        throw new Error(`Slack API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      if (!result.ok) {
        throw new Error(`Slack API error: ${result.error || 'Unknown error'}`);
      }

      return result;
    } catch (error) {
      await errorHandlingService.handleError(
        error instanceof Error ? error : new Error('Unknown Slack API error'),
        ErrorCategory.EXTERNAL_API,
        ErrorSeverity.MEDIUM,
        { endpoint, service: 'slack' }
      );
      throw error;
    }
  }

  private async makeWebhookRequest(payload: any): Promise<boolean> {
    try {
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to send Slack webhook:', error);
      return false;
    }
  }

  /**
   * Send a notification via webhook (simpler, no auth needed)
   */
  async sendNotification(text: string, blocks?: any[]): Promise<boolean> {
    try {
      return await this.makeWebhookRequest({
        text,
        blocks: blocks || []
      });
    } catch (error) {
      console.error('Failed to send Slack notification:', error);
      return false;
    }
  }

  /**
   * Send a rich notification with blocks
   */
  async sendRichNotification(payload: SlackNotificationPayload): Promise<boolean> {
    try {
      if (this.webhookUrl) {
        // Use webhook for simple notifications
        return await this.makeWebhookRequest(payload);
      } else {
        // Use bot token for more advanced features
        await this.makeRequest('/chat.postMessage', payload);
        return true;
      }
    } catch (error) {
      console.error('Failed to send rich Slack notification:', error);
      return false;
    }
  }

  /**
   * Get list of channels
   */
  async getChannels(): Promise<SlackChannel[]> {
    try {
      const response = await this.makeRequest<{ channels: SlackChannel[] }>('/conversations.list', {
        types: 'public_channel,private_channel',
        exclude_archived: true,
      });

      return response.channels || [];
    } catch (error) {
      console.error('Failed to get Slack channels:', error);
      return [];
    }
  }

  /**
   * Get list of users
   */
  async getUsers(): Promise<SlackUser[]> {
    try {
      const response = await this.makeRequest<{ members: SlackUser[] }>('/users.list');
      
      return (response.members || []).filter(user => !user.deleted && !user.is_bot);
    } catch (error) {
      console.error('Failed to get Slack users:', error);
      return [];
    }
  }

  /**
   * Get channel history
   */
  async getChannelHistory(channelId: string, limit: number = 100): Promise<SlackMessage[]> {
    try {
      const response = await this.makeRequest<{ messages: SlackMessage[] }>('/conversations.history', {
        channel: channelId,
        limit
      });

      return response.messages || [];
    } catch (error) {
      console.error('Failed to get Slack channel history:', error);
      return [];
    }
  }

  /**
   * Get team activity (recent messages across channels)
   */
  async getTeamActivity(limit: number = 50): Promise<{ channel: string; messages: SlackMessage[] }[]> {
    try {
      const channels = await this.getChannels();
      const activity: { channel: string; messages: SlackMessage[] }[] = [];

      // Get recent messages from each channel
      for (const channel of channels.slice(0, 10)) { // Limit to avoid rate limits
        const messages = await this.getChannelHistory(channel.id, Math.ceil(limit / channels.length));
        if (messages.length > 0) {
          activity.push({
            channel: channel.name,
            messages: messages.slice(0, 5) // Top 5 per channel
          });
        }
      }

      return activity;
    } catch (error) {
      console.error('Failed to get Slack team activity:', error);
      return [];
    }
  }

  /**
   * Create an approval request
   */
  async createApprovalRequest(request: SlackApprovalRequest): Promise<boolean> {
    try {
      const blocks = [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: `📋 Content Approval Request: ${request.title}`,
            emoji: true
          }
        },
        {
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: `*Requester:* ${request.requester}`
            },
            {
              type: "mrkdwn",
              text: `*Platforms:* ${request.platforms.join(', ')}`
            }
          ]
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*Content:*\n${request.content}`
          }
        }
      ];

      if (request.scheduled_at) {
        blocks.push({
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*Scheduled for:* ${new Date(request.scheduled_at).toLocaleString()}`
          }
        });
      }

      blocks.push({
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "✅ Approve",
              emoji: true
            },
            style: "primary",
            value: "approve",
            action_id: "approve_content"
          },
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "❌ Reject",
              emoji: true
            },
            style: "danger",
            value: "reject",
            action_id: "reject_content"
          },
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "💬 Comment",
              emoji: true
            },
            value: "comment",
            action_id: "comment_content"
          }
        ]
      });

      return await this.sendRichNotification({
        channel: request.channel,
        text: `Content approval request: ${request.title}`,
        blocks
      });
    } catch (error) {
      console.error('Failed to create Slack approval request:', error);
      return false;
    }
  }

  /**
   * Send publishing success notification
   */
  async sendPublishingSuccess(title: string, platforms: string[], engagement?: { views?: number; likes?: number; comments?: number }): Promise<boolean> {
    try {
      const blocks = [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: "🎉 Content Published Successfully!",
            emoji: true
          }
        },
        {
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: `*Title:* ${title}`
            },
            {
              type: "mrkdwn",
              text: `*Platforms:* ${platforms.join(', ')}`
            }
          ]
        }
      ];

      if (engagement) {
        blocks.push({
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*Early Engagement:*\n👀 ${engagement.views || 0} views\n❤️ ${engagement.likes || 0} likes\n💬 ${engagement.comments || 0} comments`
          }
        });
      }

      blocks.push({
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `Published at ${new Date().toLocaleString()}`
          }
        ]
      });

      return await this.sendRichNotification({
        channel: '#general', // or get from config
        text: `Content published: ${title}`,
        blocks
      });
    } catch (error) {
      console.error('Failed to send publishing success notification:', error);
      return false;
    }
  }

  /**
   * Send publishing failure notification
   */
  async sendPublishingFailure(title: string, platforms: string[], error: string): Promise<boolean> {
    try {
      const blocks = [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: "❌ Publishing Failed",
            emoji: true
          }
        },
        {
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: `*Title:* ${title}`
            },
            {
              type: "mrkdwn",
              text: `*Platforms:* ${platforms.join(', ')}`
            }
          ]
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*Error:* ${error}`
          }
        },
        {
          type: "actions",
          elements: [
            {
              type: "button",
              text: {
                type: "plain_text",
                text: "🔄 Retry",
                emoji: true
              },
              style: "primary",
              value: "retry",
              action_id: "retry_publishing"
            },
            {
              type: "button",
              text: {
                type: "plain_text",
                text: "📝 View Details",
                emoji: true
              },
              value: "details",
              action_id: "view_error_details"
            }
          ]
        }
      ];

      return await this.sendRichNotification({
        channel: '#general', // or get from config
        text: `Publishing failed: ${title}`,
        blocks
      });
    } catch (error) {
      console.error('Failed to send publishing failure notification:', error);
      return false;
    }
  }

  /**
   * Send daily summary
   */
  async sendDailySummary(stats: {
    postsPublished: number;
    totalReach: number;
    totalEngagement: number;
    topPerformingPost?: string;
    scheduledForTomorrow: number;
  }): Promise<boolean> {
    try {
      const blocks = [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: "📊 Daily Social Media Summary",
            emoji: true
          }
        },
        {
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: `*Posts Published:* ${stats.postsPublished}`
            },
            {
              type: "mrkdwn",
              text: `*Total Reach:* ${stats.totalReach.toLocaleString()}`
            },
            {
              type: "mrkdwn",
              text: `*Total Engagement:* ${stats.totalEngagement}`
            },
            {
              type: "mrkdwn",
              text: `*Scheduled Tomorrow:* ${stats.scheduledForTomorrow}`
            }
          ]
        }
      ];

      if (stats.topPerformingPost) {
        blocks.push({
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*🏆 Top Performing:* ${stats.topPerformingPost}`
          }
        });
      }

      blocks.push({
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `Report generated at ${new Date().toLocaleString()}`
          }
        ]
      });

      return await this.sendRichNotification({
        channel: '#general', // or get from config
        text: 'Daily social media summary',
        blocks
      });
    } catch (error) {
      console.error('Failed to send daily summary:', error);
      return false;
    }
  }

  /**
   * Test connection to Slack
   */
  async testConnection(): Promise<boolean> {
    try {
      if (this.webhookUrl) {
        // Test webhook
        return await this.makeWebhookRequest({
          text: 'Pixel8 Social Hub connection test ✅'
        });
      } else {
        // Test bot token
        await this.makeRequest('/auth.test');
        return true;
      }
    } catch (error) {
      console.error('Slack connection test failed:', error);
      return false;
    }
  }

  /**
   * Get workspace info
   */
  async getWorkspaceInfo(): Promise<{ team: string; url: string } | null> {
    try {
      const response = await this.makeRequest<{ team: { name: string; url: string } }>('/team.info');
      return {
        team: response.team.name,
        url: response.team.url
      };
    } catch (error) {
      console.error('Failed to get Slack workspace info:', error);
      return null;
    }
  }
}

export const slackService = SlackService.getInstance();