"use client";

import { useState, useEffect } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";

interface PostLikeDislikeProps {
  postSlug: string;
}

export default function PostLikeDislike({ postSlug }: PostLikeDislikeProps) {
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [userAction, setUserAction] = useState<"liked" | "disliked" | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user vote from localStorage and stats from API on mount
  useEffect(() => {
    async function loadStats() {
      try {
        const savedAction = localStorage.getItem(`post_action_${postSlug}`);
        if (savedAction === "liked" || savedAction === "disliked") {
          setUserAction(savedAction);
        }

        const res = await fetch(`/api/posts/${postSlug}/likes`);
        if (res.ok) {
          const data = await res.json();
          setLikes(data.likes ?? 0);
          setDislikes(data.dislikes ?? 0);
        }
      } catch (err) {
        console.error("Failed to load post reaction stats", err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, [postSlug]);

  const saveAction = (action: "liked" | "disliked" | null) => {
    setUserAction(action);
    try {
      if (action) {
        localStorage.setItem(`post_action_${postSlug}`, action);
      } else {
        localStorage.removeItem(`post_action_${postSlug}`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleLike = async () => {
    if (loading) return;

    // Optimistic UI updates
    let updatedLikes = likes;
    let updatedDislikes = dislikes;
    let nextAction: "liked" | "disliked" | null = null;

    if (userAction === "liked") {
      // Toggle off like
      updatedLikes = Math.max(0, likes - 1);
      nextAction = null;
      setLikes(updatedLikes);
      saveAction(nextAction);
      
      try {
        await fetch(`/api/posts/${postSlug}/likes`, { method: "DELETE" });
      } catch (err) {
        console.error(err);
      }
    } else if (userAction === "disliked") {
      // Toggle off dislike, then toggle on like
      updatedDislikes = Math.max(0, dislikes - 1);
      updatedLikes = likes + 1;
      nextAction = "liked";
      setLikes(updatedLikes);
      setDislikes(updatedDislikes);
      saveAction(nextAction);

      try {
        await fetch(`/api/posts/${postSlug}/dislikes`, { method: "DELETE" });
        await fetch(`/api/posts/${postSlug}/likes`, { method: "POST" });
      } catch (err) {
        console.error(err);
      }
    } else {
      // Toggle on like
      updatedLikes = likes + 1;
      nextAction = "liked";
      setLikes(updatedLikes);
      saveAction(nextAction);

      try {
        await fetch(`/api/posts/${postSlug}/likes`, { method: "POST" });
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleDislike = async () => {
    if (loading) return;

    // Optimistic UI updates
    let updatedLikes = likes;
    let updatedDislikes = dislikes;
    let nextAction: "liked" | "disliked" | null = null;

    if (userAction === "disliked") {
      // Toggle off dislike
      updatedDislikes = Math.max(0, dislikes - 1);
      nextAction = null;
      setDislikes(updatedDislikes);
      saveAction(nextAction);

      try {
        await fetch(`/api/posts/${postSlug}/dislikes`, { method: "DELETE" });
      } catch (err) {
        console.error(err);
      }
    } else if (userAction === "liked") {
      // Toggle off like, then toggle on dislike
      updatedLikes = Math.max(0, likes - 1);
      updatedDislikes = dislikes + 1;
      nextAction = "disliked";
      setLikes(updatedLikes);
      setDislikes(updatedDislikes);
      saveAction(nextAction);

      try {
        await fetch(`/api/posts/${postSlug}/likes`, { method: "DELETE" });
        await fetch(`/api/posts/${postSlug}/dislikes`, { method: "POST" });
      } catch (err) {
        console.error(err);
      }
    } else {
      // Toggle on dislike
      updatedDislikes = dislikes + 1;
      nextAction = "disliked";
      setDislikes(updatedDislikes);
      saveAction(nextAction);

      try {
        await fetch(`/api/posts/${postSlug}/dislikes`, { method: "POST" });
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="bg-white border border-border-custom rounded-xl p-4 sm:p-5 flex items-center justify-between gap-4">
      <div className="text-xs sm:text-sm font-serif font-bold text-gray-800">
        Was this article helpful to your manifestion journey?
      </div>

      <div className="flex items-center gap-2">
        {/* Like Button */}
        <button
          onClick={handleLike}
          disabled={loading}
          className={`px-4 py-2 rounded-full border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            userAction === "liked"
              ? "bg-sage border-sage text-white shadow-xs"
              : "border-gray-200 text-gray-650 hover:border-sage hover:text-sage bg-transparent"
          }`}
          aria-label="Like this post"
        >
          <ThumbsUp size={13} className={userAction === "liked" ? "fill-white" : ""} />
          <span>{likes}</span>
        </button>

        {/* Dislike Button */}
        <button
          onClick={handleDislike}
          disabled={loading}
          className={`px-4 py-2 rounded-full border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            userAction === "disliked"
              ? "bg-sand border-sand text-white shadow-xs"
              : "border-gray-200 text-gray-650 hover:border-sand hover:text-sand bg-transparent"
          }`}
          aria-label="Dislike this post"
        >
          <ThumbsDown size={13} className={userAction === "disliked" ? "fill-white" : ""} />
          <span>{dislikes}</span>
        </button>
      </div>
    </div>
  );
}
