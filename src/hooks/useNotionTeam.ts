import { useState, useEffect } from 'react';
import { notionService, type NotionTeamMember } from '@/services/NotionService';

export const useNotionTeam = () => {
  const [teamMembers, setTeamMembers] = useState<NotionTeamMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      const members = await notionService.getTeamMembers();
      setTeamMembers(members);
    } catch (err: any) {
      setError(err.message);
      // Fallback to empty array on error
      setTeamMembers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  return {
    teamMembers,
    loading,
    error,
    refetch: fetchTeamMembers
  };
};