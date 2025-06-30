export interface TravelPreferences {
  budget: 'budget' | 'mid-range' | 'luxury';
  duration: number; // days
  interests: string[];
  travelers: number;
  travelStyle: 'relaxed' | 'moderate' | 'packed';
}

export interface Itinerary {
  day: number;
  title: string;
  activities: Activity[];
  estimatedCost: number;
  tips: string[];
}

export interface Activity {
  time: string;
  name: string;
  description: string;
  duration: string;
  cost: number;
  category: 'sightseeing' | 'food' | 'shopping' | 'culture' | 'adventure' | 'transport';
}

export class ItineraryService {
  private destinationData = {
    'jaipur': {
      name: 'Jaipur',
      activities: [
        { name: 'Amber Fort', duration: '3 hours', cost: 200, category: 'sightseeing' as const, description: 'Magnificent hilltop fort with elephant rides' },
        { name: 'City Palace', duration: '2 hours', cost: 100, category: 'culture' as const, description: 'Royal residence with museums and courtyards' },
        { name: 'Hawa Mahal', duration: '1 hour', cost: 50, category: 'sightseeing' as const, description: 'Iconic pink palace facade' },
        { name: 'Johari Bazaar', duration: '2 hours', cost: 1000, category: 'shopping' as const, description: 'Traditional jewelry and textile market' },
        { name: 'Dal Baati Churma', duration: '1 hour', cost: 300, category: 'food' as const, description: 'Traditional Rajasthani meal' },
        { name: 'Nahargarh Fort', duration: '2 hours', cost: 50, category: 'sightseeing' as const, description: 'Best sunset views of the city' }
      ],
      dailyBudget: { budget: 1500, 'mid-range': 3000, luxury: 6000 },
      transportation: { local: 500, airport: 800 }
    },
    'delhi': {
      name: 'Delhi',
      activities: [
        { name: 'Red Fort', duration: '2 hours', cost: 50, category: 'sightseeing' as const, description: 'Historic Mughal fortress' },
        { name: 'India Gate', duration: '1 hour', cost: 0, category: 'sightseeing' as const, description: 'War memorial and gardens' },
        { name: 'Chandni Chowk', duration: '3 hours', cost: 500, category: 'food' as const, description: 'Street food and shopping paradise' },
        { name: 'Lotus Temple', duration: '1 hour', cost: 0, category: 'culture' as const, description: 'Architectural marvel and meditation' },
        { name: 'Qutub Minar', duration: '1.5 hours', cost: 30, category: 'sightseeing' as const, description: 'UNESCO World Heritage site' },
        { name: 'Khan Market', duration: '2 hours', cost: 800, category: 'shopping' as const, description: 'Upscale shopping and dining' }
      ],
      dailyBudget: { budget: 1200, 'mid-range': 2500, luxury: 5000 },
      transportation: { local: 400, airport: 600 }
    },
    'mumbai': {
      name: 'Mumbai',
      activities: [
        { name: 'Gateway of India', duration: '1 hour', cost: 0, category: 'sightseeing' as const, description: 'Iconic waterfront monument' },
        { name: 'Elephanta Caves', duration: '4 hours', cost: 300, category: 'culture' as const, description: 'Ancient rock-cut temples (includes ferry)' },
        { name: 'Marine Drive', duration: '1 hour', cost: 0, category: 'sightseeing' as const, description: 'Evening promenade walk' },
        { name: 'Colaba Causeway', duration: '2 hours', cost: 800, category: 'shopping' as const, description: 'Street shopping and cafes' },
        { name: 'Vada Pav Tour', duration: '2 hours', cost: 200, category: 'food' as const, description: 'Mumbai street food experience' },
        { name: 'Film City Tour', duration: '4 hours', cost: 1200, category: 'culture' as const, description: 'Bollywood studio experience' }
      ],
      dailyBudget: { budget: 1800, 'mid-range': 3500, luxury: 7000 },
      transportation: { local: 200, airport: 400 }
    }
  };

