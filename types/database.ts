import type {
  CriteriaStatus,
  Direction,
  FollowedTradingPlan,
  Market,
  TradeOutcome,
  TradeResult,
  TradeScreenshot,
  TradeType,
  TradingSession,
  Emotion,
  RuleReviewStatus,
  TradeStatus,
} from "@/types/trade";

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      trades: {
        Row: {
          id: string;
          user_id: string;
          trade_date: string;
          pair: string;
          market: Market;
          setup_name: string;
          direction: Direction | "long" | "short";
          status: TradeStatus;
          entry_price: number | null;
          stop_price: number | null;
          target_price: number | null;
          exit_price: number | null;
          volume: number | null;
          commission: number | null;
          swap: number | null;
          profit: number | null;
          risk_percent: number | null;
          source_platform: string | null;
          source_trade_id: string | null;
          opened_at: string | null;
          closed_at: string | null;
          emotion: Emotion | null;
          emotion_notes: string | null;
          review_comment: string | null;
          lesson_learned: string | null;
          next_trade_action: string | null;
          reviewed_at: string | null;
          review_required: boolean;
          fomo: boolean;
          cut_winner_early: boolean;
          revenge_trade: boolean;
          discipline_score: number | null;
          ai_rule_status: RuleReviewStatus;
          ai_rule_feedback: string | null;
          entry_reason: string;
          exit_reason: string;
          criteria_met: boolean;
          criteria_status: CriteriaStatus;
          outcome: TradeOutcome | null;
          trade_idea_link: string | null;
          screenshots: TradeScreenshot[];
          followed_trading_plan: FollowedTradingPlan | null;
          session: TradingSession | null;
          trade_type: TradeType | null;
          notes: string | null;
          r_value: number;
          result: TradeResult;
          legacy_result?: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          trade_date: string;
          pair: string;
          market: Market;
          setup_name: string;
          direction: Direction | "long" | "short";
          status?: TradeStatus;
          entry_price?: number | null;
          stop_price?: number | null;
          target_price?: number | null;
          exit_price?: number | null;
          opened_at?: string | null;
          closed_at?: string | null;
          volume?: number | null;
          commission?: number | null;
          swap?: number | null;
          profit?: number | null;
          risk_percent?: number | null;
          source_platform?: string | null;
          source_trade_id?: string | null;
          emotion?: Emotion | null;
          emotion_notes?: string | null;
          review_comment?: string | null;
          lesson_learned?: string | null;
          next_trade_action?: string | null;
          reviewed_at?: string | null;
          review_required?: boolean;
          fomo?: boolean;
          cut_winner_early?: boolean;
          revenge_trade?: boolean;
          discipline_score?: number | null;
          ai_rule_status?: RuleReviewStatus;
          ai_rule_feedback?: string | null;
          entry_reason: string;
          exit_reason: string;
          criteria_met?: boolean;
          criteria_status: CriteriaStatus;
          outcome?: TradeOutcome | null;
          trade_idea_link?: string | null;
          screenshots?: TradeScreenshot[];
          followed_trading_plan?: FollowedTradingPlan | null;
          session?: TradingSession | null;
          trade_type?: TradeType | null;
          notes?: string | null;
          created_at?: string;
          legacy_result?: string | null;
        };
        Update: {
          legacy_result?: string | null;
          trade_date?: string;
          pair?: string;
          market?: Market;
          setup_name?: string;
          direction?: Direction | "long" | "short";
          status?: TradeStatus;
          entry_price?: number | null;
          stop_price?: number | null;
          target_price?: number | null;
          exit_price?: number | null;
          opened_at?: string | null;
          closed_at?: string | null;
          entry_reason?: string;
          exit_reason?: string;
          criteria_met?: boolean;
          criteria_status?: CriteriaStatus;
          emotion?: Emotion | null;
          emotion_notes?: string | null;
          fomo?: boolean;
          cut_winner_early?: boolean;
          revenge_trade?: boolean;
          outcome?: TradeOutcome | null;
          trade_idea_link?: string | null;
          screenshots?: TradeScreenshot[];
          followed_trading_plan?: FollowedTradingPlan | null;
          session?: TradingSession | null;
          trade_type?: TradeType | null;
          notes?: string | null;
          risk_percent?: number | null;
          review_comment?: string | null;
          lesson_learned?: string | null;
          next_trade_action?: string | null;
          reviewed_at?: string | null;
          review_required?: boolean;
          discipline_score?: number | null;
          ai_rule_status?: RuleReviewStatus;
          ai_rule_feedback?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "trades_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      trading_rules: {
        Row: { id: string; user_id: string; title: string; rule_text: string; is_active: boolean; created_at: string; updated_at: string };
        Insert: { id?: string; user_id?: string; title: string; rule_text: string; is_active?: boolean };
        Update: { title?: string; rule_text?: string; is_active?: boolean };
        Relationships: [];
      };
      daily_reviews: {
        Row: { id: string; user_id: string; review_date: string; day_rating: number; discipline_score: number; emotion: Emotion | null; summary: string | null; lesson: string | null; created_at: string; updated_at: string };
        Insert: { id?: string; user_id?: string; review_date: string; day_rating: number; discipline_score: number; emotion?: Emotion | null; summary?: string | null; lesson?: string | null };
        Update: { review_date?: string; day_rating?: number; discipline_score?: number; emotion?: Emotion | null; summary?: string | null; lesson?: string | null };
        Relationships: [];
      };
      user_profiles: {
        Row: { id: string; full_name: string | null; timezone: string; currency: string; default_market: Market | null; default_session: TradingSession | null; default_trade_type: TradeType | null; default_risk_percent: number | null; ai_coach_enabled: boolean; created_at: string; updated_at: string };
        Insert: { id?: string; full_name?: string | null; timezone?: string; currency?: string; default_market?: Market | null; default_session?: TradingSession | null; default_trade_type?: TradeType | null; default_risk_percent?: number | null; ai_coach_enabled?: boolean };
        Update: { full_name?: string | null; timezone?: string; currency?: string; default_market?: Market | null; default_session?: TradingSession | null; default_trade_type?: TradeType | null; default_risk_percent?: number | null; ai_coach_enabled?: boolean };
        Relationships: [];
      };
      growth_plans: {
        Row: { id: string; user_id: string; title: string; account_type: "Prop firm" | "Personal account"; starting_balance: number; target_balance: number; currency: string; risk_percent: number; deadline: string | null; milestones: string; is_active: boolean; created_at: string };
        Insert: { id?: string; user_id?: string; title: string; account_type: "Prop firm" | "Personal account"; starting_balance: number; target_balance: number; currency?: string; risk_percent: number; deadline?: string | null; milestones?: string; is_active?: boolean };
        Update: { title?: string; account_type?: "Prop firm" | "Personal account"; starting_balance?: number; target_balance?: number; currency?: string; risk_percent?: number; deadline?: string | null; milestones?: string; is_active?: boolean };
        Relationships: [];
      };
      analysis_studies: {
        Row: { id: string; user_id: string; trade_id: string | null; title: string; outcome: "Exploring" | "Win" | "Loss"; status: "In progress" | "Complete"; cause: string; lesson: string; next_action: string; created_at: string; updated_at: string };
        Insert: { id?: string; user_id?: string; trade_id?: string | null; title: string; outcome?: "Exploring" | "Win" | "Loss"; status?: "In progress" | "Complete"; cause?: string; lesson?: string; next_action?: string; created_at?: string; updated_at?: string };
        Update: { trade_id?: string | null; title?: string; outcome?: "Exploring" | "Win" | "Loss"; status?: "In progress" | "Complete"; cause?: string; lesson?: string; next_action?: string; updated_at?: string };
        Relationships: [];
      };
      analysis_evidence: {
        Row: { id: string; user_id: string; study_id: string; kind: "Note" | "Link" | "Screenshot"; body: string; storage_path: string | null; created_at: string };
        Insert: { id?: string; user_id?: string; study_id: string; kind: "Note" | "Link" | "Screenshot"; body?: string; storage_path?: string | null; created_at?: string };
        Update: { body?: string; storage_path?: string | null };
        Relationships: [];
      };
      analysis_matches: {
        Row: { id: string; user_id: string; study_id: string; trade_id: string; rationale: string; review_status: "Suggested" | "Confirmed" | "Dismissed"; created_at: string };
        Insert: { id?: string; user_id?: string; study_id: string; trade_id: string; rationale?: string; review_status?: "Suggested" | "Confirmed" | "Dismissed" };
        Update: { rationale?: string; review_status?: "Suggested" | "Confirmed" | "Dismissed" };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
