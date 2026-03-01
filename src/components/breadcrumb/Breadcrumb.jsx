import { Link } from 'react-router-dom';

export function Breadcrumb({ items }) {
  return (
    <nav className="bg-gray-50 border-b border-gray-200 py-4">
      <div className="mx-auto px-4 md:px-14">
        <div className="flex items-center flex-wrap gap-2 text-sm">
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              {item.href ? (
                <Link
                  to={item.href}
                  className="flex items-center text-gray-500 no-underline px-2 py-1 rounded-md transition-all hover:text-red-600 hover:bg-red-50"
                >
                  {item.icon && <i className={`${item.icon} mr-1`}></i>}
                  <span>{item.label}</span>
                </Link>
              ) : (
                <span className="flex items-center text-gray-800 font-semibold px-2 py-1 bg-white rounded-md border border-gray-200">
                  {item.icon && <i className={`${item.icon} mr-1`}></i>}
                  <span>{item.label}</span>
                </span>
              )}

              {index < items.length - 1 && (
                <i className="bi bi-chevron-right text-gray-400 text-xs"></i>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}