  generateItinerary(destination: string, preferences: TravelPreferences): string {
    const destData = this.destinationData[destination.toLowerCase() as keyof typeof this.destinationData];
    
    if (!destData) {
      return this.generateGenericItinerary(destination, preferences);
    }

    const dailyBudget = destData.dailyBudget[preferences.budget];
    const itineraries = this.createDayPlans(destData, preferences, dailyBudget);
    
    return this.formatItinerary(destination, preferences, itineraries, dailyBudget);
  }

  private createDayPlans(destData: any, preferences: TravelPreferences, dailyBudget: number): Itinerary[] {
    const itineraries: Itinerary[] = [];
    const activities = [...destData.activities];
    
    for (let day = 1; day <= preferences.duration; day++) {
      const dayActivities: Activity[] = [];
      let dayBudget = dailyBudget * 0.8; // 80% for activities, 20% buffer
      let currentTime = 9; // Start at 9 AM

      // Morning activity (sightseeing/culture)
      const morningActivities = activities.filter(a => 
        ['sightseeing', 'culture'].includes(a.category) && a.cost <= dayBudget
      );
      if (morningActivities.length > 0) {
        const activity = morningActivities[Math.floor(Math.random() * morningActivities.length)];
        dayActivities.push({
          time: `${currentTime}:00 AM`,
          name: activity.name,
          description: activity.description,
          duration: activity.duration,
          cost: activity.cost,
          category: activity.category
        });
        dayBudget -= activity.cost;
        currentTime += parseInt(activity.duration.split(' ')[0]);
      }

      // Lunch
      if (currentTime >= 12) {
        const foodActivity = activities.find(a => a.category === 'food');
        if (foodActivity && foodActivity.cost <= dayBudget) {
          dayActivities.push({
            time: `${currentTime}:00 PM`,
            name: foodActivity.name,
            description: foodActivity.description,
            duration: foodActivity.duration,
            cost: foodActivity.cost,
            category: foodActivity.category
          });
          dayBudget -= foodActivity.cost;
          currentTime += 1;
        }
      }

      // Afternoon activity
      const afternoonActivities = activities.filter(a => 
        !dayActivities.some(da => da.name === a.name) && a.cost <= dayBudget
      );
      if (afternoonActivities.length > 0) {
        const activity = afternoonActivities[Math.floor(Math.random() * afternoonActivities.length)];
        dayActivities.push({
          time: `${currentTime}:00 PM`,
          name: activity.name,
          description: activity.description,
          duration: activity.duration,
          cost: activity.cost,
          category: activity.category
        });
        dayBudget -= activity.cost;
      }

      const totalCost = dayActivities.reduce((sum, a) => sum + a.cost, 0);
      
      itineraries.push({
        day,
        title: `Day ${day} - ${destData.name} Exploration`,
        activities: dayActivities,
        estimatedCost: totalCost,
        tips: this.getDayTips(day, preferences.travelStyle)
      });
    }

    return itineraries;
  }

  private getDayTips(day: number, style: string): string[] {
    const baseTips = [
      'Start early to avoid crowds',
      'Carry water and snacks',
      'Wear comfortable shoes',
      'Keep emergency contacts handy'
    ];

    const styleTips = {
      relaxed: ['Take breaks between activities', 'Enjoy local cafes', 'Don\'t rush the schedule'],
      moderate: ['Balance sightseeing with rest', 'Try local transportation', 'Book tickets in advance'],
      packed: ['Optimize travel routes', 'Pre-book all attractions', 'Carry energy bars']
    };

    return [...baseTips.slice(0, 2), ...styleTips[style as keyof typeof styleTips]];
  }

