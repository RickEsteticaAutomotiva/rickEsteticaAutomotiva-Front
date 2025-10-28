import { Link } from 'react-router-dom';
import './Breadcrumb.css';

export function Breadcrumb({ items }) {
  return (
    <nav className="breadcrumb-container">
      <div className="breadcrumb-wrapper">
        <div className="breadcrumb-items">
          {items.map((item, index) => (
            <div key={index} className="breadcrumb-item-wrapper">
              {item.href ? (
                <Link to={item.href} className="breadcrumb-link">
                  {item.icon && <i className={`${item.icon} mr-1`}></i>}
                  <span className="breadcrumb-text">{item.label}</span>
                </Link>
              ) : (
                <span className="breadcrumb-current">
                  {item.icon && <i className={`${item.icon} mr-1`}></i>}
                  <span className="breadcrumb-text">{item.label}</span>
                </span>
              )}
              
              {index < items.length - 1 && (
                <i className="bi bi-chevron-right breadcrumb-separator"></i>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}