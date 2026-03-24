import './TechStack.css';

// Simple Icons CDN: https://cdn.simpleicons.org/{slug}/{color}
// Color is hex without the # prefix
const icon = (slug, hex = '8a8a8a') =>
  `https://cdn.simpleicons.org/${slug}/${hex}`;

const CATEGORIES = [
  {
    title: 'Languages',
    items: [
      { name: 'C++',        color: '#f34b7d', icon: icon('cplusplus') },
      { name: 'Go',         color: '#00ADD8', icon: icon('go') },
      { name: 'JavaScript', color: '#f1e05a', icon: icon('javascript') },
      { name: 'Python',     color: '#3572A5', icon: icon('python') },
    ],
  },
  {
    title: 'Frontend',
    items: [
      { name: 'React.js',   color: '#61DAFB', icon: icon('react') },
      { name: 'Next.js',    color: '#00C2FF', icon: icon('nextdotjs') },
    ],
  },
  {
    title: 'Backend',
    items: [
      { name: 'Node.js',    color: '#68A063', icon: icon('nodedotjs') },
      { name: 'Express.js', color: '#68A063', icon: icon('express') },
      { name: 'Gin',        color: '#00ADD8', icon: icon('gin') },
    ],
  },
  {
    title: 'Databases',
    items: [
      { name: 'MongoDB',    color: '#47A248', icon: icon('mongodb') },
      { name: 'Redis',      color: '#DC382D', icon: icon('redis') },
      { name: 'MySQL',      color: '#4479A1', icon: icon('mysql') },
    ],
  },
  {
    title: 'DevOps & Cloud',
    items: [
      { name: 'Docker',     color: '#2496ED', icon: icon('docker') },
      { name: 'Kubernetes', color: '#326CE5', icon: icon('kubernetes') },
      { name: 'Kafka',      color: '#E32529', icon: icon('apachekafka') },
      { name: 'Terraform',  color: '#7B42BC', icon: icon('terraform') },
      { name: 'AWS',        color: '#FF9900', icon: 'https://api.iconify.design/mdi/aws.svg' },
      { name: 'CI/CD',      color: '#4CAF50', icon: icon('githubactions') },
      { name: 'Git',        color: '#F05032', icon: icon('git') },
      { name: 'Linux',      color: '#51A2DA', icon: icon('linux') },
    ],
  },
  {
    title: 'Tools',
    items: [
      { name: 'Antigravity', color: '#4285F4', icon: `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M 25 80 Q 50 10 75 80" stroke="black" stroke-width="20" stroke-linecap="round" fill="none" /></svg>')}` },
      { name: 'Cursor',      color: '#00D1FF', icon: icon('cursor') },
      { name: 'Gemini',      color: '#886FBF', icon: icon('googlegemini') },
      { name: 'Claude',      color: '#D4A27F', icon: `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="black"><path d="M50 10L53 38L50 42L47 38ZM50 90L47 62L50 58L53 62ZM10 50L38 47L42 50L38 53ZM90 50L62 53L58 50L62 47ZM21.7 21.7L40.5 37.5L41.2 41.2L37.5 40.5ZM78.3 78.3L59.5 62.5L58.8 58.8L62.5 59.5ZM78.3 21.7L62.5 40.5L58.8 41.2L59.5 37.5ZM21.7 78.3L37.5 59.5L41.2 58.8L40.5 62.5Z" /></svg>')}` },
      { name: 'GitHub',      color: '#ffffff', icon: icon('github') },
    ],
  },
];

const TechStack = () => {
  return (
    <div className="tech-stack">
      {CATEGORIES.map((cat) => (
        <div className="tech-category" key={cat.title}>
          <h4 className="tech-cat-title">{cat.title}</h4>
          <div className="tech-items">
            {cat.items.map((item) => (
              <span
                key={item.name}
                className="tech-chip"
                style={{ '--hover-color': item.color }}
              >
                <div
                  className="tech-icon-mask"
                  style={{ '--icon-url': `url(${item.icon})` }}
                  title={item.name}
                />
                {item.name}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TechStack;
