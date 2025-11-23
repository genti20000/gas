
import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Highlights from './components/Highlights';
import Features from './components/Features';
import Menu from './components/Menu';
import Fitness from './components/Fitness';
import Battery from './components/Battery';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import DrinksMenu from './components/DrinksMenu';
import ImageEditor from './components/ImageEditor';
import Chatbot from './components/Chatbot';
import WhatsAppButton from './components/WhatsAppButton';
import AdminDashboard from './components/AdminDashboard';
import { DataProvider } from './context/DataContext';

type Page = 'home' | 'menu' | 'drinks' | 'imageEditor' | 'admin';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  return (
    <DataProvider>
      <div className="bg-black text-white min-h-screen">
        {currentPage !== 'admin' && <Header onNavigate={navigateTo} />}
        <main>
          {currentPage === 'home' && (
            <>
              <Hero />
              <Highlights />
              <Features />
              <Fitness />
              <Battery />
              <Testimonials />
            </>
          )}
          {currentPage === 'menu' && <Menu />}
          {currentPage === 'drinks' && <DrinksMenu />}
          {currentPage === 'imageEditor' && <ImageEditor />}
          {currentPage === 'admin' && <AdminDashboard />}
        </main>
        {currentPage !== 'admin' && <Footer onNavigate={navigateTo} />}
        {currentPage !== 'admin' && (
            <>
                <WhatsAppButton />
                <Chatbot />
            </>
        )}
      </div>
    </DataProvider>
  );
};

export default App;
