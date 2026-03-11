import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Check if running in iframe
export const isIframe = typeof window !== 'undefined' && window.self !== window.top;

// Create page URL for routing
export const createPageUrl = (pageName) => {
  if (!pageName) return '/';
  
  // Handle query params in page name (e.g., "Thread?id=123")
  if (pageName.includes('?')) {
    const [page, query] = pageName.split('?');
    return `/${page}?${query}`;
  }
  
  return `/${pageName}`;
};

// Format date for display
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

// Format relative time
export const formatRelativeTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return formatDate(dateString);
};
