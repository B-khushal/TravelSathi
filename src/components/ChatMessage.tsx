import { User, Bot, WifiOff, MapPin, CloudSun, Utensils, AlertTriangle, Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isOffline?: boolean;
  type?: 'text' | 'destination' | 'emergency' | 'weather';
  metadata?: any;
}

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const getMessageIcon = () => {
    switch (message.type) {
      case 'destination':
        return <MapPin className="w-4 h-4" />;
      case 'weather':
        return <CloudSun className="w-4 h-4" />;
      case 'emergency':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Bot className="w-4 h-4" />;
    }
  };

  const getMessageTypeColor = () => {
    switch (message.type) {
      case 'destination':
        return 'from-blue-500 to-cyan-500';
      case 'weather':
        return 'from-yellow-500 to-orange-500';
      case 'emergency':
        return 'from-red-500 to-pink-500';
      default:
        return 'from-green-500 to-teal-500';
    }
  };

  const getMessageTypeBadge = () => {
    switch (message.type) {
      case 'destination':
        return (
          <Badge variant="secondary" className="mb-2 bg-blue-100 text-blue-700 text-xs">
            <MapPin className="w-3 h-3 mr-1" />
            Destination Info
          </Badge>
        );
      case 'weather':
        return (
          <Badge variant="secondary" className="mb-2 bg-yellow-100 text-yellow-700 text-xs">
            <CloudSun className="w-3 h-3 mr-1" />
            Weather Update
          </Badge>
        );
      case 'emergency':
        return (
          <Badge variant="secondary" className="mb-2 bg-red-100 text-red-700 text-xs">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Emergency Info
          </Badge>
        );
      default:
        return null;
    }
  };

  const formatMessageText = (text: string) => {
    // Convert markdown-style formatting to HTML
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold text
      .replace(/(?:^|\n)• (.*?)(?=\n|$)/g, '<div class="flex items-start space-x-2 my-1"><span class="text-orange-500 mt-1">•</span><span>$1</span></div>') // Bullet points
      .replace(/(?:^|\n)(🔥|🏪|🌡️|📅|🧳|💡|🗓️|🎒|💰|🌶️) \*\*(.*?)\*\*/g, '<div class="font-semibold text-gray-800 mt-3 mb-2 flex items-center"><span class="mr-2">$1</span>$2</div>') // Section headers with emojis
      .split('\n').map(line => {
        if (line.trim() === '') return '<br />';
        if (line.includes('•')) return line;
        return `<div class="mb-1">${line}</div>`;
      }).join('');
  };

  return (
    <div className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} message-enter`}>
      <div className={`flex max-w-xs lg:max-w-2xl ${message.isUser ? 'flex-row-reverse' : 'flex-row'} items-start space-x-3`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
          message.isUser 
            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white ml-3' 
            : `bg-gradient-to-r ${getMessageTypeColor()} text-white mr-3`
        }`}>
          {message.isUser ? (
            <User className="w-5 h-5" />
          ) : (
            getMessageIcon()
          )}
        </div>

        {/* Message Content */}
        <div className={`rounded-2xl shadow-sm ${
          message.isUser
            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
            : 'bg-white border border-gray-700/30'
        }`}>
          {/* Message Type Badge for Assistant */}
          {!message.isUser && getMessageTypeBadge() && (
            <div className="px-4 pt-3">
              {getMessageTypeBadge()}
            </div>
          )}

          {/* Offline indicator */}
          {message.isOffline && (
            <div className="px-4 pt-3">
              <div className="flex items-center space-x-2 bg-orange-100 rounded-lg p-2 mb-2">
                <WifiOff className="w-4 h-4 text-orange-600" />
                <span className="text-sm text-orange-700 font-medium">Showing cached offline info</span>
              </div>
            </div>
          )}
          
          {/* Message Text */}
          <div className="px-4 py-3">
            {message.isUser ? (
              <p className="text-sm leading-relaxed">{message.text}</p>
            ) : (
              <div 
                className="text-sm leading-relaxed text-gray-800 prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: formatMessageText(message.text) }}
              />
            )}
          </div>
          
          {/* Timestamp */}
          <div className={`px-4 pb-3 flex items-center space-x-1 ${
            message.isUser ? 'justify-end text-blue-100' : 'justify-start text-gray-500'
          }`}>
            <Clock className="w-3 h-3" />
            <span className="text-xs">
              {format(message.timestamp, 'HH:mm')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
