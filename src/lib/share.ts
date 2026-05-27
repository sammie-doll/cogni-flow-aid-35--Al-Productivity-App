import { toast } from "sonner";

export interface ShareTarget {
  title: string;
  text: string;
  url?: string;
}

export function copyLink(url: string) {
  navigator.clipboard.writeText(url).then(
    () => toast.success("Link copied to clipboard"),
    () => toast.error("Could not copy link"),
  );
}

export function shareUrls({ title, text, url }: ShareTarget) {
  const u = encodeURIComponent(url || (typeof location !== "undefined" ? location.href : ""));
  const t = encodeURIComponent(text);
  const ttl = encodeURIComponent(title);
  return {
    whatsapp: `https://wa.me/?text=${t}%20${u}`,
    x: `https://twitter.com/intent/tweet?text=${t}&url=${u}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
    telegram: `https://t.me/share/url?url=${u}&text=${t}`,
    email: `mailto:?subject=${ttl}&body=${t}%20${u}`,
  };
}

export async function nativeShare(t: ShareTarget) {
  if (navigator.share) {
    try {
      await navigator.share(t);
      return true;
    } catch {
      return false;
    }
  }
  return false;
}
