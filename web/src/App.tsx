import './App.css';
import StripeContainer from './components/StripeContainer';
import { useState } from 'react';

function App() {
  const [showItem, setShowItem] = useState(false);

  const handleShowItem = () => {
    setShowItem(true);
  };

  return (
    <div className="App">
      <h1>Payment gateway prototype</h1>

      <p style={{ textAlign: 'center' }}>
        Test input : 4242 4242 4242 4242 , 04/24 , 242, 42424
      </p>
      <br />

      {showItem ? (
        <StripeContainer />
      ) : (
        <>
          <h3>$10.00</h3>
          <p style={{ textAlign: 'center' }}>
            Power up for growth Ideal for smart business for more conversions,
            turnover & ROI
          </p>
          <button onClick={handleShowItem}>Upgrade plan</button>
        </>
      )}
    </div>
  );
}

export default App;
