import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFamily } from '../../context/FamilyContext';
import { useAuth } from '../../context/AuthContext';
import confetti from 'canvas-confetti';
import { 
  Trees, 
  User, 
  Heart, 
  Users, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Globe, 
  Shield 
} from 'lucide-react';

export const OnboardingPage: React.FC = () => {
  const { createNewBlankFamily, addMember } = useFamily();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  // Step 1: Family details
  const [familyName, setFamilyName] = useState('');
  const [familyOrigin, setFamilyOrigin] = useState('');
  const [familyMotto, setFamilyMotto] = useState('');
  const [isPublic, setIsPublic] = useState(true);

  // Step 2: Self
  const [selfFirstName, setSelfFirstName] = useState(user?.displayName?.split(' ')[0] || '');
  const [selfLastName, setSelfLastName] = useState(user?.displayName?.split(' ')[1] || '');
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

  // Step 5: Children
  const [hasChildren, setHasChildren] = useState(false);
  const [childFirstName, setChildFirstName] = useState('');
  const [childLastName, setChildLastName] = useState('');

  const handleFinish = () => {
    // 1. Create family
    const finalFamName = familyName.trim() || `${selfLastName ? selfLastName + ' ' : ''}Family Lineage`;
    createNewBlankFamily(finalFamName, familyOrigin || 'Global', familyMotto);

    // 2. Add Self
    if (selfFirstName.trim()) {
      const selfNode = addMember({
        firstName: selfFirstName.trim(),
        lastName: selfLastName.trim() || 'Family',
        gender: 'male',
        isLiving: true,
        birthDate: selfBirthDate || undefined,
        birthPlace: selfBirthPlace || undefined,
        generation: 3,
        nickname: 'Tree Creator (You)',
        biography: 'Anchor member and creator of this digital family tree archive.'
      });

      // 3. Add Parents if entered
      if (fatherFirstName.trim()) {
        addMember({
          firstName: fatherFirstName.trim(),
          lastName: fatherLastName.trim() || selfLastName.trim() || 'Family',
          gender: 'male',
          isLiving: true,
          generation: 2
        }, selfNode.id, 'parent');
      }

      if (motherFirstName.trim()) {
        addMember({
          firstName: motherFirstName.trim(),
          lastName: motherLastName.trim() || 'Family',
          gender: 'female',
          isLiving: true,
          generation: 2
        }, selfNode.id, 'parent');
      }

      // 4. Add Spouse if entered
      if (hasSpouse && spouseFirstName.trim()) {
        addMember({
          firstName: spouseFirstName.trim(),
          lastName: spouseLastName.trim() || 'Family',
          gender: 'female',
          isLiving: true,
          generation: 3
        }, selfNode.id, 'spouse');
      }

      // 5. Add Child if entered
      if (hasChildren && childFirstName.trim()) {
        addMember({
          firstName: childFirstName.trim(),
          lastName: childLastName.trim() || selfLastName.trim() || 'Family',
          gender: 'other',
          isLiving: true,
          generation: 4
        }, selfNode.id, 'child');
      }
    }

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
    <div className="min-h-screen bg-stone-900 text-stone-100 flex flex-col items-center justify-center p-6 select-none">
      <div className="max-w-xl w-full bg-stone-950/80 border border-stone-800 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl space-y-8 relative">
        
        {/* Step Indicator */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-forest-700 text-white flex items-center justify-center font-serif font-bold">
              <Trees className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-forest-400">Step {step} of 5</span>
              <h2 className="text-base font-serif font-bold text-white">
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
        <div className="w-full bg-stone-800 h-1.5 rounded-full overflow-hidden">
          <div 
            className="bg-gradient-to-r from-forest-600 to-emerald-400 h-full transition-all duration-300 rounded-full"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                What is your Family Tree or Lineage Name? <span className="text-emerald-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. The Anderson Family Tree / Smith Heritage"
                value={familyName}
                onChange={(e) => setFamilyName(e.target.value)}
                className="w-full text-xs rounded-xl bg-stone-900 border-stone-700 text-white p-3 focus:ring-forest-500 focus:border-forest-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Ancestral Country or Region of Origin
              </label>
              <input
                type="text"
                placeholder="e.g. Ireland, Sri Lanka, Canada, Japan..."
                value={familyOrigin}
                onChange={(e) => setFamilyOrigin(e.target.value)}
                className="w-full text-xs rounded-xl bg-stone-900 border-stone-700 text-white p-3 focus:ring-forest-500 focus:border-forest-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Family Motto / Words of Wisdom (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Together through generations"
                value={familyMotto}
                onChange={(e) => setFamilyMotto(e.target.value)}
                className="w-full text-xs rounded-xl bg-stone-900 border-stone-700 text-white p-3 focus:ring-forest-500 focus:border-forest-500"
              />
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">Your First Name</label>
                <input
                  type="text"
                  placeholder="First name"
                  value={selfFirstName}
                  onChange={(e) => setSelfFirstName(e.target.value)}
                  className="w-full text-xs rounded-xl bg-stone-900 border-stone-700 text-white p-3 focus:ring-forest-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">Your Last Name</label>
                <input
                  type="text"
                  placeholder="Last name"
                  value={selfLastName}
                  onChange={(e) => setSelfLastName(e.target.value)}
                  className="w-full text-xs rounded-xl bg-stone-900 border-stone-700 text-white p-3 focus:ring-forest-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={selfBirthDate}
                  onChange={(e) => setSelfBirthDate(e.target.value)}
                  className="w-full text-xs rounded-xl bg-stone-900 border-stone-700 text-white p-3 focus:ring-forest-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">Birth Place</label>
                <input
                  type="text"
                  placeholder="City, Country"
                  value={selfBirthPlace}
                  onChange={(e) => setSelfBirthPlace(e.target.value)}
                  className="w-full text-xs rounded-xl bg-stone-900 border-stone-700 text-white p-3 focus:ring-forest-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-stone-300">Father's Name (Optional)</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="First name"
                  value={fatherFirstName}
                  onChange={(e) => setFatherFirstName(e.target.value)}
                  className="w-full text-xs rounded-xl bg-stone-900 border-stone-700 text-white p-3 focus:ring-forest-500"
                />
                <input
                  type="text"
                  placeholder="Last name"
                  value={fatherLastName}
                  onChange={(e) => setFatherLastName(e.target.value)}
                  className="w-full text-xs rounded-xl bg-stone-900 border-stone-700 text-white p-3 focus:ring-forest-500"
                />
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-stone-800">
              <label className="block text-xs font-semibold text-stone-300">Mother's Name (Optional)</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="First name"
                  value={motherFirstName}
                  onChange={(e) => setMotherFirstName(e.target.value)}
                  className="w-full text-xs rounded-xl bg-stone-900 border-stone-700 text-white p-3 focus:ring-forest-500"
                />
                <input
                  type="text"
                  placeholder="Maiden / Last name"
                  value={motherLastName}
                  onChange={(e) => setMotherLastName(e.target.value)}
                  className="w-full text-xs rounded-xl bg-stone-900 border-stone-700 text-white p-3 focus:ring-forest-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4 */}
        {step === 4 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between p-3.5 bg-stone-900 rounded-2xl border border-stone-800">
              <span className="text-xs text-stone-300">Do you have a spouse or partner?</span>
              <button
                type="button"
                onClick={() => setHasSpouse(!hasSpouse)}
                className={`px-3 py-1 text-xs rounded-xl font-bold transition ${hasSpouse ? 'bg-pink-600 text-white' : 'bg-stone-800 text-stone-400'}`}
              >
                {hasSpouse ? 'Yes' : 'Skip'}
              </button>
            </div>

            {hasSpouse && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">Spouse First Name</label>
                  <input
                    type="text"
                    placeholder="First name"
                    value={spouseFirstName}
                    onChange={(e) => setSpouseFirstName(e.target.value)}
                    className="w-full text-xs rounded-xl bg-stone-900 border-stone-700 text-white p-3 focus:ring-forest-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">Spouse Last Name</label>
                  <input
                    type="text"
                    placeholder="Last name"
                    value={spouseLastName}
                    onChange={(e) => setSpouseLastName(e.target.value)}
                    className="w-full text-xs rounded-xl bg-stone-900 border-stone-700 text-white p-3 focus:ring-forest-500"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 5 */}
        {step === 5 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between p-3.5 bg-stone-900 rounded-2xl border border-stone-800">
              <span className="text-xs text-stone-300">Do you have children to add?</span>
              <button
                type="button"
                onClick={() => setHasChildren(!hasChildren)}
                className={`px-3 py-1 text-xs rounded-xl font-bold transition ${hasChildren ? 'bg-forest-600 text-white' : 'bg-stone-800 text-stone-400'}`}
              >
                {hasChildren ? 'Yes' : 'Skip'}
              </button>
            </div>

            {hasChildren && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">Child First Name</label>
                  <input
                    type="text"
                    placeholder="First name"
                    value={childFirstName}
                    onChange={(e) => setChildFirstName(e.target.value)}
                    className="w-full text-xs rounded-xl bg-stone-900 border-stone-700 text-white p-3 focus:ring-forest-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">Child Last Name</label>
                  <input
                    type="text"
                    placeholder="Last name"
                    value={childLastName}
                    onChange={(e) => setChildLastName(e.target.value)}
                    className="w-full text-xs rounded-xl bg-stone-900 border-stone-700 text-white p-3 focus:ring-forest-500"
                  />
                </div>
              </div>
            )}

            <div className="p-4 rounded-2xl bg-forest-950/80 border border-forest-800/80 text-center space-y-1">
              <Sparkles className="w-6 h-6 text-emerald-400 mx-auto" />
              <h4 className="font-bold text-xs text-white">Ready to Launch!</h4>
              <p className="text-[11px] text-forest-300">
                Your family tree is initialized. You can continue adding grandparents, uncles, aunts, and photos at any time.
              </p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-stone-800">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-white transition px-4 py-2 rounded-xl bg-stone-900"
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
              className="flex items-center gap-2 text-xs font-bold text-forest-950 bg-emerald-400 hover:bg-emerald-300 transition px-8 py-3 rounded-xl shadow-lg font-serif"
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
