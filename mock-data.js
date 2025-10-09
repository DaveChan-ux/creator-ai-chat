// mock-data.js
// This file contains sample data for a creator's business
// In a real app, this would come from your database

const mockCreatorData = {
  // Basic creator info
  creatorInfo: {
    name: "Sarah Johnson",
    username: "@sarahjstyle",
    joinDate: "2023-01-15",
    totalFollowers: 45230
  },

  // Overview metrics (for the home screen)
  overview: {
    totalPosts: 156,
    totalImpressions: 892450,
    totalVisits: 45678,
    totalProductClicks: 12340,
    itemsSold: 890,
    totalSales: 45670.50,
    totalEarnings: 6850.58, // Commission from sales
    avgCommissionRate: 0.15 // 15% average
  },

  // Monthly trends for charts
  monthlyFollowerGrowth: [
    { month: "Apr", followers: 38200 },
    { month: "May", followers: 39850 },
    { month: "Jun", followers: 41200 },
    { month: "Jul", followers: 42900 },
    { month: "Aug", followers: 44100 },
    { month: "Sep", followers: 45230 }
  ],

  // Monthly earnings
  monthlyEarnings: [
    { month: "Apr", earnings: 4250.30 },
    { month: "May", earnings: 5120.45 },
    { month: "Jun", earnings: 5890.20 },
    { month: "Jul", earnings: 6340.15 },
    { month: "Aug", earnings: 6125.80 },
    { month: "Sep", earnings: 6850.58 }
  ],

  // Product performance data
  products: [
    {
      id: 1,
      name: "Wireless Bluetooth Headphones",
      brand: "SoundPro",
      category: "Electronics",
      price: 89.99,
      commission: 13.50,
      commissionRate: 0.15,
      unitsSold: 145,
      revenue: 13048.55,
      totalClicks: 2340,
      totalImpressions: 45670,
      conversionRate: 0.062, // 6.2%
      posts: 12,
      avgPostPerformance: "High",
      lastPostDate: "2025-09-28"
    },
    {
      id: 2,
      name: "Organic Face Serum with Vitamin C",
      brand: "GlowNaturals",
      category: "Beauty",
      price: 45.00,
      commission: 9.00,
      commissionRate: 0.20,
      unitsSold: 203,
      revenue: 9135.00,
      totalClicks: 3120,
      totalImpressions: 67890,
      conversionRate: 0.065, // 6.5%
      posts: 18,
      avgPostPerformance: "High",
      lastPostDate: "2025-10-01"
    },
    {
      id: 3,
      name: "Yoga Mat with Carrying Strap",
      brand: "FitLife",
      category: "Fitness",
      price: 35.00,
      commission: 5.25,
      commissionRate: 0.15,
      unitsSold: 187,
      revenue: 6545.00,
      totalClicks: 2890,
      totalImpressions: 52340,
      conversionRate: 0.065, // 6.5%
      posts: 15,
      avgPostPerformance: "Medium",
      lastPostDate: "2025-09-25"
    },
    {
      id: 4,
      name: "Stainless Steel Water Bottle",
      brand: "HydroMax",
      category: "Lifestyle",
      price: 28.00,
      commission: 4.20,
      commissionRate: 0.15,
      unitsSold: 234,
      revenue: 6552.00,
      totalClicks: 3450,
      totalImpressions: 78900,
      conversionRate: 0.068, // 6.8%
      posts: 20,
      avgPostPerformance: "High",
      lastPostDate: "2025-09-30"
    },
    {
      id: 5,
      name: "Summer Floral Maxi Dress",
      brand: "ChicStyle",
      category: "Fashion",
      price: 65.00,
      commission: 13.00,
      commissionRate: 0.20,
      unitsSold: 121,
      revenue: 7865.00,
      totalClicks: 1980,
      totalImpressions: 43210,
      conversionRate: 0.061, // 6.1%
      posts: 9,
      avgPostPerformance: "Medium",
      lastPostDate: "2025-09-15"
    }
  ],

  // Top performing posts
  topPosts: [
    {
      id: 101,
      title: "My Morning Skincare Routine 🌅",
      date: "2025-10-01",
      impressions: 23450,
      clicks: 1890,
      productsTagged: [2], // Face Serum
      engagement: 0.081, // 8.1%
      sales: 34
    },
    {
      id: 102,
      title: "Best Wireless Headphones Under $100 🎧",
      date: "2025-09-28",
      impressions: 19870,
      clicks: 1560,
      productsTagged: [1], // Headphones
      engagement: 0.079, // 7.9%
      sales: 28
    },
    {
      id: 103,
      title: "Stay Hydrated! My Favorite Water Bottle 💧",
      date: "2025-09-30",
      impressions: 18290,
      clicks: 1450,
      productsTagged: [4], // Water Bottle
      engagement: 0.079, // 7.9%
      sales: 42
    }
  ],

  // Analytics - Recent performance (last 30 days)
  recentAnalytics: {
    newFollowers: 1130,
    totalVisits: 12340,
    productClicks: 3890,
    itemsSold: 234,
    totalSales: 12456.80
  },

  // Top searches on the platform (what users search for)
  topSearches: [
    { term: "wireless headphones", count: 8920 },
    { term: "yoga mat", count: 7650 },
    { term: "face serum", count: 6780 },
    { term: "water bottle", count: 5430 },
    { term: "summer dress", count: 4890 }
  ]
};

// Helper function to get data based on query type
function getCreatorData(queryType) {
  switch(queryType) {
    case 'top_products':
      // Sort products by revenue and return top 3
      return mockCreatorData.products
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 3);
    
    case 'overview':
      return mockCreatorData.overview;
    
    case 'follower_growth':
      return mockCreatorData.monthlyFollowerGrowth;
    
    case 'earnings':
      return mockCreatorData.monthlyEarnings;
    
    case 'top_posts':
      return mockCreatorData.topPosts;
    
    case 'analytics':
      return mockCreatorData.recentAnalytics;
    
    default:
      return null;
  }
}

// No export needed for browser - data is available globally