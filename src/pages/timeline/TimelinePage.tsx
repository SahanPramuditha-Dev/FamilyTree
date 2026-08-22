import React, { useState, useMemo } from 'react';
import { useFamily } from '../../context/FamilyContext';
import { useNavigate } from 'react-router-dom';
import { 
  Clock, 
  Filter, 
  Calendar, 
  Heart, 
  GraduationCap, 
  Briefcase, 
  MapPin, 
  Sparkles, 
  ArrowRight,
  User
} from 'lucide-react';

export const TimelinePage: React.FC = () => {
  const { members, events, family } = useFamily();
  const navigate = useNavigate();
  const [filterType, setFilterType] = useState<string>('all');

  // Synthesize complete chronological events from members and family events
  const timelineEvents = useMemo(() => {
    const list: {
      id: string;
      year: number;
      fullDate?: string;
      title: string;
      description: string;
      type: 'birth' | 'marriage' | 'death' | 'event' | 'career';
      location?: string;
      memberId?: string;
      memberName?: string;
      avatarUrl?: string;
    }[] = [];

    // 1. Births & Deaths from members
    members.forEach(m => {
      if (m.birthDate) {
        const year = parseInt(m.birthDate.split('-')[0], 10);
        list.push({
          id: `birth-${m.id}`,
          year: isNaN(year) ? 1900 : year,
          fullDate: m.birthDate,
          title: `${m.firstName} ${m.lastName} Born`,
          description: `Welcome to Generation ${m.generation} in ${m.birthPlace || 'ancestral home'}`,
          type: 'birth',
          location: m.birthPlace,
          memberId: m.id,
          memberName: `${m.firstName} ${m.lastName}`,
          avatarUrl: m.avatarUrl
        });
      }

      if (!m.isLiving && m.deathDate) {
        const year = parseInt(m.deathDate.split('-')[0], 10);
        list.push({
          id: `death-${m.id}`,
          year: isNaN(year) ? 2000 : year,
          fullDate: m.deathDate,
          title: `In Loving Memory: ${m.firstName} ${m.lastName}`,
          description: `Passed peacefully in ${m.deathPlace || 'homeland'}. Life preserved in memory archives.`,
          type: 'death',
          location: m.deathPlace,
          memberId: m.id,
          memberName: `${m.firstName} ${m.lastName}`,
          avatarUrl: m.avatarUrl
        });
      }

      if (m.occupation) {
        const birthYear = m.birthDate ? parseInt(m.birthDate.split('-')[0], 10) : 1950;
        list.push({
          id: `career-${m.id}`,
          year: isNaN(birthYear) ? 1980 : birthYear + 25,
          title: `${m.firstName} appointed as ${m.occupation}`,
          description: `${m.education ? `Educated at ${m.education}. ` : ''}Career milestone reached.`,
          type: 'career',
          memberId: m.id,
          memberName: `${m.firstName} ${m.lastName}`,
          avatarUrl: m.avatarUrl
        });
      }
    });

    // 2. Family Events
    events.forEach(e => {
      const year = parseInt(e.date.split('-')[0], 10);
      list.push({
        id: e.id,
        year: isNaN(year) ? 2026 : year,
        fullDate: e.date,
        title: e.title,
        description: e.description || '',
        type: e.eventType === 'wedding' || e.eventType === 'anniversary' ? 'marriage' : 'event',
        location: e.location
      });
    });

    // Sort chronologically ascending
    return list.sort((a, b) => a.year - b.year);
  }, [members, events]);

  const filteredTimeline = useMemo(() => {
    if (filterType === 'all') return timelineEvents;
    return timelineEvents.filter(e => e.type === filterType);
  }, [timelineEvents, filterType]);

  // Group events by Decade
  const groupedByDecade = useMemo(() => {
    const map = new Map<string, typeof filteredTimeline>();
    filteredTimeline.forEach(ev => {
      const decade = `${Math.floor(ev.year / 10) * 10}s`;
      if (!map.has(decade)) map.set(decade, []);
      map.get(decade)!.push(ev);
    });
    return map;
  }, [filteredTimeline]);

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold mb-2">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span>Chronological Family Chronicle</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900">
            Family Heritage Timeline
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 max-w-2xl mt-1">
            Explore births, marriages, career achievements, and migrations across a continuous historical timeline.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2 bg-white p-1.5 rounded-2xl border border-stone-200 shadow-soft">
          {[
            { key: 'all', label: 'All Milestones' },
            { key: 'birth', label: 'Births' },
            { key: 'marriage', label: 'Marriages & Reunions' },
            { key: 'career', label: 'Careers' },
            { key: 'death', label: 'Memorials' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilterType(tab.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                filterType === tab.key 
                  ? 'bg-forest-700 text-white shadow-sm' 
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="space-y-12 max-w-4xl mx-auto">
        {Array.from(groupedByDecade.entries()).map(([decade, decadeEvents]) => (
          <div key={decade} className="space-y-6">
            
            {/* Decade Marker */}
            <div className="flex items-center gap-4">
              <span className="font-serif text-2xl font-bold text-stone-900 bg-stone-100 px-4 py-1.5 rounded-2xl border border-stone-300 shadow-xs">
                The {decade}
              </span>
              <div className="flex-1 h-0.5 bg-stone-200" />
            </div>

            {/* Events within Decade */}
            <div className="relative pl-6 sm:pl-8 border-l-2 border-forest-300 space-y-6 ml-4 sm:ml-6">
              {decadeEvents.map((item) => (
                <div key={item.id} className="relative group">
                  {/* Dot Badge */}
                  <div className={`absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full border-2 border-white ring-2 transition group-hover:scale-125 ${
                    item.type === 'birth' ? 'bg-forest-600 ring-forest-200' :
                    item.type === 'marriage' ? 'bg-pink-500 ring-pink-200' :
                    item.type === 'death' ? 'bg-stone-800 ring-stone-300' :
                    item.type === 'career' ? 'bg-blue-600 ring-blue-200' :
                    'bg-amber-500 ring-amber-200'
                  }`} />

                  {/* Card Content */}
                  <div 
                    onClick={() => item.memberId && navigate(`/members/${item.memberId}`)}
                    className={`bg-white rounded-3xl p-5 border border-stone-200 shadow-soft transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      item.memberId ? 'hover:shadow-elevated hover:border-forest-300 cursor-pointer' : ''
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {item.avatarUrl ? (
                        <img src={item.avatarUrl} alt="" className="w-12 h-12 rounded-2xl object-cover border border-stone-200 flex-shrink-0" />
                      ) : (
                        <div className="w-12 h-12 rounded-2xl bg-forest-100 text-forest-800 font-serif font-bold text-sm flex items-center justify-center flex-shrink-0">
                          {item.year}
                        </div>
                      )}

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-forest-700 bg-forest-50 px-2 py-0.5 rounded-md">
                            {item.fullDate || item.year}
                          </span>
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            item.type === 'birth' ? 'bg-emerald-100 text-emerald-800' :
                            item.type === 'marriage' ? 'bg-pink-100 text-pink-800' :
                            item.type === 'death' ? 'bg-stone-100 text-stone-800' :
                            item.type === 'career' ? 'bg-blue-100 text-blue-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {item.type}
                          </span>
                        </div>

                        <h3 className="font-serif font-bold text-base text-stone-900 group-hover:text-forest-800">
                          {item.title}
                        </h3>

                        <p className="text-xs text-stone-600 leading-relaxed">
                          {item.description}
                        </p>

                        {item.location && (
                          <div className="flex items-center gap-1 text-[11px] text-stone-400 pt-1">
                            <MapPin className="w-3 h-3 text-stone-400" />
                            <span>{item.location}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {item.memberId && (
                      <div className="flex items-center gap-1 text-xs text-forest-700 font-semibold self-end sm:self-center">
                        <span>Profile</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>

                </div>
              ))}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
