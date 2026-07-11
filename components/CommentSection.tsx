"use client";

import { useState, useEffect } from "react";
import { CommentData } from "@/lib/api";
import { timeAgo } from "@/lib/utils";
import { MessageSquare, ThumbsUp, CornerDownRight, Reply, X } from "lucide-react";

interface CommentSectionProps {
  postSlug: string;
  postTitle: string;
  initialComments: CommentData[];
}

export default function CommentSection({
  postSlug,
  postTitle,
  initialComments,
}: CommentSectionProps) {
  const [comments, setComments] = useState<CommentData[]>(initialComments);
  
  // New comment states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  
  // Reply states
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyName, setReplyName] = useState("");
  const [replyContent, setReplyContent] = useState("");
  
  // Statuses
  const [submitting, setSubmitting] = useState(false);
  const [replySubmitting, setReplySubmitting] = useState(false);
  const [likedComments, setLikedComments] = useState<string[]>([]);
  const [error, setError] = useState("");

  // Load liked comments from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`likes_comments_${postSlug}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        setTimeout(() => {
          setLikedComments(parsed);
        }, 0);
      }
    } catch (e) {
      console.error(e);
    }
  }, [postSlug]);

  // Fetch fresh comments from API on mount
  useEffect(() => {
    async function fetchComments() {
      try {
        const res = await fetch(`/api/posts/${postSlug}/comments`);
        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data.comments)) {
            setComments(data.comments);
          }
        }
      } catch (err) {
        console.error("Failed to load comments from client", err);
      }
    }
    fetchComments();
  }, [postSlug]);

  const saveLikedComments = (newLikes: string[]) => {
    setLikedComments(newLikes);
    try {
      localStorage.setItem(`likes_comments_${postSlug}`, JSON.stringify(newLikes));
    } catch (e) {
      console.error(e);
    }
  };

  const handleLike = async (commentId: string) => {
    const isLiked = likedComments.includes(commentId);
    const method = isLiked ? "DELETE" : "POST";
    
    // Optimistic UI update
    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? { ...c, likes: c.likes + (isLiked ? -1 : 1) }
          : c
      )
    );

    if (isLiked) {
      saveLikedComments(likedComments.filter((id) => id !== commentId));
    } else {
      saveLikedComments([...likedComments, commentId]);
    }

    try {
      await fetch(`/api/posts/${postSlug}/comments/${commentId}/like`, { method });
    } catch (err) {
      console.error("Failed to toggle like", err);
      // Revert optimistic update
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId
            ? { ...c, likes: c.likes + (isLiked ? 1 : -1) }
            : c
        )
      );
      if (isLiked) {
        saveLikedComments([...likedComments, commentId]);
      } else {
        saveLikedComments(likedComments.filter((id) => id !== commentId));
      }
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) {
      setError("Name and comment are required.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch(`/api/posts/${postSlug}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author: name, email, content }),
      });

      if (!res.ok) {
        throw new Error("Failed to post comment.");
      }

      const data = await res.json();
      if (data && data.comment) {
        setComments((prev) => [data.comment, ...prev]);
        setContent("");
        // Keep name and email for next comments (UX improvement)
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Failed to submit comment. Please try again.";
      setError(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitReply = async (e: React.FormEvent, commentId: string) => {
    e.preventDefault();
    if (!replyName.trim() || !replyContent.trim()) {
      return;
    }

    setReplySubmitting(true);

    try {
      const res = await fetch(`/api/posts/${postSlug}/comments/${commentId}/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author: replyName, content: replyContent }),
      });

      if (!res.ok) {
        throw new Error();
      }

      const data = await res.json();
      if (data && data.reply) {
        setComments((prev) =>
          prev.map((c) =>
            c.id === commentId
              ? { ...c, replies: [...(c.replies || []), data.reply] }
              : c
          )
        );
        setReplyContent("");
        setReplyingToId(null);
      }
    } catch {
      alert("Failed to post reply. Please try again.");
    } finally {
      setReplySubmitting(false);
    }
  };

  const totalComments = comments.reduce(
    (acc, comment) => acc + 1 + (comment.replies?.length || 0),
    0
  );

  return (
    <section id="comments" className="bg-white rounded-xl shadow-sm p-5 sm:p-6 space-y-6">
      <div className="flex items-center gap-2 pb-3 border-b border-gray-150">
        <MessageSquare size={18} className="text-sage" />
        <h2 className="font-serif font-bold text-gray-900 text-base sm:text-lg">
          Discussion ({totalComments})
        </h2>
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmitComment} className="space-y-4">
        <h3 className="font-serif text-sm font-semibold text-gray-800">
          Leave a response to &ldquo;{postTitle}&rdquo;
        </h3>
        
        {error && <p className="text-xs text-red-500">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label htmlFor="name-input" className="block text-xs font-bold text-gray-700 mb-1">
              Name *
            </label>
            <input
              id="name-input"
              type="text"
              required
              placeholder="e.g. Jane Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-sage focus:ring-1 focus:ring-sage transition-all"
            />
          </div>
          <div>
            <label htmlFor="email-input" className="block text-xs font-bold text-gray-700 mb-1">
              Email (will not be published)
            </label>
            <input
              id="email-input"
              type="email"
              placeholder="jane@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-sage focus:ring-1 focus:ring-sage transition-all"
            />
          </div>
        </div>

        <div>
          <label htmlFor="comment-input" className="block text-xs font-bold text-gray-700 mb-1">
            Comment *
          </label>
          <textarea
            id="comment-input"
            required
            rows={4}
            maxLength={2000}
            placeholder="Share your thoughts, experiences, or questions..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-sage focus:ring-1 focus:ring-sage transition-all resize-y"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="px-5 py-2 text-xs font-bold bg-sage hover:bg-sage-hover text-white rounded-full transition-all disabled:opacity-50 cursor-pointer"
        >
          {submitting ? "Posting..." : "Post Comment"}
        </button>
      </form>

      {/* Comments List */}
      <div className="space-y-5 pt-4">
        {comments.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">
            No comments yet. Be the first to share your thoughts!
          </p>
        ) : (
          comments.map((comment) => {
            const isLiked = likedComments.includes(comment.id);
            const isReplying = replyingToId === comment.id;

            return (
              <div key={comment.id} className="space-y-3.5 border-b border-gray-100 last:border-0 pb-5 last:pb-0">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h4 className="font-bold text-gray-900 text-xs sm:text-sm font-sans">
                      {comment.author}
                    </h4>
                    <span className="text-[10px] text-gray-400">
                      {timeAgo(comment.createdAt)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleLike(comment.id)}
                      className={`flex items-center gap-1 text-[11px] font-bold cursor-pointer transition-colors ${
                        isLiked ? "text-sage" : "text-gray-450 hover:text-sage"
                      }`}
                    >
                      <ThumbsUp size={12} className={isLiked ? "fill-sage" : ""} />
                      <span>{comment.likes}</span>
                    </button>
                    <button
                      onClick={() => {
                        setReplyingToId(isReplying ? null : comment.id);
                        if (!replyName && name) setReplyName(name);
                      }}
                      className="flex items-center gap-1 text-[11px] font-bold text-gray-450 hover:text-sage transition-colors cursor-pointer"
                    >
                      <Reply size={12} />
                      <span>Reply</span>
                    </button>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-line font-sans">
                  {comment.content}
                </p>

                {/* Reply Form */}
                {isReplying && (
                  <form
                    onSubmit={(e) => handleSubmitReply(e, comment.id)}
                    className="ml-6 sm:ml-10 bg-bg-custom border border-border-custom rounded-xl p-3.5 space-y-3 animate-fade-in"
                  >
                    <div className="flex justify-between items-center pb-1.5 border-b border-border-custom/50">
                      <span className="text-xs font-bold text-gray-700 flex items-center gap-1">
                        <CornerDownRight size={12} className="text-sage" />
                        Reply to {comment.author}
                      </span>
                      <button
                        type="button"
                        onClick={() => setReplyingToId(null)}
                        className="text-gray-400 hover:text-gray-650 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <input
                          type="text"
                          required
                          placeholder="Your Name"
                          value={replyName}
                          onChange={(e) => setReplyName(e.target.value)}
                          className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg focus:outline-hidden focus:border-sage focus:ring-1 focus:ring-sage transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <textarea
                        required
                        rows={2}
                        placeholder="Write your reply..."
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg focus:outline-hidden focus:border-sage focus:ring-1 focus:ring-sage transition-all resize-y"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={replySubmitting}
                      className="px-4 py-1.5 text-xs font-bold bg-sage hover:bg-sage-hover text-white rounded-full transition-all disabled:opacity-50 cursor-pointer"
                    >
                      {replySubmitting ? "Posting..." : "Post Reply"}
                    </button>
                  </form>
                )}

                {/* Replies List */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="ml-6 sm:ml-10 mt-3 space-y-3.5 border-l-2 border-border-custom pl-4">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="space-y-1">
                        <div className="flex justify-between items-center">
                          <h5 className="font-bold text-gray-900 text-xs font-sans">
                            {reply.author}
                          </h5>
                          <span className="text-[9px] text-gray-400">
                            {timeAgo(reply.createdAt)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-650 leading-relaxed font-sans">
                          {reply.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
