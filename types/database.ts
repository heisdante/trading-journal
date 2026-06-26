import type { Direction, TradeResult } from "@/types/trade";

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      trades: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          setup_name: string;
          direction: Direction;
          entry_price: number;
          stop_price: number;
          target_price: number | null;
          exit_price: number;
          criteria_met: boolean;
          notes: string | null;
          r_value: number;
          result: TradeResult;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          date: string;
          setup_name: string;
          direction: Direction;
          entry_price: number;
          stop_price: number;
          target_price?: number | null;
          exit_price: number;
          criteria_met?: boolean;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          date?: string;
          setup_name?: string;
          direction?: Direction;
          entry_price?: number;
          stop_price?: number;
          target_price?: number | null;
          exit_price?: number;
          criteria_met?: boolean;
          notes?: string | null;
          updated_at?: string;
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
