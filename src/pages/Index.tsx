import { useState, useEffect, useRef } from 'react';
import { Send, Globe, Wifi, WifiOff, MapPin, Camera, Utensils, Hotel, Plane, Plus, Sparkles, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ChatMessage } from '@/components/ChatMessage';
import { LanguageToggle } from '@/components/LanguageToggle';
import { BackgroundSlideshow } from '@/components/BackgroundSlideshow';
import { ContextIndicator } from '@/components/ContextIndicator';
import { WikipediaService } from '@/services/WikipediaService';
import { TranslationService } from '@/services/TranslationService';
import { OfflineService } from '@/services/OfflineService';
import { ItineraryService, TravelPreferences } from '@/services/ItineraryService';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isOffline?: boolean;
  type?: 'text' | 'destination' | 'emergency' | 'weather';
  metadata?: any;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Namaste! 🙏 I am TravelSathi, your intelligent travel companion for incredible India! \n\nI can help you with:\n🏛️ Destination information\n🌤️ Weather updates\n🍛 Local cuisine recommendations\n🚨 Emergency contacts\n📍 Popular attractions\n\nWhere would you like to explore today?',
      isUser: false,
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const [backgroundContext, setBackgroundContext] = useState('default');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const wikipediaService = new WikipediaService();
  const translationService = new TranslationService();
  const offlineService = new OfflineService();
  const itineraryService = new ItineraryService();

  // Quick reply suggestions
  const quickReplies = [
    { text: 'Popular destinations in India', icon: MapPin },
    { text: 'Tell me about Jaipur', icon: Camera },
    { text: 'Plan a trip to Delhi', icon: Plane },
    { text: 'Best food in Mumbai', icon: Utensils },
    { text: 'Local experiences in Goa', icon: Sparkles },
    { text: 'Budget breakdown for Kerala', icon: Plus },
  ];

  const popularDestinations = [
    { name: 'Jaipur', emoji: '🏰', description: 'The Pink City' },
    { name: 'Kerala', emoji: '🌴', description: 'God\'s Own Country' },
    { name: 'Goa', emoji: '🏖️', description: 'Beach Paradise' },
    { name: 'Rajasthan', emoji: '🐪', description: 'Land of Kings' },
    { name: 'Delhi', emoji: '🏛️', description: 'Historic Capital' },
    { name: 'Mumbai', emoji: '🏙️', description: 'City of Dreams' },
  ];

  useEffect(() => {
    const handleOnlineStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputMessage;
    if (!textToSend.trim()) return;

    setShowQuickReplies(false);
    
    // Update background context based on user query
    const newContext = detectBackgroundContext(textToSend);
    setBackgroundContext(newContext);

    const userMessage: Message = {
      id: Date.now().toString(),
      text: textToSend,
      isUser: true,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      let response = '';
      let messageType: Message['type'] = 'text';
      let metadata = {};
      let isOfflineResponse = false;

      // Determine message type based on query
      if (textToSend.toLowerCase().includes('weather')) {
        messageType = 'weather';
        response = await getWeatherInfo(textToSend);
      } else if (textToSend.toLowerCase().includes('emergency') || textToSend.toLowerCase().includes('contact')) {
        messageType = 'emergency';
        response = await wikipediaService.searchDestination(textToSend);
      } else if (textToSend.toLowerCase().includes('food') || textToSend.toLowerCase().includes('cuisine')) {
        response = await getFoodRecommendations(textToSend);
      } else if (textToSend.toLowerCase().includes('plan') || textToSend.toLowerCase().includes('trip') || textToSend.toLowerCase().includes('itinerary')) {
        response = await getItineraryPlan(textToSend);
      } else if (textToSend.toLowerCase().includes('local experience') || textToSend.toLowerCase().includes('things to do')) {
        response = await getLocalExperiences(textToSend);
      } else if (textToSend.toLowerCase().includes('budget') && textToSend.toLowerCase().includes('breakdown')) {
        response = await getBudgetBreakdown(textToSend);
      } else {
        if (isOnline) {
          response = await wikipediaService.searchDestination(textToSend);
          messageType = 'destination';
          offlineService.cacheData(textToSend, response);
        } else {
          response = offlineService.getCachedData(textToSend) || 
            'I apologize, but I need an internet connection to provide detailed travel information. Please check your connection and try again.';
          isOfflineResponse = true;
        }
      }

      // Translate response if needed
      if (selectedLanguage !== 'en') {
        response = await translationService.translate(response, selectedLanguage);
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date(),
        isOffline: isOfflineResponse,
        type: messageType,
        metadata
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error getting response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error while fetching information. Please try again.',
        isUser: false,
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const getWeatherInfo = async (query: string): Promise<string> => {
    // Mock weather service - in production, integrate with weather API
    const destination = query.toLowerCase().includes('delhi') ? 'Delhi' :
                       query.toLowerCase().includes('mumbai') ? 'Mumbai' :
                       query.toLowerCase().includes('bangalore') ? 'Bangalore' :
                       query.toLowerCase().includes('chennai') ? 'Chennai' :
                       'the requested location';

    return `🌤️ **Weather Update for ${destination}**

🌡️ **Current Conditions:**
• Temperature: 28°C (feels like 32°C)
• Condition: Partly cloudy
• Humidity: 65%
• Wind: 12 km/h

📅 **7-Day Forecast:**
Today: 🌤️ 28°C / 22°C - Partly cloudy
Tomorrow: ☀️ 30°C / 24°C - Sunny
Day 3: 🌧️ 26°C / 20°C - Light rain

🧳 **Travel Tip:** Pack light cotton clothes and carry an umbrella. Best time to visit outdoor attractions is early morning or evening.

💡 For real-time weather updates, check local weather services or apps like India Meteorological Department.`;
  };

  const getFoodRecommendations = async (query: string): Promise<string> => {
    const destination = query.toLowerCase().includes('delhi') ? 'Delhi' :
                       query.toLowerCase().includes('mumbai') ? 'Mumbai' :
                       query.toLowerCase().includes('jaipur') ? 'Jaipur' :
                       query.toLowerCase().includes('bangalore') ? 'Bangalore' :
                       'India';

    const foodGuides: { [key: string]: string } = {
      'Delhi': `🍛 **Delhi Food Guide**

🔥 **Must-Try Dishes:**
• Chole Bhature at Sita Ram Diwan Chand
• Paranthe Wali Gali in Chandni Chowk
• Butter Chicken at Moti Mahal
• Kulfi at Kuremal Mohan Lal Kulfi Wale

🏪 **Food Areas:**
• Chandni Chowk - Street food paradise
• Khan Market - Upscale dining
• Karim's - Historic Mughlai cuisine
• Connaught Place - Diverse options

💰 **Budget:** ₹50-500 per meal
🌶️ **Spice Level:** Moderate to high`,

      'Mumbai': `🍛 **Mumbai Food Guide**

🔥 **Must-Try Dishes:**
• Vada Pav - Mumbai's burger
• Pav Bhaji at Sardar Refreshments
• Bhel Puri at Chowpatty Beach
• Tiffin service experience

🏪 **Food Areas:**
• Mohammed Ali Road - Street food
• Bandra - Trendy restaurants
• Crawford Market - Local flavors
• Marine Drive - Evening snacks

💰 **Budget:** ₹30-400 per meal
🌶️ **Spice Level:** Moderate`,
    };

    return foodGuides[destination] || `🍛 **Indian Cuisine Guide**

🔥 **Popular Indian Dishes:**
• Biryani - Aromatic rice dish
• Masala Dosa - South Indian crepe
• Rajma Chawal - Kidney bean curry with rice
• Samosas - Fried pastries with filling

🥘 **Regional Specialties:**
• North: Naan, Tandoori, Lassi
• South: Dosa, Idli, Sambhar
• West: Dhokla, Thali, Fafda
• East: Rosogolla, Fish curry, Momos

💡 **Tip:** Always try local street food but ensure it's from busy, clean stalls!`;
  };

  const getItineraryPlan = async (query: string): Promise<string> => {
    // Extract destination from query
    const destination = extractDestination(query);
    
    // Default preferences for demo - in a real app, you'd collect these from user
    const preferences: TravelPreferences = {
      budget: query.toLowerCase().includes('luxury') ? 'luxury' : 
              query.toLowerCase().includes('budget') ? 'budget' : 'mid-range',
      duration: query.toLowerCase().includes('week') ? 7 : 
                query.toLowerCase().includes('weekend') ? 2 : 3,
      interests: ['culture', 'food', 'sightseeing'],
      travelers: 2,
      travelStyle: query.toLowerCase().includes('relaxed') ? 'relaxed' : 
                   query.toLowerCase().includes('packed') ? 'packed' : 'moderate'
    };

    if (destination) {
      return itineraryService.generateItinerary(destination, preferences);
    }

    return `📋 **Trip Planning Assistant**

🗓️ **Planning Your Perfect Trip:**

**Step 1: Tell me your destination**
• "Plan a trip to Jaipur"
• "3-day itinerary for Delhi"
• "Budget trip to Mumbai"

**Step 2: Specify preferences (optional)**
• Budget: budget/mid-range/luxury
• Duration: weekend/week/custom days
• Style: relaxed/moderate/packed

**Step 3: I'll create your personalized itinerary!**

**💡 Example queries:**
• "Plan a luxury 5-day trip to Goa"
• "Budget weekend in Bangalore"
• "Relaxed week in Kerala"

**🎒 What I'll include:**
• Day-by-day schedule with timings
• Cost estimates and budget breakdown
• Local experiences and attractions
• Transportation and food recommendations
• Cultural tips and best practices

Which destination would you like to explore? 🌟`;
  };

  const getLocalExperiences = async (query: string): Promise<string> => {
    const destination = extractDestination(query);
    
    if (destination) {
      return itineraryService.getLocalExperiences(destination);
    }

    return `🌟 **Local Experiences Guide**

To get specific local experiences, tell me your destination:
• "Local experiences in Jaipur"
• "Things to do in Delhi"
• "Unique activities in Mumbai"

**🎯 Popular Experience Categories:**

**🎨 Cultural Immersion:**
• Traditional craft workshops
• Cooking classes with local families
• Folk dance and music performances
• Temple and spiritual experiences

**🏞️ Nature & Adventure:**
• Guided heritage walks
• Photography tours
• Village and rural experiences
• Wildlife and nature activities

**🍛 Food & Culinary:**
• Street food tours with locals
• Traditional cooking lessons
• Market visits with chefs
• Regional specialty tastings

**👥 Community Connections:**
• Homestays with local families
• Language exchange meetups
• Volunteer opportunities
• Local festival participations

Which destination interests you for unique local experiences? 🌟`;
  };

  const getBudgetBreakdown = async (query: string): Promise<string> => {
    const destination = extractDestination(query);
    const duration = query.toLowerCase().includes('week') ? 7 : 
                     query.toLowerCase().includes('weekend') ? 2 : 3;
    const budgetType = query.toLowerCase().includes('luxury') ? 'luxury' : 
                       query.toLowerCase().includes('budget') ? 'budget' : 'mid-range';

    if (destination) {
      return itineraryService.getBudgetBreakdown(destination, duration, budgetType);
    }

    return `💰 **Budget Planning Guide**

To get a detailed budget breakdown, specify:
• "Budget breakdown for 3 days in Delhi"
• "Luxury budget for week in Goa"
• "Mid-range 5-day Mumbai trip cost"

**💡 Quick Budget Estimates (per person/day):**

**🏨 Budget Travelers (₹1,000-2,000/day):**
• Hostels/budget hotels
• Local transport & street food
• Free attractions & walking tours

**🏛️ Mid-Range (₹2,000-5,000/day):**
• 3-star hotels or good guesthouses  
• Mix of local & restaurant dining
• Paid attractions & some guided tours

**✨ Luxury (₹5,000+/day):**
• 4-5 star hotels or resorts
• Fine dining & premium experiences
• Private transport & exclusive access

**📊 Cost Factors:**
• Destination popularity & season
• Accommodation style & location
• Transportation choices
• Dining preferences & shopping
• Activities & experience bookings

Which destination and budget range would you like me to detail? 🎯`;
  };

  const extractDestination = (query: string): string | null => {
    const cities = ['jaipur', 'delhi', 'mumbai', 'bangalore', 'hyderabad', 'chennai', 'kolkata', 'goa', 'kerala', 'agra', 'varanasi', 'pune', 'ahmedabad', 'surat', 'lucknow', 'kanpur', 'nagpur', 'indore', 'thane', 'bhopal', 'visakhapatnam', 'pimpri', 'patna', 'vadodara', 'ludhiana', 'rajkot', 'kalyan', 'dombivli', 'agra', 'nashik', 'meerut', 'faridabad', 'ghaziabad', 'durgapur', 'rajpur', 'solapur', 'shimla', 'darjeeling', 'ooty', 'manali', 'rishikesh', 'haridwar', 'amritsar', 'chandigarh', 'kochi', 'thiruvananthapuram', 'kozhikode', 'madurai', 'coimbatore', 'tiruchirappalli', 'salem', 'tirunelveli'];
    
    const queryLower = query.toLowerCase();
    return cities.find(city => queryLower.includes(city)) || null;
  };

  const detectBackgroundContext = (query: string): string => {
    const queryLower = query.toLowerCase();
    
    // Check for specific destinations first
    if (queryLower.includes('jaipur') || queryLower.includes('pink city') || queryLower.includes('rajasthan')) {
      return 'jaipur';
    }
    if (queryLower.includes('delhi') || queryLower.includes('new delhi')) {
      return 'delhi';
    }
    if (queryLower.includes('mumbai') || queryLower.includes('bombay')) {
      return 'mumbai';
    }
    if (queryLower.includes('kerala') || queryLower.includes('backwater') || queryLower.includes('kochi') || queryLower.includes('cochin')) {
      return 'kerala';
    }
    if (queryLower.includes('goa') || queryLower.includes('beach') || queryLower.includes('panaji')) {
      return 'goa';
    }
    if (queryLower.includes('rajasthan') || queryLower.includes('desert') || queryLower.includes('camel') || 
        queryLower.includes('udaipur') || queryLower.includes('jodhpur')) {
      return 'rajasthan';
    }
    if (queryLower.includes('agra') || queryLower.includes('taj mahal')) {
      return 'agra';
    }
    if (queryLower.includes('varanasi') || queryLower.includes('benares') || queryLower.includes('ganga') || queryLower.includes('ganges')) {
      return 'varanasi';
    }
    if (queryLower.includes('bangalore') || queryLower.includes('bengaluru')) {
      return 'bangalore';
    }
    
    // Check for topic-based contexts
    if (queryLower.includes('food') || queryLower.includes('cuisine') || queryLower.includes('eat') || 
        queryLower.includes('restaurant') || queryLower.includes('spice') || queryLower.includes('dish')) {
      return 'food';
    }
    if (queryLower.includes('weather') || queryLower.includes('temperature') || queryLower.includes('climate') || 
        queryLower.includes('season') || queryLower.includes('rain') || queryLower.includes('monsoon')) {
      return 'weather';
    }
    if (queryLower.includes('emergency') || queryLower.includes('help') || queryLower.includes('contact') || 
        queryLower.includes('police') || queryLower.includes('hospital') || queryLower.includes('safety')) {
      return 'emergency';
    }
    
    // Default context for general queries
    return 'default';
  };

  const handleQuickReply = (reply: string) => {
    // Update background context for quick replies too
    const newContext = detectBackgroundContext(reply);
    setBackgroundContext(newContext);
    handleSendMessage(reply);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background Slideshow */}
      <BackgroundSlideshow autoplayInterval={10000} context={backgroundContext} />
      
      {/* Context Indicator */}
      <ContextIndicator context={backgroundContext} />
      
      {/* Main Content with backdrop filter */}
      <div className="relative z-10 min-h-screen flex flex-col bg-white/5 backdrop-blur-[1px]">
        {/* Header */}
        <header className="bg-gray-900/95 backdrop-blur-lg shadow-xl border-b border-gray-700/50 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                <Globe className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                  TravelSathi
                </h1>
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-3 h-3 text-orange-400" />
                  <p className="text-sm text-gray-300">Your AI Travel Companion</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 bg-gray-800/60 rounded-full px-3 py-1 border border-gray-700/50">
                {isOnline ? (
                  <>
                    <Wifi className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-green-300 font-medium">Online</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-4 h-4 text-red-400" />
                    <span className="text-sm text-red-300 font-medium">Offline</span>
                  </>
                )}
              </div>
              <LanguageToggle 
                selectedLanguage={selectedLanguage}
                onLanguageChange={setSelectedLanguage}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full p-4 flex gap-4">
          {/* Sidebar with popular destinations */}
          <div className="hidden lg:block w-80">
            <Card className="bg-white/80 backdrop-blur-md border-gray-700/50 shadow-xl">
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                <Navigation className="w-4 h-4 mr-2 text-orange-500" />
                Popular Destinations
              </h3>
              <div className="space-y-2">
                {popularDestinations.map((dest) => (
                                      <Button
                      key={dest.name}
                      variant="ghost"
                      className="w-full justify-start text-left h-auto p-3 hover:bg-orange-50"
                      onClick={() => {
                        const query = `Tell me about ${dest.name}`;
                        const newContext = detectBackgroundContext(query);
                        setBackgroundContext(newContext);
                        handleSendMessage(query);
                      }}
                    >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{dest.emoji}</span>
                      <div>
                        <div className="font-medium text-gray-800">{dest.name}</div>
                        <div className="text-xs text-gray-500">{dest.description}</div>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

                    {/* Chat Area */}
            <div className="flex-1">
              <Card className="bg-white/85 backdrop-blur-md border-gray-700/50 shadow-xl h-full flex flex-col">
                              {/* Messages */}
                  <div className="flex-1 p-6 overflow-y-auto space-y-4 min-h-[600px] custom-scrollbar smooth-scroll">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              
                                {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gradient-to-r from-orange-100/90 to-amber-100/90 backdrop-blur-sm rounded-2xl p-4 max-w-xs border border-orange-200/70 shadow-lg">
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                          <span className="text-sm text-orange-700 font-medium">TravelSathi is thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}

                                  {/* Quick Replies */}
                    {showQuickReplies && messages.length === 1 && (
                      <div className="space-y-3 bg-gradient-to-r from-white/60 to-orange-50/60 backdrop-blur-sm rounded-xl p-4 border border-gray-700/30">
                        <p className="text-sm text-gray-700 font-semibold flex items-center">
                          <Sparkles className="w-4 h-4 mr-2 text-orange-500" />
                          Quick suggestions to get started:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {quickReplies.map((reply, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuickReply(reply.text)}
                              className="bg-white/90 backdrop-blur-sm border-gray-700/50 text-gray-700 hover:bg-orange-50 hover:border-orange-300 hover:shadow-md transition-all duration-200"
                            >
                              <reply.icon className="w-3 h-3 mr-2" />
                              {reply.text}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
              
              <div ref={messagesEndRef} />
            </div>

                            {/* Input Area */}
                <div className="p-4 border-t border-gray-700/50 bg-white/60 backdrop-blur-sm">
              <div className="flex space-x-3">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about destinations, food, weather, or planning tips..."
                  className="flex-1 bg-white/80 border-gray-700/50 focus:border-orange-400 focus:ring-orange-400"
                  disabled={isLoading}
                />
                <Button
                  onClick={() => handleSendMessage()}
                  disabled={isLoading || !inputMessage.trim()}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              
                                  {/* Mobile quick replies */}
                    <div className="lg:hidden mt-3">
                      <div className="flex overflow-x-auto space-x-2 pb-2">
                        {popularDestinations.slice(0, 4).map((dest) => (
                          <Badge
                            key={dest.name}
                            variant="secondary"
                            className="cursor-pointer whitespace-nowrap bg-orange-100/90 backdrop-blur-sm text-orange-700 hover:bg-orange-200/90 border border-gray-700/40 shadow-sm transition-all duration-200"
                            onClick={() => {
                              const query = `Tell me about ${dest.name}`;
                              const newContext = detectBackgroundContext(query);
                              setBackgroundContext(newContext);
                              handleSendMessage(query);
                            }}
                          >
                            {dest.emoji} {dest.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
            </div>
          </Card>
        </div>
      </main>

                {/* Footer */}
          <footer className="bg-white/75 backdrop-blur-md border-t border-gray-700/50 p-4 text-center shadow-lg">
            <p className="text-sm text-gray-700">
              Powered by Wikipedia API • Made with ❤️ for Indian Travelers • 
              <span className="text-orange-600 font-medium"> Incredible India Awaits!</span>
            </p>
          </footer>
        </div>
      </div>
  );
};

export default Index;
