import { useState, useEffect } from 'react';
import { MapPin, Utensils, CloudSun, AlertTriangle, Sparkles } from 'lucide-react';

interface ContextIndicatorProps {
  context: string;
}

export const ContextIndicator = ({ context }: ContextIndicatorProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentContext, setCurrentContext] = useState(context);

  const contextDetails = {
    'jaipur': { icon: MapPin, label: 'Jaipur Experience', color: 'from-pink-400 to-red-500' },
    'delhi': { icon: MapPin, label: 'Delhi Exploration', color: 'from-red-400 to-orange-500' },
    'mumbai': { icon: MapPin, label: 'Mumbai Adventure', color: 'from-blue-400 to-purple-500' },
    'kerala': { icon: MapPin, label: 'Kerala Journey', color: 'from-green-400 to-teal-500' },
    'goa': { icon: MapPin, label: 'Goa Beaches', color: 'from-orange-400 to-yellow-500' },
    'rajasthan': { icon: MapPin, label: 'Rajasthan Heritage', color: 'from-yellow-400 to-orange-500' },
    'agra': { icon: MapPin, label: 'Agra Wonders', color: 'from-purple-400 to-pink-500' },
    'varanasi': { icon: MapPin, label: 'Varanasi Spirituality', color: 'from-amber-400 to-orange-600' },
    'bangalore': { icon: MapPin, label: 'Bangalore Tech Hub', color: 'from-blue-400 to-green-500' },
    'food': { icon: Utensils, label: 'Culinary Journey', color: 'from-orange-400 to-red-500' },
    'weather': { icon: CloudSun, label: 'Weather Update', color: 'from-blue-400 to-cyan-500' },
    'emergency': { icon: AlertTriangle, label: 'Safety Information', color: 'from-red-400 to-pink-500' },
    'default': { icon: Sparkles, label: 'Incredible India', color: 'from-orange-400 to-red-500' }
  };

  useEffect(() => {
    if (context !== currentContext) {
      setCurrentContext(context);
      setIsVisible(true);
      
      // Hide after 3 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [context, currentContext]);

  if (!isVisible || context === 'default') return null;

  const details = contextDetails[context as keyof typeof contextDetails] || contextDetails['default'];
  const IconComponent = details.icon;

  return (
    <div className="fixed top-20 right-6 z-50 animate-in slide-in-from-right duration-500">
      <div className={`bg-gradient-to-r ${details.color} text-white px-4 py-2 rounded-full shadow-lg backdrop-blur-md flex items-center space-x-2 border border-gray-700/40`}>
        <IconComponent className="w-4 h-4" />
        <span className="text-sm font-medium">{details.label}</span>
      </div>
    </div>
  );
}; 