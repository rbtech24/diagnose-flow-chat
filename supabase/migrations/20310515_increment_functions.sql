
-- Create function to increment a generic counter field in any table
CREATE OR REPLACE FUNCTION increment(row_id UUID, field_name TEXT DEFAULT 'views', table_name TEXT DEFAULT 'community_posts')
RETURNS INTEGER AS $$
DECLARE
  current_value INTEGER;
  sql_query TEXT;
BEGIN
  sql_query := 'SELECT ' || quote_ident(field_name) || ' FROM ' || quote_ident(table_name) || ' WHERE id = $1';
  EXECUTE sql_query INTO current_value USING row_id;
  
  current_value := COALESCE(current_value, 0) + 1;
  
  sql_query := 'UPDATE ' || quote_ident(table_name) || ' SET ' || quote_ident(field_name) || ' = $1 WHERE id = $2';
  EXECUTE sql_query USING current_value, row_id;
  
  RETURN current_value;
END;
$$ LANGUAGE plpgsql;

-- Create function specifically for incrementing upvotes
CREATE OR REPLACE FUNCTION increment_upvotes(post_id UUID, table_name TEXT DEFAULT 'community_posts')
RETURNS void AS $$
BEGIN
  PERFORM increment(post_id, 'upvotes', table_name);
END;
$$ LANGUAGE plpgsql;
