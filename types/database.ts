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
          direction: Direction;
          entry_price: number;
          stop_price: number;
          target_price: number | null;
          exit_price: number;
          volume: number | null;
          commission: number | null;
          swap: number | null;
          profit: number | null;
          source_platform: string | null;
          source_trade_id: string | null;
          opened_at: string | null;
          closed_at: string | null;
          emotion: Emotion | null;
          emotion_notes: string | null;
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
          outcome: TradeOutcome;
          trade_idea_link: string | null;
          screenshots: TradeScreenshot[];
          followed_trading_plan: FollowedTradingPlan;
          session: TradingSession | null;
          trade_type: TradeType | null;
          notes: string | null;
          r_value: number;
          result: TradeResult;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          trade_date: string;
          pair: string;
          market: Market;
          setup_name: string;
          direction: Direction;
          entry_price: number;
          stop_price: number;
          target_price?: number | null;
          exit_price: number;
          volume?: number | null;
          commission?: number | null;
          swap?: number | null;
          profit?: number | null;
          source_platform?: string | null;
          source_trade_id?: string | null;
          opened_at?: string | null;
          closed_at?: string | null;
          emotion?: Emotion | null;
          emotion_notes?: string | null;
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
          outcome: TradeOutcome;
          trade_idea_link?: string | null;
          screenshots?: TradeScreenshot[];
          followed_trading_plan: FollowedTradingPlan;
          session?: TradingSession | null;
          trade_type?: TradeType | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          trade_date?: string;
          pair?: string;
          market?: Market;
          setup_name?: string;
          direction?: Direction;
          entry_reason?: string;
          exit_reason?: string;
          criteria_met?: boolean;
          criteria_status?: CriteriaStatus;
          outcome?: TradeOutcome;
          trade_idea_link?: string | null;
          screenshots?: TradeScreenshot[];
          followed_trading_plan?: FollowedTradingPlan;
          session?: TradingSession | null;
          trade_type?: TradeType | null;
          notes?: string | null;
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
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
