import './Dashboard.css';

const isToday = (date) => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

const isThisWeek = (date) => {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay() + 1); //Lấy ra thứ 2
  startOfWeek.setHours(0, 0, 0, 0);
};

function Dashboard() {
  return (
    <div>

    </div>
  );
}

export default Dashboard;
