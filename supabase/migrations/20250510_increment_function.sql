
CREATE OR REPLACE FUNCTION increment(row_id uuid, table_name text, column_name text)
RETURNS int
LANGUAGE plpgsql
AS $$
DECLARE
  current_value int;
  new_value int;
BEGIN
  EXECUTE format('SELECT %I FROM %I WHERE id = $1', column_name, table_name)
  INTO current_value
  USING row_id;
  
  new_value := coalesce(current_value, 0) + 1;
  
  RETURN new_value;
END;
$$;
