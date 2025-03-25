export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ai_messages: {
        Row: {
          content: string
          context: Json | null
          created_at: string | null
          id: string
          model: string
          role: string
          user_id: string | null
        }
        Insert: {
          content: string
          context?: Json | null
          created_at?: string | null
          id?: string
          model: string
          role: string
          user_id?: string | null
        }
        Update: {
          content?: string
          context?: Json | null
          created_at?: string | null
          id?: string
          model?: string
          role?: string
          user_id?: string | null
        }
        Relationships: []
      }
      analytics_aggregates: {
        Row: {
          company_id: string | null
          created_at: string | null
          end_date: string
          id: string
          metadata: Json | null
          metric_name: string
          period: string | null
          start_date: string
          value: number
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          end_date: string
          id?: string
          metadata?: Json | null
          metric_name: string
          period?: string | null
          start_date: string
          value: number
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          end_date?: string
          id?: string
          metadata?: Json | null
          metric_name?: string
          period?: string | null
          start_date?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "analytics_aggregates_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics_metrics: {
        Row: {
          company_id: string | null
          dimension: string | null
          dimension_value: string | null
          id: string
          metric_name: string
          metric_value: number
          timestamp: string | null
        }
        Insert: {
          company_id?: string | null
          dimension?: string | null
          dimension_value?: string | null
          id?: string
          metric_name: string
          metric_value: number
          timestamp?: string | null
        }
        Update: {
          company_id?: string | null
          dimension?: string | null
          dimension_value?: string | null
          id?: string
          metric_name?: string
          metric_value?: number
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_metrics_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      api_configurations: {
        Row: {
          company_id: string | null
          created_at: string | null
          created_by: string | null
          credentials: Json
          id: string
          is_active: boolean | null
          provider: string
          quota_limit: number | null
          quota_reset_at: string | null
          quota_used: number | null
          settings: Json | null
          updated_at: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          created_by?: string | null
          credentials: Json
          id?: string
          is_active?: boolean | null
          provider: string
          quota_limit?: number | null
          quota_reset_at?: string | null
          quota_used?: number | null
          settings?: Json | null
          updated_at?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          created_by?: string | null
          credentials?: Json
          id?: string
          is_active?: boolean | null
          provider?: string
          quota_limit?: number | null
          quota_reset_at?: string | null
          quota_used?: number | null
          settings?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "api_configurations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "api_configurations_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "technician_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "api_configurations_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
        ]
      }
      api_integrations: {
        Row: {
          category: string
          company_id: string | null
          config: Json | null
          created_at: string | null
          created_by: string | null
          credentials: Json | null
          description: string | null
          id: string
          is_public: boolean | null
          last_sync: string | null
          name: string
          provider: string
          status: string
          updated_at: string | null
          webhook_url: string | null
        }
        Insert: {
          category: string
          company_id?: string | null
          config?: Json | null
          created_at?: string | null
          created_by?: string | null
          credentials?: Json | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          last_sync?: string | null
          name: string
          provider: string
          status?: string
          updated_at?: string | null
          webhook_url?: string | null
        }
        Update: {
          category?: string
          company_id?: string | null
          config?: Json | null
          created_at?: string | null
          created_by?: string | null
          credentials?: Json | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          last_sync?: string | null
          name?: string
          provider?: string
          status?: string
          updated_at?: string | null
          webhook_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "api_integrations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      api_key_logs: {
        Row: {
          api_key_id: string | null
          created_at: string | null
          endpoint: string
          id: string
          ip_address: string | null
          method: string
          status_code: number
          user_agent: string | null
        }
        Insert: {
          api_key_id?: string | null
          created_at?: string | null
          endpoint: string
          id?: string
          ip_address?: string | null
          method: string
          status_code: number
          user_agent?: string | null
        }
        Update: {
          api_key_id?: string | null
          created_at?: string | null
          endpoint?: string
          id?: string
          ip_address?: string | null
          method?: string
          status_code?: number
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "api_key_logs_api_key_id_fkey"
            columns: ["api_key_id"]
            isOneToOne: false
            referencedRelation: "api_keys"
            referencedColumns: ["id"]
          },
        ]
      }
      api_keys: {
        Row: {
          company_id: string | null
          created_at: string | null
          created_by: string | null
          expires_at: string | null
          id: string
          key_hash: string
          last_used_at: string | null
          name: string
          revoked_at: string | null
          revoked_by: string | null
          scopes: string[] | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          created_by?: string | null
          expires_at?: string | null
          id?: string
          key_hash: string
          last_used_at?: string | null
          name: string
          revoked_at?: string | null
          revoked_by?: string | null
          scopes?: string[] | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          created_by?: string | null
          expires_at?: string | null
          id?: string
          key_hash?: string
          last_used_at?: string | null
          name?: string
          revoked_at?: string | null
          revoked_by?: string | null
          scopes?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "api_keys_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      api_usage_logs: {
        Row: {
          company_id: string | null
          cost: number | null
          created_at: string | null
          endpoint: string
          error_message: string | null
          id: string
          metadata: Json | null
          provider: string
          response_time: unknown | null
          status_code: number | null
        }
        Insert: {
          company_id?: string | null
          cost?: number | null
          created_at?: string | null
          endpoint: string
          error_message?: string | null
          id?: string
          metadata?: Json | null
          provider: string
          response_time?: unknown | null
          status_code?: number | null
        }
        Update: {
          company_id?: string | null
          cost?: number | null
          created_at?: string | null
          endpoint?: string
          error_message?: string | null
          id?: string
          metadata?: Json | null
          provider?: string
          response_time?: unknown | null
          status_code?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "api_usage_logs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      appliance_types: {
        Row: {
          company_id: string | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appliance_types_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      community_post_comments: {
        Row: {
          author_id: string | null
          content: string
          created_at: string | null
          id: string
          is_answer: boolean | null
          post_id: string | null
          updated_at: string | null
          upvotes: number | null
        }
        Insert: {
          author_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          is_answer?: boolean | null
          post_id?: string | null
          updated_at?: string | null
          upvotes?: number | null
        }
        Update: {
          author_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          is_answer?: boolean | null
          post_id?: string | null
          updated_at?: string | null
          upvotes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "community_post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_posts: {
        Row: {
          author_id: string | null
          content: string
          created_at: string | null
          id: string
          is_fulfilled: boolean | null
          is_solved: boolean | null
          knowledge_base_article_id: string | null
          tags: string[] | null
          title: string
          type: string
          updated_at: string | null
          upvotes: number | null
          views: number | null
        }
        Insert: {
          author_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          is_fulfilled?: boolean | null
          is_solved?: boolean | null
          knowledge_base_article_id?: string | null
          tags?: string[] | null
          title: string
          type: string
          updated_at?: string | null
          upvotes?: number | null
          views?: number | null
        }
        Update: {
          author_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          is_fulfilled?: boolean | null
          is_solved?: boolean | null
          knowledge_base_article_id?: string | null
          tags?: string[] | null
          title?: string
          type?: string
          updated_at?: string | null
          upvotes?: number | null
          views?: number | null
        }
        Relationships: []
      }
      companies: {
        Row: {
          created_at: string | null
          id: string
          name: string
          subscription_tier: string
          trial_end_date: string | null
          trial_period: number | null
          trial_status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          subscription_tier?: string
          trial_end_date?: string | null
          trial_period?: number | null
          trial_status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          subscription_tier?: string
          trial_end_date?: string | null
          trial_period?: number | null
          trial_status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      company_settings: {
        Row: {
          branding: Json | null
          company_id: string | null
          created_at: string | null
          holidays: Json | null
          id: string
          service_area: Json | null
          updated_at: string | null
          working_hours: Json | null
        }
        Insert: {
          branding?: Json | null
          company_id?: string | null
          created_at?: string | null
          holidays?: Json | null
          id?: string
          service_area?: Json | null
          updated_at?: string | null
          working_hours?: Json | null
        }
        Update: {
          branding?: Json | null
          company_id?: string | null
          created_at?: string | null
          holidays?: Json | null
          id?: string
          service_area?: Json | null
          updated_at?: string | null
          working_hours?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "company_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_appliances: {
        Row: {
          brand: string | null
          created_at: string | null
          customer_id: string | null
          id: string
          location: string | null
          maintenance_schedule: Json | null
          model: string | null
          notes: string | null
          purchase_date: string | null
          serial_number: string | null
          service_history: Json | null
          type: string
          updated_at: string | null
          warranty_expiry: string | null
        }
        Insert: {
          brand?: string | null
          created_at?: string | null
          customer_id?: string | null
          id?: string
          location?: string | null
          maintenance_schedule?: Json | null
          model?: string | null
          notes?: string | null
          purchase_date?: string | null
          serial_number?: string | null
          service_history?: Json | null
          type: string
          updated_at?: string | null
          warranty_expiry?: string | null
        }
        Update: {
          brand?: string | null
          created_at?: string | null
          customer_id?: string | null
          id?: string
          location?: string | null
          maintenance_schedule?: Json | null
          model?: string | null
          notes?: string | null
          purchase_date?: string | null
          serial_number?: string | null
          service_history?: Json | null
          type?: string
          updated_at?: string | null
          warranty_expiry?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_appliances_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_contacts: {
        Row: {
          created_at: string | null
          customer_id: string | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          notes: string | null
          phone: string | null
          role: string | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          customer_id?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          notes?: string | null
          phone?: string | null
          role?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          notes?: string | null
          phone?: string | null
          role?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_contacts_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_documents: {
        Row: {
          created_at: string | null
          customer_id: string | null
          description: string | null
          file_url: string | null
          id: string
          metadata: Json | null
          title: string
          type: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          customer_id?: string | null
          description?: string | null
          file_url?: string | null
          id?: string
          metadata?: Json | null
          title: string
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string | null
          description?: string | null
          file_url?: string | null
          id?: string
          metadata?: Json | null
          title?: string
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_documents_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_interactions: {
        Row: {
          created_at: string | null
          customer_id: string | null
          description: string | null
          follow_up_date: string | null
          follow_up_required: boolean | null
          id: string
          outcome: string | null
          subject: string | null
          technician_id: string | null
          type: string | null
        }
        Insert: {
          created_at?: string | null
          customer_id?: string | null
          description?: string | null
          follow_up_date?: string | null
          follow_up_required?: boolean | null
          id?: string
          outcome?: string | null
          subject?: string | null
          technician_id?: string | null
          type?: string | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string | null
          description?: string | null
          follow_up_date?: string | null
          follow_up_required?: boolean | null
          id?: string
          outcome?: string | null
          subject?: string | null
          technician_id?: string | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_interactions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_interactions_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technician_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_interactions_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_preferences: {
        Row: {
          communication_preferences: Json | null
          created_at: string | null
          customer_id: string | null
          id: string
          maintenance_reminders: boolean | null
          preferred_schedule: Json | null
          preferred_technicians: string[] | null
          service_reminders: boolean | null
          updated_at: string | null
        }
        Insert: {
          communication_preferences?: Json | null
          created_at?: string | null
          customer_id?: string | null
          id?: string
          maintenance_reminders?: boolean | null
          preferred_schedule?: Json | null
          preferred_technicians?: string[] | null
          service_reminders?: boolean | null
          updated_at?: string | null
        }
        Update: {
          communication_preferences?: Json | null
          created_at?: string | null
          customer_id?: string | null
          id?: string
          maintenance_reminders?: boolean | null
          preferred_schedule?: Json | null
          preferred_technicians?: string[] | null
          service_reminders?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_preferences_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: true
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          alternate_phone: string | null
          billing_address: Json | null
          company_id: string | null
          company_name: string | null
          created_at: string | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          notes: string | null
          payment_terms: string | null
          phone: string | null
          preferred_contact_method: string | null
          service_addresses: Json | null
          status: string | null
          tags: string[] | null
          tax_id: string | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          alternate_phone?: string | null
          billing_address?: Json | null
          company_id?: string | null
          company_name?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          notes?: string | null
          payment_terms?: string | null
          phone?: string | null
          preferred_contact_method?: string | null
          service_addresses?: Json | null
          status?: string | null
          tags?: string[] | null
          tax_id?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          alternate_phone?: string | null
          billing_address?: Json | null
          company_id?: string | null
          company_name?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          notes?: string | null
          payment_terms?: string | null
          phone?: string | null
          preferred_contact_method?: string | null
          service_addresses?: Json | null
          status?: string | null
          tags?: string[] | null
          tax_id?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      dashboard_activity: {
        Row: {
          action: string
          created_at: string | null
          dashboard_id: string | null
          details: Json | null
          id: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          dashboard_id?: string | null
          details?: Json | null
          id?: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          dashboard_id?: string | null
          details?: Json | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dashboard_activity_dashboard_id_fkey"
            columns: ["dashboard_id"]
            isOneToOne: false
            referencedRelation: "dashboards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dashboard_activity_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "technician_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dashboard_activity_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
        ]
      }
      dashboard_filters: {
        Row: {
          config: Json
          created_at: string | null
          dashboard_id: string | null
          id: string
          name: string
          position: number | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          config: Json
          created_at?: string | null
          dashboard_id?: string | null
          id?: string
          name: string
          position?: number | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          config?: Json
          created_at?: string | null
          dashboard_id?: string | null
          id?: string
          name?: string
          position?: number | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dashboard_filters_dashboard_id_fkey"
            columns: ["dashboard_id"]
            isOneToOne: false
            referencedRelation: "dashboards"
            referencedColumns: ["id"]
          },
        ]
      }
      dashboard_shares: {
        Row: {
          created_at: string | null
          created_by: string | null
          dashboard_id: string | null
          id: string
          permissions: string | null
          shared_with: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          dashboard_id?: string | null
          id?: string
          permissions?: string | null
          shared_with?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          dashboard_id?: string | null
          id?: string
          permissions?: string | null
          shared_with?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dashboard_shares_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "technician_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dashboard_shares_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dashboard_shares_dashboard_id_fkey"
            columns: ["dashboard_id"]
            isOneToOne: false
            referencedRelation: "dashboards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dashboard_shares_shared_with_fkey"
            columns: ["shared_with"]
            isOneToOne: false
            referencedRelation: "technician_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dashboard_shares_shared_with_fkey"
            columns: ["shared_with"]
            isOneToOne: false
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
        ]
      }
      dashboard_templates: {
        Row: {
          category: string | null
          company_id: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_public: boolean | null
          layout: Json
          name: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          company_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          layout: Json
          name: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          company_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          layout?: Json
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dashboard_templates_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dashboard_templates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "technician_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dashboard_templates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
        ]
      }
      dashboard_widgets: {
        Row: {
          config: Json
          created_at: string | null
          dashboard_id: string | null
          id: string
          position: Json
          refresh_interval: unknown | null
          title: string
          type: string | null
          updated_at: string | null
        }
        Insert: {
          config: Json
          created_at?: string | null
          dashboard_id?: string | null
          id?: string
          position: Json
          refresh_interval?: unknown | null
          title: string
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          config?: Json
          created_at?: string | null
          dashboard_id?: string | null
          id?: string
          position?: Json
          refresh_interval?: unknown | null
          title?: string
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dashboard_widgets_dashboard_id_fkey"
            columns: ["dashboard_id"]
            isOneToOne: false
            referencedRelation: "dashboards"
            referencedColumns: ["id"]
          },
        ]
      }
      dashboards: {
        Row: {
          company_id: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_default: boolean | null
          layout: Json | null
          name: string
          updated_at: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_default?: boolean | null
          layout?: Json | null
          name: string
          updated_at?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_default?: boolean | null
          layout?: Json | null
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dashboards_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dashboards_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "technician_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dashboards_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
        ]
      }
      diagnostic_sessions: {
        Row: {
          appliance_id: string | null
          completed_at: string | null
          created_at: string | null
          current_node_id: string | null
          diagnosis_result: string | null
          id: string
          notes: string | null
          recommended_action: string | null
          session_data: Json | null
          started_at: string | null
          status: string | null
          technician_id: string | null
          updated_at: string | null
          workflow_id: string | null
        }
        Insert: {
          appliance_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          current_node_id?: string | null
          diagnosis_result?: string | null
          id?: string
          notes?: string | null
          recommended_action?: string | null
          session_data?: Json | null
          started_at?: string | null
          status?: string | null
          technician_id?: string | null
          updated_at?: string | null
          workflow_id?: string | null
        }
        Update: {
          appliance_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          current_node_id?: string | null
          diagnosis_result?: string | null
          id?: string
          notes?: string | null
          recommended_action?: string | null
          session_data?: Json | null
          started_at?: string | null
          status?: string | null
          technician_id?: string | null
          updated_at?: string | null
          workflow_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "diagnostic_sessions_appliance_id_fkey"
            columns: ["appliance_id"]
            isOneToOne: false
            referencedRelation: "customer_appliances"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "diagnostic_sessions_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technician_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "diagnostic_sessions_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "diagnostic_sessions_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      feature_requests: {
        Row: {
          company_id: string | null
          created_at: string | null
          description: string
          id: string
          status: string | null
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          description: string
          id?: string
          status?: string | null
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          description?: string
          id?: string
          status?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feature_requests_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      feature_votes: {
        Row: {
          created_at: string | null
          feature_id: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          feature_id?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          feature_id?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feature_votes_feature_id_fkey"
            columns: ["feature_id"]
            isOneToOne: false
            referencedRelation: "feature_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_transactions: {
        Row: {
          company_id: string | null
          created_at: string | null
          id: string
          location: string | null
          notes: string | null
          part_id: string | null
          performed_by: string | null
          quantity: number
          reference_id: string | null
          reference_type: string | null
          type: string | null
          unit_cost: number | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          id?: string
          location?: string | null
          notes?: string | null
          part_id?: string | null
          performed_by?: string | null
          quantity: number
          reference_id?: string | null
          reference_type?: string | null
          type?: string | null
          unit_cost?: number | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          id?: string
          location?: string | null
          notes?: string | null
          part_id?: string | null
          performed_by?: string | null
          quantity?: number
          reference_id?: string | null
          reference_type?: string | null
          type?: string | null
          unit_cost?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_transactions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_transactions_part_id_fkey"
            columns: ["part_id"]
            isOneToOne: false
            referencedRelation: "parts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_transactions_performed_by_fkey"
            columns: ["performed_by"]
            isOneToOne: false
            referencedRelation: "technician_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_transactions_performed_by_fkey"
            columns: ["performed_by"]
            isOneToOne: false
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
        ]
      }
      kpi_definitions: {
        Row: {
          calculation_query: string
          category: string | null
          company_id: string | null
          created_at: string | null
          critical_threshold: number | null
          description: string | null
          id: string
          last_updated_at: string | null
          name: string
          target_value: number | null
          update_frequency: unknown | null
          updated_at: string | null
          warning_threshold: number | null
        }
        Insert: {
          calculation_query: string
          category?: string | null
          company_id?: string | null
          created_at?: string | null
          critical_threshold?: number | null
          description?: string | null
          id?: string
          last_updated_at?: string | null
          name: string
          target_value?: number | null
          update_frequency?: unknown | null
          updated_at?: string | null
          warning_threshold?: number | null
        }
        Update: {
          calculation_query?: string
          category?: string | null
          company_id?: string | null
          created_at?: string | null
          critical_threshold?: number | null
          description?: string | null
          id?: string
          last_updated_at?: string | null
          name?: string
          target_value?: number | null
          update_frequency?: unknown | null
          updated_at?: string | null
          warning_threshold?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "kpi_definitions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      kpi_values: {
        Row: {
          created_at: string | null
          id: string
          kpi_id: string | null
          metadata: Json | null
          period_end: string | null
          period_start: string | null
          target_met: boolean | null
          value: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          kpi_id?: string | null
          metadata?: Json | null
          period_end?: string | null
          period_start?: string | null
          target_met?: boolean | null
          value: number
        }
        Update: {
          created_at?: string | null
          id?: string
          kpi_id?: string | null
          metadata?: Json | null
          period_end?: string | null
          period_start?: string | null
          target_met?: boolean | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "kpi_values_kpi_id_fkey"
            columns: ["kpi_id"]
            isOneToOne: false
            referencedRelation: "kpi_definitions"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          id: string
          message: string
          read: boolean | null
          timestamp: string | null
          title: string
          type: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          message: string
          read?: boolean | null
          timestamp?: string | null
          title: string
          type?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          message?: string
          read?: boolean | null
          timestamp?: string | null
          title?: string
          type?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      part_categories: {
        Row: {
          company_id: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "part_categories_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      part_inventory: {
        Row: {
          company_id: string | null
          created_at: string | null
          id: string
          last_counted_at: string | null
          location: string | null
          part_id: string | null
          quantity: number
          reserved_quantity: number
          updated_at: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          id?: string
          last_counted_at?: string | null
          location?: string | null
          part_id?: string | null
          quantity?: number
          reserved_quantity?: number
          updated_at?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          id?: string
          last_counted_at?: string | null
          location?: string | null
          part_id?: string | null
          quantity?: number
          reserved_quantity?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "part_inventory_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "part_inventory_part_id_fkey"
            columns: ["part_id"]
            isOneToOne: false
            referencedRelation: "parts"
            referencedColumns: ["id"]
          },
        ]
      }
      part_supplier_prices: {
        Row: {
          created_at: string | null
          currency: string | null
          id: string
          is_current: boolean | null
          minimum_quantity: number | null
          part_id: string | null
          price: number
          supplier_id: string | null
          updated_at: string | null
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          created_at?: string | null
          currency?: string | null
          id?: string
          is_current?: boolean | null
          minimum_quantity?: number | null
          part_id?: string | null
          price: number
          supplier_id?: string | null
          updated_at?: string | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          created_at?: string | null
          currency?: string | null
          id?: string
          is_current?: boolean | null
          minimum_quantity?: number | null
          part_id?: string | null
          price?: number
          supplier_id?: string | null
          updated_at?: string | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "part_supplier_prices_part_id_fkey"
            columns: ["part_id"]
            isOneToOne: false
            referencedRelation: "parts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "part_supplier_prices_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "part_suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      part_suppliers: {
        Row: {
          address: Json | null
          company_id: string | null
          contact_name: string | null
          created_at: string | null
          email: string | null
          id: string
          lead_time: unknown | null
          minimum_order: number | null
          name: string
          notes: string | null
          payment_terms: string | null
          phone: string | null
          preferred: boolean | null
          updated_at: string | null
        }
        Insert: {
          address?: Json | null
          company_id?: string | null
          contact_name?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          lead_time?: unknown | null
          minimum_order?: number | null
          name: string
          notes?: string | null
          payment_terms?: string | null
          phone?: string | null
          preferred?: boolean | null
          updated_at?: string | null
        }
        Update: {
          address?: Json | null
          company_id?: string | null
          contact_name?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          lead_time?: unknown | null
          minimum_order?: number | null
          name?: string
          notes?: string | null
          payment_terms?: string | null
          phone?: string | null
          preferred?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "part_suppliers_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      parts: {
        Row: {
          category_id: string | null
          company_id: string | null
          created_at: string | null
          description: string | null
          dimensions: Json | null
          id: string
          is_active: boolean | null
          manufacturer: string | null
          minimum_stock: number | null
          model_compatibility: Json | null
          name: string
          notes: string | null
          reorder_point: number | null
          sku: string | null
          specifications: Json | null
          unit: string | null
          updated_at: string | null
          warranty_period: unknown | null
          weight: number | null
        }
        Insert: {
          category_id?: string | null
          company_id?: string | null
          created_at?: string | null
          description?: string | null
          dimensions?: Json | null
          id?: string
          is_active?: boolean | null
          manufacturer?: string | null
          minimum_stock?: number | null
          model_compatibility?: Json | null
          name: string
          notes?: string | null
          reorder_point?: number | null
          sku?: string | null
          specifications?: Json | null
          unit?: string | null
          updated_at?: string | null
          warranty_period?: unknown | null
          weight?: number | null
        }
        Update: {
          category_id?: string | null
          company_id?: string | null
          created_at?: string | null
          description?: string | null
          dimensions?: Json | null
          id?: string
          is_active?: boolean | null
          manufacturer?: string | null
          minimum_stock?: number | null
          model_compatibility?: Json | null
          name?: string
          notes?: string | null
          reorder_point?: number | null
          sku?: string | null
          specifications?: Json | null
          unit?: string | null
          updated_at?: string | null
          warranty_period?: unknown | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "parts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "part_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "parts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_transactions: {
        Row: {
          amount: number
          company_id: string | null
          created_at: string | null
          currency: string | null
          id: string
          metadata: Json | null
          payment_method: Json | null
          status: string | null
        }
        Insert: {
          amount: number
          company_id?: string | null
          created_at?: string | null
          currency?: string | null
          id?: string
          metadata?: Json | null
          payment_method?: Json | null
          status?: string | null
        }
        Update: {
          amount?: number
          company_id?: string | null
          created_at?: string | null
          currency?: string | null
          id?: string
          metadata?: Json | null
          payment_method?: Json | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_transactions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_order_items: {
        Row: {
          created_at: string | null
          id: string
          part_id: string | null
          purchase_order_id: string | null
          quantity: number
          received_quantity: number | null
          unit_price: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          part_id?: string | null
          purchase_order_id?: string | null
          quantity: number
          received_quantity?: number | null
          unit_price: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          part_id?: string | null
          purchase_order_id?: string | null
          quantity?: number
          received_quantity?: number | null
          unit_price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "purchase_order_items_part_id_fkey"
            columns: ["part_id"]
            isOneToOne: false
            referencedRelation: "parts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_order_items_purchase_order_id_fkey"
            columns: ["purchase_order_id"]
            isOneToOne: false
            referencedRelation: "purchase_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_orders: {
        Row: {
          approved_by: string | null
          company_id: string | null
          created_at: string | null
          created_by: string | null
          delivery_address: Json | null
          expected_delivery: string | null
          id: string
          notes: string | null
          order_date: string | null
          shipping: number | null
          status: string | null
          subtotal: number | null
          supplier_id: string | null
          tax: number | null
          total: number | null
          updated_at: string | null
        }
        Insert: {
          approved_by?: string | null
          company_id?: string | null
          created_at?: string | null
          created_by?: string | null
          delivery_address?: Json | null
          expected_delivery?: string | null
          id?: string
          notes?: string | null
          order_date?: string | null
          shipping?: number | null
          status?: string | null
          subtotal?: number | null
          supplier_id?: string | null
          tax?: number | null
          total?: number | null
          updated_at?: string | null
        }
        Update: {
          approved_by?: string | null
          company_id?: string | null
          created_at?: string | null
          created_by?: string | null
          delivery_address?: Json | null
          expected_delivery?: string | null
          id?: string
          notes?: string | null
          order_date?: string | null
          shipping?: number | null
          status?: string | null
          subtotal?: number | null
          supplier_id?: string | null
          tax?: number | null
          total?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "purchase_orders_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "technician_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_orders_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_orders_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_orders_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "technician_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_orders_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_orders_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "part_suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      repair_categories: {
        Row: {
          company_id: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "repair_categories_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      repair_history: {
        Row: {
          action: string
          details: string | null
          id: string
          repair_id: string | null
          technician_id: string | null
          timestamp: string | null
        }
        Insert: {
          action: string
          details?: string | null
          id?: string
          repair_id?: string | null
          technician_id?: string | null
          timestamp?: string | null
        }
        Update: {
          action?: string
          details?: string | null
          id?: string
          repair_id?: string | null
          technician_id?: string | null
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "repair_history_repair_id_fkey"
            columns: ["repair_id"]
            isOneToOne: false
            referencedRelation: "repairs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "repair_history_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technician_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "repair_history_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
        ]
      }
      repair_templates: {
        Row: {
          category_id: string | null
          checklist: Json | null
          company_id: string | null
          created_at: string | null
          description: string | null
          documentation: string | null
          estimated_cost: number | null
          estimated_duration: unknown | null
          id: string
          name: string
          required_parts: Json | null
          required_skills: Json | null
          updated_at: string | null
          warranty_period: unknown | null
        }
        Insert: {
          category_id?: string | null
          checklist?: Json | null
          company_id?: string | null
          created_at?: string | null
          description?: string | null
          documentation?: string | null
          estimated_cost?: number | null
          estimated_duration?: unknown | null
          id?: string
          name: string
          required_parts?: Json | null
          required_skills?: Json | null
          updated_at?: string | null
          warranty_period?: unknown | null
        }
        Update: {
          category_id?: string | null
          checklist?: Json | null
          company_id?: string | null
          created_at?: string | null
          description?: string | null
          documentation?: string | null
          estimated_cost?: number | null
          estimated_duration?: unknown | null
          id?: string
          name?: string
          required_parts?: Json | null
          required_skills?: Json | null
          updated_at?: string | null
          warranty_period?: unknown | null
        }
        Relationships: [
          {
            foreignKeyName: "repair_templates_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "repair_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "repair_templates_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      repairs: {
        Row: {
          actual_cost: number | null
          actual_duration: unknown | null
          checklist_completed: Json | null
          company_id: string | null
          completed_at: string | null
          created_at: string | null
          customer_id: string | null
          diagnosis: string | null
          documents: Json | null
          estimated_cost: number | null
          estimated_duration: unknown | null
          id: string
          metadata: Json | null
          notes: string | null
          parts_used: Json | null
          photos: Json | null
          priority: string | null
          scheduled_at: string | null
          solution: string | null
          started_at: string | null
          status: string | null
          technician_id: string | null
          template_id: string | null
          updated_at: string | null
          warranty_expires_at: string | null
        }
        Insert: {
          actual_cost?: number | null
          actual_duration?: unknown | null
          checklist_completed?: Json | null
          company_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          customer_id?: string | null
          diagnosis?: string | null
          documents?: Json | null
          estimated_cost?: number | null
          estimated_duration?: unknown | null
          id?: string
          metadata?: Json | null
          notes?: string | null
          parts_used?: Json | null
          photos?: Json | null
          priority?: string | null
          scheduled_at?: string | null
          solution?: string | null
          started_at?: string | null
          status?: string | null
          technician_id?: string | null
          template_id?: string | null
          updated_at?: string | null
          warranty_expires_at?: string | null
        }
        Update: {
          actual_cost?: number | null
          actual_duration?: unknown | null
          checklist_completed?: Json | null
          company_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          customer_id?: string | null
          diagnosis?: string | null
          documents?: Json | null
          estimated_cost?: number | null
          estimated_duration?: unknown | null
          id?: string
          metadata?: Json | null
          notes?: string | null
          parts_used?: Json | null
          photos?: Json | null
          priority?: string | null
          scheduled_at?: string | null
          solution?: string | null
          started_at?: string | null
          status?: string | null
          technician_id?: string | null
          template_id?: string | null
          updated_at?: string | null
          warranty_expires_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "repairs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "repairs_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "repairs_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technician_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "repairs_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "repairs_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "repair_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      report_definitions: {
        Row: {
          company_id: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          last_run_at: string | null
          name: string
          parameters: Json | null
          query: string
          schedule: Json | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          last_run_at?: string | null
          name: string
          parameters?: Json | null
          query: string
          schedule?: Json | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          last_run_at?: string | null
          name?: string
          parameters?: Json | null
          query?: string
          schedule?: Json | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "report_definitions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_definitions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "technician_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_definitions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
        ]
      }
      report_executions: {
        Row: {
          created_at: string | null
          error_message: string | null
          executed_by: string | null
          execution_time: unknown | null
          id: string
          parameters: Json | null
          report_id: string | null
          result_count: number | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          executed_by?: string | null
          execution_time?: unknown | null
          id?: string
          parameters?: Json | null
          report_id?: string | null
          result_count?: number | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          executed_by?: string | null
          execution_time?: unknown | null
          id?: string
          parameters?: Json | null
          report_id?: string | null
          result_count?: number | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "report_executions_executed_by_fkey"
            columns: ["executed_by"]
            isOneToOne: false
            referencedRelation: "technician_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_executions_executed_by_fkey"
            columns: ["executed_by"]
            isOneToOne: false
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_executions_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "report_definitions"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_plans: {
        Row: {
          created_at: string | null
          description: string | null
          features: Json
          id: string
          is_active: boolean | null
          limits: Json
          name: string
          price_monthly: number
          price_yearly: number
          recommended: boolean | null
          trial_period: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          features?: Json
          id?: string
          is_active?: boolean | null
          limits?: Json
          name: string
          price_monthly: number
          price_yearly: number
          recommended?: boolean | null
          trial_period?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          features?: Json
          id?: string
          is_active?: boolean | null
          limits?: Json
          name?: string
          price_monthly?: number
          price_yearly?: number
          recommended?: boolean | null
          trial_period?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          assigned_to: string | null
          company_id: string | null
          created_at: string | null
          description: string
          id: string
          priority: string | null
          status: string | null
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          assigned_to?: string | null
          company_id?: string | null
          created_at?: string | null
          description: string
          id?: string
          priority?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          assigned_to?: string | null
          company_id?: string | null
          created_at?: string | null
          description?: string
          id?: string
          priority?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "support_tickets_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "technician_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_tickets_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_tickets_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      tech_billing: {
        Row: {
          created_at: string | null
          id: string
          next_billing_date: string | null
          payment_method: Json | null
          plan: Json | null
          status: string | null
          technician_id: string | null
          trial_ends_at: string | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          next_billing_date?: string | null
          payment_method?: Json | null
          plan?: Json | null
          status?: string | null
          technician_id?: string | null
          trial_ends_at?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          next_billing_date?: string | null
          payment_method?: Json | null
          plan?: Json | null
          status?: string | null
          technician_id?: string | null
          trial_ends_at?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tech_billing_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: true
            referencedRelation: "technician_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tech_billing_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: true
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
        ]
      }
      tech_billing_transactions: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          description: string | null
          id: string
          metadata: Json | null
          status: string | null
          tech_billing_id: string | null
          type: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          status?: string | null
          tech_billing_id?: string | null
          type?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          status?: string | null
          tech_billing_id?: string | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tech_billing_transactions_tech_billing_id_fkey"
            columns: ["tech_billing_id"]
            isOneToOne: false
            referencedRelation: "tech_billing"
            referencedColumns: ["id"]
          },
        ]
      }
      tech_call_logs: {
        Row: {
          call_type: string | null
          caller_id: string | null
          company_id: string | null
          duration: unknown | null
          ended_at: string | null
          group_id: string | null
          id: string
          receiver_id: string | null
          started_at: string | null
          status: string | null
        }
        Insert: {
          call_type?: string | null
          caller_id?: string | null
          company_id?: string | null
          duration?: unknown | null
          ended_at?: string | null
          group_id?: string | null
          id?: string
          receiver_id?: string | null
          started_at?: string | null
          status?: string | null
        }
        Update: {
          call_type?: string | null
          caller_id?: string | null
          company_id?: string | null
          duration?: unknown | null
          ended_at?: string | null
          group_id?: string | null
          id?: string
          receiver_id?: string | null
          started_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tech_call_logs_caller_id_fkey"
            columns: ["caller_id"]
            isOneToOne: false
            referencedRelation: "technician_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tech_call_logs_caller_id_fkey"
            columns: ["caller_id"]
            isOneToOne: false
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tech_call_logs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tech_call_logs_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "tech_chat_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tech_call_logs_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "technician_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tech_call_logs_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
        ]
      }
      tech_chat_groups: {
        Row: {
          company_id: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tech_chat_groups_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tech_chat_groups_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "technician_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tech_chat_groups_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
        ]
      }
      tech_company_applications: {
        Row: {
          availability: Json | null
          company_id: string | null
          cover_letter: string | null
          created_at: string | null
          desired_rate: number | null
          documents: Json | null
          id: string
          notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
          technician_id: string | null
          updated_at: string | null
        }
        Insert: {
          availability?: Json | null
          company_id?: string | null
          cover_letter?: string | null
          created_at?: string | null
          desired_rate?: number | null
          documents?: Json | null
          id?: string
          notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          technician_id?: string | null
          updated_at?: string | null
        }
        Update: {
          availability?: Json | null
          company_id?: string | null
          cover_letter?: string | null
          created_at?: string | null
          desired_rate?: number | null
          documents?: Json | null
          id?: string
          notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          technician_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tech_company_applications_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tech_company_applications_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "technician_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tech_company_applications_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tech_company_applications_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technician_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tech_company_applications_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
        ]
      }
      tech_company_communications: {
        Row: {
          company_id: string | null
          content: string
          created_at: string | null
          id: string
          metadata: Json | null
          read_at: string | null
          subject: string
          technician_id: string | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          company_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          read_at?: string | null
          subject: string
          technician_id?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          company_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          read_at?: string | null
          subject?: string
          technician_id?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tech_company_communications_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tech_company_communications_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technician_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tech_company_communications_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
        ]
      }
      tech_company_limits: {
        Row: {
          company_id: string | null
          created_at: string | null
          id: string
          max_admins: number | null
          max_technicians: number
          updated_at: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          id?: string
          max_admins?: number | null
          max_technicians: number
          updated_at?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          id?: string
          max_admins?: number | null
          max_technicians?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tech_company_limits_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      tech_file_metadata: {
        Row: {
          created_at: string | null
          download_url: string
          file_name: string
          file_size: number
          file_type: string
          id: string
          message_id: string | null
          mime_type: string
          thumbnail_url: string | null
        }
        Insert: {
          created_at?: string | null
          download_url: string
          file_name: string
          file_size: number
          file_type: string
          id?: string
          message_id?: string | null
          mime_type: string
          thumbnail_url?: string | null
        }
        Update: {
          created_at?: string | null
          download_url?: string
          file_name?: string
          file_size?: number
          file_type?: string
          id?: string
          message_id?: string | null
          mime_type?: string
          thumbnail_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tech_file_metadata_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "tech_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      tech_group_members: {
        Row: {
          group_id: string | null
          id: string
          joined_at: string | null
          role: string | null
          user_id: string | null
        }
        Insert: {
          group_id?: string | null
          id?: string
          joined_at?: string | null
          role?: string | null
          user_id?: string | null
        }
        Update: {
          group_id?: string | null
          id?: string
          joined_at?: string | null
          role?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tech_group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "tech_chat_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tech_group_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "technician_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tech_group_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
        ]
      }
      tech_messages: {
        Row: {
          attachments: string[] | null
          company_id: string | null
          content: string
          created_at: string | null
          format: Json | null
          group_id: string | null
          id: string
          receiver_id: string | null
          sender_id: string | null
        }
        Insert: {
          attachments?: string[] | null
          company_id?: string | null
          content: string
          created_at?: string | null
          format?: Json | null
          group_id?: string | null
          id?: string
          receiver_id?: string | null
          sender_id?: string | null
        }
        Update: {
          attachments?: string[] | null
          company_id?: string | null
          content?: string
          created_at?: string | null
          format?: Json | null
          group_id?: string | null
          id?: string
          receiver_id?: string | null
          sender_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tech_messages_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tech_messages_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "tech_chat_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tech_messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "technician_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tech_messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tech_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "technician_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tech_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
        ]
      }
      tech_profiles: {
        Row: {
          availability: Json | null
          bio: string | null
          certifications: Json | null
          created_at: string | null
          education: string[] | null
          experience_years: number | null
          id: string
          portfolio_items: Json | null
          service_area: Json | null
          social_links: Json | null
          specialties: string[] | null
          technician_id: string | null
          updated_at: string | null
        }
        Insert: {
          availability?: Json | null
          bio?: string | null
          certifications?: Json | null
          created_at?: string | null
          education?: string[] | null
          experience_years?: number | null
          id?: string
          portfolio_items?: Json | null
          service_area?: Json | null
          social_links?: Json | null
          specialties?: string[] | null
          technician_id?: string | null
          updated_at?: string | null
        }
        Update: {
          availability?: Json | null
          bio?: string | null
          certifications?: Json | null
          created_at?: string | null
          education?: string[] | null
          experience_years?: number | null
          id?: string
          portfolio_items?: Json | null
          service_area?: Json | null
          social_links?: Json | null
          specialties?: string[] | null
          technician_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tech_profiles_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: true
            referencedRelation: "technician_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tech_profiles_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: true
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
        ]
      }
      technician_invites: {
        Row: {
          company_id: string
          created_at: string
          created_by: string | null
          email: string
          expires_at: string
          id: string
          name: string
          phone: string | null
          status: string
          token: string
        }
        Insert: {
          company_id: string
          created_at?: string
          created_by?: string | null
          email: string
          expires_at?: string
          id?: string
          name: string
          phone?: string | null
          status?: string
          token?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          created_by?: string | null
          email?: string
          expires_at?: string
          id?: string
          name?: string
          phone?: string | null
          status?: string
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "technician_invites_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      technician_schedules: {
        Row: {
          created_at: string | null
          date_from: string
          date_to: string
          id: string
          reason: string | null
          status: string | null
          technician_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          date_from: string
          date_to: string
          id?: string
          reason?: string | null
          status?: string | null
          technician_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          date_from?: string
          date_to?: string
          id?: string
          reason?: string | null
          status?: string | null
          technician_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "technician_schedules_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technician_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technician_schedules_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
        ]
      }
      technician_skills: {
        Row: {
          certification_expiry: string | null
          certified: boolean | null
          created_at: string | null
          id: string
          level: string | null
          skill_name: string
          technician_id: string | null
          updated_at: string | null
        }
        Insert: {
          certification_expiry?: string | null
          certified?: boolean | null
          created_at?: string | null
          id?: string
          level?: string | null
          skill_name: string
          technician_id?: string | null
          updated_at?: string | null
        }
        Update: {
          certification_expiry?: string | null
          certified?: boolean | null
          created_at?: string | null
          id?: string
          level?: string | null
          skill_name?: string
          technician_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "technician_skills_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technician_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technician_skills_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
        ]
      }
      technicians: {
        Row: {
          available_for_hire: boolean | null
          company_id: string | null
          created_at: string | null
          email: string
          hourly_rate: number | null
          id: string
          is_independent: boolean | null
          last_sign_in_at: string | null
          phone: string | null
          role: string
          status: string
          updated_at: string | null
        }
        Insert: {
          available_for_hire?: boolean | null
          company_id?: string | null
          created_at?: string | null
          email: string
          hourly_rate?: number | null
          id: string
          is_independent?: boolean | null
          last_sign_in_at?: string | null
          phone?: string | null
          role: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          available_for_hire?: boolean | null
          company_id?: string | null
          created_at?: string | null
          email?: string
          hourly_rate?: number | null
          id?: string
          is_independent?: boolean | null
          last_sign_in_at?: string | null
          phone?: string | null
          role?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "technicians_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      test_users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          password: string
          role: string | null
          username: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          password: string
          role?: string | null
          username: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          password?: string
          role?: string | null
          username?: string
        }
        Relationships: []
      }
      ticket_comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          ticket_id: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          ticket_id?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          ticket_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ticket_comments_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      user_activity_logs: {
        Row: {
          activity_type: string
          created_at: string | null
          description: string | null
          id: string
          ip_address: string | null
          metadata: Json | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          activity_type: string
          created_at?: string | null
          description?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          activity_type?: string
          created_at?: string | null
          description?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_invitations: {
        Row: {
          accepted_at: string | null
          company_id: string | null
          created_at: string | null
          email: string
          expires_at: string
          id: string
          invited_by: string | null
          role: string
          token: string
        }
        Insert: {
          accepted_at?: string | null
          company_id?: string | null
          created_at?: string | null
          email: string
          expires_at: string
          id?: string
          invited_by?: string | null
          role: string
          token: string
        }
        Update: {
          accepted_at?: string | null
          company_id?: string | null
          created_at?: string | null
          email?: string
          expires_at?: string
          id?: string
          invited_by?: string | null
          role?: string
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_invitations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          created_at: string | null
          id: string
          language: string | null
          notifications: Json | null
          theme: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          language?: string | null
          notifications?: Json | null
          theme?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          language?: string | null
          notifications?: Json | null
          theme?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          created_at: string | null
          device_info: Json | null
          id: string
          is_active: boolean | null
          last_active: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          device_info?: Json | null
          id?: string
          is_active?: boolean | null
          last_active?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          device_info?: Json | null
          id?: string
          is_active?: boolean | null
          last_active?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      webhook_endpoints: {
        Row: {
          company_id: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          events: string[] | null
          id: string
          integration_id: string | null
          name: string
          secret_key: string | null
          status: string
          updated_at: string | null
          url: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          events?: string[] | null
          id?: string
          integration_id?: string | null
          name: string
          secret_key?: string | null
          status?: string
          updated_at?: string | null
          url: string
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          events?: string[] | null
          id?: string
          integration_id?: string | null
          name?: string
          secret_key?: string | null
          status?: string
          updated_at?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "webhook_endpoints_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "webhook_endpoints_integration_id_fkey"
            columns: ["integration_id"]
            isOneToOne: false
            referencedRelation: "api_integrations"
            referencedColumns: ["id"]
          },
        ]
      }
      widget_data_cache: {
        Row: {
          created_at: string | null
          data: Json
          expires_at: string
          filter_hash: string
          id: string
          widget_id: string | null
        }
        Insert: {
          created_at?: string | null
          data: Json
          expires_at: string
          filter_hash: string
          id?: string
          widget_id?: string | null
        }
        Update: {
          created_at?: string | null
          data?: Json
          expires_at?: string
          filter_hash?: string
          id?: string
          widget_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "widget_data_cache_widget_id_fkey"
            columns: ["widget_id"]
            isOneToOne: false
            referencedRelation: "dashboard_widgets"
            referencedColumns: ["id"]
          },
        ]
      }
      widget_presets: {
        Row: {
          category: string | null
          company_id: string | null
          config: Json
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_public: boolean | null
          name: string
          type: string | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          company_id?: string | null
          config: Json
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          name: string
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          company_id?: string | null
          config?: Json
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          name?: string
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "widget_presets_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "widget_presets_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "technician_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "widget_presets_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_approval_requests: {
        Row: {
          id: string
          requested_at: string | null
          requested_by: string | null
          review_date: string | null
          review_notes: string | null
          reviewed_by: string | null
          status: string | null
          version: number
          workflow_id: string | null
        }
        Insert: {
          id?: string
          requested_at?: string | null
          requested_by?: string | null
          review_date?: string | null
          review_notes?: string | null
          reviewed_by?: string | null
          status?: string | null
          version: number
          workflow_id?: string | null
        }
        Update: {
          id?: string
          requested_at?: string | null
          requested_by?: string | null
          review_date?: string | null
          review_notes?: string | null
          reviewed_by?: string | null
          status?: string | null
          version?: number
          workflow_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workflow_approval_requests_requested_by_fkey"
            columns: ["requested_by"]
            isOneToOne: false
            referencedRelation: "technician_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_approval_requests_requested_by_fkey"
            columns: ["requested_by"]
            isOneToOne: false
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_approval_requests_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "technician_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_approval_requests_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_approval_requests_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_categories: {
        Row: {
          company_id: string | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          parent_id: string | null
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          parent_id?: string | null
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          parent_id?: string | null
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workflow_categories_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "workflow_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_versions: {
        Row: {
          changes: string | null
          created_at: string | null
          created_by: string | null
          data: Json
          id: string
          review_date: string | null
          review_notes: string | null
          reviewed_by: string | null
          status: string | null
          version: number
          workflow_id: string | null
        }
        Insert: {
          changes?: string | null
          created_at?: string | null
          created_by?: string | null
          data: Json
          id?: string
          review_date?: string | null
          review_notes?: string | null
          reviewed_by?: string | null
          status?: string | null
          version: number
          workflow_id?: string | null
        }
        Update: {
          changes?: string | null
          created_at?: string | null
          created_by?: string | null
          data?: Json
          id?: string
          review_date?: string | null
          review_notes?: string | null
          reviewed_by?: string | null
          status?: string | null
          version?: number
          workflow_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workflow_versions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "technician_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_versions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_versions_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "technician_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_versions_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_versions_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      workflows: {
        Row: {
          archived_at: string | null
          category_id: string | null
          company_id: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          flow_data: Json | null
          id: string
          is_active: boolean | null
          name: string
          previous_version: string | null
          published_at: string | null
          status: string | null
          updated_at: string | null
          version: number | null
        }
        Insert: {
          archived_at?: string | null
          category_id?: string | null
          company_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          flow_data?: Json | null
          id?: string
          is_active?: boolean | null
          name: string
          previous_version?: string | null
          published_at?: string | null
          status?: string | null
          updated_at?: string | null
          version?: number | null
        }
        Update: {
          archived_at?: string | null
          category_id?: string | null
          company_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          flow_data?: Json | null
          id?: string
          is_active?: boolean | null
          name?: string
          previous_version?: string | null
          published_at?: string | null
          status?: string | null
          updated_at?: string | null
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "workflows_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "workflow_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflows_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflows_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "technician_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflows_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflows_previous_version_fkey"
            columns: ["previous_version"]
            isOneToOne: false
            referencedRelation: "workflow_versions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      technician_details: {
        Row: {
          avatar: string | null
          company_id: string | null
          created_at: string | null
          email: string | null
          id: string | null
          name: string | null
          role: string | null
          status: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "technicians_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      build_safe_query: {
        Args: {
          search_term: string
          sort_column: string
          sort_direction: string
        }
        Returns: {
          created_at: string | null
          email: string
          id: string
          password: string
          role: string | null
          username: string
        }[]
      }
      calculate_company_limits: {
        Args: {
          subscription_tier: string
        }
        Returns: number
      }
      calculate_customer_metrics: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      calculate_inventory_metrics: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      calculate_repair_metrics: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      can_access_company: {
        Args: {
          p_company_id: string
        }
        Returns: boolean
      }
      check_api_quota: {
        Args: {
          p_company_id: string
          p_provider: string
        }
        Returns: boolean
      }
      check_company_technician_limits: {
        Args: {
          p_company_id: string
        }
        Returns: Json
      }
      check_system_setup: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      cleanup_old_ai_messages: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_api_key: {
        Args: {
          p_company_id: string
          p_name: string
          p_scopes?: string[]
          p_expires_in?: unknown
        }
        Returns: string
      }
      create_dashboard_from_template: {
        Args: {
          p_company_id: string
          p_template_id: string
          p_name: string
          p_description?: string
        }
        Returns: string
      }
      delete_user_account: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      email_login: {
        Args: {
          email: string
          password: string
        }
        Returns: Json
      }
      get_api_credentials: {
        Args: {
          p_company_id: string
          p_provider: string
        }
        Returns: Json
      }
      get_file_preview: {
        Args: {
          p_mime_type: string
          p_file_size: number
        }
        Returns: Json
      }
      get_technician_list: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: number
          name: string
          email: string
        }[]
      }
      get_technician_messages:
        | {
            Args: {
              p_company_id: string
              p_user_id: string
              p_receiver_id?: string
            }
            Returns: {
              id: string
              sender_id: string
              receiver_id: string
              content: string
              attachments: string[]
              created_at: string
              edited_at: string
              is_deleted: boolean
              message_type: string
              reply_to: string
              sender_name: string
              sender_avatar: string
            }[]
          }
        | {
            Args: {
              p_receiver_id: number
            }
            Returns: {
              id: number
              message: string
              sender_id: number
              created_at: string
            }[]
          }
      get_user_company: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_permissions: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      handle_initial_setup: {
        Args: {
          p_admin_email: string
          p_admin_password: string
          p_admin_name: string
          p_company_name: string
        }
        Returns: Json
      }
      handle_system_setup: {
        Args: {
          admin_email: string
          admin_password: string
          admin_name: string
          company_name: string
        }
        Returns: Json
      }
      handle_user_login: {
        Args: {
          p_email: string
          p_password: string
        }
        Returns: Json
      }
      handle_user_registration: {
        Args: {
          p_email: string
          p_password: string
          p_name: string
          p_company_name: string
          p_role: string
        }
        Returns: Json
      }
      increment: {
        Args: {
          row_id: string
          field_name?: string
          table_name?: string
        }
        Returns: number
      }
      invite_technician: {
        Args: {
          p_email: string
          p_name: string
          p_phone: string
          p_company_id: string
        }
        Returns: string
      }
      is_email_available: {
        Args: {
          p_email: string
        }
        Returns: boolean
      }
      log_api_key_usage: {
        Args: {
          p_api_key_id: string
          p_endpoint: string
          p_method: string
          p_status_code: number
          p_ip_address?: string
          p_user_agent?: string
        }
        Returns: undefined
      }
      log_api_usage: {
        Args: {
          p_company_id: string
          p_provider: string
          p_endpoint: string
          p_status_code: number
          p_response_time: unknown
          p_cost?: number
          p_error_message?: string
          p_metadata?: Json
        }
        Returns: undefined
      }
      needs_setup: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      process_webhook_event: {
        Args: {
          webhook_id: string
          event_type: string
          payload: Json
        }
        Returns: Json
      }
      refresh_widget_data: {
        Args: {
          p_widget_id: string
          p_filter_hash?: string
        }
        Returns: Json
      }
      register_company_admin: {
        Args: {
          p_email: string
          p_password: string
          p_name: string
          p_company_name: string
        }
        Returns: Json
      }
      register_technician: {
        Args: {
          p_email: string
          p_password: string
          p_name: string
          p_company_id: string
        }
        Returns: Json
      }
      request_password_reset: {
        Args: {
          p_email: string
        }
        Returns: undefined
      }
      reset_password: {
        Args: {
          p_token: string
          p_new_password: string
        }
        Returns: boolean
      }
      revoke_api_key: {
        Args: {
          p_key_id: string
        }
        Returns: boolean
      }
      safe_login: {
        Args: {
          user_input: string
          pass_input: string
        }
        Returns: {
          created_at: string | null
          email: string
          id: string
          password: string
          role: string | null
          username: string
        }[]
      }
      search_messages: {
        Args: {
          p_company_id: string
          p_query: string
          p_limit?: number
        }
        Returns: {
          id: string
          content: string
          rank: number
          created_at: string
          sender_name: string
        }[]
      }
      unsafe_login: {
        Args: {
          user_input: string
          pass_input: string
        }
        Returns: {
          created_at: string | null
          email: string
          id: string
          password: string
          role: string | null
          username: string
        }[]
      }
      validate_registration: {
        Args: {
          p_email: string
          p_password: string
          p_role: string
          p_company_name?: string
        }
        Returns: boolean
      }
      verify_api_key: {
        Args: {
          p_key: string
        }
        Returns: {
          company_id: string
          scopes: string[]
          is_valid: boolean
        }[]
      }
      verify_email: {
        Args: {
          p_token: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
