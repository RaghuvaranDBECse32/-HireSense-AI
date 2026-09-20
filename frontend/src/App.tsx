import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { DiscoverJobsPage } from './pages/DiscoverJobsPage';
import { TechknowHubPage } from './pages/TechknowHubPage';
import { MatchEnginePage } from './pages/MatchEnginePage';
import { AICareerCopilotPage } from './pages/AICareerCopilotPage';
import { ResumeIntelPage } from './pages/ResumeIntelPage';
import { SkillIntelPage } from './pages/SkillIntelPage';
import { RoadmapPage } from './pages/RoadmapPage';
import { AIAgenticTrackPage } from './pages/AIAgenticTrackPage';
import { QuantumTrackPage } from './pages/QuantumTrackPage';
import { ApplicationsPage } from './pages/ApplicationsPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminPortalPage } from './pages/AdminPortalPage';
import { JobItem } from './types';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [userRole, setUserRole] = useState<string>('job_seeker');
  const [selectedJobForMatch, setSelectedJobForMatch] = useState<JobItem | null>(null);

  const handleAnalyzeJob = (job: JobItem) => {
    setSelectedJobForMatch(job);
    setActiveTab('match');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userRole={userRole}
        setUserRole={setUserRole}
      />

      <main className="flex-1">
        {activeTab === 'home' && (
          <HomePage
            setActiveTab={setActiveTab}
            onSelectJobForMatch={(jobId) => {
              setActiveTab('jobs');
            }}
          />
        )}

        {activeTab === 'jobs' && (
          <DiscoverJobsPage onAnalyzeJob={handleAnalyzeJob} />
        )}

        {activeTab === 'techknow' && (
          <TechknowHubPage onAnalyzeJob={handleAnalyzeJob} />
        )}

        {activeTab === 'match' && (
          <MatchEnginePage
            selectedJob={selectedJobForMatch}
            onGoToCopilot={() => setActiveTab('copilot')}
            onGoToApplications={() => setActiveTab('applications')}
          />
        )}

        {activeTab === 'copilot' && <AICareerCopilotPage />}
        {activeTab === 'resume' && <ResumeIntelPage />}
        {activeTab === 'skills' && <SkillIntelPage />}
        {activeTab === 'learning' && <RoadmapPage />}
        {activeTab === 'ai-agents' && <AIAgenticTrackPage />}
        {activeTab === 'quantum' && <QuantumTrackPage />}
        {activeTab === 'applications' && <ApplicationsPage />}
        {activeTab === 'profile' && <ProfilePage />}
        {activeTab === 'admin' && <AdminPortalPage />}
      </main>

      <Footer setActiveTab={setActiveTab} />
    </div>
  );
}

export default App;
