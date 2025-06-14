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
      certification_programs: {
        Row: {
          company_id: string | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          total_modules: number | null
          updated_at: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          total_modules?: number | null
          updated_at?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          total_modules?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "certification_programs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      community_comments: {
        Row: {
          attachments: Json | null
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
          attachments?: Json | null
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
          attachments?: Json | null
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
            foreignKeyName: "community_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
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
      email_logs: {
        Row: {
          bcc_addresses: string[]
          cc_addresses: string[]
          clicks: number | null
          company_id: string | null
          created_at: string
          delivered_at: string | null
          error_message: string | null
          html_content: string | null
          id: string
          message_id: string
          opens: number | null
          sent_at: string | null
          sent_by: string | null
          status: string
          subject: string
          template_id: string | null
          template_variables: Json | null
          text_content: string | null
          to_addresses: string[]
          updated_at: string
        }
        Insert: {
          bcc_addresses?: string[]
          cc_addresses?: string[]
          clicks?: number | null
          company_id?: string | null
          created_at?: string
          delivered_at?: string | null
          error_message?: string | null
          html_content?: string | null
          id?: string
          message_id: string
          opens?: number | null
          sent_at?: string | null
          sent_by?: string | null
          status?: string
          subject: string
          template_id?: string | null
          template_variables?: Json | null
          text_content?: string | null
          to_addresses?: string[]
          updated_at?: string
        }
        Update: {
          bcc_addresses?: string[]
          cc_addresses?: string[]
          clicks?: number | null
          company_id?: string | null
          created_at?: string
          delivered_at?: string | null
          error_message?: string | null
          html_content?: string | null
          id?: string
          message_id?: string
          opens?: number | null
          sent_at?: string | null
          sent_by?: string | null
          status?: string
          subject?: string
          template_id?: string | null
          template_variables?: Json | null
          text_content?: string | null
          to_addresses?: string[]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_email_logs_company_id"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_email_logs_template_id"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "email_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      email_templates: {
        Row: {
          category: string
          company_id: string | null
          created_at: string
          html_content: string
          id: string
          is_active: boolean | null
          name: string
          subject: string
          text_content: string | null
          updated_at: string
          variables: string[] | null
        }
        Insert: {
          category: string
          company_id?: string | null
          created_at?: string
          html_content: string
          id?: string
          is_active?: boolean | null
          name: string
          subject: string
          text_content?: string | null
          updated_at?: string
          variables?: string[] | null
        }
        Update: {
          category?: string
          company_id?: string | null
          created_at?: string
          html_content?: string
          id?: string
          is_active?: boolean | null
          name?: string
          subject?: string
          text_content?: string | null
          updated_at?: string
          variables?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_email_templates_company_id"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      feature_comments: {
        Row: {
          content: string
          created_at: string | null
          feature_id: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          feature_id?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          feature_id?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feature_comments_feature_id_fkey"
            columns: ["feature_id"]
            isOneToOne: false
            referencedRelation: "feature_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      feature_requests: {
        Row: {
          comments_count: number | null
          company_id: string | null
          created_at: string | null
          created_by_user: Json | null
          description: string
          id: string
          priority: string | null
          status: string | null
          title: string
          updated_at: string | null
          user_has_voted: boolean | null
          user_id: string | null
          votes_count: number | null
        }
        Insert: {
          comments_count?: number | null
          company_id?: string | null
          created_at?: string | null
          created_by_user?: Json | null
          description: string
          id?: string
          priority?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
          user_has_voted?: boolean | null
          user_id?: string | null
          votes_count?: number | null
        }
        Update: {
          comments_count?: number | null
          company_id?: string | null
          created_at?: string | null
          created_by_user?: Json | null
          description?: string
          id?: string
          priority?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
          user_has_voted?: boolean | null
          user_id?: string | null
          votes_count?: number | null
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
      file_categories: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      file_library: {
        Row: {
          category_id: string | null
          community_comment_id: string | null
          community_post_id: string | null
          created_at: string | null
          description: string | null
          download_count: number | null
          file_type: string
          file_upload_id: string | null
          id: string
          indexed_at: string | null
          is_featured: boolean | null
          search_vector: unknown | null
          tags: string[] | null
          title: string
          updated_at: string | null
          visibility: string | null
        }
        Insert: {
          category_id?: string | null
          community_comment_id?: string | null
          community_post_id?: string | null
          created_at?: string | null
          description?: string | null
          download_count?: number | null
          file_type: string
          file_upload_id?: string | null
          id?: string
          indexed_at?: string | null
          is_featured?: boolean | null
          search_vector?: unknown | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          visibility?: string | null
        }
        Update: {
          category_id?: string | null
          community_comment_id?: string | null
          community_post_id?: string | null
          created_at?: string | null
          description?: string | null
          download_count?: number | null
          file_type?: string
          file_upload_id?: string | null
          id?: string
          indexed_at?: string | null
          is_featured?: boolean | null
          search_vector?: unknown | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          visibility?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "file_library_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "file_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "file_library_community_comment_id_fkey"
            columns: ["community_comment_id"]
            isOneToOne: false
            referencedRelation: "community_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "file_library_community_post_id_fkey"
            columns: ["community_post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "file_library_file_upload_id_fkey"
            columns: ["file_upload_id"]
            isOneToOne: false
            referencedRelation: "file_uploads"
            referencedColumns: ["id"]
          },
        ]
      }
      file_library_access_logs: {
        Row: {
          access_type: string | null
          created_at: string | null
          file_library_id: string | null
          id: string
          ip_address: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          access_type?: string | null
          created_at?: string | null
          file_library_id?: string | null
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          access_type?: string | null
          created_at?: string | null
          file_library_id?: string | null
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "file_library_access_logs_file_library_id_fkey"
            columns: ["file_library_id"]
            isOneToOne: false
            referencedRelation: "file_library"
            referencedColumns: ["id"]
          },
        ]
      }
      file_uploads: {
        Row: {
          bucket: string
          company_id: string | null
          created_at: string
          file_name: string
          id: string
          metadata: Json | null
          mime_type: string
          original_name: string
          path: string
          size: number
          updated_at: string
          uploaded_by: string | null
          url: string
        }
        Insert: {
          bucket?: string
          company_id?: string | null
          created_at?: string
          file_name: string
          id?: string
          metadata?: Json | null
          mime_type: string
          original_name: string
          path: string
          size: number
          updated_at?: string
          uploaded_by?: string | null
          url: string
        }
        Update: {
          bucket?: string
          company_id?: string | null
          created_at?: string
          file_name?: string
          id?: string
          metadata?: Json | null
          mime_type?: string
          original_name?: string
          path?: string
          size?: number
          updated_at?: string
          uploaded_by?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "file_uploads_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      incident_updates: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          incident_id: string
          message: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          incident_id: string
          message: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          incident_id?: string
          message?: string
        }
        Relationships: [
          {
            foreignKeyName: "incident_updates_incident_id_fkey"
            columns: ["incident_id"]
            isOneToOne: false
            referencedRelation: "incidents"
            referencedColumns: ["id"]
          },
        ]
      }
      incidents: {
        Row: {
          created_at: string | null
          description: string
          id: string
          resolved_at: string | null
          status: string
          title: string
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          resolved_at?: string | null
          status: string
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          resolved_at?: string | null
          status?: string
          title?: string
        }
        Relationships: []
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
      knowledge_base: {
        Row: {
          author_id: string | null
          category: string | null
          category_id: string | null
          company_id: string | null
          content: string
          created_at: string | null
          id: string
          is_public: boolean | null
          tags: string[] | null
          title: string
          updated_at: string | null
          views: number | null
        }
        Insert: {
          author_id?: string | null
          category?: string | null
          category_id?: string | null
          company_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          is_public?: boolean | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          views?: number | null
        }
        Update: {
          author_id?: string | null
          category?: string | null
          category_id?: string | null
          company_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          is_public?: boolean | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_base_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "knowledge_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_base_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_categories: {
        Row: {
          company_id: string | null
          created_at: string | null
          description: string | null
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
          id?: string
          is_active?: boolean | null
          name?: string
          parent_id?: string | null
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_categories_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "knowledge_categories"
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
      licenses: {
        Row: {
          active_technicians: number
          company_id: string
          company_name: string | null
          created_at: string
          end_date: string | null
          id: string
          max_technicians: number
          next_payment: string | null
          plan_id: string
          plan_name: string
          start_date: string
          status: string
          trial_ends_at: string | null
          updated_at: string
        }
        Insert: {
          active_technicians?: number
          company_id: string
          company_name?: string | null
          created_at?: string
          end_date?: string | null
          id?: string
          max_technicians?: number
          next_payment?: string | null
          plan_id: string
          plan_name: string
          start_date?: string
          status?: string
          trial_ends_at?: string | null
          updated_at?: string
        }
        Update: {
          active_technicians?: number
          company_id?: string
          company_name?: string | null
          created_at?: string
          end_date?: string | null
          id?: string
          max_technicians?: number
          next_payment?: string | null
          plan_id?: string
          plan_name?: string
          start_date?: string
          status?: string
          trial_ends_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "licenses_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "licenses_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_settings: {
        Row: {
          created_at: string | null
          id: string
          setting_key: string
          setting_type: string | null
          setting_value: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          setting_key: string
          setting_type?: string | null
          setting_value?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          setting_key?: string
          setting_type?: string | null
          setting_value?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          company_id: string | null
          id: string
          message: string
          read: boolean | null
          timestamp: string | null
          title: string
          type: string | null
          user_id: string | null
        }
        Insert: {
          company_id?: string | null
          id?: string
          message: string
          read?: boolean | null
          timestamp?: string | null
          title: string
          type?: string | null
          user_id?: string | null
        }
        Update: {
          company_id?: string | null
          id?: string
          message?: string
          read?: boolean | null
          timestamp?: string | null
          title?: string
          type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
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
      payments: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          license_id: string
          payment_date: string
          payment_method: string | null
          status: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          id?: string
          license_id: string
          payment_date?: string
          payment_method?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          license_id?: string
          payment_date?: string
          payment_method?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_license_id_fkey"
            columns: ["license_id"]
            isOneToOne: false
            referencedRelation: "licenses"
            referencedColumns: ["id"]
          },
        ]
      }
      product_updates: {
        Row: {
          content: string
          created_at: string | null
          date: string | null
          id: string
          title: string
          updated_at: string | null
          version: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          date?: string | null
          id?: string
          title: string
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          date?: string | null
          id?: string
          title?: string
          updated_at?: string | null
          version?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company_id: string | null
          created_at: string | null
          full_name: string | null
          id: string
          phone_number: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          company_id?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          phone_number?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          company_id?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          phone_number?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
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
      service_records: {
        Row: {
          company_id: string | null
          created_at: string | null
          customer: string
          date: string | null
          device: string
          id: string
          notes: string | null
          rating: number | null
          status: string
          technician_id: string | null
          updated_at: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          customer: string
          date?: string | null
          device: string
          id?: string
          notes?: string | null
          rating?: number | null
          status?: string
          technician_id?: string | null
          updated_at?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          customer?: string
          date?: string | null
          device?: string
          id?: string
          notes?: string | null
          rating?: number | null
          status?: string
          technician_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_records_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_records_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technician_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_records_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
        ]
      }
      service_statuses: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          last_updated_at: string | null
          name: string
          status: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          last_updated_at?: string | null
          name: string
          status: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          last_updated_at?: string | null
          name?: string
          status?: string
        }
        Relationships: []
      }
      sla_policies: {
        Row: {
          company_id: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          priority: string
          resolution_time: number
          response_time: number
          updated_at: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          priority: string
          resolution_time: number
          response_time: number
          updated_at?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          priority?: string
          resolution_time?: number
          response_time?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sla_policies_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
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
      support_metrics: {
        Row: {
          agent_id: string | null
          avg_resolution_time: number | null
          avg_response_time: number | null
          company_id: string | null
          created_at: string | null
          customer_satisfaction: number | null
          id: string
          metric_date: string
          sla_compliance_rate: number | null
          tickets_handled: number | null
        }
        Insert: {
          agent_id?: string | null
          avg_resolution_time?: number | null
          avg_response_time?: number | null
          company_id?: string | null
          created_at?: string | null
          customer_satisfaction?: number | null
          id?: string
          metric_date: string
          sla_compliance_rate?: number | null
          tickets_handled?: number | null
        }
        Update: {
          agent_id?: string | null
          avg_resolution_time?: number | null
          avg_response_time?: number | null
          company_id?: string | null
          created_at?: string | null
          customer_satisfaction?: number | null
          id?: string
          metric_date?: string
          sla_compliance_rate?: number | null
          tickets_handled?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "support_metrics_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "support_team_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_metrics_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      support_notification_preferences: {
        Row: {
          created_at: string | null
          email_enabled: boolean | null
          id: string
          sla_breach: boolean | null
          ticket_assigned: boolean | null
          ticket_created: boolean | null
          ticket_resolved: boolean | null
          ticket_updated: boolean | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email_enabled?: boolean | null
          id?: string
          sla_breach?: boolean | null
          ticket_assigned?: boolean | null
          ticket_created?: boolean | null
          ticket_resolved?: boolean | null
          ticket_updated?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email_enabled?: boolean | null
          id?: string
          sla_breach?: boolean | null
          ticket_assigned?: boolean | null
          ticket_created?: boolean | null
          ticket_resolved?: boolean | null
          ticket_updated?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      support_team_members: {
        Row: {
          company_id: string | null
          created_at: string | null
          current_tickets: number | null
          department: string | null
          email: string
          id: string
          is_active: boolean | null
          max_tickets: number | null
          name: string
          role: string
          specializations: string[] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          current_tickets?: number | null
          department?: string | null
          email: string
          id?: string
          is_active?: boolean | null
          max_tickets?: number | null
          name: string
          role?: string
          specializations?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          current_tickets?: number | null
          department?: string | null
          email?: string
          id?: string
          is_active?: boolean | null
          max_tickets?: number | null
          name?: string
          role?: string
          specializations?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "support_team_members_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      support_ticket_attachments: {
        Row: {
          created_at: string | null
          file_name: string
          file_size: number
          file_type: string
          file_url: string
          id: string
          message_id: string | null
          ticket_id: string | null
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string | null
          file_name: string
          file_size: number
          file_type: string
          file_url: string
          id?: string
          message_id?: string | null
          ticket_id?: string | null
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string | null
          file_name?: string
          file_size?: number
          file_type?: string
          file_url?: string
          id?: string
          message_id?: string | null
          ticket_id?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "support_ticket_attachments_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "support_ticket_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_ticket_attachments_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      support_ticket_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          sender_id: string | null
          ticket_id: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          sender_id?: string | null
          ticket_id?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          sender_id?: string | null
          ticket_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "support_ticket_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_ticket_messages_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          assigned_to: string | null
          company_id: string | null
          created_at: string | null
          created_by_user_id: string | null
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
          created_by_user_id?: string | null
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
          created_by_user_id?: string | null
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
          {
            foreignKeyName: "support_tickets_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      system_messages: {
        Row: {
          active: boolean | null
          audience: string
          created_at: string | null
          created_by: string | null
          end_date: string | null
          id: string
          message: string
          scheduled: string | null
          start_date: string | null
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          audience: string
          created_at?: string | null
          created_by?: string | null
          end_date?: string | null
          id?: string
          message: string
          scheduled?: string | null
          start_date?: string | null
          title: string
          type: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          audience?: string
          created_at?: string | null
          created_by?: string | null
          end_date?: string | null
          id?: string
          message?: string
          scheduled?: string | null
          start_date?: string | null
          title?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      system_metrics: {
        Row: {
          created_at: string | null
          id: string
          name: string
          unit: string | null
          value: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          unit?: string | null
          value: number
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          unit?: string | null
          value?: number
        }
        Relationships: []
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
      technician_performance_metrics: {
        Row: {
          average_service_time: unknown | null
          calculated_at: string | null
          completed_repairs: number | null
          created_at: string | null
          customer_rating: number | null
          customers_served: number | null
          efficiency_score: number | null
          id: string
          technician_id: string | null
          updated_at: string | null
        }
        Insert: {
          average_service_time?: unknown | null
          calculated_at?: string | null
          completed_repairs?: number | null
          created_at?: string | null
          customer_rating?: number | null
          customers_served?: number | null
          efficiency_score?: number | null
          id?: string
          technician_id?: string | null
          updated_at?: string | null
        }
        Update: {
          average_service_time?: unknown | null
          calculated_at?: string | null
          completed_repairs?: number | null
          created_at?: string | null
          customer_rating?: number | null
          customers_served?: number | null
          efficiency_score?: number | null
          id?: string
          technician_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "technician_performance_metrics_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technician_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technician_performance_metrics_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians"
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
      ticket_assignments: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          assigned_to: string | null
          id: string
          is_active: boolean | null
          notes: string | null
          ticket_id: string | null
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          assigned_to?: string | null
          id?: string
          is_active?: boolean | null
          notes?: string | null
          ticket_id?: string | null
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          assigned_to?: string | null
          id?: string
          is_active?: boolean | null
          notes?: string | null
          ticket_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ticket_assignments_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "support_team_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ticket_assignments_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "support_team_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ticket_assignments_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
            referencedColumns: ["id"]
          },
        ]
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
      ticket_sla_tracking: {
        Row: {
          created_at: string | null
          first_response_at: string | null
          id: string
          resolution_due_at: string | null
          resolution_sla_met: boolean | null
          resolved_at: string | null
          response_due_at: string | null
          response_sla_met: boolean | null
          sla_policy_id: string | null
          ticket_id: string | null
        }
        Insert: {
          created_at?: string | null
          first_response_at?: string | null
          id?: string
          resolution_due_at?: string | null
          resolution_sla_met?: boolean | null
          resolved_at?: string | null
          response_due_at?: string | null
          response_sla_met?: boolean | null
          sla_policy_id?: string | null
          ticket_id?: string | null
        }
        Update: {
          created_at?: string | null
          first_response_at?: string | null
          id?: string
          resolution_due_at?: string | null
          resolution_sla_met?: boolean | null
          resolved_at?: string | null
          response_due_at?: string | null
          response_sla_met?: boolean | null
          sla_policy_id?: string | null
          ticket_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ticket_sla_tracking_sla_policy_id_fkey"
            columns: ["sla_policy_id"]
            isOneToOne: false
            referencedRelation: "sla_policies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ticket_sla_tracking_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      training_modules: {
        Row: {
          category: string
          company_id: string | null
          content_url: string | null
          created_at: string | null
          description: string | null
          difficulty: string
          duration_minutes: number | null
          id: string
          is_active: boolean | null
          rating: number | null
          thumbnail_url: string | null
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          category: string
          company_id?: string | null
          content_url?: string | null
          created_at?: string | null
          description?: string | null
          difficulty: string
          duration_minutes?: number | null
          id?: string
          is_active?: boolean | null
          rating?: number | null
          thumbnail_url?: string | null
          title: string
          type: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          company_id?: string | null
          content_url?: string | null
          created_at?: string | null
          description?: string | null
          difficulty?: string
          duration_minutes?: number | null
          id?: string
          is_active?: boolean | null
          rating?: number | null
          thumbnail_url?: string | null
          title?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "training_modules_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      training_progress: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          last_accessed_at: string
          module_id: string | null
          progress: number
          started_at: string | null
          status: string
          time_spent: number
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          last_accessed_at?: string
          module_id?: string | null
          progress?: number
          started_at?: string | null
          status?: string
          time_spent?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          last_accessed_at?: string
          module_id?: string | null
          progress?: number
          started_at?: string | null
          status?: string
          time_spent?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "training_progress_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "training_modules"
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
      user_training_progress: {
        Row: {
          certification_id: string | null
          completed_at: string | null
          created_at: string | null
          id: string
          module_id: string | null
          progress_data: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          certification_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          module_id?: string | null
          progress_data?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          certification_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          module_id?: string | null
          progress_data?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_training_progress_certification_id_fkey"
            columns: ["certification_id"]
            isOneToOne: false
            referencedRelation: "certification_programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_training_progress_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "training_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          company_id: string | null
          created_at: string
          email: string
          id: string
          name: string | null
          phone: string | null
          role: string
          status: string
          subscription_status: string | null
          trial_ends_at: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          company_id?: string | null
          created_at?: string
          email: string
          id: string
          name?: string | null
          phone?: string | null
          role: string
          status: string
          subscription_status?: string | null
          trial_ends_at?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          company_id?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          phone?: string | null
          role?: string
          status?: string
          subscription_status?: string | null
          trial_ends_at?: string | null
          updated_at?: string
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
          available_for_hire: boolean | null
          company_id: string | null
          created_at: string | null
          email: string | null
          hourly_rate: number | null
          id: string | null
          is_independent: boolean | null
          last_sign_in_at: string | null
          phone: string | null
          role: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          available_for_hire?: boolean | null
          company_id?: string | null
          created_at?: string | null
          email?: string | null
          hourly_rate?: number | null
          id?: string | null
          is_independent?: boolean | null
          last_sign_in_at?: string | null
          phone?: string | null
          role?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          available_for_hire?: boolean | null
          company_id?: string | null
          created_at?: string | null
          email?: string | null
          hourly_rate?: number | null
          id?: string | null
          is_independent?: boolean | null
          last_sign_in_at?: string | null
          phone?: string | null
          role?: string | null
          status?: string | null
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
    }
    Functions: {
      assign_ticket_to_best_agent: {
        Args: { p_ticket_id: string; p_company_id: string; p_priority?: string }
        Returns: string
      }
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
        Args: { subscription_tier: string }
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
      calculate_sla_dates: {
        Args: { p_ticket_id: string; p_priority: string; p_company_id: string }
        Returns: undefined
      }
      calculate_technician_metrics: {
        Args: { p_technician_id: string }
        Returns: undefined
      }
      can_access_company: {
        Args: { p_company_id: string }
        Returns: boolean
      }
      can_access_company_data: {
        Args: { company_id: string }
        Returns: boolean
      }
      check_api_quota: {
        Args: { p_company_id: string; p_provider: string }
        Returns: boolean
      }
      check_company_technician_limits: {
        Args: { p_company_id: string }
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
        Args: { email: string; password: string }
        Returns: Json
      }
      get_api_credentials: {
        Args: { p_company_id: string; p_provider: string }
        Returns: Json
      }
      get_company_subscription_tier: {
        Args: { company_id: string }
        Returns: string
      }
      get_current_user_info: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          email: string
          created_at: string
          last_sign_in_at: string
        }[]
      }
      get_file_preview: {
        Args: { p_mime_type: string; p_file_size: number }
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
      get_technician_messages: {
        Args:
          | { p_company_id: string; p_user_id: string; p_receiver_id?: string }
          | { p_receiver_id: number }
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
        Args: { p_email: string; p_password: string }
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
        Args: { row_id: string; field_name?: string; table_name?: string }
        Returns: number
      }
      increment_view_count: {
        Args: { table_name: string; row_id: string }
        Returns: undefined
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
        Args: { p_email: string }
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
      log_file_access: {
        Args: {
          p_file_library_id: string
          p_access_type?: string
          p_ip_address?: string
          p_user_agent?: string
        }
        Returns: undefined
      }
      needs_setup: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      process_webhook_event: {
        Args: { webhook_id: string; event_type: string; payload: Json }
        Returns: Json
      }
      refresh_widget_data: {
        Args: { p_widget_id: string; p_filter_hash?: string }
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
        Args: { p_email: string }
        Returns: undefined
      }
      reset_password: {
        Args: { p_token: string; p_new_password: string }
        Returns: boolean
      }
      revoke_api_key: {
        Args: { p_key_id: string }
        Returns: boolean
      }
      safe_login: {
        Args: { user_input: string; pass_input: string }
        Returns: {
          created_at: string | null
          email: string
          id: string
          password: string
          role: string | null
          username: string
        }[]
      }
      search_file_library: {
        Args: {
          p_query?: string
          p_file_type?: string
          p_category_id?: string
          p_tags?: string[]
          p_visibility?: string
          p_limit?: number
          p_offset?: number
        }
        Returns: {
          id: string
          title: string
          description: string
          file_type: string
          tags: string[]
          download_count: number
          is_featured: boolean
          visibility: string
          category_name: string
          category_icon: string
          category_color: string
          file_name: string
          file_size: number
          file_url: string
          mime_type: string
          created_at: string
          rank: number
        }[]
      }
      search_messages: {
        Args: { p_company_id: string; p_query: string; p_limit?: number }
        Returns: {
          id: string
          content: string
          rank: number
          created_at: string
          sender_name: string
        }[]
      }
      unsafe_login: {
        Args: { user_input: string; pass_input: string }
        Returns: {
          created_at: string | null
          email: string
          id: string
          password: string
          role: string | null
          username: string
        }[]
      }
      user_can_access_company: {
        Args: { company_id: string }
        Returns: boolean
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
        Args: { p_key: string }
        Returns: {
          company_id: string
          scopes: string[]
          is_valid: boolean
        }[]
      }
      verify_email: {
        Args: { p_token: string }
        Returns: boolean
      }
    }
    Enums: {
      community_post_type:
        | "question"
        | "tech-sheet-request"
        | "wire-diagram-request"
        | "discussion"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      community_post_type: [
        "question",
        "tech-sheet-request",
        "wire-diagram-request",
        "discussion",
      ],
    },
  },
} as const