  private formatItinerary(destination: string, preferences: TravelPreferences, itineraries: Itinerary[], dailyBudget: number): string {
    const totalBudget = dailyBudget * preferences.duration;
    
    let response = `🗓️ **${preferences.duration}-Day ${destination} Itinerary**\n\n`;
    response += `**Travel Style:** ${preferences.travelStyle} | **Budget:** ${preferences.budget} (₹${totalBudget.toLocaleString()} total)\n`;
    response += `**Travelers:** ${preferences.travelers} person${preferences.travelers > 1 ? 's' : ''}\n\n`;

    itineraries.forEach(itinerary => {
      response += `**📅 ${itinerary.title}**\n`;
      response += `*Estimated Cost: ₹${itinerary.estimatedCost.toLocaleString()}*\n\n`;
      
      itinerary.activities.forEach(activity => {
        const icon = this.getCategoryIcon(activity.category);
        response += `${icon} **${activity.time}** - ${activity.name}\n`;
        response += `   ${activity.description} (${activity.duration})\n`;
        response += `   *Cost: ₹${activity.cost.toLocaleString()}*\n\n`;
      });

      response += `💡 **Day ${itinerary.day} Tips:**\n`;
      itinerary.tips.forEach(tip => response += `• ${tip}\n`);
      response += '\n';
    });

    response += `**💰 Budget Breakdown:**\n`;
    response += `• Activities: ₹${itineraries.reduce((sum, i) => sum + i.estimatedCost, 0).toLocaleString()}\n`;
    response += `• Food & Misc: ₹${(totalBudget * 0.3).toLocaleString()}\n`;
    response += `• Transport: ₹${(totalBudget * 0.2).toLocaleString()}\n\n`;

    response += `**📱 Helpful Apps:**\n`;
    response += `• IRCTC (train bookings) • Ola/Uber (taxis)\n`;
    response += `• Zomato (food) • Google Translate\n\n`;

    response += `*Want to modify this itinerary? Just let me know your preferences!* 🌟`;

    return response;
  }

  private getCategoryIcon(category: string): string {
    const icons = {
      sightseeing: '🏛️',
      culture: '🎭',
      food: '🍛',
      shopping: '🛍️',
      adventure: '⛰️',
      transport: '🚗'
    };
    return icons[category as keyof typeof icons] || '📍';
  }

  private generateGenericItinerary(destination: string, preferences: TravelPreferences): string {
    return `🗓️ **${preferences.duration}-Day ${destination} Travel Plan**

**Travel Style:** ${preferences.travelStyle} | **Budget:** ${preferences.budget}
**Travelers:** ${preferences.travelers} person${preferences.travelers > 1 ? 's' : ''}

**🎯 General Itinerary Framework:**

**Day 1 - Arrival & City Center**
• Morning: Arrive, check-in, local orientation
• Afternoon: Major landmarks and city center
• Evening: Local cuisine experience

**Day 2+ - Deep Exploration**
• Cultural sites and museums
• Local markets and shopping areas  
• Traditional food experiences
• Natural attractions (if available)

**📋 Essential Planning Steps:**
1. **Research** local customs and weather
2. **Book** accommodations and major attractions
3. **Download** offline maps and translation apps
4. **Pack** appropriate clothing and essentials
5. **Share** itinerary with family/friends

**💡 Pro Tips:**
• Book train/flight tickets 2-8 weeks in advance
• Carry both cash and cards
• Learn basic local phrases
• Keep digital copies of important documents
• Have local emergency contacts

**💰 Estimated Daily Budget:**
• Budget: ₹1,000-2,000 per person
• Mid-range: ₹2,000-4,000 per person
• Luxury: ₹4,000+ per person

Would you like me to create a detailed day-by-day plan for ${destination}? Just share your specific interests! 🌟`;
  }

