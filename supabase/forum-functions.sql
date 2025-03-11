-- Function to increment the view count of a topic
CREATE OR REPLACE FUNCTION increment_topic_view_count(topic_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE forum_topics
  SET view_count = view_count + 1
  WHERE id = topic_id;
END;
$$ LANGUAGE plpgsql;
