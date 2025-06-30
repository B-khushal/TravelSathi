export class WikipediaService {
  private baseUrl = 'https://en.wikipedia.org/api/rest_v1';
  private wikivoyageUrl = 'https://en.wikivoyage.org/api/rest_v1';

  async searchDestination(query: string): Promise<string> {
    try {
      console.log('Searching for destination:', query);
      
      // Extract destination name from query
      const destination = this.extractDestinationName(query);
      
      // Check if query is asking for emergency numbers
      if (query.toLowerCase().includes('emergency') || query.toLowerCase().includes('contact')) {
        return this.getEmergencyInfo(destination);
      }

      // Check if asking for popular destinations
      if (query.toLowerCase().includes('popular destinations') || query.toLowerCase().includes('best places')) {
        return this.getPopularDestinations();
      }

      // Get comprehensive destination information
      const overview = await this.getDestinationOverview(destination);
      const culturalTips = await this.getCulturalTips(destination);
      const bestTime = this.getBestTimeToVisit(destination);
      const attractions = this.getTopAttractions(destination);
      const transportation = this.getTransportationInfo(destination);
      
      return this.formatComprehensiveResponse(destination, overview, culturalTips, bestTime, attractions, transportation);
    } catch (error) {
      console.error('Wikipedia service error:', error);
      return this.getFallbackResponse(query);
    }
  }

  private extractDestinationName(query: string): string {
    // Enhanced extraction logic with common travel query patterns
    const words = query.toLowerCase().split(' ');
    const stopWords = ['tell', 'me', 'about', 'what', 'is', 'the', 'in', 'of', 'for', 'visit', 'travel', 'to', 'trip'];
    const destination = words.filter(word => !stopWords.includes(word)).join(' ');
    
    // Handle specific patterns
    if (query.toLowerCase().includes('tell me about')) {
      const afterAbout = query.toLowerCase().split('tell me about')[1]?.trim();
      return afterAbout || destination;
    }
    
    return destination || query;
  }

  private async getDestinationOverview(destination: string): Promise<string> {
    try {
      // Using Wikipedia's OpenSearch API for simplicity
      const searchUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(destination)}`;
      const response = await fetch(searchUrl);
      
      if (!response.ok) {
        throw new Error('Wikipedia API error');
      }
      
      const data = await response.json();
      return data.extract || '';
    } catch (error) {
      console.error('Error fetching destination overview:', error);
      return '';
    }
  }

  private async getCulturalTips(destination: string): Promise<string> {
    // Enhanced cultural tips with more comprehensive information
    const culturalTips = {
      'jaipur': {
        tips: 'Respect local customs when visiting temples. Dress modestly and remove shoes before entering. Bargaining is common in local markets.',
        etiquette: 'Traditional Rajasthani hospitality is warm. Accept tea when offered. Photography may be restricted in some palaces.',
        clothing: 'Cotton clothing recommended. Carry a light scarf for temple visits. Avoid leather items in religious places.',
        language: 'Hindi and Rajasthani are local languages. English is widely understood in tourist areas.'
      },
      'delhi': {
        tips: 'Metro is the best way to travel. Avoid street food if you have a sensitive stomach. Dress conservatively when visiting religious sites.',
        etiquette: 'Delhi is cosmopolitan. Tipping 10-15% is customary. Be respectful during prayer times at mosques.',
        clothing: 'Dress modestly, especially in Old Delhi. Comfortable walking shoes essential.',
        language: 'Hindi, Punjabi, and English are widely spoken. Urdu is understood in Old Delhi areas.'
      },
      'mumbai': {
        tips: 'Local trains are crowded but efficient. Tipping is customary in restaurants (10-15%). Be prepared for monsoon season (June-September).',
        etiquette: 'Fast-paced city life. Be punctual for meetings. Street food culture is vibrant but choose busy stalls.',
        clothing: 'Western and traditional wear both accepted. Umbrella essential during monsoons.',
        language: 'Hindi, Marathi, and English are primary languages. Gujarati is also common.'
      },
      'bangalore': {
        tips: 'Traffic can be heavy, plan accordingly. The weather is pleasant year-round. English is widely spoken in the IT areas.',
        etiquette: 'Tech-friendly city. Pub culture is popular. Respect traditional South Indian customs.',
        clothing: 'Casual wear acceptable. Light jackets for evenings. Traditional wear for temple visits.',
        language: 'Kannada, English, Hindi, and Tamil are commonly spoken.'
      },
      'hyderabad': {
        tips: 'Famous for biryani and pearl jewelry. Respect Ramadan customs if visiting during the holy month. Charminar area can be crowded.',
        etiquette: 'Rich Nizami culture. Respect Islamic traditions. Bargaining expected in old city markets.',
        clothing: 'Conservative dress in old city areas. Comfortable footwear for exploring historical sites.',
        language: 'Telugu, Urdu, Hindi, and English are widely understood.'
      },
      'kerala': {
        tips: 'Monsoons are heavy (June-September). Respect local customs in temples. Try authentic Kerala cuisine.',
        etiquette: 'Traditional and modern cultures blend. Remove shoes before entering homes. Ayurvedic traditions are respected.',
        clothing: 'Light cotton clothes. Waterproof clothing during monsoons. Traditional wear appreciated in temples.',
        language: 'Malayalam is primary. English and Hindi are understood in tourist areas.'
      },
      'goa': {
        tips: 'Beach safety is important. Respect local fishing communities. Water sports are popular but choose licensed operators.',
        etiquette: 'Relaxed beach culture. Bikinis acceptable on beaches, not in villages. Siesta culture in afternoon.',
        clothing: 'Beach wear for coast, modest clothing for inland areas. Sun protection essential.',
        language: 'Konkani, Portuguese influences. English, Hindi widely spoken.'
      }
    };

    const key = destination.toLowerCase();
    const info = culturalTips[key as keyof typeof culturalTips];
    
    if (info) {
      return `**Cultural Etiquette:**
${info.etiquette}

**Dress Code:**
${info.clothing}

**Local Languages:**
${info.language}

**Additional Tips:**
${info.tips}`;
    }
    
    return 'Respect local customs and traditions. Learn a few basic phrases in the local language. Dress modestly when visiting religious sites.';
  }

  private getBestTimeToVisit(destination: string): string {
    const travelSeasons = {
      'jaipur': '**Best Time:** October to March (pleasant weather), **Avoid:** April-June (extreme heat)',
      'delhi': '**Best Time:** October to March (cool & pleasant), **Monsoon:** July-September, **Avoid:** April-June (very hot)',
      'mumbai': '**Best Time:** November to February (cool), **Monsoon:** June-September (heavy rains), **Summer:** March-May (hot & humid)',
      'bangalore': '**Best Time:** Year-round (pleasant climate), **Monsoon:** June-September, **Cool Season:** December-February',
      'hyderabad': '**Best Time:** October to February (pleasant), **Monsoon:** June-September, **Avoid:** March-May (hot)',
      'kerala': '**Best Time:** September to March (dry season), **Monsoon:** June-August (heavy rains), **Summer:** March-May (hot)',
      'goa': '**Best Time:** November to February (cool & dry), **Monsoon:** June-September, **Off-season:** March-May (hot)',
      'chennai': '**Best Time:** November to February (cool), **Monsoon:** October-December, **Avoid:** March-June (very hot)',
      'kolkata': '**Best Time:** October to March (pleasant), **Monsoon:** June-September, **Avoid:** April-June (hot & humid)',
      'rajasthan': '**Best Time:** October to March (cool), **Avoid:** April-June (extreme heat), **Monsoon:** July-September'
    };

    const key = destination.toLowerCase();
    return travelSeasons[key as keyof typeof travelSeasons] || 
           '**Best Time:** October to March (generally pleasant weather across India), **Monsoon:** June-September';
  }

  private getTopAttractions(destination: string): string {
    const attractions = {
      'jaipur': `**Must-Visit Attractions:**
🏰 Amber Fort - Magnificent hilltop fort (2-3 hours)
🕌 City Palace - Royal residence with museums (2 hours)  
🏛️ Hawa Mahal - Iconic pink palace (1 hour)
⭐ Jantar Mantar - Ancient astronomical observatory (1 hour)
🏮 Nahargarh Fort - Best sunset views (1.5 hours)`,

      'delhi': `**Must-Visit Attractions:**
🕌 Red Fort - Historic Mughal fort (2 hours)
🏛️ India Gate - War memorial & gardens (1 hour)
🕌 Jama Masjid - India's largest mosque (1 hour)
🏛️ Lotus Temple - Architectural marvel (1 hour)
🛍️ Chandni Chowk - Historic market area (2-3 hours)
🏛️ Qutub Minar - UNESCO World Heritage site (1.5 hours)`,

      'mumbai': `**Must-Visit Attractions:**
🚪 Gateway of India - Iconic waterfront monument (1 hour)
🏰 Chhatrapati Shivaji Terminus - UNESCO railway station (30 minutes)
🏖️ Marine Drive - Queen's Necklace promenade (evening walk)
🏝️ Elephanta Caves - Ancient rock-cut temples (half day)
🏛️ Prince of Wales Museum - Art & history (2 hours)
🎬 Film City - Bollywood studio tours (half day)`,

      'bangalore': `**Must-Visit Attractions:**
🌺 Lalbagh Botanical Garden - Beautiful gardens (2 hours)
🏰 Bangalore Palace - Tudor-style architecture (1.5 hours)
🕌 Bull Temple - Unique Nandi temple (1 hour)
🛍️ Commercial Street - Shopping paradise (2-3 hours)
🌄 Nandi Hills - Hill station nearby (full day trip)
🍺 Brewery tours - Craft beer culture (evening)`,

      'hyderabad': `**Must-Visit Attractions:**
🕌 Charminar - Iconic 16th-century monument (1 hour)
🏰 Golconda Fort - Historic fortress complex (3 hours)
💎 Salar Jung Museum - World's largest one-man collection (2 hours)
🕌 Mecca Masjid - One of India's largest mosques (1 hour)
🏰 Ramoji Film City - World's largest film studio (full day)
💍 Laad Bazaar - Famous for bangles & pearls (2 hours)`
    };

    const key = destination.toLowerCase();
    return attractions[key as keyof typeof attractions] || 
           `**Popular Attractions:** Major temples, historical sites, local markets, and cultural landmarks. Check with local tourism office for specific recommendations.`;
  }

  private getTransportationInfo(destination: string): string {
    return `**Getting Around:**
🚇 **Metro/Local Trains:** Most efficient for long distances
🚗 **Taxi/Rideshare:** Uber, Ola available in major cities
🛺 **Auto-rickshaw:** Great for short distances, always negotiate or use meter
🚌 **City Buses:** Economical but can be crowded
🚲 **Bike Rentals:** Available in tourist areas

**Airport Connectivity:** Most cities have metro/bus connections to airports
**Booking Tips:** Use official apps for trains (IRCTC), flights (multiple options)`;
  }

  private getPopularDestinations(): string {
    return `🇮🇳 **Popular Destinations in India**

**🏰 Golden Triangle:**
• Delhi - Capital with rich history
• Agra - Home to the Taj Mahal  
• Jaipur - The Pink City of Rajasthan

**🏖️ Beach Destinations:**
• Goa - Beaches, nightlife, Portuguese culture
• Kerala Backwaters - Serene waterways
• Andaman Islands - Pristine beaches

**🏔️ Hill Stations:**
• Shimla - Queen of Hills
• Darjeeling - Tea gardens & mountain views
• Ooty - Nilgiri Mountain retreat

**🕌 Cultural Heritage:**
• Varanasi - Spiritual capital
• Hampi - Ancient Vijayanagara Empire
• Khajuraho - Temple architecture

**🌴 South India:**
• Kerala - God's Own Country
• Tamil Nadu - Temple trails
• Karnataka - Diverse landscapes

**Adventure & Nature:**
• Ladakh - High altitude desert
• Rishikesh - Yoga & adventure sports
• Jim Corbett - Wildlife sanctuary

Would you like detailed information about any specific destination?`;
  }

  private getEmergencyInfo(destination: string): string {
    return `🚨 **Emergency Numbers for ${destination}**

**🚨 Universal Emergency Numbers:**
• **Police:** 100
• **Ambulance:** 108  
• **Fire Brigade:** 101
• **Tourist Helpline:** 1363
• **National Emergency:** 112
• **Women's Helpline:** 1091
• **Child Helpline:** 1098

**📞 Important Services:**
• **Railway Enquiry:** 139
• **Gas Leak:** 1906
• **Disaster Management:** 108
• **Blood Bank:** 104

**🏥 Medical Emergency Tips:**
• Keep emergency contacts in local language
• Note nearest hospital address
• Carry medical insurance documents
• Have local SIM card for emergency calls

**📍 ${destination} Specific:**
Contact local police station, tourist information center, or your embassy for local emergency services.

**💡 Travel Safety:**
• Share itinerary with family/friends
• Keep copies of important documents
• Have local emergency contacts
• Download offline maps

Stay safe and enjoy your travels! 🙏`;
  }

  private formatComprehensiveResponse(
    destination: string, 
    overview: string, 
    culturalTips: string, 
    bestTime: string, 
    attractions: string,
    transportation: string
  ): string {
    return `📍 **${destination.toUpperCase()}**

${overview}

⏰ **${bestTime}**

${attractions}

🎭 ${culturalTips}

🚗 ${transportation}

💡 **Quick Tips:**
• Always carry valid ID and emergency contacts
• Respect local customs and dress codes  
• Bargain politely in markets
• Try local cuisine from busy, clean places
• Stay hydrated and carry basic medicines

Need specific information about weather, food, or emergency contacts? Just ask! 🙏`;
  }

  private getFallbackResponse(query: string): string {
    return `🗺️ **Travel Information for "${query}"**

I'd love to help you explore this destination! Here's some general travel guidance:

**🎯 General Travel Tips for India:**
• **Documentation:** Always carry valid ID (Aadhaar, Passport, License)
• **Health:** Stay hydrated, eat at clean places, carry basic medicines
• **Transportation:** Metro, trains, and official taxis are reliable
• **Culture:** Respect local customs, dress modestly at religious sites
• **Communication:** English is widely understood in tourist areas

**🆘 Universal Emergency Numbers:**
• Police: 100 | Ambulance: 108 | Fire: 101
• Tourist Helpline: 1363 | National Emergency: 112

**💡 For detailed destination info, try asking:**
• "Tell me about [City Name]"
• "Weather in [City]"  
• "Best food in [City]"
• "Emergency numbers for [City]"
• "Popular destinations in India"

Which specific destination would you like to explore? I can provide detailed information about major Indian cities and tourist spots! 🌟`;
  }
}
