
-- Add defense-in-depth constraints to feedback table
ALTER TABLE public.feedback
  ADD CONSTRAINT feedback_message_max_length CHECK (length(message) <= 5000),
  ADD CONSTRAINT feedback_name_max_length CHECK (name IS NULL OR length(name) <= 100),
  ADD CONSTRAINT feedback_email_max_length CHECK (email IS NULL OR length(email) <= 255),
  ADD CONSTRAINT feedback_email_format CHECK (email IS NULL OR email ~* '^[^@]+@[^@]+\.[^@]+$'),
  ADD CONSTRAINT feedback_rating_range CHECK (rating IS NULL OR (rating >= 1 AND rating <= 5)),
  ADD CONSTRAINT feedback_usage_summary_max_length CHECK (usage_summary IS NULL OR length(usage_summary) <= 10000);
