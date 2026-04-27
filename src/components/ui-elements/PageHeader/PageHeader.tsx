import { Link } from "react-router-dom";

type BreadcrumbItem = {
  label: string;
  path?: string;
};

type PageHeaderProps = {
  title: string;
  breadcrumbs: BreadcrumbItem[];
};

export default function PageHeader({ title, breadcrumbs }: PageHeaderProps) {
  return ( 
    // <div className="bg-white px-6 py-4 border-b flex items-center justify-between">
    <div className="px-6 py-4 border-b flex items-center justify-between">
        
      {/* Left: Title */}
      <h1 className="text-xl font-semibold">{title}</h1>

      {/* Right: Breadcrumb */}
      <div className="flex items-center text-sm text-gray-500 gap-2">
        {breadcrumbs.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            {item.path ? (
              <Link to={item.path} className="hover:text-blue-500">
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-800">{item.label}</span>
            )}

            {index < breadcrumbs.length - 1 && <span>›</span>}
          </div>
        ))}
      </div>
    </div>
  );
}