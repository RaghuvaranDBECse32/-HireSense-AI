export interface UserProfile {
  user_id: number;
  email: string;
  role: string;
  profile: {
    full_name: string;
    headline: string;
    location: string;
    github?: string;
    linkedin?: string;
    portfolio?: string;
    career_interests?: string;
    preferred_roles?: string;
    preferred_technologies?: string;
    ai_interests?: string;
    agentic_ai_interests?: string;
    quantum_interests?: string;
    readiness: {
      evidence_strength: number;
      interview_readiness: number;
      skill_alignment: number;
      learning_progress: number;
    };
  };
  skills: Array<{
    id: number;
    name: string;
    verified: boolean;
    evidence_quote?: string;
    evidence_source?: string;
    proficiency: string;
  }>;
  experiences: Array<{
    id: number;
    title: string;
    company: string;
    dates: string;
    description: string;
    evidence_grounding?: string;
  }>;
  projects: Array<{
    id: number;
    title: string;
    description: string;
    technologies: string;
    evidence_quote?: string;
  }>;
  has_primary_resume: boolean;
}

export interface JobItem {
  id: number;
  title: string;
  company_name: string;
  location: string;
  work_mode: string;
  job_type: string;
  track: string;
  salary_range?: string;
  experience_required?: string;
  education_required?: string;
  is_techknow_opportunity: boolean;
  techknow_room?: string;
  raw_jd_text: string;
}

export interface TechknowCompanyItem {
  id: number;
  sheet_num: number;
  name: string;
  industry: string;
  location: string;
  official_website?: string;
  verification_status: "EVENT SHEET" | "VERIFIED" | "NOT VERIFIED" | "CONFLICT";
  about_company: string;
  event_information: {
    opportunity: string;
    eligible_branches: string;
    vacancies: string;
    salary_stipend: string;
    room: string;
    source_type: string;
  };
  verified_information: {
    status: string;
    notes: string;
    sources: Array<{ title: string; url: string; is_official: boolean }>;
  };
  contact?: {
    name: string;
    designation: string;
    phone: string;
    email: string;
    note?: string;
  };
}

export interface MatchAnalysisResult {
  match_score: number;
  confidence_level: "High" | "Medium" | "Low";
  explanation: string;
  strengths: Array<{ item: string; evidence: string }>;
  concerns: Array<{ item: string; evidence: string }>;
  skill_gaps: Array<{
    requirement: string;
    classification: "MATCHED" | "MISSING" | "AMBIGUOUS";
    candidate_evidence: string;
    source: string;
    confidence: string;
    recommended_action: string;
  }>;
  interview_questions: Array<{
    category: string;
    question: string;
    grounded_context: string;
    evaluation_criteria?: string;
  }>;
  career_plan: {
    target_readiness_boost: string;
    actionable_milestones: Array<{
      phase: string;
      goal: string;
      action: string;
    }>;
  };
  resume_tailoring: {
    tailoring_recommendations: Array<{
      section: string;
      suggestion: string;
      anti_gravity_warning: string;
    }>;
  };
  application_strategy: {
    match_score: number;
    submission_strategy: string;
    pre_submission_checklist: Array<{ item: string; done: boolean }>;
    recommended_follow_up_days: number;
  };
  candidate: any;
  job: any;
  grounding_status: string;
}

export interface ApplicationItem {
  id: number;
  job_id: number;
  job_title: string;
  company_name: string;
  location: string;
  techknow_room?: string;
  status: "Saved" | "Analyzing" | "Applied" | "Assessment" | "Interview" | "Offer" | "Rejected";
  notes?: string;
  applied_date?: string;
  follow_up_date?: string;
}

export interface CareerTrackItem {
  id: number;
  title: string;
  slug: string;
  description: string;
  total_levels: number;
  learning_items: Array<{
    id: number;
    level: number;
    title: string;
    topic: string;
    description: string;
    estimated_hours: number;
    prerequisites: string;
    project_idea: string;
  }>;
}