  getLocalExperiences(destination: string): string {
    const experiences = {
      'jaipur': [
        '🏰 **Elephant Safari** at Amber Fort with mahout experience',
        '🎨 **Block Printing Workshop** in traditional textile centers',
        '🍛 **Cooking Class** - Learn authentic Rajasthani cuisine',
        '🛍️ **Jewelry Making** - Create your own Kundan jewelry',
        '🎭 **Folk Performance** - Kalbelia dance and puppet shows',
        '🐪 **Camel Cart Ride** through rural villages'
      ],
      'delhi': [
        '🚲 **Heritage Cycle Tour** through Old Delhi bylanes',
        '🍛 **Street Food Walking Tour** in Chandni Chowk',
        '🎨 **Art Workshop** at local artist studios',
        '🕌 **Spiritual Walk** covering multiple religions',
        '🛍️ **Market Hopping** with local shopping expert',
        '🚗 **Photography Tour** of hidden Delhi gems'
      ],
      'mumbai': [
        '🚂 **Local Train Experience** with Mumbai resident',
        '🎬 **Bollywood Studio Visit** with actor interactions',
        '🍛 **Dabbawala Tour** understanding lunch delivery system',
        '🏖️ **Fishing Village Tour** in Versova or Worli',
        '🎨 **Warli Art Workshop** with tribal artists',
        '🌅 **Dawn Market Visit** at Crawford Market'
      ]
    };

    const destExperiences = experiences[destination.toLowerCase() as keyof typeof experiences];
    
    if (destExperiences) {
      return `🌟 **Unique Local Experiences in ${destination}**\n\n${destExperiences.join('\n\n')}\n\n💡 **Booking Tips:**\n• Book through verified local tour operators\n• Check reviews and ratings\n• Confirm pickup/drop points\n• Carry contact details of organizers\n\n*These experiences offer authentic insights into local culture and lifestyle!* ✨`;
    }

    return `🌟 **Local Experience Ideas for ${destination}**\n\n🎯 **Cultural Immersion:**\n• Local cooking classes\n• Traditional craft workshops\n• Language exchange meetups\n• Religious/spiritual ceremonies\n\n🏞️ **Nature & Adventure:**\n• Guided nature walks\n• Local farming experiences\n• Traditional sports/games\n• Sunrise/sunset viewpoints\n\n👥 **Community Connections:**\n• Village stays with families\n• Local market tours with residents\n• Traditional music/dance performances\n• Volunteer opportunities\n\n💡 **How to Find:**\n• Ask hotel concierge for recommendations\n• Use platforms like Airbnb Experiences\n• Connect with local travel communities\n• Visit tourist information centers\n\n*The best experiences often come from connecting with locals!* 🤝`;
  }

  getBudgetBreakdown(destination: string, duration: number, budget: 'budget' | 'mid-range' | 'luxury'): string {
    const baseCosts = {
      budget: {
        accommodation: 800,
        food: 500,
        transport: 300,
        activities: 400
      },
      'mid-range': {
        accommodation: 2000,
        food: 800,
        transport: 500,
        activities: 700
      },
      luxury: {
        accommodation: 5000,
        food: 1500,
        transport: 1000,
        activities: 1500
      }
    };

    const costs = baseCosts[budget];
    const dailyTotal = Object.values(costs).reduce((sum, cost) => sum + cost, 0);
    const tripTotal = dailyTotal * duration;

    return `💰 **${duration}-Day ${destination} Budget (${budget.charAt(0).toUpperCase() + budget.slice(1)})**

**Daily Breakdown:**
🏨 Accommodation: ₹${costs.accommodation.toLocaleString()}
🍛 Food & Drinks: ₹${costs.food.toLocaleString()}
🚗 Transportation: ₹${costs.transport.toLocaleString()}
🎯 Activities: ₹${costs.activities.toLocaleString()}
**Daily Total: ₹${dailyTotal.toLocaleString()}**

**${duration}-Day Trip Total: ₹${tripTotal.toLocaleString()}**

**💡 Money-Saving Tips:**
• Book accommodations in advance
• Use public transport when possible
• Eat at local restaurants vs hotels
• Look for combo tickets for attractions
• Carry water bottle to avoid buying
• Use travel apps for discounts

**💳 Payment Methods:**
• UPI apps (PhonePe, Google Pay, Paytm)
• Debit/Credit cards widely accepted
• Cash still needed for street vendors
• ATMs available in all major areas

**🎒 Additional Costs to Consider:**
• Travel insurance: ₹200-500/day
• Shopping & souvenirs: ₹1,000-5,000
• Tips & service charges: 10-15%
• Emergency fund: 10% of total budget

*Prices may vary by season and specific location within ${destination}* 📊`;
  }
} 