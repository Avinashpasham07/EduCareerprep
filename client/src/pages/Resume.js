import { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import {
  DocumentTextIcon, AcademicCapIcon, BriefcaseIcon, UserIcon,
  CpuChipIcon, SparklesIcon, CommandLineIcon, PlusIcon,
  TrashIcon, ArrowDownTrayIcon, ChevronLeftIcon, ChevronRightIcon,
  PrinterIcon, EyeIcon
} from '@heroicons/react/24/outline';

// --- Resume Preview Component (Printable) ---
// This component is only visible during print or in the preview step
const ResumePreview = ({ data, template }) => {
  return (
    <div id="resume-preview" className="bg-white text-black font-serif leading-relaxed p-8 max-w-[210mm] mx-auto shadow-2xl min-h-[297mm]">
      {/* Header */}
      <div className="border-b-2 border-slate-800 pb-4 mb-6">
        <h1 className="text-4xl font-bold uppercase tracking-wide mb-2">{data.personalInfo.name || "Your Name"}</h1>
        <div className="flex flex-wrap gap-4 text-sm text-slate-700">
          {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo.phone && <span>• {data.personalInfo.phone}</span>}
          {data.personalInfo.location && <span>• {data.personalInfo.location}</span>}
          {data.personalInfo.linkedin && <span>• <a href={data.personalInfo.linkedin} className="text-blue-600 underline">LinkedIn</a></span>}
          {data.personalInfo.github && <span>• <a href={data.personalInfo.github} className="text-blue-600 underline">GitHub</a></span>}
        </div>
      </div>

      {/* Summary */}
      {data.summary && (
        <div className="mb-6">
          <h2 className="text-lg font-bold uppercase border-b border-slate-300 mb-2 py-1">Professional Summary</h2>
          <p className="text-slate-800 text-justify">{data.summary}</p>
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold uppercase border-b border-slate-300 mb-3 py-1">Experience</h2>
          <div className="space-y-4">
            {data.experience.map((exp, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-lg">{exp.title}</h3>
                  <span className="text-sm font-semibold text-slate-600 whitespace-nowrap">{exp.duration}</span>
                </div>
                <div className="text-sm italic font-semibold mb-1 text-slate-700">{exp.company}</div>
                <p className="text-sm text-slate-800 whitespace-pre-wrap">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {data.projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold uppercase border-b border-slate-300 mb-3 py-1">Projects</h2>
          <div className="space-y-4">
            {data.projects.map((proj, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold">{proj.title}</h3>
                  {proj.link && <a href={proj.link} className="text-xs text-blue-600 underline">View Project</a>}
                </div>
                {proj.technologies && <div className="text-xs italic text-slate-600 mb-1">Stack: {proj.technologies}</div>}
                <p className="text-sm text-slate-700">{proj.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold uppercase border-b border-slate-300 mb-3 py-1">Education</h2>
          {data.education.map((edu, i) => (
            <div key={i} className="mb-2">
              <div className="flex justify-between font-bold">
                <span>{edu.institution}</span>
                <span className="text-sm">{edu.year}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>{edu.degree}</span>
                {edu.gpa && <span className="italic">GPA: {edu.gpa}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold uppercase border-b border-slate-300 mb-3 py-1">Technical Skills</h2>
          <p className="text-sm leading-relaxed">
            {data.skills.join(' • ')}
          </p>
        </div>
      )}
    </div>
  );
};


export default function Resume() {
  const { user } = useSelector((s) => s.auth);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [isAIOptimizing, setIsAIOptimizing] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [resumeData, setResumeData] = useState({
    personalInfo: {
      name: user?.name || '',
      email: user?.email || '',
      phone: '',
      location: '',
      linkedin: '',
      github: ''
    },
    summary: '',
    experience: [],
    education: [],
    skills: [],
    projects: []
  });

  const templates = [
    { id: 'modern', name: 'Standard Professional', icon: <BriefcaseIcon className="w-12 h-12" />, description: 'Clean, ATS-friendly design for all roles' },
    // Only one template fully implemented for MVP
    // { id: 'classic', name: 'Classic Traditional', icon: <DocumentTextIcon className="w-12 h-12" />, description: 'Timeless format for corporate roles' },
  ];

  const handleInputChange = (section, field, value) => {
    setResumeData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const addItem = (section, item) => {
    setResumeData(prev => ({
      ...prev,
      [section]: [...prev[section], item]
    }));
  };

  const removeItem = (section, index) => {
    setResumeData(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  const optimizeWithAI = async () => {
    setIsAIOptimizing(true);
    // Simulate AI processing
    setTimeout(() => {
      const suggestions = [
        {
          type: 'summary',
          message: 'Summary Impact',
          suggestion: 'Enhance your summary with metric-driven achievements (e.g., "Increased efficiency by 20%").'
        },
        {
          type: 'skills',
          message: 'Keyword Gap',
          suggestion: 'Add "Agile Methodologies" and "Cloud Computing" to match current market trends.'
        }
      ];
      setAiSuggestions(suggestions);
      setIsAIOptimizing(false);
    }, 1500);
  };

  const applySuggestion = (suggestion) => {
    if (suggestion.type === 'summary') {
      setResumeData(prev => ({
        ...prev,
        summary: prev.summary + ' ' + suggestion.suggestion
      }));
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6 animate-fade-in-up">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3 font-display">
                Select Template
              </h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
                Choose a professional layout optimized for Applicant Tracking Systems (ATS).
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-center">
              {templates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`group relative p-8 border rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-xl ${selectedTemplate === template.id
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10 shadow-lg ring-1 ring-primary-500'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-primary-300'
                    }`}
                >
                  <div className={`mb-6 p-4 rounded-xl w-fit mx-auto transition-colors ${selectedTemplate === template.id ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-600'
                    }`}>
                    {template.icon}
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2 text-center">{template.name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 text-center leading-relaxed">{template.description}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8 animate-fade-in-up">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              <UserIcon className="w-8 h-8 text-primary-600" />
              Personal Details
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <InputGroup label="Full Name" value={resumeData.personalInfo.name} onChange={(e) => handleInputChange('personalInfo', 'name', e.target.value)} />
              <InputGroup label="Email" type="email" value={resumeData.personalInfo.email} onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)} />
              <InputGroup label="Phone" type="tel" value={resumeData.personalInfo.phone} onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)} />
              <InputGroup label="Location" placeholder="City, Country" value={resumeData.personalInfo.location} onChange={(e) => handleInputChange('personalInfo', 'location', e.target.value)} />
              <InputGroup label="LinkedIn URL" type="url" value={resumeData.personalInfo.linkedin} onChange={(e) => handleInputChange('personalInfo', 'linkedin', e.target.value)} />
              <InputGroup label="GitHub URL" type="url" value={resumeData.personalInfo.github} onChange={(e) => handleInputChange('personalInfo', 'github', e.target.value)} />
            </div>
            <div>
              <label className="label-premium">Professional Summary</label>
              <textarea
                value={resumeData.summary}
                onChange={(e) => setResumeData(prev => ({ ...prev, summary: e.target.value }))}
                rows={4}
                className="input-premium w-full"
                placeholder="Briefly describe your professional background and key achievements..."
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8 animate-fade-in-up">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                <BriefcaseIcon className="w-8 h-8 text-primary-600" />
                Experience
              </h2>
              <button
                onClick={() => addItem('experience', { title: '', company: '', duration: '', description: '' })}
                className="btn-secondary-new flex items-center gap-2"
              >
                <PlusIcon className="w-4 h-4" /> Add Role
              </button>
            </div>
            <div className="space-y-6">
              {resumeData.experience.map((exp, index) => (
                <div key={index} className="card-premium p-6 border border-slate-200 dark:border-slate-700">
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <InputGroup label="Job Title" value={exp.title} onChange={(e) => {
                      const newExp = [...resumeData.experience]; newExp[index].title = e.target.value; setResumeData(prev => ({ ...prev, experience: newExp }));
                    }} />
                    <InputGroup label="Company" value={exp.company} onChange={(e) => {
                      const newExp = [...resumeData.experience]; newExp[index].company = e.target.value; setResumeData(prev => ({ ...prev, experience: newExp }));
                    }} />
                  </div>
                  <InputGroup label="Duration" placeholder="Jan 2022 - Present" value={exp.duration} onChange={(e) => {
                    const newExp = [...resumeData.experience]; newExp[index].duration = e.target.value; setResumeData(prev => ({ ...prev, experience: newExp }));
                  }} />
                  <div className="mt-4">
                    <label className="label-premium">Description (Bullet points recommended)</label>
                    <textarea
                      value={exp.description}
                      onChange={(e) => {
                        const newExp = [...resumeData.experience]; newExp[index].description = e.target.value; setResumeData(prev => ({ ...prev, experience: newExp }));
                      }}
                      rows={3}
                      className="input-premium w-full"
                      placeholder="• Led a team of 5 developers..."
                    />
                  </div>
                  <button onClick={() => removeItem('experience', index)} className="mt-4 text-red-500 hover:text-red-600 text-sm font-bold flex items-center gap-1">
                    <TrashIcon className="w-4 h-4" /> Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-8 animate-fade-in-up">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                <AcademicCapIcon className="w-8 h-8 text-primary-600" />
                Education
              </h2>
              <button
                onClick={() => addItem('education', { degree: '', institution: '', year: '', gpa: '' })}
                className="btn-secondary-new flex items-center gap-2"
              >
                <PlusIcon className="w-4 h-4" /> Add Education
              </button>
            </div>
            <div className="space-y-6">
              {resumeData.education.map((edu, index) => (
                <div key={index} className="card-premium p-6 border border-slate-200 dark:border-slate-700">
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <InputGroup label="Degree" value={edu.degree} onChange={(e) => {
                      const newE = [...resumeData.education]; newE[index].degree = e.target.value; setResumeData(prev => ({ ...prev, education: newE }));
                    }} />
                    <InputGroup label="Institution" value={edu.institution} onChange={(e) => {
                      const newE = [...resumeData.education]; newE[index].institution = e.target.value; setResumeData(prev => ({ ...prev, education: newE }));
                    }} />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <InputGroup label="Year" placeholder="2020 - 2024" value={edu.year} onChange={(e) => {
                      const newE = [...resumeData.education]; newE[index].year = e.target.value; setResumeData(prev => ({ ...prev, education: newE }));
                    }} />
                    <InputGroup label="GPA / Percentage" value={edu.gpa} onChange={(e) => {
                      const newE = [...resumeData.education]; newE[index].gpa = e.target.value; setResumeData(prev => ({ ...prev, education: newE }));
                    }} />
                  </div>
                  <button onClick={() => removeItem('education', index)} className="mt-4 text-red-500 hover:text-red-600 text-sm font-bold flex items-center gap-1">
                    <TrashIcon className="w-4 h-4" /> Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-8 animate-fade-in-up">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                <CpuChipIcon className="w-8 h-8 text-primary-600" />
                Skills
              </h2>
              <button
                onClick={optimizeWithAI}
                disabled={isAIOptimizing}
                className="btn-primary-new flex items-center gap-2"
              >
                <SparklesIcon className="w-5 h-5" />
                {isAIOptimizing ? 'Analyzing...' : 'AI Optimize'}
              </button>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
              <label className="label-premium">Add Skills (Press Enter)</label>
              <input
                type="text"
                placeholder="e.g. JavaScript, Python, React..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const skills = e.target.value.split(',').map(s => s.trim()).filter(s => s);
                    setResumeData(prev => ({ ...prev, skills: [...prev.skills, ...skills] }));
                    e.target.value = '';
                  }
                }}
                className="input-premium w-full mb-4"
              />
              <div className="flex flex-wrap gap-2">
                {resumeData.skills.length > 0 ? (
                  resumeData.skills.map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-lg text-sm font-bold border border-primary-100 dark:border-primary-800 flex items-center gap-2">
                      {skill}
                      <button onClick={() => removeItem('skills', index)} className="hover:text-primary-900 dark:hover:text-primary-100 font-bold">×</button>
                    </span>
                  ))
                ) : (
                  <span className="text-slate-400 italic text-sm">No skills added yet.</span>
                )}
              </div>
            </div>

            {/* AI Suggestions Box */}
            {aiSuggestions.length > 0 && (
              <div className="p-5 bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/30 rounded-xl animate-scale-in">
                <h3 className="text-lg font-bold text-purple-900 dark:text-purple-300 mb-3 flex items-center gap-2">
                  <SparklesIcon className="w-5 h-5" /> AI Opportunities
                </h3>
                <div className="space-y-3">
                  {aiSuggestions.map((suggestion, index) => (
                    <div key={index} className="flex justify-between items-center bg-white dark:bg-slate-900 p-3 rounded-lg border border-purple-100 dark:border-purple-800/50">
                      <div>
                        <span className="text-xs font-bold text-purple-600 bg-purple-100 px-2 py-0.5 rounded uppercase tracking-wider mb-1 inline-block">{suggestion.type}</span>
                        <p className="text-sm text-slate-700 dark:text-slate-300">{suggestion.message}</p>
                        <p className="text-xs text-slate-500 mt-0.5 italic">"{suggestion.suggestion}"</p>
                      </div>
                      <button onClick={() => applySuggestion(suggestion)} className="bg-purple-100 hover:bg-purple-200 text-purple-700 font-bold py-1 px-3 rounded text-xs transition-colors">Apply</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 6: // Projects
        return (
          <div className="space-y-8 animate-fade-in-up">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                <CommandLineIcon className="w-8 h-8 text-primary-600" />
                Projects
              </h2>
              <button
                onClick={() => addItem('projects', { title: '', description: '', technologies: '', link: '' })}
                className="btn-secondary-new flex items-center gap-2"
              >
                <PlusIcon className="w-4 h-4" /> Add Project
              </button>
            </div>
            <div className="space-y-6">
              {resumeData.projects.map((proj, index) => (
                <div key={index} className="card-premium p-6 border border-slate-200 dark:border-slate-700">
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <InputGroup label="Project Title" value={proj.title} onChange={(e) => {
                      const newP = [...resumeData.projects]; newP[index].title = e.target.value; setResumeData(prev => ({ ...prev, projects: newP }));
                    }} />
                    <InputGroup label="Tech Stack" value={proj.technologies} onChange={(e) => {
                      const newP = [...resumeData.projects]; newP[index].technologies = e.target.value; setResumeData(prev => ({ ...prev, projects: newP }));
                    }} />
                  </div>
                  <div className="mb-4">
                    <label className="label-premium">Description</label>
                    <textarea value={proj.description} onChange={(e) => {
                      const newP = [...resumeData.projects]; newP[index].description = e.target.value; setResumeData(prev => ({ ...prev, projects: newP }));
                    }} className="input-premium w-full" rows={2}></textarea>
                  </div>
                  <InputGroup label="Link (Optional)" value={proj.link} onChange={(e) => {
                    const newP = [...resumeData.projects]; newP[index].link = e.target.value; setResumeData(prev => ({ ...prev, projects: newP }));
                  }} />
                  <button onClick={() => removeItem('projects', index)} className="mt-4 text-red-500 hover:text-red-600 text-sm font-bold flex items-center gap-1">
                    <TrashIcon className="w-4 h-4" /> Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case 7: // Preview & Export
        return (
          <div className="space-y-8 animate-fade-in-up">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 font-display">Resume Preview</h2>
              <p className="text-slate-600 dark:text-slate-400">Review your resume layout. Click download to save as PDF.</p>
            </div>

            <div className="flex justify-center my-6">
              <div className="border border-slate-200 shadow-xl overflow-hidden rounded-sm mx-auto transform scale-[0.8] origin-top h-[600px] overflow-y-auto custom-scrollbar bg-slate-100 p-8 w-full max-w-4xl flex justify-center">
                <ResumePreview data={resumeData} template={selectedTemplate} />
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handlePrint}
                className="btn-primary-new px-8 py-4 flex items-center gap-3 text-lg shadow-xl shadow-primary-600/20 hover:scale-105"
              >
                <PrinterIcon className="w-6 h-6" /> Save as PDF / Print
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {/* Hide main app shell on print */}
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-20 no-print">
        <div className="max-w-5xl mx-auto px-6">

          {/* Progress Bar */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Step {currentStep} of 7</span>
              <span className="text-sm font-bold text-primary-600 dark:text-primary-400">{Math.round((currentStep / 7) * 100)}% Complete</span>
            </div>
            <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-primary-600 transition-all duration-500 ease-out" style={{ width: `${(currentStep / 7) * 100}%` }}></div>
            </div>
          </div>

          {/* Content Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-8 md:p-12 mb-10 min-h-[500px]">
            {renderStep()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center sticky bottom-6 bg-white/10 dark:bg-black/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="btn-ghost-new flex items-center gap-2 disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <ChevronLeftIcon className="w-5 h-5" /> Previous
            </button>

            {currentStep < 7 && (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="btn-primary-new px-8 py-3 flex items-center gap-2 font-bold"
              >
                {currentStep === 6 ? 'Preview Resume' : 'Next Step'} <ChevronRightIcon className="w-5 h-5" />
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Hidden Print Area - Only visible when printing due to CSS */}
      <div className="hidden print:block">
        <ResumePreview data={resumeData} template={selectedTemplate} />
      </div>
    </>
  );
}

const InputGroup = ({ label, type = "text", ...props }) => (
  <div>
    <label className="label-premium">{label}</label>
    <input type={type} className="input-premium w-full" {...props} />
  </div>
);
