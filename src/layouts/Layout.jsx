import { useEffect } from 'react';

const Layout = ({ children }) => {
  useEffect(() => {
    // Helper for smooth scrolling if needed (optional since CSS smooth-scroll is used)
  }, []);

  return (
    <div className="min-h-screen bg-emerald-950 text-emerald-100 font-inter selection:bg-emerald-500 selection:text-white">
      {/* Background Texture/Noise Overlay could go here */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay z-50 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      
      <main className="relative z-10">
        {children}
      </main>
      
      <footer className="py-8 text-center text-emerald-300/60 text-sm font-light tracking-wider">
        <p>&copy; {new Date().getFullYear()} &middot; Forever & Always</p>
      </footer>
    </div>
  );
};

export default Layout;
