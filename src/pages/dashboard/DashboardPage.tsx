import React from 'react';
import { useFamily } from '../../context/FamilyContext';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Users, 
  GitFork, 
  Split, 
  Image as ImageIcon, 
  FileText, 
  Calendar, 
  PlusCircle, 
  Sparkles, 
  Cake, 
  Heart, 
  History, 
  ArrowRight, 
  BookOpen, 
  UserPlus, 
  ExternalLink,
  MapPin,
  Clock
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { family, members, branches, photos, documents, events, activityLogs, stories } = useFamily();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Metrics
  const totalMembers = members.length;
  const totalGenerations = Math.max(...members.map(m => m.generation || 1), 1);
  const livingMembers = members.filter(m => m.isLiving).length;
  const deceasedMembers = totalMembers - livingMembers;

  // Upcoming Birthdays in next 90 days (or all upcoming)
  const upcomingBirthdays = members
    .filter(m => m.birthDate && m.isLiving)
    .map(m => {
      const parts = m.birthDate!.split('-');
      const month = parts[1];
      const day = parts[2];
      return { member: m, month, day, dateStr: `${month}-${day}` };
    })
    .sort((a, b) => a.dateStr.localeCompare(b.dateStr))
    .slice(0, 4);

  // Recent additions
  const recentMembers = [...members].reverse().slice(0, 4);

  return (
    <div className="space-y-8 pb-12">
      
      {/* Welcome Banner / Header */}
      <div className="bg-gradient-to-r from-forest-900 via-forest-800 to-forest-900 text-white rounded-3xl p-6 sm:p-8 shadow-elevated relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(#66b087_1px,transparent_1px)] [background-size:16px_16px] opacity-20 hidden md:block" />
        
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-700/80 border border-forest-500/40 text-forest-200 text-[11px] font-semibold">
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>Family Heritage Control Center</span>
          </div>

          <h1 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight">
            Welcome back, {user?.displayName || 'Family Historian'}
          </h1>
          
          <p className="text-forest-200 text-xs sm:text-sm leading-relaxed max-w-2xl">
            {family.name} is currently chronicling <span className="text-white font-bold">{totalMembers} individuals</span> across <span className="text-white font-bold">{totalGenerations} generations</span> and <span className="text-white font-bold">{branches.length} family branches</span>.
          </p>

          {/* Quick Action Pills */}
          <div className="pt-3 flex flex-wrap gap-2.5">
            <Link
              to="/tree"
              className="px-4 py-2 bg-emerald-400 hover:bg-emerald-300 text-forest-950 rounded-xl text-xs font-bold shadow transition flex items-center gap-1.5 active:scale-95"
            >
              <GitFork className="w-3.5 h-3.5" />
              <span>Explore Interactive Tree</span>
            </Link>
            <Link
              to="/relationships"
              className="px-4 py-2 bg-forest-700 hover:bg-forest-600 text-white rounded-xl text-xs font-semibold border border-forest-500/50 transition flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Relationship Finder</span>
            </Link>
            <Link
              to="/timeline"
              className="px-4 py-2 bg-forest-700 hover:bg-forest-600 text-white rounded-xl text-xs font-semibold border border-forest-500/50 transition flex items-center gap-1.5"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Family Timeline</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 1. Statistics Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-soft">
          <div className="flex items-center justify-between text-stone-500 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider">Members</span>
            <Users className="w-4 h-4 text-forest-600" />
          </div>
          <span className="text-2xl font-serif font-bold text-stone-900">{totalMembers}</span>
          <p className="text-[10px] text-stone-500 mt-1">{livingMembers} living • {deceasedMembers} deceased</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-soft">
          <div className="flex items-center justify-between text-stone-500 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider">Generations</span>
            <GitFork className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-2xl font-serif font-bold text-stone-900">{totalGenerations}</span>
          <p className="text-[10px] text-stone-500 mt-1">1918 to {new Date().getFullYear()}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-soft">
          <div className="flex items-center justify-between text-stone-500 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider">Branches</span>
            <Split className="w-4 h-4 text-amber-600" />
          </div>
          <span className="text-2xl font-serif font-bold text-stone-900">{branches.length}</span>
          <p className="text-[10px] text-stone-500 mt-1 truncate">
            {branches.length > 0 ? branches.map(b => b.name).join(', ') : 'Lineage groups'}
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-soft">
          <div className="flex items-center justify-between text-stone-500 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider">Photos</span>
            <ImageIcon className="w-4 h-4 text-rose-600" />
          </div>
          <span className="text-2xl font-serif font-bold text-stone-900">{photos.length}</span>
          <p className="text-[10px] text-stone-500 mt-1">Restored & tagged</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-soft">
          <div className="flex items-center justify-between text-stone-500 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider">Documents</span>
            <FileText className="w-4 h-4 text-purple-600" />
          </div>
          <span className="text-2xl font-serif font-bold text-stone-900">{documents.length}</span>
          <p className="text-[10px] text-stone-500 mt-1">Deeds & Certificates</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-soft">
          <div className="flex items-center justify-between text-stone-500 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider">Stories</span>
            <BookOpen className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl font-serif font-bold text-stone-900">{stories.length}</span>
          <p className="text-[10px] text-stone-500 mt-1">Written memoirs</p>
        </div>
      </div>

      {/* 2. Main Dashboard Widgets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Recent Members & Upcoming Events */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Upcoming Family Events Widget */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-soft space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-forest-700" />
                <h3 className="font-serif font-bold text-base text-stone-900">Upcoming Family Events & Reunions</h3>
              </div>
              <Link to="/events" className="text-xs text-forest-700 font-semibold hover:underline flex items-center gap-1">
                <span>View all</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-3">
              {events.slice(0, 2).map((ev) => (
                <div key={ev.id} className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-forest-100 text-forest-800 flex flex-col items-center justify-center flex-shrink-0 font-bold leading-none border border-forest-200">
                      <span className="text-[10px] uppercase">{new Date(ev.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                      <span className="text-base font-serif">{new Date(ev.date).getDate()}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-stone-900">{ev.title}</h4>
                      <p className="text-stone-500 text-xs mt-0.5 line-clamp-1">{ev.description}</p>
                      <div className="flex items-center gap-3 text-[11px] text-stone-500 mt-1 font-medium">
                        {ev.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-stone-400" /> {ev.location}
                          </span>
                        )}
                        {ev.rsvps && (
                          <span className="text-forest-700 font-semibold">
                            {ev.rsvps.filter(r => r.status === 'attending').length} Attending
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <Link
                    to="/events"
                    className="px-3.5 py-1.5 bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 rounded-xl text-xs font-semibold transition self-start sm:self-center"
                  >
                    RSVP Details
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Family Members Grid */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-soft space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-forest-700" />
                <h3 className="font-serif font-bold text-base text-stone-900">Recently Updated Lineage Records</h3>
              </div>
              <Link to="/members" className="text-xs text-forest-700 font-semibold hover:underline flex items-center gap-1">
                <span>All {totalMembers} members</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {recentMembers.map((m) => (
                <div
                  key={m.id}
                  onClick={() => navigate(`/members/${m.id}`)}
                  className="p-3.5 rounded-2xl bg-stone-50 hover:bg-forest-50/50 border border-stone-200 hover:border-forest-200 cursor-pointer transition flex items-center gap-3 group"
                >
                  {m.avatarUrl ? (
                    <img src={m.avatarUrl} alt="" className="w-12 h-12 rounded-xl object-cover border border-stone-200" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-forest-100 text-forest-800 font-bold flex items-center justify-center font-serif text-sm">
                      {m.firstName.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs text-stone-900 truncate group-hover:text-forest-800">
                      {m.firstName} {m.lastName}
                    </h4>
                    <p className="text-[11px] text-stone-500 truncate">{m.occupation || (m.isLiving ? 'Living' : 'Deceased')}</p>
                    <span className="text-[10px] text-forest-700 font-medium font-mono">
                      Generation {m.generation}
                    </span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-forest-700 transition" />
                </div>
              ))}
            </div>
          </div>

          {/* Photo Memory Carousel Highlight */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-soft space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-forest-700" />
                <h3 className="font-serif font-bold text-base text-stone-900">Featured Historical Memories</h3>
              </div>
              <Link to="/photos" className="text-xs text-forest-700 font-semibold hover:underline flex items-center gap-1">
                <span>View album gallery</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {photos.slice(0, 4).map((p) => (
                <div key={p.id} onClick={() => navigate('/photos')} className="group relative rounded-2xl overflow-hidden aspect-square border border-stone-200 cursor-pointer">
                  <img src={p.url} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                    <p className="text-[10px] text-white font-medium line-clamp-1 leading-tight">{p.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right 1 Column: Upcoming Birthdays & Activity Feed */}
        <div className="space-y-6">
          
          {/* Upcoming Birthdays Widget */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-soft space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cake className="w-5 h-5 text-rose-500" />
                <h3 className="font-serif font-bold text-base text-stone-900">Upcoming Birthdays</h3>
              </div>
            </div>

            <div className="space-y-2.5">
              {upcomingBirthdays.length === 0 ? (
                <p className="text-xs text-stone-400">No upcoming birthdays recorded.</p>
              ) : (
                upcomingBirthdays.map(({ member, month, day }) => (
                  <div
                    key={member.id}
                    onClick={() => navigate(`/members/${member.id}`)}
                    className="p-3 rounded-2xl bg-rose-50/50 border border-rose-100 flex items-center justify-between hover:bg-rose-50 cursor-pointer transition"
                  >
                    <div className="flex items-center gap-2.5">
                      {member.avatarUrl ? (
                        <img src={member.avatarUrl} alt="" className="w-8 h-8 rounded-lg object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 font-bold flex items-center justify-center text-xs">
                          {member.firstName.charAt(0)}
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold text-xs text-stone-900 leading-tight">
                          {member.firstName} {member.lastName}
                        </h4>
                        <p className="text-[10px] text-stone-500">Gen {member.generation}</p>
                      </div>
                    </div>

                    <span className="text-[11px] font-bold text-rose-700 bg-white px-2 py-0.5 rounded-md border border-rose-200 font-mono">
                      {new Date(2000, Number(month) - 1, Number(day)).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Family Activity Log Widget */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-soft space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-forest-700" />
                <h3 className="font-serif font-bold text-base text-stone-900">Recent Activity Feed</h3>
              </div>
              <Link to="/activity" className="text-xs text-forest-700 font-semibold hover:underline">
                View all
              </Link>
            </div>

            <div className="space-y-3">
              {activityLogs.slice(0, 4).map((log) => (
                <div key={log.id} className="text-xs flex items-start gap-2.5 pb-2.5 border-b border-stone-100 last:border-0 last:pb-0">
                  <div className="w-2 h-2 rounded-full bg-forest-600 mt-1.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-stone-800 font-medium leading-snug">
                      <span className="font-bold text-stone-900">{log.userName}</span> {log.action.replace('_', ' ')} <strong className="text-forest-800">{log.targetName}</strong>
                    </p>
                    {log.details && (
                      <p className="text-[11px] text-stone-500 truncate mt-0.5">{log.details}</p>
                    )}
                    <span className="text-[10px] text-stone-400 block mt-0.5">
                      {new Date(log.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
