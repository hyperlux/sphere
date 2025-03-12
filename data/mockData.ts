export const mockAurovillePosts = [
  {
    id: "1",
    topicId: "t1",
    title: "Ideas for Expanding the Solar Kitchen?",
    content: "The Solar Kitchen is amazing, but with more residents, should we scale it up? Thoughts on funding and design?",
    author: "SunSeeker",
    timestamp: "2025-03-11T08:45:00Z",
    upvotes: 38,
    downvotes: 2,
    replies: [
      {
        id: "r1",
        content: "Crowdfunding could work! Maybe add a rooftop garden too?",
        author: "GreenSoul",
        timestamp: "2025-03-11T09:15:00Z",
        upvotes: 12,
        downvotes: 0,
      },
    ],
  },
  {
    id: "2",
    topicId: "t1",
    title: "Meditation Circle at Matrimandir—Timing Suggestions?",
    content: "The sunrise sessions are beautiful, but some of us prefer evenings. Can we start a dusk circle?",
    author: "InnerLight",
    timestamp: "2025-03-11T10:00:00Z",
    upvotes: 25,
    downvotes: 5,
    replies: [
      {
        id: "r2",
        content: "Evening vibes would be magical near the Banyan tree. I'm in!",
        author: "PeaceWeaver",
        timestamp: "2025-03-11T10:30:00Z",
        upvotes: 8,
        downvotes: 1,
      },
    ],
  },
  {
    id: "3",
    topicId: "t2",
    title: "Composting Workshop Next Week—Volunteers Needed!",
    content: "Planning a hands-on session at the Earth Institute. Who's joining to help teach?",
    author: "SoilSage",
    timestamp: "2025-03-11T11:20:00Z",
    upvotes: 60,
    downvotes: 1,
    replies: [],
  },
];

// Helper function to calculate net score
export const getNetScore = (post: { upvotes: number; downvotes: number }) => {
  return post.upvotes - post.downvotes;
};

// Helper function to determine if a post is trending
export const isTrendingPost = (post: { upvotes: number; downvotes: number }) => {
  return getNetScore(post) > 30;
};

// Helper function to get color based on post engagement
export const getPostEngagementColor = (post: { upvotes: number; downvotes: number }) => {
  const netScore = getNetScore(post);
  
  if (netScore > 50) return "#f8e3c5"; // Warm gold for highly upvoted
  if (netScore > 20) return "#f5f5e8"; // Light sage for positive
  if (netScore < -10) return "#f8e1e1"; // Light red for controversial
  if (netScore < 0) return "#e8f1f5"; // Cool blue for slightly negative
  
  return "#f9f9f9"; // Neutral for balanced posts
};
