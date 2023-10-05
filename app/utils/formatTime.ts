export default function formatTime(timeCreated: any) {
    var diff = Math.floor((Date.now() - timeCreated) / 1000);
    var interval = Math.floor(diff / 31536000);
  
    if (interval >= 1) {
      return interval + " years ago";
    }
    interval = Math.floor(diff / 2592000);
    if (interval >= 1) {
      return interval + " months ago";
    }
    interval = Math.floor(diff / 604800);
    if (interval >= 1) {
      return interval + " weeks ago";
    }
    interval = Math.floor(diff / 86400);
    if (interval >= 1) {
      return interval + " days ago";
    }
    interval = Math.floor(diff / 3600);
    if (interval >= 1) {
      return interval + " hours ago";
    }
    interval = Math.floor(diff / 60);
    if (interval >= 1) {
      return interval + " minutes ago";
    }
    return "Just now";
  }
  