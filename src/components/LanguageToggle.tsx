import { useState } from 'react';
import { ChevronDown, Globe, Search, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

interface LanguageToggleProps {
  selectedLanguage: string;
  onLanguageChange: (lang: string) => void;
}

const languages = [
  { code: 'en', name: 'English', native: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'Hindi', native: 'हिंदी', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', native: 'मराठी', flag: '🇮🇳' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
];

export const LanguageToggle = ({ selectedLanguage, onLanguageChange }: LanguageToggleProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const selectedLang = languages.find(lang => lang.code === selectedLanguage);

  const filteredLanguages = languages.filter(lang =>
    lang.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lang.native.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLanguageSelect = (langCode: string) => {
    onLanguageChange(langCode);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-gray-800/80 hover:bg-gray-700/80 border-gray-700/50 shadow-sm h-10 px-4"
      >
        <Globe className="w-4 h-4 text-orange-400" />
        <span className="hidden sm:inline text-sm font-medium text-gray-200">
          {selectedLang?.flag} {selectedLang?.native}
        </span>
        <span className="sm:hidden text-sm font-medium text-gray-200">
          {selectedLang?.flag}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-300 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <Card className="absolute right-0 mt-2 w-72 z-50 border-gray-700/50 shadow-xl bg-white/95 backdrop-blur-md">
            <CardContent className="p-0">
              {/* Header */}
              <div className="p-4 border-b border-gray-700/30">
                <div className="flex items-center space-x-2 mb-3">
                  <Globe className="w-5 h-5 text-orange-500" />
                  <h3 className="font-semibold text-gray-800">Choose Language</h3>
                </div>
                
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search languages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-9 bg-white/80 border-gray-700/50 focus:border-orange-400 focus:ring-orange-400"
                  />
                </div>
              </div>

              {/* Language List */}
              <div className="max-h-64 overflow-y-auto">
                {filteredLanguages.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 text-sm">
                    No languages found
                  </div>
                ) : (
                  filteredLanguages.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => handleLanguageSelect(language.code)}
                      className={`w-full text-left px-4 py-3 hover:bg-orange-50 transition-colors duration-150 flex items-center justify-between group ${
                        selectedLanguage === language.code 
                          ? 'bg-orange-50 text-orange-700 border-r-2 border-orange-500' 
                          : 'text-gray-700 hover:text-orange-700'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{language.flag}</span>
                        <div>
                          <div className="font-medium text-sm">{language.native}</div>
                          <div className="text-xs text-gray-500">{language.name}</div>
                        </div>
                      </div>
                      
                      {selectedLanguage === language.code && (
                        <Check className="w-4 h-4 text-orange-500" />
                      )}
                    </button>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="p-3 border-t border-gray-700/30 bg-orange-50/50">
                <p className="text-xs text-gray-600 text-center">
                  More languages coming soon! 🌏
                </p>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};
