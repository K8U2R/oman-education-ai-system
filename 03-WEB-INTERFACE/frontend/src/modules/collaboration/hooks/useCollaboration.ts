import { useState, useCallback } from 'react';
import { TeamMember } from '../components/TeamMember';
import { Comment } from '../components/CommentsPanel';
import { Cursor } from '../components/LiveCursors';

export function useCollaboration() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [cursors, setCursors] = useState<Cursor[]>([]);

  const addComment = useCallback((content: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      author: 'أنت',
      content,
      timestamp: new Date(),
    };
    setComments((prev) => [...prev, newComment]);
  }, []);

  const replyToComment = useCallback((commentId: string, content: string) => {
    setComments((prev) =>
      prev.map((comment) => {
        if (comment.id === commentId) {
          const reply: Comment = {
            id: Date.now().toString(),
            author: 'أنت',
            content,
            timestamp: new Date(),
          };
          return {
            ...comment,
            replies: [...(comment.replies || []), reply],
          };
        }
        return comment;
      })
    );
  }, []);

  const updateCursor = useCallback((cursor: Cursor) => {
    setCursors((prev) => {
      const existing = prev.findIndex((c) => c.id === cursor.id);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = cursor;
        return updated;
      }
      return [...prev, cursor];
    });
  }, []);

  return {
    teamMembers,
    comments,
    cursors,
    setTeamMembers,
    addComment,
    replyToComment,
    updateCursor,
  };
}

