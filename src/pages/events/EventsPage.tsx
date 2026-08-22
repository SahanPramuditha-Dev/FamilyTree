import React, { useState } from 'react';
import { useFamily } from '../../context/FamilyContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Calendar, 
  Plus, 
  MapPin, 
  Clock, 
  Users, 
  Check, 
  X, 
  HelpCircle, 
  Sparkles,
  Cake,
  Heart,
  Share2
} from 'lucide-react';
import { EventType } from '../../types';

export const EventsPage: React.FC = () => {
  const { events, members, addEvent, rsvpEvent } = useFamily();
  const { user } = useAuth();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventType, setEventType] = useState<EventType>('reunion');
  const [date, setDate] = useState('2026-12-28');
  const [time, setTime] = useState('11:00 AM');
  const [location, setLocation] = useState('Mount Lavinia Hotel, Colombo, Sri Lanka');
  const [rsvpRequired, setRsvpRequired] = useState(true);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addEvent({
      title,
      description: description || undefined,
      eventType,
      date,
      time: time || undefined,
      location: location || undefined,
      participantIds: members.slice(0, 5).map(m => m.id),
      rsvpRequired
    });

    setTitle('');
    setDescription('');
    setIsAddOpen(false);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-2">
            <Calendar className="w-3.5 h-3.5 text-emerald-600" />
            <span>Family Gatherings & Reunions</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900">
            Family Events & Reunions
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 max-w-2xl mt-1">
            Coordinate milestone birthdays, grand reunions, anniversaries, and family celebrations with RSVP tracking.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2.5 bg-forest-700 hover:bg-forest-800 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5 active:scale-95 self-start sm:self-center"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create New Event</span>
        </button>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map((ev) => {
          const attendingCount = (ev.rsvps || []).filter(r => r.status === 'attending').length;
          const maybeCount = (ev.rsvps || []).filter(r => r.status === 'maybe').length;
          const declinedCount = (ev.rsvps || []).filter(r => r.status === 'declined').length;

          return (
            <div key={ev.id} className="bg-white rounded-3xl p-6 border border-stone-200 shadow-soft hover:shadow-elevated transition flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                
                {/* Event header badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-forest-100 text-forest-800 flex flex-col items-center justify-center font-bold leading-none border border-forest-200">
                      <span className="text-[10px] uppercase font-mono">{new Date(ev.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                      <span className="text-lg font-serif">{new Date(ev.date).getDate()}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-forest-700 bg-forest-50 px-2 py-0.5 rounded-full border border-forest-200">
                        {ev.eventType}
                      </span>
                      <h3 className="font-serif font-bold text-base text-stone-900 mt-1">{ev.title}</h3>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed">
                  {ev.description}
                </p>

                {/* Metadata */}
                <div className="space-y-1.5 pt-2 border-t border-stone-100 text-xs text-stone-500">
                  {ev.time && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      <span>{ev.time}</span>
                    </div>
                  )}
                  {ev.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-stone-400" />
                      <span>{ev.location}</span>
                    </div>
                  )}
                </div>

                {/* RSVPs Bar */}
                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-stone-800">RSVP Status</span>
                    <div className="flex gap-3 text-[11px] font-medium">
                      <span className="text-emerald-700">✓ {attendingCount} Attending</span>
                      <span className="text-amber-700">? {maybeCount} Maybe</span>
                      <span className="text-rose-700">✕ {declinedCount} Declined</span>
                    </div>
                  </div>

                  {/* Quick User RSVP Toggle */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => rsvpEvent(ev.id, user?.uid || 'user-demo', 'attending')}
                      className="flex-1 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-1 transition"
                    >
                      <Check className="w-3 h-3" /> I'll Attend
                    </button>
                    <button
                      onClick={() => rsvpEvent(ev.id, user?.uid || 'user-demo', 'maybe')}
                      className="flex-1 py-1.5 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs font-semibold flex items-center justify-center gap-1 transition"
                    >
                      <HelpCircle className="w-3 h-3" /> Maybe
                    </button>
                    <button
                      onClick={() => rsvpEvent(ev.id, user?.uid || 'user-demo', 'declined')}
                      className="flex-1 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs font-semibold flex items-center justify-center gap-1 transition"
                    >
                      <X className="w-3 h-3" /> Can't Go
                    </button>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Add Event Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-serif font-bold text-base text-stone-900">Schedule Family Event</h3>
              <button onClick={() => setIsAddOpen(false)} className="p-1 rounded-full text-stone-400 hover:text-stone-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Event Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2026 Grand Family Reunion"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs rounded-xl border border-stone-300 p-2.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Event Type</label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value as EventType)}
                    className="w-full text-xs rounded-xl border border-stone-300 p-2.5 capitalize"
                  >
                    <option value="reunion">Reunion</option>
                    <option value="birthday">Birthday</option>
                    <option value="wedding">Wedding</option>
                    <option value="anniversary">Anniversary</option>
                    <option value="gathering">Gathering</option>
                    <option value="graduation">Graduation</option>
                    <option value="funeral">Memorial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full text-xs rounded-xl border border-stone-300 p-2.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Time</label>
                  <input
                    type="text"
                    placeholder="e.g. 06:00 PM"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full text-xs rounded-xl border border-stone-300 p-2.5"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Colombo, Sri Lanka"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full text-xs rounded-xl border border-stone-300 p-2.5"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Description & Details</label>
                <textarea
                  rows={3}
                  placeholder="Dress code, agenda, banquet details..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-xs rounded-xl border border-stone-300 p-2.5"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 bg-stone-100 rounded-xl text-xs font-semibold text-stone-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-forest-700 hover:bg-forest-800 text-white rounded-xl text-xs font-semibold shadow"
                >
                  Schedule Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
