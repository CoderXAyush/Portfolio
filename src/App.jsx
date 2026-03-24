import { useRef, useState, useEffect, useCallback } from 'react';
import { Github, Mail } from 'lucide-react';

const LinkedinIcon = () => (
  <svg role="img" viewBox="0 0 24 24" fill="currentColor" width="18" height="18" xmlns="http://www.w3.org/2000/svg" style={{ marginBottom: '-2px' }}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);
import GitHubProjects from './components/GitHubProjects';
import CustomCursor from './components/CustomCursor';
import MobileTouchEffects from './components/MobileTouchEffects';
import TypingGame from './components/TypingGame';
import TechStack from './components/TechStack';
import ViewCounter from './components/ViewCounter';
import './components/TypingGame.css';
import './components/TechStack.css';
import './App.css';

function App() {
  // 'hero' = full-screen name+about, 'layout' = sidebar + panel layout
  const [phase, setPhase] = useState('hero');
  const [currentSection, setCurrentSection] = useState(0);
  const isAnimating = useRef(false);
  const hasTransitioned = useRef(false);

  const sections = [
    { id: 'WORKS', label: 'WORKS' },
    { id: 'TECH', label: 'TECH' },
  ];

  // Transition from hero → layout on first scroll
  const triggerTransition = useCallback(() => {
    if (hasTransitioned.current) return;
    hasTransitioned.current = true;
    isAnimating.current = true;
    setCurrentSection(0); // Always land on WORKS
    setPhase('layout');
    // Long cooldown to prevent fast-scroll skip
    setTimeout(() => { isAnimating.current = false; }, 1200);
  }, []);

  // Nav click scrolling (only works in layout mode)
  const goToSection = useCallback((index) => {
    if (phase !== 'layout') return;
    if (isAnimating.current) return;
    if (index < 0 || index >= sections.length) return;
    if (index === currentSection) return;

    isAnimating.current = true;
    setCurrentSection(index);
    setTimeout(() => { isAnimating.current = false; }, 900);
  }, [currentSection, sections.length, phase]);

  // Wheel: first scroll transitions hero→layout, then navigate sections
  useEffect(() => {
    const handleWheel = (e) => {
      if (window.innerWidth <= 800) return; // Allow native scrolling on mobile

      // If the current section has a scrollable area, let it scroll natively until edges
      const scrollable = document.querySelector('.right-section.active .scrollable-section');
      if (scrollable && scrollable.scrollHeight > scrollable.clientHeight) {
        const isAtTop = scrollable.scrollTop <= 0;
        const isAtBottom = Math.abs(scrollable.scrollHeight - scrollable.scrollTop - scrollable.clientHeight) < 2;

        if (e.deltaY < 0 && !isAtTop) {
          scrollable.scrollTop += e.deltaY;
          return;
        }
        if (e.deltaY > 0 && !isAtBottom) {
          scrollable.scrollTop += e.deltaY;
          return;
        }
      }

      e.preventDefault();

      if (phase === 'hero') {
        if (e.deltaY > 0) triggerTransition();
        return;
      }

      // In layout mode: block during animation
      if (isAnimating.current) return;
      if (e.deltaY > 0) {
        goToSection(currentSection + 1);
      } else if (e.deltaY < 0) {
        if (currentSection === 0) {
          // Scroll up from first section → go back to hero
          hasTransitioned.current = false;
          setPhase('hero');
        } else {
          goToSection(currentSection - 1);
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [phase, currentSection, goToSection, triggerTransition]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (window.innerWidth <= 800) return; // Allow native keyboard scrolling on mobile

      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        if (phase === 'hero') { triggerTransition(); return; }
        goToSection(currentSection + 1);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        if (phase === 'layout' && currentSection === 0) {
          hasTransitioned.current = false;
          setPhase('hero');
        } else {
          goToSection(currentSection - 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, currentSection, goToSection, triggerTransition]);

  // Mouse position tracking for ambient dynamic background gradient
  useEffect(() => {
    const handleMouseMove = (e) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const isHero = phase === 'hero';
  const isLayout = phase === 'layout';

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 800);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 800);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Scroll-reveal observer for mobile
  useEffect(() => {
    if (!isMobile) return;
    const root = document.querySelector('.page.mobile-mode');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      { root, threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    );

    // Delay to let DOM mount
    const timer = setTimeout(() => {
      document.querySelectorAll('[data-reveal]').forEach((el) => {
        observer.observe(el);
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [isMobile]);

  if (isMobile) {
    return (
      <div className="page mobile-mode">
        <MobileTouchEffects />

        <nav className="mobile-nav">
          <div className="nav-links-mobile">
            <a href="#home">HOME</a>
            <a href="#works">WORKS</a>
            <a href="#tech">TECH</a>
          </div>
          <div className="profile-counter-mobile">
            <ViewCounter />
          </div>
          <div className="social-links-mobile">
            <a href="https://www.linkedin.com/in/ayush-aman-iitp/" target="_blank" rel="noopener noreferrer"><LinkedinIcon /></a>
            <a href="https://github.com/CoderXAyush" target="_blank" rel="noopener noreferrer"><Github size={18} strokeWidth={1.5} /></a>
            <a href="mailto:ayushhaman7@gmail.com"><Mail size={18} strokeWidth={1.5} /></a>
          </div>
        </nav>

        <div className="mobile-content">
          <div className="mobile-header fixed-header">
            <h1 className="hero-name">AYUSH</h1>
          </div>

          <section id="home" className="mobile-section home-section">
            <h2 className="hero-subtitle" data-reveal>
              B.Tech Final Year Student / <strong>Indian Institute of Technology(IITP), Patna</strong>
            </h2>

            <div className="about-block" data-reveal>
              <h3 className="section-label">ABOUT ME</h3>
              <div className="section-divider"></div>
              <TypingGame />
              <p className="about-text">
                I am currently focusing on <strong>building digital products</strong> and crafting dark, minimalist, and responsive designs.
                <br /><br />
                My main focus is <strong>web development</strong>, and I have worked on several full-stack personal projects. I enjoy exploring new technologies and experimenting with creative ideas.
                <br /><br />
                Outside of programming, I enjoy <strong> exploring new tech</strong>, playing chess, and continuously learning.
              </p>
            </div>

          </section>

          <section id="works" className="mobile-section" data-reveal>
            <h3 className="panel-title">WORKS</h3>
            <div className="panel-divider"></div>
            <GitHubProjects />
          </section>

          <section id="tech" className="mobile-section" data-reveal>
            <h3 className="panel-title">TECH & TOOLS</h3>
            <div className="panel-divider"></div>
            <TechStack />
          </section>

          <section id="contact" className="mobile-section contact-section" data-reveal>
            <div className="contact-inquiry">
              <p>For contact inquiries, email me at</p>
              <a href="mailto:ayushhaman7@gmail.com"><strong>ayushhaman7@gmail.com</strong></a>
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className={`page ${isLayout ? 'layout-mode' : 'hero-mode'}`}>
      <CustomCursor />

      {/* === FULL-SCREEN HERO === */}
      <div className={`hero-fullscreen ${isLayout ? 'collapsed' : ''}`}>
        <div className="hero-content">
          <h1 className="hero-name-full">AYUSH</h1>
          <h2 className="hero-subtitle-full">
            B.Tech Final Year Student / <strong>Indian Institute of Technology(IITP), Patna</strong>
          </h2>

          <div className="hero-game">
            <TypingGame />
          </div>

          <div className="hero-about">
            <h3 className="section-label">ABOUT ME</h3>
            <div className="section-divider"></div>
            <p className="about-text">
              I am currently focusing on <strong>building digital products</strong> and crafting dark, minimalist, and responsive designs.
              <br /><br />
              My main focus is <strong>web development</strong>, and I have worked on several full-stack personal projects. I enjoy exploring new technologies and experimenting with creative ideas.
              <br /><br />
              Outside of programming, I enjoy <strong> exploring new tech</strong>, playing chess, and continuously learning.
            </p>
          </div>

          <div className="hero-contact">
            <p>For contact inquiries, email me at</p>
            <a href="mailto:ayushhaman7@gmail.com"><strong>ayushhaman7@gmail.com</strong></a>
          </div>
        </div>

        <div className="hero-scroll-cue">
          <div className="scroll-cue-line"></div>
        </div>
      </div>

      {/* === SIDEBAR (only visible in layout) === */}
      <nav className={`sidebar ${isLayout ? 'show' : ''}`}>
        <ul className="nav-links">
          <li className={`nav-item ${isHero ? 'active' : ''}`}>
            <button onClick={() => {
              hasTransitioned.current = false;
              setPhase('hero');
            }}>
              HOME
            </button>
          </li>
          {sections.map((sec, i) => (
            <li
              key={sec.id}
              className={`nav-item ${isLayout && currentSection === i ? 'active' : ''}`}
            >
              <button onClick={() => goToSection(i)}>
                {sec.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="profile-counter">
          <ViewCounter />
        </div>

        <div className="social-links">
          <a href="https://www.linkedin.com/in/ayush-aman-iitp/" target="_blank" rel="noopener noreferrer"><LinkedinIcon /></a>
          <a href="https://github.com/CoderXAyush" target="_blank" rel="noopener noreferrer"><Github size={18} strokeWidth={1.5} /></a>
          <a href="mailto:ayushhaman7@gmail.com"><Mail size={18} strokeWidth={1.5} /></a>
        </div>
      </nav>

      {/* === FIXED LEFT (only visible in layout) === */}
      <div className={`fixed-left ${isLayout ? 'show' : ''}`}>
        <div className="hero-block">
          <h1 className="hero-name">AYUSH</h1>
          <h2 className="hero-subtitle">
            B.Tech Final Year Student / <strong>Indian Institute of Technology(IITP), Patna</strong>
          </h2>
        </div>

        <div className="about-block">
          <h3 className="section-label">ABOUT ME</h3>
          <div className="section-divider"></div>
          <p className="about-text">
            I am currently focusing on <strong>building digital products</strong> and crafting dark, minimalist, and responsive designs.
            <br /><br />
            My main focus is <strong>web development</strong>, and I have worked on several full-stack personal projects.
          </p>
        </div>

        <div className="contact-inquiry">
          <p>For contact inquiries, email me at</p>
          <a href="mailto:ayushhaman7@gmail.com"><strong>ayushhaman7@gmail.com</strong></a>
        </div>
      </div>

      {/* === RIGHT PANEL (only visible in layout) === */}
      <div className={`right-panel ${isLayout ? 'show' : ''}`}>
        <div className="section-dots">
          {sections.map((sec, i) => (
            <button
              key={sec.id}
              className={`dot ${currentSection === i ? 'active' : ''}`}
              onClick={() => goToSection(i)}
              aria-label={`Go to ${sec.label}`}
            />
          ))}
        </div>

        {/* WORKS */}
        <div className={`right-section ${currentSection === 0 ? 'active' : currentSection > 0 ? 'above' : 'below'}`}>
          <div className="right-section-inner">
            <h3 className="panel-title">WORKS</h3>
            <div className="panel-divider"></div>
            <GitHubProjects />
          </div>
        </div>

        {/* TECH STACK */}
        <div className={`right-section ${currentSection === 1 ? 'active' : currentSection > 1 ? 'above' : 'below'}`}>
          <div className="right-section-inner scrollable-section">
            <h3 className="panel-title">TECH & TOOLS</h3>
            <div className="panel-divider"></div>
            <TechStack />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
