
export interface NewsStory {
  id: number;
  title: string;
  slug: string;
  summary: string;
  published_date: string;
  updated_at: string;
  editorial_updated_at: string;
  clearance_mark: string;
  collection_headline?: string;
  collection_summary_html?: string;
  in_trending_collection: boolean;
  lead_image?: {
    url: string;
    filename: string;
  };
  lead_item?: {
    id: number;
    media_button: {
      first_time: boolean;
      already_downloaded_by_relative: boolean;
      action: string;
    };
    resource_type: string;
    type: string;
  };
  place_id?: string;
  regions?: string[];
  video_providing_partner?: boolean;
}

export interface AIOverview {
  summary: string;
  keyPoints: string[];
  relatedTopics: string[];
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface AIConversation {
  id: string;
  messages: AIMessage[];
}
