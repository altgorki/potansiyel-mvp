export interface User {
  id: number;
  name: string;
  age: number | null;
  city: string | null;
  bio: string | null;
  avatar_key: string;
  is_candidate: number;
  created_at: string;
}

export interface UserInterest {
  user_id: number;
  area_key: string;
}

export interface QuizAnswer {
  id?: number;
  user_id: number;
  area_key: string;
  question_id: string;
  answer_type: 'multiple_choice' | 'likert' | 'open_ended';
  answer_value: string;
  score: number;
}

export interface UserScore {
  user_id: number;
  area_key: string;
  score: number;
  tier: string;
}

export interface Group {
  id: number;
  name: string;
  area_key: string;
  description: string | null;
  member_count: number;
}

export interface GroupMember {
  group_id: number;
  user_id: number;
}

export interface Message {
  id: number;
  group_id: number;
  user_id: number;
  content: string;
  created_at: string;
  user_name?: string;
  user_avatar?: string;
}

export interface Event {
  id: number;
  group_id: number;
  title: string;
  description: string | null;
  event_date: string;
  location: string | null;
}

export interface Area {
  key: string;
  name: string;
  icon: string;
  description: string;
}

export interface Question {
  id: string;
  area_key: string;
  type: 'multiple_choice' | 'likert' | 'open_ended';
  text: string;
  options?: { label: string; value: string; score: number }[];
}

export interface QuizSubmission {
  user_id: number;
  answers: {
    question_id: string;
    area_key: string;
    answer_type: string;
    answer_value: string;
  }[];
}
