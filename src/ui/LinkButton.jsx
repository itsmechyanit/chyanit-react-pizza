import { Link, useNavigate } from 'react-router-dom';

function LinkButton({ to, children }) {
  let className = 'text-sm text-blue-500 underline hover:text-blue-600';
  const navigate = useNavigate();

  if (to === '-1') {
    return (
      <button className={className} onClick={() => navigate(-1)}>
        {children}
      </button>
    );
  }

  return (
    <Link to={to} className={className}>
      {children}
    </Link>
  );
}

export default LinkButton;
