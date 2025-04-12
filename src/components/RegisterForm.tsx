
import { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserIcon, Building2, HomeIcon } from "lucide-react";

const RegisterForm = () => {
  const [accountType, setAccountType] = useState<'contractor' | 'company' | null>(null);

  return (
    <div className="bg-white rounded-lg shadow-md max-w-md w-full mx-auto p-8">
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 rounded-full bg-primary bg-opacity-10 flex items-center justify-center">
          <UserIcon className="text-primary" size={32} />
        </div>
      </div>
      
      <h1 className="text-2xl font-bold text-center mb-2">Create Account</h1>
      <p className="text-gray-500 text-center mb-6">Sign up to get started</p>
      
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <Input 
              id="username" 
              placeholder="Username" 
              className="bg-blue-50 border-0"
            />
          </div>
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <Input 
              id="fullName" 
              placeholder="Full Name" 
              className="bg-blue-50 border-0"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <Input 
            id="phoneNumber" 
            placeholder="Phone Number" 
            className="bg-blue-50 border-0"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <Input 
              id="password" 
              type="password" 
              placeholder="••••••••••"
              className="bg-blue-50 border-0"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <Input 
              id="confirmPassword" 
              type="password" 
              placeholder="••••••••••"
              className="bg-blue-50 border-0"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Account Type
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button 
              type="button"
              onClick={() => setAccountType('contractor')}
              className={`p-4 border rounded-md flex flex-col items-center justify-center gap-2 transition-colors
                ${accountType === 'contractor' ? 'border-primary text-primary' : 'border-gray-200 text-gray-500'}`}
            >
              <UserIcon size={28} />
              <span>Contractor</span>
            </button>
            <button 
              type="button"
              onClick={() => setAccountType('company')}
              className={`p-4 border rounded-md flex flex-col items-center justify-center gap-2 transition-colors
                ${accountType === 'company' ? 'border-primary text-primary' : 'border-gray-200 text-gray-500'}`}
            >
              <Building2 size={28} />
              <span>Company</span>
            </button>
          </div>
        </div>
        
        <Button className="w-full py-6 bg-primary text-white">
          <Building2 size={18} className="mr-2" />
          Register Account
        </Button>
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
        </p>
        <Link to="/" className="inline-flex items-center justify-center gap-2 text-gray-600 mt-4 hover:text-primary">
          <HomeIcon size={16} />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default RegisterForm;
