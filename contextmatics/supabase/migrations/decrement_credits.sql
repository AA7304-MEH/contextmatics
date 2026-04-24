CREATE OR REPLACE FUNCTION decrement_credits(user_id uuid, amount int)
RETURNS int LANGUAGE plpgsql AS $$
DECLARE new_balance int;
BEGIN
  UPDATE profiles SET credits_remaining = credits_remaining - amount
  WHERE id = user_id AND credits_remaining >= amount
  RETURNING credits_remaining INTO new_balance;
  IF NOT FOUND THEN RAISE EXCEPTION 'INSUFFICIENT_CREDITS'; END IF;
  RETURN new_balance;
END; $$;
