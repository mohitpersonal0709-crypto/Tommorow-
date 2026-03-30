/**
 * Major Indian Festivals and Observances for 2026
 * This is a representative list. In a production app, this would be fetched from an API.
 */

import { format } from 'date-fns';

export interface Festival {
  date: string; // YYYY-MM-DD
  name: string;
  type: 'festival' | 'observance' | 'holiday';
  description?: string;
  hijriDate?: string;
}

export const INDIAN_FESTIVALS: Festival[] = [
  // 2025
  { 
    date: '2025-01-01', 
    name: 'New Year\'s Day', 
    type: 'observance',
    description: 'The first day of the year in the Gregorian calendar, celebrated globally with fireworks and resolutions.'
  },
  { 
    date: '2025-01-14', 
    name: 'Makar Sankranti / Pongal', 
    type: 'festival',
    description: 'A harvest festival marking the transition of the Sun into Capricorn. Celebrated with kites and traditional sweets.'
  },
  { 
    date: '2025-01-26', 
    name: 'Republic Day', 
    type: 'holiday',
    description: 'Commemorates the date on which the Constitution of India came into effect in 1950.'
  },
  { 
    date: '2025-02-26', 
    name: 'Maha Shivaratri', 
    type: 'festival',
    description: 'A major Hindu festival celebrated annually in honor of Lord Shiva, marking the night of his marriage to Parvati.'
  },
  { 
    date: '2025-03-14', 
    name: 'Holi', 
    type: 'festival',
    description: 'The festival of colors, celebrating the arrival of spring and the victory of good over evil.'
  },
  { 
    date: '2025-03-31', 
    name: 'Eid al-Fitr', 
    type: 'festival',
    description: 'The "Festival of Breaking the Fast", marking the end of Ramadan, the Islamic holy month of fasting.'
  },
  { 
    date: '2025-08-15', 
    name: 'Independence Day', 
    type: 'holiday',
    description: 'Commemorates India\'s independence from the United Kingdom on 15 August 1947.'
  },
  { 
    date: '2025-10-20', 
    name: 'Diwali', 
    type: 'festival',
    description: 'The festival of lights, symbolizing the spiritual victory of light over darkness and good over evil.'
  },

  // 2026
  { 
    date: '2026-01-01', 
    name: 'New Year\'s Day', 
    type: 'observance',
    description: 'Celebration of the start of the new year.'
  },
  { 
    date: '2026-01-14', 
    name: 'Makar Sankranti', 
    type: 'festival',
    description: 'Harvest festival dedicated to the Sun God.'
  },
  { 
    date: '2026-01-26', 
    name: 'Republic Day', 
    type: 'holiday',
    description: 'Celebration of India\'s Constitution.'
  },
  { 
    date: '2026-03-03', 
    name: 'Holi', 
    type: 'festival',
    description: 'The vibrant festival of colors and joy.'
  },
  { 
    date: '2026-04-20', 
    name: 'Eid al-Fitr', 
    type: 'festival',
    description: 'Celebration marking the end of the fasting month of Ramadan.'
  },
  { 
    date: '2026-08-15', 
    name: 'Independence Day', 
    type: 'holiday',
    description: 'National holiday commemorating India\'s freedom.'
  },
  { 
    date: '2026-11-08', 
    name: 'Diwali', 
    type: 'festival',
    description: 'The grand festival of lights and prosperity.'
  },
  { 
    date: '2026-12-25', 
    name: 'Christmas', 
    type: 'holiday',
    description: 'Commemorating the birth of Jesus Christ.'
  },

  // 2027
  { 
    date: '2027-01-01', 
    name: 'New Year\'s Day', 
    type: 'observance',
    description: 'Beginning of the Gregorian year.'
  },
  { 
    date: '2027-03-09', 
    name: 'Eid al-Fitr', 
    type: 'festival',
    description: 'Islamic festival of breaking the fast.'
  },
  { 
    date: '2027-03-22', 
    name: 'Holi', 
    type: 'festival',
    description: 'Spring festival of colors.'
  },
  { 
    date: '2027-08-15', 
    name: 'Independence Day', 
    type: 'holiday',
    description: 'India\'s 80th Independence Day.'
  },
  { 
    date: '2027-10-29', 
    name: 'Diwali', 
    type: 'festival',
    description: 'Festival of lights and joy.'
  }
];

export function getHijriDate(date: Date): string {
  try {
    return new Intl.DateTimeFormat('en-u-ca-islamic-uma', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  } catch (e) {
    return '';
  }
}

export async function fetchFestivals(year: number): Promise<Festival[]> {
  // Simulating an external API call with a delay
  // In a real scenario, you'd use: const response = await fetch(`https://api.example.com/festivals?year=${year}`);
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return INDIAN_FESTIVALS
    .filter(f => f.date.startsWith(year.toString()))
    .map(f => {
      // Add Hijri date for Islamic festivals
      if (f.name.toLowerCase().includes('eid') || f.name.toLowerCase().includes('ramadan')) {
        return { ...f, hijriDate: getHijriDate(new Date(f.date)) };
      }
      return f;
    });
}

export function getFestivalForDate(date: Date): Festival | undefined {
  const dateString = format(date, 'yyyy-MM-dd');
  const festival = INDIAN_FESTIVALS.find(f => f.date === dateString);
  if (festival && (festival.name.toLowerCase().includes('eid') || festival.name.toLowerCase().includes('ramadan'))) {
    return { ...festival, hijriDate: getHijriDate(date) };
  }
  return festival;
}
