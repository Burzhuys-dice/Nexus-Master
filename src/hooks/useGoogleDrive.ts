import { useState, useCallback } from 'react';
import { Scenario } from '../types';

export function useGoogleDrive(accessToken: string | null) {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fileId, setFileId] = useState<string | null>(null);

  const saveScenarios = useCallback(async (scenarios: Scenario[]) => {
    if (!accessToken) return false;
    setIsSaving(true);
    
    try {
      const fileContent = JSON.stringify({ scenarios });
      const metadata = {
        name: 'NexusMaster_Scenarios.json',
        mimeType: 'application/json',
      };

      const form = new FormData();
      form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      form.append('file', new Blob([fileContent], { type: 'application/json' }));

      let url = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';
      let method = 'POST';

      if (fileId) {
        url = `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=multipart`;
        method = 'PATCH';
      }

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: form,
      });

      if (!res.ok) {
        throw new Error('Failed to save to Google Drive');
      }

      const data = await res.json();
      if (!fileId && data.id) {
        setFileId(data.id);
      }
      
      console.log('Saved successfully');
      return true;
    } catch (err) {
      console.error(err);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [accessToken, fileId]);

  const loadScenarios = useCallback(async (): Promise<Scenario[] | null> => {
    if (!accessToken) return null;
    setIsLoading(true);
    
    try {
      // First, find the file
      const searchRes = await fetch(
        `https://www.googleapis.com/drive/v3/files?q=name='NexusMaster_Scenarios.json'&spaces=drive`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      
      if (!searchRes.ok) throw new Error('Failed to search files');
      const searchData = await searchRes.json();
      
      if (searchData.files && searchData.files.length > 0) {
        const id = searchData.files[0].id;
        setFileId(id);
        
        // Fetch the file content
        const contentRes = await fetch(
          `https://www.googleapis.com/drive/v3/files/${id}?alt=media`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        
        if (!contentRes.ok) throw new Error('Failed to download file');
        const content = await contentRes.json();
        return content.scenarios || null;
      }
      return null;
    } catch (err) {
      console.error(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [accessToken]);

  return { saveScenarios, loadScenarios, isSaving, isLoading };
}
