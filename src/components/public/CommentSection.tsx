"use client";

import { useState, useEffect, useCallback } from "react";
import {
  MessageSquare, Trash2, Loader2, Send, LogIn, Reply, ChevronDown, ChevronUp,
} from "lucide-react";
import Link from "next/link";
import { commentsApi, CommentDto, BookCommentsResponse } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import StarRating from "@/components/ui/StarRating";
import { Skeleton } from "@/components/ui/Skeleton";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CommentSectionProps { bookId: number; }

// ─── Inline reply / comment form ──────────────────────────────────────────────

interface InlineFormProps {
  bookId:    number;
  parentId?: number;         // undefined = top-level comment
  onSuccess: (c: CommentDto) => void;
  onCancel?: () => void;
  compact?:  boolean;
}

function InlineForm({ bookId, parentId, onSuccess, onCancel, compact }: InlineFormProps) {
  const isReply = parentId !== undefined;
  const [text,   setText]   = useState("");
  const [rating, setRating] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim().length < 3) { setError("حداقل ۳ کاراکتر بنویسید"); return; }
    setError("");
    setSaving(true);
    try {
      const comment = await commentsApi.create(bookId, {
        text:     text.trim(),
        rating:   (!isReply && rating > 0) ? rating : undefined,
        parentId: parentId,
      });
      onSuccess(comment);
      setText("");
      setRating(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا در ارسال");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`${compact ? "bg-parchment/60 rounded-xl p-4 border border-border" : "card border-2 border-border focus-within:border-crimson/30 transition-colors"}`}
    >
      {!compact && <h3 className="font-bold text-navy mb-4">نظر خود را بنویسید</h3>}

      {/* Star rating — only for top-level comments */}
      {!isReply && (
        <div className="flex items-center gap-3 mb-3">
          <span className="text-sm text-navy-muted">امتیاز (اختیاری):</span>
          <StarRating value={rating} onChange={setRating} size={compact ? 18 : 22} />
          {rating > 0 && (
            <button type="button" onClick={() => setRating(0)} className="text-xs text-navy-muted hover:text-crimson">
              پاک
            </button>
          )}
        </div>
      )}

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={isReply ? "پاسخ خود را بنویسید..." : "نظر، پیشنهاد یا انتقاد خود را بنویسید..."}
        rows={compact ? 2 : 4}
        maxLength={1000}
        className="input-field resize-none mb-1 leading-7 w-full"
        disabled={saving}
        autoFocus={compact}
      />

      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-2">
          <button
            type="submit"
            disabled={saving || text.trim().length < 3}
            className="btn-primary text-sm flex items-center gap-1.5 disabled:opacity-60 py-2 px-4"
          >
            {saving
              ? <><Loader2 size={14} className="animate-spin" />ارسال...</>
              : <><Send size={14} />{isReply ? "ارسال پاسخ" : "ثبت نظر"}</>}
          </button>
          {onCancel && (
            <button type="button" onClick={onCancel} className="btn-ghost text-sm py-2 px-4">
              انصراف
            </button>
          )}
        </div>
        <span className="text-xs text-navy-muted">{text.length}/۱۰۰۰</span>
      </div>
      {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
    </form>
  );
}

// ─── Reply card (compact) ─────────────────────────────────────────────────────

function ReplyCard({
  reply,
  onDelete,
  isAdmin,
}: {
  reply:    CommentDto;
  onDelete: (id: number) => void;
  isAdmin:  boolean;
}) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("این پاسخ حذف شود؟")) return;
    setDeleting(true);
    try { await commentsApi.delete(reply.id); onDelete(reply.id); }
    catch (e) { console.error(e); }
    finally { setDeleting(false); }
  };

  return (
    <div className="flex gap-3 group">
      {/* Thread line */}
      <div className="flex flex-col items-center">
        <div className="w-px flex-1 bg-border mt-1" />
      </div>

      <div className="flex-1 bg-parchment/50 rounded-xl p-3 border border-border/60 mb-2">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-crimson-light border border-crimson/20 flex items-center justify-center text-crimson text-xs font-bold shrink-0">
              {reply.userName[0]}
            </div>
            <div>
              <span className="font-semibold text-navy text-xs">{reply.userName}</span>
              <span className="text-navy-muted text-xs mr-2">{reply.createdAt}</span>
            </div>
          </div>
          {(reply.isOwner || isAdmin) && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded text-navy-muted hover:text-red-500 hover:bg-red-50"
            >
              {deleting ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
            </button>
          )}
        </div>
        <p className="text-navy-muted text-sm leading-relaxed">{reply.text}</p>
      </div>
    </div>
  );
}

