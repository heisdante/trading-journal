import type {
  CriteriaStatus,
  Direction,
  FollowedTradingPlan,
  TradeOutcome,
  TradeResult,
  TradeScreenshot,
  TradeType,
  TradingSession,
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
          setup_name: string;
          direction: Direction;
          entry_price: number;
          stop_price: number;
          target_price: number | null;
          exit_price: number;
          criteria_met: boolean;
          criteria_status: CriteriaStatus;
          outcome: TradeOutcome;
          trade_idea_link: string | null;
          screenshots: TradeScreenshot[];
          followed_trading_plan: FollowedTradingPlan;
          session: TradingSession;
          trade_type: TradeType;
          notes: string | null;
          result: TradeResult;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          trade_date: string;
          pair: string;
          setup_name: string;
          direction: Direction;
          entry_price: number;
          stop_price: number;
          target_price?: number | null;
          exit_price: number;
          criteria_met?: boolean;
          criteria_status: CriteriaStatus;
          outcome: TradeOutcome;
          trade_idea_link?: string | null;
          screenshots?: TradeScreenshot[];
          followed_trading_plan: FollowedTradingPlan;
          session: TradingSession;
          trade_type: TradeType;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          trade_date?: string;
          pair?: string;
          setup_name?: string;
          direction?: Direction;
          entry_price?: number;
          stop_price?: number;
          target_price?: number | null;
          exit_price?: number;
          criteria_met?: boolean;
          criteria_status?: CriteriaStatus;
          outcome?: TradeOutcome;
          trade_idea_link?: string | null;
          screenshots?: TradeScreenshot[];
          followed_trading_plan?: FollowedTradingPlan;
          session?: TradingSession;
          trade_type?: TradeType;
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
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
