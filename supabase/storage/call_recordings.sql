INSERT INTO storage.buckets (id, name, public)
VALUES ('call_recordings', 'call_recordings', true);

-- Set up storage policy to allow authenticated users to upload
CREATE POLICY "Allow authenticated users to upload recordings"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'call_recordings' AND
  auth.role() = 'authenticated'
);

-- Allow anyone to read the recordings
CREATE POLICY "Allow public to read recordings"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'call_recordings');