import React, { useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Avatar from '@/components/ui/Avatar';
import { formatRelativeTime } from '@/utils/helpers';

export interface Comment {
  id: string;
  author: string;
  avatar?: string;
  content: string;
  timestamp: Date;
  replies?: Comment[];
}

interface CommentsPanelProps {
  comments: Comment[];
  onAddComment?: (content: string) => void;
  onReply?: (commentId: string, content: string) => void;
}

const CommentsPanel: React.FC<CommentsPanelProps> = ({
  comments,
  onAddComment,
  onReply,
}) => {
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  const handleSubmit = () => {
    if (newComment.trim()) {
      onAddComment?.(newComment);
      setNewComment('');
    }
  };

  const handleReply = (commentId: string) => {
    if (replyContent.trim()) {
      onReply?.(commentId, replyContent);
      setReplyContent('');
      setReplyingTo(null);
    }
  };

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="w-5 h-5 text-ide-accent" />
        <h2 className="text-lg font-semibold">التعليقات</h2>
        <span className="text-sm text-ide-text-secondary">({comments.length})</span>
      </div>

      <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
        {comments.map((comment) => (
          <div key={comment.id} className="border-b border-ide-border pb-4 last:border-0">
            <div className="flex gap-3">
              <Avatar name={comment.author} size="sm" src={comment.avatar} />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{comment.author}</span>
                  <span className="text-xs text-ide-text-secondary">
                    {formatRelativeTime(comment.timestamp)}
                  </span>
                </div>
                <p className="text-sm text-ide-text mb-2">{comment.content}</p>
                <button
                  onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                  className="text-xs text-ide-accent hover:underline"
                >
                  رد
                </button>
                {replyingTo === comment.id && (
                  <div className="mt-2 flex gap-2">
                    <Input
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="اكتب ردك..."
                      size="sm"
                    />
                    <Button size="sm" onClick={() => handleReply(comment.id)}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                )}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="mt-3 mr-4 space-y-2">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="flex gap-2">
                        <Avatar name={reply.author} size="xs" src={reply.avatar} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-xs">{reply.author}</span>
                            <span className="text-xs text-ide-text-secondary">
                              {formatRelativeTime(reply.timestamp)}
                            </span>
                          </div>
                          <p className="text-xs text-ide-text">{reply.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="اكتب تعليقاً..."
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />
        <Button onClick={handleSubmit}>
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
};

export default CommentsPanel;

