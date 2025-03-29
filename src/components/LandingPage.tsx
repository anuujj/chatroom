import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <h1>Welcome to Chat Rooms</h1>
      <div className="action-buttons">
        <button 
          className="join-btn" 
          onClick={() => navigate('/join')}
        >
          Join a Chat Room
        </button>
        <button 
          className="create-btn" 
          onClick={() => navigate('/create')}
        >
          Create a Chat Room
        </button>
      </div>
    </div>
  );
};

export default LandingPage;