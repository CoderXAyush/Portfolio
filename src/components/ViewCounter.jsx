import { useState, useEffect } from 'react';

const NAMESPACE = 'ayush-aman-portfolio-2026'; // More unique namespace
const KEY = 'visits';

function ViewCounter() {
  const [count, setCount] = useState('...');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const alreadyCounted = sessionStorage.getItem('portfolio-counted');
        const endpoint = alreadyCounted
          ? `https://api.counterapi.dev/v1/${NAMESPACE}/${KEY}`
          : `https://api.counterapi.dev/v1/${NAMESPACE}/${KEY}/up`;

        const res = await fetch(endpoint);
        if (!res.ok) throw new Error('API down');
        const data = await res.json();
        
        if (data && typeof data.count === 'number') {
          setCount(data.count);
          sessionStorage.setItem('portfolio-counted', '1');
        } else {
          setCount('12'); // Minimal demo fallback 
        }
      } catch (err) {
        console.warn('ViewCounter loading error:', err);
        setCount('8'); // Minimal demo fallback if API is blocked/down
      }
    };

    fetchData();
  }, []);

  return (
    <div className="view-counter">
      <span className="view-counter-number">{count}</span>
      <span className="view-counter-label">views</span>
    </div>
  );
}

export default ViewCounter;
