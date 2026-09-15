import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Heart,
  MessageCircle,
  Share2,
  Send,
  Tag,
  PlusCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Feed() {
  const { feedPosts, user, createFeedPost, toggleLikePost } = useApp();
  const [newPostText, setNewPostText] = useState('');
  const [selectedTag, setSelectedTag] = useState('#SkillSwap');
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);
  const [commentText, setCommentText] = useState('');

  const availableTags = ['#SkillSwap', '#LearnByTeaching', '#PythonAI', '#UIUXDesign', '#Frontend'];

  const handleSubmitPost = (e) => {
    e.preventDefault();
    if (!newPostText.trim()) return;
    createFeedPost(newPostText, [selectedTag]);
    setNewPostText('');
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-20 px-4">
      <div className="container mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Peer Community
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-foreground mt-1">
            Skill Exchange Feed
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Share what you want to learn, offer mentorship, and connect with fellow builders.
          </p>
        </div>

        {/* Create Post Card */}
        <div className="rounded-3xl border border-border/80 bg-card p-5 sm:p-6 mb-8 shadow-xl">
          <form onSubmit={handleSubmitPost} className="space-y-4">
            <div className="flex items-start gap-3">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover ring-1 ring-border shrink-0"
              />
              <textarea
                rows={3}
                required
                placeholder="What skill are you looking to learn or teach today?"
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
                className="w-full bg-secondary/50 border border-border rounded-2xl p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border/60">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {availableTags.map((tag) => (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors border ${
                      selectedTag === tag
                        ? 'bg-primary/15 text-primary border-primary/30'
                        : 'bg-secondary/60 text-muted-foreground border-border hover:text-foreground'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                disabled={!newPostText.trim()}
                className="px-5 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:bg-primary/90 transition-all shadow-md shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 ml-auto"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post to Community</span>
              </button>
            </div>
          </form>
        </div>

        {/* Feed Posts List */}
        <div className="space-y-6">
          {feedPosts.map((post) => (
            <div
              key={post.id}
              className="rounded-3xl border border-border/80 bg-card p-5 sm:p-6 shadow-md hover:border-primary/40 transition-colors"
            >
              {/* Post Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={post.authorAvatar}
                    alt={post.authorName}
                    className="w-10 h-10 rounded-full object-cover ring-1 ring-border"
                  />
                  <div>
                    <h3 className="font-display font-bold text-sm text-foreground">
                      {post.authorName}
                    </h3>
                    <p className="text-[11px] text-muted-foreground">
                      {post.authorTitle} • {post.timeAgo}
                    </p>
                  </div>
                </div>

                <Link
                  to="/chat"
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Message
                </Link>
              </div>

              {/* Content */}
              <p className="text-sm text-foreground/90 leading-relaxed mb-4">
                {post.content}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-primary border border-border/60"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Post Actions */}
              <div className="pt-3 border-t border-border/60 flex items-center gap-6 text-xs text-muted-foreground">
                <button
                  onClick={() => toggleLikePost(post.id)}
                  className={`flex items-center gap-1.5 transition-colors ${
                    post.isLiked ? 'text-red-400 font-semibold' : 'hover:text-foreground'
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 ${post.isLiked ? 'fill-red-400 text-red-400' : ''}`}
                  />
                  <span>{post.likes}</span>
                </button>

                <button
                  onClick={() =>
                    setActiveCommentPostId(
                      activeCommentPostId === post.id ? null : post.id
                    )
                  }
                  className="flex items-center gap-1.5 hover:text-foreground transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{post.comments.length} comments</span>
                </button>
              </div>

              {/* Comments Section */}
              {activeCommentPostId === post.id && (
                <div className="mt-4 pt-4 border-t border-border/60 space-y-3">
                  {post.comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="p-3 rounded-2xl bg-secondary/40 text-xs space-y-1"
                    >
                      <span className="font-bold text-foreground">{comment.author}: </span>
                      <span className="text-muted-foreground">{comment.text}</span>
                    </div>
                  ))}

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Write a reply..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-xl bg-secondary/60 border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <button
                      onClick={() => {
                        if (!commentText.trim()) return;
                        post.comments.push({
                          id: `c-${Date.now()}`,
                          author: user.name,
                          text: commentText,
                        });
                        setCommentText('');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90"
                    >
                      Reply
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
