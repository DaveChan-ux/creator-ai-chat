// agent.js
// This is the "brain" that processes user queries and generates responses
// Phase 1: Template-Based (No LLM needed)

class CreatorAssistantAgent {
  constructor(creatorData) {
    this.creatorData = creatorData;
  }

  // Main function: Process a user's question
  processQuery(userMessage) {
    // Step 1: Figure out what the user is asking about
    const intent = this.detectIntent(userMessage);
    
    // Step 2: Get the relevant data
    const data = this.fetchData(intent);
    
    // Step 3: Generate a natural-sounding response
    const response = this.generateResponse(intent, data);
    
    return response;
  }

  // Detect what the user is asking about
  // This is a simple pattern matching - looking for keywords
  detectIntent(message) {
    const lowerMessage = message.toLowerCase();
    
    // Check for different question patterns
    if (lowerMessage.includes('top product') || 
        lowerMessage.includes('best product') ||
        lowerMessage.includes('performing product')) {
      return 'top_products';
    }
    
    if (lowerMessage.includes('how am i doing') || 
        lowerMessage.includes('overview') ||
        lowerMessage.includes('summary')) {
      return 'overview';
    }
    
    if (lowerMessage.includes('follower') || 
        lowerMessage.includes('growing') ||
        lowerMessage.includes('community')) {
      return 'follower_growth';
    }
    
    if (lowerMessage.includes('earning') || 
        lowerMessage.includes('money') ||
        lowerMessage.includes('income') ||
        lowerMessage.includes('commission')) {
      return 'earnings';
    }
    
    if (lowerMessage.includes('post') && 
        (lowerMessage.includes('top') || lowerMessage.includes('best'))) {
      return 'top_posts';
    }
    
    if (lowerMessage.includes('what should i') || 
        lowerMessage.includes('what can i') ||
        lowerMessage.includes('recommendation')) {
      return 'recommendations';
    }
    
    // Default: if we don't understand, return general help
    return 'help';
  }

