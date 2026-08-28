import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFamily } from '../../context/FamilyContext';
import { useAuth } from '../../context/AuthContext';
import confetti from 'canvas-confetti';
import { 
  Trees, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles,
  X
} from 'lucide-react';
import { LocationSelector } from '../../components/common/LocationSelector';
import { ThemeToggle } from '../../components/ui/ThemeToggle';

export const OnboardingPage: React.FC = () => {
  const { initializeOnboardingTree } = useFamily();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  // Step 1: Family details
  const [familyName, setFamilyName] = useState('');
  const [familyOrigin, setFamilyOrigin] = useState('');
  const [familyMotto, setFamilyMotto] = useState('');
  const [isPublic] = useState(true);

  // Step 2: Self
  const [selfFirstName, setSelfFirstName] = useState(user?.displayName?.split(' ')[0] || '');
  const [selfLastName, setSelfLastName] = useState(user?.displayName?.split(' ')[1] || '');
  const [selfGender, setSelfGender] = useState<'male' | 'female' | 'other'>('male');
  const [selfBirthDate, setSelfBirthDate] = useState('');
  const [selfBirthPlace, setSelfBirthPlace] = useState('');

  // Step 3: Parents
  const [fatherFirstName, setFatherFirstName] = useState('');
  const [fatherLastName, setFatherLastName] = useState('');
  const [motherFirstName, setMotherFirstName] = useState('');
  const [motherLastName, setMotherLastName] = useState('');

  // Step 4: Spouse / Partner
  const [hasSpouse, setHasSpouse] = useState(false);
  const [spouseFirstName, setSpouseFirstName] = useState('');
  const [spouseLastName, setSpouseLastName] = useState('');
  const [spouseGender, setSpouseGender] = useState<'male' | 'female' | 'other'>('female');

  // Step 5: Children
  const [hasChildren, setHasChildren] = useState(false);
  const [childFirstName, setChildFirstName] = useState('');
  const [childLastName, setChildLastName] = useState('');
  const [childGender, setChildGender] = useState<'male' | 'female' | 'other'>('male');

  const handleFinish = () => {
    const finalFamName = familyName.trim() || `${selfLastName ? selfLastName + ' ' : ''}Family Lineage`;

    initializeOnboardingTree({
      familyName: finalFamName,
      familyOrigin: familyOrigin || 'Global',
      familyMotto: familyMotto || undefined,
      isPublic,
      self: {
        firstName: selfFirstName.trim() || 'Anchor',
        lastName: selfLastName.trim() || 'Family',
        gender: selfGender,
        birthDate: selfBirthDate || undefined,
        birthPlace: selfBirthPlace || undefined,
      },
      father: fatherFirstName.trim()
        ? { firstName: fatherFirstName.trim(), lastName: fatherLastName.trim() || selfLastName.trim() || 'Family' }
        : undefined,
      mother: motherFirstName.trim()
        ? { firstName: motherFirstName.trim(), lastName: motherLastName.trim() || 'Family' }
        : undefined,
      spouse: hasSpouse && spouseFirstName.trim()
        ? { firstName: spouseFirstName.trim(), lastName: spouseLastName.trim() || 'Family' }
        : undefined,
      child: hasChildren && childFirstName.trim()
        ? { firstName: childFirstName.trim(), lastName: childLastName.trim() || selfLastName.trim() || 'Family' }
        : undefined,
    });

    // Mark onboarding dismissed/completed in localStorage
    localStorage.setItem('ft_dismissed_onboarding', 'true');

    // Trigger celebration confetti
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 }
    });

    setTimeout(() => {
      navigate('/tree');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col items-center justify-center p-6 select-none transition-colors duration-200">
      
      {/* Top right actions */}
      <div className="absolute top-6 right-6 flex items-center gap-2">
        <button
          onClick={() => {
            localStorage.setItem('ft_dismissed_onboarding', 'true');
            navigate('/dashboard');
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/80 dark:bg-stone-900/80 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-800 text-xs font-semibold hover:bg-stone-100 dark:hover:bg-stone-850 transition shadow-xs"
          title="Exit to Dashboard"
        >
          <X className="w-3.5 h-3.5" />
          <span>Exit to Dashboard</span>
        </button>
        <ThemeToggle />
      </div>

      <div className="max-w-xl w-full bg-white dark:bg-stone-900/90 border border-stone-200 dark:border-stone-800 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl space-y-8 relative">
        
        {/* Step Indicator */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-forest-600 dark:bg-forest-700 text-white flex items-center justify-center font-serif font-bold shadow-md shadow-forest-900/10">
              <Trees className="w-5 h-5 text-forest-100" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-forest-700 dark:text-forest-400">Step {step} of 5</span>
              <h2 className="text-base font-serif font-bold text-stone-900 dark:text-white">
                {step === 1 && 'Name Your Family Tree'}
                {step === 2 && 'Add Your Profile (The Anchor)'}
                {step === 3 && 'Add Your Parents (Optional)'}
                {step === 4 && 'Add Your Spouse / Partner (Optional)'}
                {step === 5 && 'Add Children & Launch Canvas'}
              </h2>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-stone-100 dark:bg-stone-800 h-1.5 rounded-full overflow-hidden">
          <div 
            className="bg-gradient-to-r from-forest-600 to-emerald-400 h-full transition-all duration-300 rounded-full"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                What is your Family Tree or Lineage Name? <span className="text-emerald-500 dark:text-emerald-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. The Anderson Family Tree / Smith Heritage"
                value={familyName}
                onChange={(e) => setFamilyName(e.target.value)}
                className="w-full text-xs rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white p-3 focus:ring-2 focus:ring-forest-500 focus:border-forest-500 shadow-xs"
              />
            </div>

            <div>
              <LocationSelector
                label="Ancestral Country or Region of Origin"
                placeholder="Select country, province, or ancestral village..."
                value={familyOrigin}
                onChange={(loc) => setFamilyOrigin(loc.formatted)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Family Motto / Words of Wisdom (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Together through generations"
                value={familyMotto}
                onChange={(e) => setFamilyMotto(e.target.value)}
                className="w-full text-xs rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white p-3 focus:ring-2 focus:ring-forest-500 focus:border-forest-500 shadow-xs"
              />
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Your First Name *</label>
                <input
                  type="text"
                  required
                  placeholder="First name"
                  value={selfFirstName}
                  onChange={(e) => setSelfFirstName(e.target.value)}
                  className="w-full text-xs rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white p-3 focus:ring-2 focus:ring-forest-500 shadow-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Your Last Name</label>
                <input
                  type="text"
                  placeholder="Last name"
                  value={selfLastName}
                  onChange={(e) => setSelfLastName(e.target.value)}
                  className="w-full text-xs rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white p-3 focus:ring-2 focus:ring-forest-500 shadow-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">Your Gender *</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelfGender('male')}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition ${
                    selfGender === 'male' 
                      ? 'bg-blue-600 border-blue-500 text-white shadow-md' 
                      : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                  }`}
                >
                  <span>♂ Male</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelfGender('female')}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition ${
                    selfGender === 'female' 
                      ? 'bg-pink-600 border-pink-500 text-white shadow-md' 
                      : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                  }`}
                >
                  <span>♀ Female</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelfGender('other')}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition ${
                    selfGender === 'other' 
                      ? 'bg-purple-600 border-purple-500 text-white shadow-md' 
                      : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                  }`}
                >
                  <span>⚧ Other</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={selfBirthDate}
                  onChange={(e) => setSelfBirthDate(e.target.value)}
                  className="w-full text-xs rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white p-3 focus:ring-2 focus:ring-forest-500 shadow-xs"
                />
              </div>
              <div>
                <LocationSelector
                  label="Birth Place"
                  placeholder="Select country, province, village..."
                  value={selfBirthPlace}
                  onChange={(loc) => setSelfBirthPlace(loc.formatted)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">Father's Name (Optional)</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="First name"
                  value={fatherFirstName}
                  onChange={(e) => setFatherFirstName(e.target.value)}
                  className="w-full text-xs rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white p-3 focus:ring-2 focus:ring-forest-500 shadow-xs"
                />
                <input
                  type="text"
                  placeholder="Last name"
                  value={fatherLastName}
                  onChange={(e) => setFatherLastName(e.target.value)}
                  className="w-full text-xs rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white p-3 focus:ring-2 focus:ring-forest-500 shadow-xs"
                />
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-stone-200 dark:border-stone-800">
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">Mother's Name (Optional)</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="First name"
                  value={motherFirstName}
                  onChange={(e) => setMotherFirstName(e.target.value)}
                  className="w-full text-xs rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white p-3 focus:ring-2 focus:ring-forest-500 shadow-xs"
                />
                <input
                  type="text"
                  placeholder="Maiden / Last name"
                  value={motherLastName}
                  onChange={(e) => setMotherLastName(e.target.value)}
                  className="w-full text-xs rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white p-3 focus:ring-2 focus:ring-forest-500 shadow-xs"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4 */}
        {step === 4 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between p-3.5 bg-stone-50 dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-xs">
              <span className="text-xs font-medium text-stone-700 dark:text-stone-300">Do you have a spouse or partner?</span>
              <button
                type="button"
                onClick={() => setHasSpouse(!hasSpouse)}
                className={`px-3 py-1 text-xs rounded-xl font-bold transition ${hasSpouse ? 'bg-pink-600 text-white' : 'bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300'}`}
              >
                {hasSpouse ? 'Yes' : 'Skip'}
              </button>
            </div>

            {hasSpouse && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Spouse First Name</label>
                    <input
                      type="text"
                      placeholder="First name"
                      value={spouseFirstName}
                      onChange={(e) => setSpouseFirstName(e.target.value)}
                      className="w-full text-xs rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white p-3 focus:ring-2 focus:ring-forest-500 shadow-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Spouse Last Name</label>
                    <input
                      type="text"
                      placeholder="Last name"
                      value={spouseLastName}
                      onChange={(e) => setSpouseLastName(e.target.value)}
                      className="w-full text-xs rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white p-3 focus:ring-2 focus:ring-forest-500 shadow-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Spouse Gender</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setSpouseGender('female')}
                      className={`py-1.5 px-3 rounded-xl text-xs font-semibold border transition ${
                        spouseGender === 'female' ? 'bg-pink-600 border-pink-500 text-white' : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400'
                      }`}
                    >
                      ♀ Female
                    </button>
                    <button
                      type="button"
                      onClick={() => setSpouseGender('male')}
                      className={`py-1.5 px-3 rounded-xl text-xs font-semibold border transition ${
                        spouseGender === 'male' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400'
                      }`}
                    >
                      ♂ Male
                    </button>
                    <button
                      type="button"
                      onClick={() => setSpouseGender('other')}
                      className={`py-1.5 px-3 rounded-xl text-xs font-semibold border transition ${
                        spouseGender === 'other' ? 'bg-purple-600 border-purple-500 text-white' : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400'
                      }`}
                    >
                      ⚧ Other
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 5 */}
        {step === 5 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between p-3.5 bg-stone-50 dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-xs">
              <span className="text-xs font-medium text-stone-700 dark:text-stone-300">Do you have children to add?</span>
              <button
                type="button"
                onClick={() => setHasChildren(!hasChildren)}
                className={`px-3 py-1 text-xs rounded-xl font-bold transition ${hasChildren ? 'bg-forest-600 text-white' : 'bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300'}`}
              >
                {hasChildren ? 'Yes' : 'Skip'}
              </button>
            </div>

            {hasChildren && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Child First Name</label>
                    <input
                      type="text"
                      placeholder="First name"
                      value={childFirstName}
                      onChange={(e) => setChildFirstName(e.target.value)}
                      className="w-full text-xs rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white p-3 focus:ring-2 focus:ring-forest-500 shadow-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Child Last Name</label>
                    <input
                      type="text"
                      placeholder="Last name"
                      value={childLastName}
                      onChange={(e) => setChildLastName(e.target.value)}
                      className="w-full text-xs rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white p-3 focus:ring-2 focus:ring-forest-500 shadow-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Child Gender</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setChildGender('male')}
                      className={`py-1.5 px-3 rounded-xl text-xs font-semibold border transition ${
                        childGender === 'male' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400'
                      }`}
                    >
                      ♂ Male
                    </button>
                    <button
                      type="button"
                      onClick={() => setChildGender('female')}
                      className={`py-1.5 px-3 rounded-xl text-xs font-semibold border transition ${
                        childGender === 'female' ? 'bg-pink-600 border-pink-500 text-white' : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400'
                      }`}
                    >
                      ♀ Female
                    </button>
                    <button
                      type="button"
                      onClick={() => setChildGender('other')}
                      className={`py-1.5 px-3 rounded-xl text-xs font-semibold border transition ${
                        childGender === 'other' ? 'bg-purple-600 border-purple-500 text-white' : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400'
                      }`}
                    >
                      ⚧ Other
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="p-4 rounded-2xl bg-forest-50 dark:bg-forest-950/80 border border-forest-200 dark:border-forest-800/80 text-center space-y-1">
              <Sparkles className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mx-auto" />
              <h4 className="font-bold text-xs text-stone-900 dark:text-white">Ready to Launch!</h4>
              <p className="text-[11px] text-stone-600 dark:text-forest-300">
                Your family tree is initialized. You can continue adding grandparents, uncles, aunts, and photos at any time.
              </p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-stone-200 dark:border-stone-800">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-1.5 text-xs text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition px-4 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : <div />}

          {step < 5 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-1.5 text-xs font-bold text-white bg-forest-600 hover:bg-forest-500 transition px-6 py-2.5 rounded-xl shadow-md"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="flex items-center gap-2 text-xs font-bold text-stone-950 bg-emerald-400 hover:bg-emerald-300 transition px-8 py-3 rounded-xl shadow-lg font-serif active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch My Family Tree Canvas</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
