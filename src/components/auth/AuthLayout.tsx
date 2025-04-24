
import { Link } from "react-router-dom";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
}

export function AuthLayout({ children, title, description }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-blue-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-center mb-6">
            <Link to="/">
              <img 
                src="/lovable-uploads/28cef98f-7973-4892-9eb5-f0e02978d22e.png" 
                alt="logo" 
                className="h-14 w-auto object-contain"
                style={{ maxWidth: 160 }}
              />
            </Link>
          </div>
          
          <h1 className="text-center text-2xl font-bold mb-2">{title}</h1>
          <p className="text-center text-gray-600 mb-6">{description}</p>
          
          {children}
        </div>
      </div>
    </div>
  );
}
