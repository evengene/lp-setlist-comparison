import { useState, type ReactNode } from 'react';
import { toPng } from 'html-to-image';
import { Share2, X, Copy, Check, Download } from 'lucide-react';
import type { Show } from '../types/setlist';

interface ShareButtonProps {
  show1: Show;
  show2: Show;
}

function ShareRow({
  onClick,
  disabled,
  icon,
  title,
  subtitle,
  primary,
}: {
  onClick: () => void;
  disabled?: boolean;
  icon: ReactNode;
  title: string;
  subtitle: string;
  primary?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex w-full items-center gap-3 rounded-md border p-3 text-left transition-colors disabled:opacity-50 ${
        primary ? 'border-ember/40 bg-ember/10 hover:border-ember' : 'border-line bg-ink hover:border-ash-2'
      }`}
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
          primary ? 'bg-ember text-ink' : 'bg-line text-ember'
        }`}
      >
        {icon}
      </div>
      <div>
        <div className="font-medium text-bone">{title}</div>
        <div className="font-mono text-[11px] tracking-[0.04em] text-ash">{subtitle}</div>
      </div>
    </button>
  );
}

export function ShareButton({ show1, show2 }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const shareUrl = `${window.location.origin}${window.location.pathname}?show1=${show1.id}&show2=${show2.id}`;
  const shareText = `Check out this Linkin Park setlist comparison: ${show1.name} vs ${show2.name}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert(`Failed to copy link: ${err}`);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'LP Setlist Comparison', text: shareText, url: shareUrl });
      } catch (err) {
        console.log('Share cancelled or failed:', err);
      }
    } else {
      await handleCopyLink();
    }
  };

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank', 'width=550,height=420');
  };

  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(facebookUrl, '_blank', 'width=550,height=420');
  };

  const handleDownloadImage = async () => {
    setDownloading(true);
    try {
      const element = document.getElementById('comparison-container');
      if (!element) {
        alert('Comparison not found');
        return;
      }
      const dataUrl = await toPng(element, { pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `lp-setlist-${show1.name.replace(/[^a-z0-9]/gi, '-')}-vs-${show2.name.replace(/[^a-z0-9]/gi, '-')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Failed to download image:', error);
      alert('Failed to download image');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 rounded-md bg-ember px-6 py-3 font-mono text-xs uppercase tracking-[0.1em] text-ink transition-colors hover:bg-ember-bright"
      >
        <Share2 className="h-5 w-5" />
        Share this comparison
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 p-4">
            <div className="rounded-lg border border-line bg-ink-2 p-6 text-left">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="font-display text-xl uppercase text-bone">Share comparison</h3>
                <button onClick={() => setIsOpen(false)} className="text-ash transition-colors hover:text-bone" aria-label="Close">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-2">
                <ShareRow
                  onClick={handleDownloadImage}
                  disabled={downloading}
                  icon={<Download className="h-5 w-5" />}
                  title={downloading ? 'Generating…' : 'Download as image'}
                  subtitle="Save & share anywhere"
                  primary
                />
                {'share' in navigator && (
                  <ShareRow onClick={handleNativeShare} icon={<Share2 className="h-5 w-5" />} title="Share" subtitle="Open share menu" />
                )}
                <ShareRow
                  onClick={handleTwitterShare}
                  icon={
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  }
                  title="Twitter / X"
                  subtitle="Post to your feed"
                />
                <ShareRow
                  onClick={handleFacebookShare}
                  icon={
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  }
                  title="Facebook"
                  subtitle="Share on your timeline"
                />
                <ShareRow
                  onClick={handleCopyLink}
                  icon={copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                  title={copied ? 'Link copied!' : 'Copy link'}
                  subtitle="For Discord, Instagram, TikTok, etc."
                />
              </div>

              <div className="mt-4 rounded-md border border-line bg-ink p-3">
                <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.08em] text-ash">Link</div>
                <div className="break-all font-mono text-[11px] text-bone-dim">{shareUrl}</div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
