export interface Feedback {
  id?: string;
  user_id: string;
  user_name: string;
  user_avatar_url?: string;
  rating: number;
  comment?: string;
  is_public?: boolean;
  created_at?: string;
}

export interface FeedbackSubmission {
  user_id: string;
  user_name: string;
  user_avatar_url?: string;
  rating: number;
  comment?: string;
  is_public?: boolean;
}