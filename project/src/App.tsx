import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import PrescriptionAnalyzer from './pages/PrescriptionAnalyzer';
import MedicineScanner from './pages/MedicineScanner';
import ChatAssistant from './pages/ChatAssistant';
import About from './pages/About';
import { Link } from 'react-router-dom';

const fade = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.2 } },
};

function Page({ children }: { children: React.ReactNode }) {
  return <motion.div variants={fade} initial="initial" animate="animate" exit="exit">{children}</motion.div>;
}

export default function App() {
  const location = useLocation();
  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <Navbar />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Page><Home /></Page>} />
            <Route path="/prescription" element={<Page><PrescriptionAnalyzer /></Page>} />
            <Route path="/scanner" element={<Page><MedicineScanner /></Page>} />
            <Route path="/chat" element={<Page><ChatAssistant /></Page>} />
            <Route path="/about" element={<Page><About /></Page>} />
            <Route path="*" element={
              <Page>
                <div className="min-h-[70vh] flex flex-col items-center justify-center text-white gap-4">
                  <p className="text-7xl">🏥</p>
                  <h1 className="text-3xl font-bold">Page Not Found</h1>
                  <Link to="/" className="btn-primary mt-2">Go Home</Link>
                </div>
              </Page>
            } />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
