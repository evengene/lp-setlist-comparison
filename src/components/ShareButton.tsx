import { useState } from 'react';
import { toPng } from 'html-to-image';

import { Share2, X, Copy, Check, Download } from 'lucide-react';
import type { Show } from '../types/setlist';

interface ShareButtonProps {
    show1: Show;
    show2: Show;
}

export function ShareButton({show1, show2}: ShareButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const [downloading, setDownloading] = useState(false);

    const shareUrl = `${window.location.origin}${window.location.pathname}?show1=${show1.id}&show2=${show2.id}`;
    const shareText = `Check out this Linkin Park setlist comparison: ${show1.name} vs ${show2.name}`;

    // Copy to clipboard
    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            alert('Failed to copy link');
        }
    };

    // Native share (works on mobile)
    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'LP Setlist Comparison',
                    text: shareText,
                    url: shareUrl,
                });
            } catch (err) {
                // User cancelled or error
                console.log('Share cancelled');
            }
        } else {
            // Fallback to copy
            handleCopyLink();
        }
    };

    // Twitter share
    const handleTwitterShare = () => {
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        window.open(twitterUrl, '_blank', 'width=550,height=420');
    };

    // Facebook share
    const handleFacebookShare = () => {
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        window.open(facebookUrl, '_blank', 'width=550,height=420');
    };

    // Download data as image
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
            const filename = `lp-setlist-${show1.name.replace(/[^a-z0-9]/gi, '-')}-vs-${show2.name.replace(/[^a-z0-9]/gi, '-')}.png`;
            link.download = filename;
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
        <div className="relative">
            {/* Share Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
            >
                <Share2 className="w-5 h-5"/>
                Share This Comparison
            </button>

            {/* Share Modal */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                        <div
                            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
                            onClick={() => setIsOpen(false)}
                        />

                    {/* Modal */}
                        <div
                            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  rounded-xl p-6 z-50 w-full max-w-md">
                            <div
                                className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6">

                                {/* Header */}
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-bold text-gray-900">Share Comparison</h3>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <X className="w-5 h-5"/>
                                    </button>
                                </div>

                                {/* Share Options */}
                                <div className="space-y-3">

                                    {/* Download as Image */}
                                    <button
                                        onClick={handleDownloadImage}
                                        disabled={downloading}
                                        className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 rounded-lg transition-all text-left disabled:opacity-50"
                                    >
                                        <div
                                            className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                            <Download className="w-5 h-5"/>
                                        </div>
                                        <div>
                                            <div className="font-medium">
                                                {downloading ? 'Generating...' : 'Download as Image'}
                                            </div>
                                            <div className="text-sm opacity-90">
                                                Save & share anywhere
                                            </div>
                                        </div>
                                    </button>

                                    {/* Native Share (Mobile) */}
                                    {'share' in navigator && (
                                        <button
                                            onClick={handleNativeShare}
                                            className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left"
                                        >
                                            <div
                                                className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                <Share2 className="w-5 h-5 text-blue-600"/>
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">Share</div>
                                                <div className="text-sm text-gray-500">Open share menu</div>
                                            </div>
                                        </button>
                                    )}

                                    {/* Twitter */}
                                    <button
                                        onClick={handleTwitterShare}
                                        className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left"
                                    >
                                        <div
                                            className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                            <svg className="w-5 h-5 text-blue-600" fill="currentColor"
                                                 viewBox="0 0 24 24">
                                                <path
                                                    d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                            </svg>
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900">Twitter / X</div>
                                            <div className="text-sm text-gray-500">Post to your feed</div>
                                        </div>
                                    </button>

                                    {/* Facebook */}
                                    <button
                                        onClick={handleFacebookShare}
                                        className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left"
                                    >
                                        <div
                                            className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                            <svg className="w-5 h-5 text-blue-600" fill="currentColor"
                                                 viewBox="0 0 24 24">
                                                <path
                                                    d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                            </svg>
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900">Facebook</div>
                                            <div className="text-sm text-gray-500">Share on your timeline</div>
                                        </div>
                                    </button>

                                    {/* Copy Link */}
                                    <button
                                        onClick={handleCopyLink}
                                        className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left"
                                    >
                                        <div
                                            className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                            {copied ? (
                                                <Check className="w-5 h-5 text-green-600"/>
                                            ) : (
                                                <Copy className="w-5 h-5 text-green-600"/>
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900">
                                                {copied ? 'Link Copied!' : 'Copy Link'}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                For Discord, Instagram, TikTok, etc.
                                            </div>
                                        </div>
                                    </button>
                                </div>

                                {/* URL Preview */}
                                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                    <div className="text-xs text-gray-500 mb-1">Link:</div>
                                    <div className="text-xs text-gray-700 font-mono break-all">
                                        {shareUrl}
                                    </div>
                                </div>
                            </div>
                        </div>
                </>
            )}
        </div>
    );
}