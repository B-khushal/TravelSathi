import { useState, useEffect } from 'react';

interface BackgroundSlideshowProps {
  autoplayInterval?: number;
  context?: string; // New prop to control context-based backgrounds
}

interface ImageSet {
  [key: string]: {
    url: string;
    title: string;
    description: string;
  }[];
}

export const BackgroundSlideshow = ({ autoplayInterval = 8000, context = 'default' }: BackgroundSlideshowProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentContext, setCurrentContext] = useState(context);

  // Context-based image collections
  const imageCollections: ImageSet = {
    'jaipur': [
      {
        url: 'https://images.unsplash.com/photo-1599661046827-dacde6976549?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2669&q=80',
        title: 'Hawa Mahal, Jaipur',
        description: 'Palace of Winds in the Pink City'
      },
      {
        url: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80',
        title: 'Amber Fort, Jaipur',
        description: 'Magnificent hilltop fortress'
      },
      {
        url: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2671&q=80',
        title: 'City Palace, Jaipur',
        description: 'Royal residence and museums'
      }
    ],
    'delhi': [
      {
        url: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80',
        title: 'Red Fort, Delhi',
        description: 'Historic Mughal fortress'
      },
      {
        url: 'https://images.unsplash.com/photo-1558431382-27e50c65044b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2669&q=80',
        title: 'India Gate, Delhi',
        description: 'War memorial and national pride'
      },
      {
        url: 'https://images.unsplash.com/photo-1605640840605-14ac1855827b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2662&q=80',
        title: 'Lotus Temple, Delhi',
        description: 'Architectural marvel of peace'
      }
    ],
    'mumbai': [
      {
        url: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2588&q=80',
        title: 'Mumbai Skyline',
        description: 'City of dreams and opportunities'
      },
      {
        url: 'https://images.unsplash.com/photo-1595658658481-d53d3f999875?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2669&q=80',
        title: 'Gateway of India, Mumbai',
        description: 'Iconic colonial monument'
      },
      {
        url: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2648&q=80',
        title: 'Marine Drive, Mumbai',
        description: 'Queen\'s Necklace promenade'
      }
    ],
    'kerala': [
      {
        url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80',
        title: 'Kerala Backwaters',
        description: 'Serene waterways of God\'s Own Country'
      },
      {
        url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2639&q=80',
        title: 'Alleppey Houseboats',
        description: 'Traditional floating homes'
      },
      {
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80',
        title: 'Kerala Spice Gardens',
        description: 'Lush green plantations'
      }
    ],
    'goa': [
      {
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80',
        title: 'Goa Beaches',
        description: 'Sun, sand, and serenity'
      },
      {
        url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2674&q=80',
        title: 'Portuguese Churches, Goa',
        description: 'Colonial heritage architecture'
      },
      {
        url: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2532&q=80',
        title: 'Goa Sunset',
        description: 'Golden hour by the Arabian Sea'
      }
    ],
    'rajasthan': [
      {
        url: 'https://images.unsplash.com/photo-1548013146-72479768bada?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2676&q=80',
        title: 'Rajasthan Desert',
        description: 'Golden sands and royal heritage'
      },
      {
        url: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80',
        title: 'Rajasthani Palaces',
        description: 'Majestic royal architecture'
      }
    ],
    'food': [
      {
        url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2671&q=80',
        title: 'Indian Spices',
        description: 'Colorful aromatic spice markets'
      },
      {
        url: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80',
        title: 'Traditional Thali',
        description: 'Complete Indian meal experience'
      },
      {
        url: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2517&q=80',
        title: 'Street Food Culture',
        description: 'Vibrant flavors of India'
      }
    ],
    'weather': [
      {
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80',
        title: 'Monsoon Season',
        description: 'Life-giving rains across India'
      },
      {
        url: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2652&q=80',
        title: 'Sunny Indian Skies',
        description: 'Perfect weather for exploration'
      }
    ],
    'emergency': [
      {
        url: 'https://images.unsplash.com/photo-1558431382-27e50c65044b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2669&q=80',
        title: 'Travel Safety',
        description: 'Your safety is our priority'
      }
    ],
    'agra': [
      {
        url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2671&q=80',
        title: 'Taj Mahal, Agra',
        description: 'Symbol of eternal love'
      },
      {
        url: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80',
        title: 'Agra Fort',
        description: 'Red sandstone marvel'
      }
    ],
    'varanasi': [
      {
        url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80',
        title: 'Varanasi Ghats',
        description: 'Spiritual heart of India'
      },
      {
        url: 'https://images.unsplash.com/photo-1562577309-4932fdd64cd1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2574&q=80',
        title: 'Ganges Rituals',
        description: 'Sacred river ceremonies'
      }
    ],
    'bangalore': [
      {
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80',
        title: 'Bangalore Gardens',
        description: 'Garden city of India'
      },
      {
        url: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80',
        title: 'Bangalore Skyline',
        description: 'Silicon Valley of India'
      }
    ],
    'default': [
      {
        url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2671&q=80',
        title: 'Taj Mahal, Agra',
        description: 'Symbol of eternal love'
      },
      {
        url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80',
        title: 'Kerala Backwaters',
        description: 'Serene waterways of God\'s Own Country'
      },
      {
        url: 'https://images.unsplash.com/photo-1599661046827-dacde6976549?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2669&q=80',
        title: 'Hawa Mahal, Jaipur',
        description: 'Palace of Winds in the Pink City'
      },
      {
        url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80',
        title: 'Varanasi Ghats',
        description: 'Spiritual heart of India'
      },
      {
        url: 'https://images.unsplash.com/photo-1548906881-8c7d1638b004?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2669&q=80',
        title: 'Hampi Ruins',
        description: 'Ancient Vijayanagara Empire'
      }
    ]
  };

  // Get current image set based on context
  const getCurrentImages = () => {
    return imageCollections[currentContext] || imageCollections['default'];
  };

  const travelImages = getCurrentImages();

  // Handle context changes
  useEffect(() => {
    if (context !== currentContext) {
      setCurrentContext(context);
      setCurrentSlide(0); // Reset to first slide when context changes
    }
  }, [context, currentContext]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % travelImages.length);
    }, autoplayInterval);

    return () => clearInterval(interval);
  }, [autoplayInterval, travelImages.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="fixed inset-0 z-0">
      {/* Image Slides */}
      <div className="relative w-full h-full overflow-hidden">
        {travelImages.map((image, index) => (
          <div
            key={`${currentContext}-${index}`}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentSlide
                ? 'opacity-100 scale-100 slide-enter'
                : 'opacity-0 scale-105 slide-exit'
            }`}
          >
            <img
              src={image.url}
              alt={image.title}
              className="w-full h-full object-cover"
              loading={index <= 2 ? 'eager' : 'lazy'}
            />
            
            {/* Dynamic gradient overlays based on context */}
            <div className={`absolute inset-0 ${
              currentContext === 'food' 
                ? 'bg-gradient-to-br from-orange-900/20 via-transparent to-red-900/30'
                : currentContext === 'weather'
                ? 'bg-gradient-to-br from-blue-900/20 via-transparent to-cyan-900/30'
                : currentContext === 'emergency'
                ? 'bg-gradient-to-br from-red-900/20 via-transparent to-orange-900/30'
                : 'bg-gradient-to-br from-black/20 via-transparent to-black/30'
            }`} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            
            {/* Context indicator */}
            {currentContext !== 'default' && (
              <div className="absolute top-6 right-6 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 text-white text-sm font-medium">
                📍 {currentContext.charAt(0).toUpperCase() + currentContext.slice(1)}
              </div>
            )}
            
            {/* Image Info Badge */}
            {index === currentSlide && (
              <div className="absolute bottom-6 left-6 bg-white/10 backdrop-blur-md rounded-xl p-4 text-white transform transition-all duration-500 translate-y-0 opacity-100 float shadow-elegant">
                <h3 className="font-bold text-lg mb-1 gradient-text bg-gradient-to-r from-white to-orange-100 bg-clip-text text-transparent">{image.title}</h3>
                <p className="text-sm text-white/90">{image.description}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-6 right-6 flex space-x-2 z-10">
        {travelImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-110 ${
              index === currentSlide
                ? 'bg-white shadow-lg'
                : 'bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar with context color */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
        <div
          className={`h-full transition-all duration-100 ease-linear ${
            currentContext === 'food' 
              ? 'bg-gradient-to-r from-orange-400 to-red-500'
              : currentContext === 'weather'
              ? 'bg-gradient-to-r from-blue-400 to-cyan-500'
              : currentContext === 'emergency'
              ? 'bg-gradient-to-r from-red-400 to-orange-500'
              : 'bg-gradient-to-r from-orange-400 to-red-500'
          }`}
          style={{
            width: `${((currentSlide + 1) / travelImages.length) * 100}%`,
          }}
        />
      </div>

      {/* Subtle pattern overlay for texture */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white' fill-opacity='0.1'%3E%3Cpath d='m0 40 40-40h-40z'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '40px 40px'
        }} />
      </div>
    </div>
  );
}; 