import { useState, useEffect } from 'react';
import { Star, GitFork, ArrowUpRight } from 'lucide-react';
import './GitHubProjects.css';

// Only show these specific repos
const FEATURED_REPOS = ['NanoLink', 'Poll-Creator', 'spike-ai-builder', 'RedHill'];

// GitHub-standard language colors
const LANG_COLORS = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Go: '#00ADD8',
  Rust: '#dea584',
  Dart: '#00B4AB',
  Kotlin: '#A97BFF',
  Java: '#b07219',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Shell: '#89e051',
  Ruby: '#701516',
  C: '#555555',
  'C++': '#f34b7d',
  'C#': '#178600',
  PHP: '#4F5D95',
  Swift: '#F05138',
  'Jupyter Notebook': '#DA5B0B',
};

const GitHubProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('https://api.github.com/users/CoderXAyush/repos?sort=updated&per_page=30');
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        const data = await response.json();
        
        // Filter to only featured repos, preserving the order defined above
        const featured = FEATURED_REPOS
          .map(name => data.find(repo => repo.name === name))
          .filter(Boolean);
        
        setProjects(featured);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) return <div className="state-msg">Loading projects...</div>;
  if (error) return <div className="state-msg">Error: {error}</div>;

  return (
    <div className="projects-list">
      {projects.map((repo, i) => (
        <a 
          key={repo.id} 
          href={repo.html_url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="project-card"
          style={{ animationDelay: `${i * 0.1}s` }}
        >
          <div className="project-header">
            <h4 className="project-name">{repo.name}</h4>
            <ArrowUpRight size={14} className="project-arrow" />
          </div>
          <p className="project-desc">
            {repo.description 
              ? repo.description.slice(0, 80) + (repo.description.length > 80 ? '...' : '') 
              : 'No description provided.'}
          </p>
          <div className="project-footer">
            {repo.language && (
              <span className="project-lang">
                <span
                  className="lang-dot"
                  style={{ background: LANG_COLORS[repo.language] || '#8a8a8a' }}
                ></span>
                {repo.language}
              </span>
            )}
            <div className="project-stats">
              <span><Star size={12} /> {repo.stargazers_count}</span>
              <span><GitFork size={12} /> {repo.forks_count}</span>
            </div>
          </div>
        </a>
      ))}
      <a href="https://github.com/CoderXAyush" target="_blank" rel="noopener noreferrer" className="view-more-link">
        View all on GitHub →
      </a>
    </div>
  );
};

export default GitHubProjects;
