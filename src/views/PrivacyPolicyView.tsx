import React from 'react';
import { GlassPanel } from '../components/ui/GlassPanel';
import { BackLink } from '../components/ui/BackLink';

interface PrivacyPolicyViewProps {
  onNavigateToLanding: () => void;
}

// Standalone, unauthenticated page -- same shell as TermsView.tsx (see
// that file's header comment). Content mirrors the approved draft 1:1;
// update both together if either changes.
export const PrivacyPolicyView: React.FC<PrivacyPolicyViewProps> = ({ onNavigateToLanding }) => {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col justify-between relative overflow-hidden">
      <div className="bg-layer">
        <div className="bg-pattern" />
      </div>

      <header className="relative z-10 border-b border-[var(--border)] px-6 py-4 flex items-center justify-between">
        <div
          onClick={onNavigateToLanding}
          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity overflow-hidden min-w-0"
        >
          <img src="/branding/ielts-ai-mascot-full.png" alt="IELTS AI" className="h-10 w-auto object-contain shrink-0" />
          <img src="/branding/ielts-ai-wordmark-dark.png" alt="IELTS AI by nextED." className="brand-wordmark-dark h-9 w-auto object-contain" />
          <img src="/branding/ielts-ai-wordmark-light.png" alt="IELTS AI by nextED." className="brand-wordmark-light h-9 w-auto object-contain" />
        </div>

        <BackLink onClick={onNavigateToLanding}>Back to Home</BackLink>
      </header>

      <main className="relative z-10 flex-1 flex items-start justify-center p-4 md:p-8">
        <div className="w-full max-w-3xl space-y-6 py-6">
          <div className="text-center space-y-2">
            <h1 className="font-display text-3xl font-extrabold text-[var(--text)]">
              Privacy Policy
            </h1>
            <p className="text-xs text-[var(--text-dim)]">Last updated September 17, 2026</p>
          </div>

          <GlassPanel className="p-6 md:p-8 border border-[var(--border)] shadow-2xl space-y-6 text-sm leading-relaxed text-[var(--text-dim)]">
            <section className="space-y-2">
              <h2 className="font-display text-lg font-bold text-[var(--text)]">1. Overview</h2>
              <p>
                This Privacy Policy explains what information IELTS AI (operated by NextEd) collects,
                how we use it, and the choices you have.{' '}
                <span className="text-[var(--text)] font-semibold">
                  By registering for an account, you agree to this Privacy Policy
                </span>{' '}
                as described in the Terms &amp; Conditions.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-display text-lg font-bold text-[var(--text)]">2. Information We Collect</h2>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  <span className="font-semibold text-[var(--text)]">Account &amp; profile information:</span>{' '}
                  name, legal full name, phone number (used as your login ID and verified via OTP),
                  email, native language, country, date of birth, academic background, and exam goals.
                </li>
                <li>
                  <span className="font-semibold text-[var(--text)]">Test submissions &amp; responses:</span>{' '}
                  your answers, essays, spoken audio/transcripts, scores, AI-generated feedback, and
                  timestamps for every Listening, Reading, Writing, and Speaking practice test or mock
                  test you take.
                </li>
                <li>
                  <span className="font-semibold text-[var(--text)]">Usage data:</span> pages visited,
                  features used, device/browser information, and general activity on the Platform
                  (e.g. login times, streaks, progress).
                </li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="font-display text-lg font-bold text-[var(--text)]">3. How We Use Your Information</h2>
              <p>We use the information above to:</p>
              <ol className="list-decimal pl-5 space-y-1.5">
                <li>Provide and personalize the Service, including scoring, feedback, progress tracking, and study recommendations</li>
                <li>Verify your identity via OTP and secure your account</li>
                <li>
                  Communicate with you about your account, results, and Platform updates, including
                  through providers such as our SMS/OTP delivery partner
                </li>
                <li>
                  <span className="font-semibold text-[var(--text)]">
                    Train, fine-tune, and improve our own proprietary AI models and language models
                    (LLMs) using your test submissions and results, with the goal of shifting our
                    evaluation and feedback systems onto AI we develop and control ourselves
                  </span>{' '}
                  rather than relying solely on third-party AI providers
                </li>
                <li>Analyze aggregate usage trends to improve the Platform</li>
              </ol>
            </section>

            <section className="space-y-2">
              <h2 className="font-display text-lg font-bold text-[var(--text)]">4. Sharing Your Information</h2>
              <p>We do not sell your personal information. We share limited data with:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  <span className="font-semibold text-[var(--text)]">SMS/OTP delivery providers</span>,
                  to send verification codes to your phone number
                </li>
                <li>
                  <span className="font-semibold text-[var(--text)]">Third-party AI providers</span>, to
                  generate scoring and feedback on your test submissions, until our own trained models
                  take over that function
                </li>
                <li>
                  <span className="font-semibold text-[var(--text)]">Our counselling partner</span>,
                  only if you choose to opt in to a free counselling session offer, and only the
                  contact details needed to arrange that session
                </li>
                <li>
                  <span className="font-semibold text-[var(--text)]">Legal authorities</span>, if
                  required by law
                </li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="font-display text-lg font-bold text-[var(--text)]">5. Data Retention &amp; Security</h2>
              <p>
                We retain account and Test Data for as long as your account is active, and as needed
                to support the AI training purposes described above, unless you request deletion
                (subject to the Terms &amp; Conditions). We use reasonable technical and organizational
                measures, including encrypted storage and access controls, to protect your data — but
                no system is completely secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-display text-lg font-bold text-[var(--text)]">6. Your Rights &amp; Choices</h2>
              <p>
                You may request to access, correct, or delete your personal information by contacting
                support. You may also update most profile fields directly from your account settings.
                Deletion requests will remove your account and stop further use of your data, though
                data already incorporated into a trained AI model cannot be extracted afterward.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-display text-lg font-bold text-[var(--text)]">7. Children's Privacy</h2>
              <p>
                The Platform is intended for users aged 13 and above. We do not knowingly collect data
                from children under 13. If you believe a child under 13 has registered, contact us and
                we will take steps to remove the account.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-display text-lg font-bold text-[var(--text)]">8. Contact Us</h2>
              <p>
                For privacy questions, data requests, or concerns, contact NextEd support through the
                Platform's contact channels.
              </p>
            </section>
          </GlassPanel>
        </div>
      </main>

      <footer className="font-michroma relative z-10 py-4 text-center text-xs tracking-wide text-[var(--text-faint)] border-t border-[var(--border)]">
        IELTS AI • Phone Authentication • Powered by PostgreSQL
      </footer>
    </div>
  );
};
