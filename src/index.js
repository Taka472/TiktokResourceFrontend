import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import './index.css';
import Dashboard from './pages/dashboard/Dashboard';
import reportWebVitals from './reportWebVitals';
import Calendar from './pages/calendar/Calendar';
import Reviewer from './pages/reviewer/Reviewer';
import Statistic from './pages/statistic/Statistic';
import Payment from './pages/payment/Payment';
import { LockProvider } from './lockContext/lockContext';
import GlobalLock from './lockContext/globalLock';
import Coins from './pages/coins/Coins';
import OtherPayment from './pages/otherPayment/OtherPayment';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <LockProvider>
    <GlobalLock />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/reviewer" element={<Reviewer />} />
        <Route path="/statistic" element={<Statistic />} />
        <Route path="/coins" element={<Coins />} />
        <Route path="/other" elements={<OtherPayment />} />
      </Routes>
    </BrowserRouter>
  </LockProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
