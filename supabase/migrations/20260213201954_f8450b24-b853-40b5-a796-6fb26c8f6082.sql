
-- Table for users to report errors in AI coffee scan results
CREATE TABLE public.scan_error_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  coffee_id UUID NOT NULL REFERENCES public.coffees(id) ON DELETE CASCADE,
  scan_id UUID REFERENCES public.coffee_scans(id) ON DELETE SET NULL,
  suggested_edit TEXT NOT NULL,
  coffee_name TEXT,
  coffee_brand TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.scan_error_reports ENABLE ROW LEVEL SECURITY;

-- Users can insert their own reports
CREATE POLICY "Users can insert own error reports"
ON public.scan_error_reports
FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Users can view their own reports
CREATE POLICY "Users can view own error reports"
ON public.scan_error_reports
FOR SELECT
USING (user_id = auth.uid());

-- Admins can view all reports
CREATE POLICY "Admins can view all error reports"
ON public.scan_error_reports
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can delete reports
CREATE POLICY "Admins can delete error reports"
ON public.scan_error_reports
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));