  // Fetch the relevant data based on what the user asked
  fetchData(intent) {
    const data = this.creatorData;
    
    switch(intent) {
      case 'top_products':
        return data.products
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 3);
      
      case 'overview':
        return data.overview;
      
      case 'follower_growth':
        const growth = data.monthlyFollowerGrowth;
        const latest = growth[growth.length - 1];
        const previous = growth[growth.length - 2];
        return {
          current: latest.followers,
          growth: latest.followers - previous.followers,
          trend: growth
        };
      
      case 'earnings':
        const earnings = data.monthlyEarnings;
        const latestEarnings = earnings[earnings.length - 1];
        const previousEarnings = earnings[earnings.length - 2];
        return {
          current: latestEarnings.earnings,
          growth: latestEarnings.earnings - previousEarnings.earnings,
          trend: earnings
        };
      
      case 'top_posts':
        return data.topPosts;
      
      case 'recommendations':
        return this.generateRecommendations();
      
      default:
        return null;
    }
  }

  // Generate recommendations based on the data
  generateRecommendations() {
    const data = this.creatorData;
    const recommendations = [];

    // Find best performing product category
    const categoryPerformance = {};
    data.products.forEach(product => {
      if (!categoryPerformance[product.category]) {
        categoryPerformance[product.category] = {
          revenue: 0,
          conversionRate: 0,
          count: 0
        };
      }
      categoryPerformance[product.category].revenue += product.revenue;
      categoryPerformance[product.category].conversionRate += product.conversionRate;
      categoryPerformance[product.category].count += 1;
    });

    // Find top category
    let topCategory = null;
    let topRevenue = 0;
    for (const [category, stats] of Object.entries(categoryPerformance)) {
      if (stats.revenue > topRevenue) {
        topRevenue = stats.revenue;
        topCategory = category;
      }
    }

    recommendations.push({
      type: 'content',
      message: `Your ${topCategory} products are performing best. Consider creating more content in this category.`
    });

    // Check posting frequency
    const totalPosts = data.overview.totalPosts;
    if (totalPosts < 200) {
      recommendations.push({
        type: 'frequency',
        message: 'Increasing your posting frequency could help you reach more followers and drive more sales.'
      });
    }

    // Check conversion rate
    const avgConversion = data.products.reduce((sum, p) => sum + p.conversionRate, 0) / data.products.length;
    if (avgConversion < 0.07) {
      recommendations.push({
        type: 'optimization',
        message: 'Your conversion rate is good but has room to grow. Try adding more product details and lifestyle shots to your posts.'
      });
    }

    return recommendations;
  }

  // Generate natural-sounding responses using templates
  generateResponse(intent, data) {
    switch(intent) {
      case 'top_products':
        return this.formatTopProductsResponse(data);
      
      case 'overview':
        return this.formatOverviewResponse(data);
      
      case 'follower_growth':
        return this.formatFollowerGrowthResponse(data);
      
      case 'earnings':
        return this.formatEarningsResponse(data);
      
      case 'top_posts':
        return this.formatTopPostsResponse(data);
      
      case 'recommendations':
        return this.formatRecommendationsResponse(data);
      
      case 'help':
      default:
        return this.formatHelpResponse();
    }
  }

  // Template: Top Products Response
  formatTopProductsResponse(products) {
    const topProduct = products[0];
    
    let response = `🎯 **Your Top Performing Products**\n\n`;
    response += `Your best seller this month is **${topProduct.name}**!\n\n`;
    response += `📊 **Performance:**\n`;
    response += `• ${topProduct.unitsSold} units sold\n`;
    response += `• $${topProduct.revenue.toLocaleString()} in total revenue\n`;
    response += `• ${(topProduct.conversionRate * 100).toFixed(1)}% conversion rate\n`;
    response += `• Featured in ${topProduct.posts} posts\n\n`;
    
    if (products.length > 1) {
      response += `**Other Top Performers:**\n`;
      for (let i = 1; i < products.length; i++) {
        const product = products[i];
        response += `${i + 1}. ${product.name} - ${product.unitsSold} units ($${product.revenue.toLocaleString()})\n`;
      }
    }
    
    response += `\n💡 **Insight:** This product is driving significant revenue. Consider creating more content featuring it!`;
    
    return response;
  }

  // Template: Overview Response
  formatOverviewResponse(data) {
    let response = `📈 **Your Business Overview**\n\n`;
    response += `Here's how your business is doing:\n\n`;
    response += `**Content & Reach:**\n`;
    response += `• ${data.totalPosts.toLocaleString()} total posts created\n`;
    response += `• ${data.totalImpressions.toLocaleString()} total impressions\n`;
    response += `• ${data.totalVisits.toLocaleString()} profile visits\n\n`;
    
    response += `**Engagement:**\n`;
    response += `• ${data.totalProductClicks.toLocaleString()} product clicks\n`;
    response += `• ${data.itemsSold.toLocaleString()} items sold\n\n`;
    
    response += `**Revenue:**\n`;
    response += `• $${data.totalSales.toLocaleString()} in total sales\n`;
    response += `• $${data.totalEarnings.toLocaleString()} earned in commissions\n`;
    response += `• ${(data.avgCommissionRate * 100).toFixed(0)}% average commission rate\n\n`;
    
    const clickToSaleRate = (data.itemsSold / data.totalProductClicks * 100).toFixed(1);
    response += `💡 **Insight:** Your ${clickToSaleRate}% click-to-sale conversion rate shows your audience trusts your recommendations!`;
    
    return response;
  }

  // Template: Follower Growth Response
  formatFollowerGrowthResponse(data) {
    const growthPercent = ((data.growth / (data.current - data.growth)) * 100).toFixed(1);
    
    let response = `👥 **Your Community Growth**\n\n`;
    response += `You currently have **${data.current.toLocaleString()} followers**\n\n`;
    response += `📊 **Recent Growth:**\n`;
    response += `• +${data.growth.toLocaleString()} new followers this month\n`;
    response += `• ${growthPercent}% growth rate\n\n`;
    
    // Show trend
    const recentTrend = data.trend.slice(-3);
    response += `**3-Month Trend:**\n`;
    recentTrend.forEach(month => {
      response += `• ${month.month}: ${month.followers.toLocaleString()} followers\n`;
    });
    
    response += `\n💡 **Insight:** `;
    if (growthPercent > 3) {
      response += `Great momentum! Your consistent posting is attracting new followers.`;
    } else {
      response += `Consider posting more consistently to accelerate your growth.`;
    }
    
    return response;
  }

  // Template: Earnings Response
  formatEarningsResponse(data) {
    const growthPercent = ((data.growth / (data.current - data.growth)) * 100).toFixed(1);
    
    let response = `💰 **Your Earnings**\n\n`;
    response += `You earned **$${data.current.toLocaleString()}** this month!\n\n`;
    response += `📊 **Performance:**\n`;
    response += `• $${data.growth.toLocaleString()} more than last month\n`;
    response += `• ${growthPercent}% growth\n\n`;
    
    // Show trend
    const recentTrend = data.trend.slice(-3);
    response += `**3-Month Trend:**\n`;
    recentTrend.forEach(month => {
      response += `• ${month.month}: $${month.earnings.toLocaleString()}\n`;
    });
    
    response += `\n💡 **Insight:** `;
    if (growthPercent > 5) {
      response += `Excellent growth! You're on track for a great year.`;
    } else {
      response += `Focus on your top-performing products to boost earnings further.`;
    }
    
    return response;
  }

  // Template: Top Posts Response
  formatTopPostsResponse(posts) {
    let response = `⭐ **Your Top Performing Posts**\n\n`;
    
    posts.forEach((post, index) => {
      response += `**${index + 1}. ${post.title}**\n`;
      response += `• ${post.impressions.toLocaleString()} impressions\n`;
      response += `• ${post.clicks.toLocaleString()} clicks (${(post.engagement * 100).toFixed(1)}% engagement)\n`;
      response += `• ${post.sales} sales generated\n\n`;
    });
    
    response += `💡 **Insight:** Posts with lifestyle imagery and clear product benefits tend to perform best!`;
    
    return response;
  }

  // Template: Recommendations Response
  formatRecommendationsResponse(recommendations) {
    let response = `🎯 **Personalized Recommendations**\n\n`;
    response += `Based on your performance data, here's what you can focus on:\n\n`;
    
    recommendations.forEach((rec, index) => {
      response += `**${index + 1}. ${rec.message}**\n\n`;
    });
    
    response += `💡 Want more specific advice? Ask me about your top products, earnings, or follower growth!`;
    
    return response;
  }

  // Template: Help Response
  formatHelpResponse() {
    let response = `👋 Hi! I'm your AI business assistant.\n\n`;
    response += `I can help you understand your creator business better. Try asking me:\n\n`;
    response += `• "How are my top products performing?"\n`;
    response += `• "How am I doing this month?"\n`;
    response += `• "How is my follower growth?"\n`;
    response += `• "What are my earnings?"\n`;
    response += `• "What are my best posts?"\n`;
    response += `• "What should I focus on?"\n\n`;
    response += `What would you like to know?`;
    
    return response;
  }
}

// No export needed for browser - class is available globally