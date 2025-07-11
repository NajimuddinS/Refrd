import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import ReferralStatusChecker from '../components/ReferralStatusChecker';
import Footer from '../components/Footer';

function Home() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/login');
  };

  const handleSignIn = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar 
        onSignIn={handleSignIn} 
        onGetStarted={handleGetStarted}
      />
      <HeroSection onGetStarted={handleGetStarted} />
      <ReferralStatusChecker />
      <Footer />
    </div>
  );
}

export default Home;