// ─── Top-level comment card ───────────────────────────────────────────────────

function CommentCard({
  comment,
  bookId,
  onDelete,
  onReplyAdded,
  isAdmin,
  isAuthenticated,
}: {
  comment:         CommentDto;
  bookId:          number;
  onDelete:        (id: number) => void;
  onReplyAdded:    (commentId: number, reply: CommentDto) => void;
  isAdmin:         boolean;
  isAuthenticated: boolean;
}) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReplies,   setShowReplies]   = useState(true);
  const [deleting,      setDeleting]      = useState(false);
  const replyCount = comment.replies?.length ?? 0;

  const handleDelete = async () => {
    if (!confirm("این نظر و تمام پاسخ‌هایش حذف شود؟")) return;
    setDeleting(true);
    try { await commentsApi.delete(comment.id); onDelete(comment.id); }
    catch (e) { console.error(e); }
    finally { setDeleting(false); }
  };

  const handleReplySuccess = (reply: CommentDto) => {
    onReplyAdded(comment.id, reply);
    setShowReplyForm(false);
    setShowReplies(true);
  };

  const handleDeleteReply = (replyId: number) => {
    onDelete(replyId);   // parent handles filtering from nested list
  };

  return (
    <div className="card group hover:border-border/80 transition-all">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-full bg-crimson-light border border-crimson/20 flex items-center justify-center text-crimson font-bold text-sm shrink-0">
            {comment.userName[0]}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-navy text-sm">{comment.userName}</p>
            <p className="text-xs text-navy-muted">{comment.createdAt}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {comment.rating && <StarRating value={comment.rating} readonly size={14} />}
          {(comment.isOwner || isAdmin) && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg text-navy-muted hover:text-red-500 hover:bg-red-50 disabled:opacity-40"
              title="حذف نظر"
            >
              {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
            </button>
          )}
        </div>
      </div>

      {/* Body */}
      <p className="text-navy-muted text-sm leading-relaxed mt-3 pr-12">{comment.text}</p>

      {/* Actions row */}
      <div className="flex items-center gap-3 mt-3 pr-12">
        {isAuthenticated && (
          <button
            onClick={() => setShowReplyForm(v => !v)}
            className="flex items-center gap-1.5 text-xs text-navy-muted hover:text-crimson transition-colors font-medium"
          >
            <Reply size={13} />
            پاسخ
          </button>
        )}
        {replyCount > 0 && (
          <button
            onClick={() => setShowReplies(v => !v)}
            className="flex items-center gap-1 text-xs text-navy-muted hover:text-navy transition-colors"
          >
            {showReplies ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            {replyCount} پاسخ
          </button>
        )}
      </div>

      {/* Replies */}
      {showReplies && replyCount > 0 && (
        <div className="mt-4 pr-9 space-y-1">
          {comment.replies.map((reply) => (
            <ReplyCard
              key={reply.id}
              reply={reply}
              onDelete={handleDeleteReply}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      )}

      {/* Inline reply form */}
      {showReplyForm && (
        <div className="mt-4 pr-9">
          <InlineForm
            bookId={bookId}
            parentId={comment.id}
            onSuccess={handleReplySuccess}
            onCancel={() => setShowReplyForm(false)}
            compact
          />
        </div>
      )}
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function CommentSkeleton() {
  return (
    <div className="card space-y-3 animate-pulse">
      <div className="flex items-center gap-3">
        <Skeleton className="w-9 h-9 rounded-full shrink-0" />
        <div className="space-y-1.5 flex-1">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-4 w-20 shrink-0" />
      </div>
      <Skeleton className="h-4 w-full mr-12" />
      <Skeleton className="h-4 w-3/4 mr-12" />
      <div className="pr-12 flex gap-3 mt-1">
        <Skeleton className="h-4 w-12" />
      </div>
    </div>
  );
}

// ─── Main CommentSection ──────────────────────────────────────────────────────

export default function CommentSection({ bookId }: CommentSectionProps) {
  const { isAuthenticated, isAdmin } = useAuth();
  const [data,    setData]    = useState<BookCommentsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const loadComments = useCallback(async () => {
    try {
      const res = await commentsApi.getByBook(bookId);
      setData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [bookId]);

  useEffect(() => { loadComments(); }, [loadComments]);

  // Add new top-level comment
  const handleNewComment = (comment: CommentDto) => {
    setData(prev => prev
      ? { ...prev, comments: [comment, ...prev.comments], totalCount: prev.totalCount + 1 }
      : { comments: [comment], totalCount: 1, totalReplies: 0 }
    );
  };

  // Add reply to a specific comment
  const handleReplyAdded = (commentId: number, reply: CommentDto) => {
    setData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        totalReplies: prev.totalReplies + 1,
        comments: prev.comments.map(c =>
          c.id === commentId
            ? { ...c, replies: [...(c.replies ?? []), reply] }
            : c
        ),
      };
    });
  };

  // Delete top-level comment OR a reply
  const handleDelete = (id: number) => {
    setData(prev => {
      if (!prev) return prev;
      // Check if it's a top-level comment
      const isTopLevel = prev.comments.some(c => c.id === id);
      if (isTopLevel) {
        const deleted = prev.comments.find(c => c.id === id);
        return {
          ...prev,
          comments:    prev.comments.filter(c => c.id !== id),
          totalCount:  prev.totalCount - 1,
          totalReplies: prev.totalReplies - (deleted?.replies?.length ?? 0),
        };
      }
      // It's a reply — remove from nested
      return {
        ...prev,
        totalReplies: prev.totalReplies - 1,
        comments: prev.comments.map(c => ({
          ...c,
          replies: (c.replies ?? []).filter(r => r.id !== id),
        })),
      };
    });
  };

  const totalComments = (data?.totalCount ?? 0) + (data?.totalReplies ?? 0);

  return (
    <section className="mt-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="section-title">نظرات کاربران</h2>
          {!loading && data && (
            <span className="badge bg-parchment text-navy-muted">{totalComments} نظر</span>
          )}
        </div>
        {!loading && data?.averageRating && (
          <div className="flex items-center gap-2">
            <StarRating value={Math.round(data.averageRating)} readonly size={16} />
            <span className="text-sm font-bold text-navy">{data.averageRating}</span>
            <span className="text-xs text-navy-muted">از ۵</span>
          </div>
        )}
      </div>

      {/* Top-level comment form or login prompt */}
      <div className="mb-8">
        {isAuthenticated ? (
          <InlineForm bookId={bookId} onSuccess={handleNewComment} />
        ) : (
          <div className="card flex items-center justify-between gap-4">
            <div>
              <p className="font-medium text-navy text-sm">می‌خواهید نظر بدهید؟</p>
              <p className="text-navy-muted text-xs mt-0.5">برای ثبت نظر وارد حساب کاربری شوید</p>
            </div>
            <Link
              href={`/auth/login?redirect=/book/${bookId}`}
              className="btn-primary text-sm flex items-center gap-2 shrink-0"
            >
              <LogIn size={15} />ورود
            </Link>
          </div>
        )}
      </div>

      {/* Comment list */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <CommentSkeleton key={i} />)}
        </div>
      ) : !data || data.comments.length === 0 ? (
        <div className="text-center py-12 bg-parchment rounded-xl border border-border">
          <MessageSquare size={36} className="text-border mx-auto mb-3" />
          <p className="font-medium text-navy-muted">هنوز نظری ثبت نشده</p>
          <p className="text-sm text-navy-muted/60 mt-1">اولین نفری باشید که نظر می‌دهد</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.comments.map(comment => (
            <CommentCard
              key={comment.id}
              comment={comment}
              bookId={bookId}
              onDelete={handleDelete}
              onReplyAdded={handleReplyAdded}
              isAdmin={isAdmin}
              isAuthenticated={isAuthenticated}
            />
          ))}
        </div>
      )}
    </section>
  );
}
