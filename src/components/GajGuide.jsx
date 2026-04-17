import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import GajMascot from '../assets/elephant-mascot.png';


const GajGuide = () => {
  const [message, setMessage] = useState("Welcome to M-Maidan! I'm Gaj-Guide.");
  const [isVisible, setIsVisible] = useState(true);

  // Example: Change message based on stadium events
  useEffect(() => {
    const timer = setTimeout(() => {
      setMessage("Gate 4 is crowded! Try Gate 1 for 10m faster entry. 🐘");
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed bottom-10 right-5 z-50 flex flex-col items-end pointer-events-none">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="mb-4 mr-2 max-w-[200px] bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-2xl rounded-br-none shadow-2xl pointer-events-auto"
          >
            <p className="text-xs text-emerald-400 font-bold uppercase tracking-widest mb-1">Gaj-Guide AI</p>
            <p className="text-sm text-white font-medium leading-tight">
              {message}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="pointer-events-auto cursor-pointer"
        animate={{
          y: [0, -15, 0], // Floating effect
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        onClick={() => setIsVisible(!isVisible)}
      >
        {/* Replace with your generated elephant image path */}
        <img 
          src={GajMascot} 
          alt="M-Maidan Elephant Mascot" 
          className="w-24 h-24 md:w-32 md:h-32 drop-shadow-[0_20px_50px_rgba(0,255,136,0.3)]"
        />

        
        {/* Subtle glowing ring under the mascot */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-4 bg-emerald-500/20 blur-xl rounded-[100%]" />
      </motion.div>
    </div>
  );
};

export default GajGuide;