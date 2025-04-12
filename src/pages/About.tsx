
import { 
  Building2, Users, Target, BarChart3 
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const About = () => {
  return (
    <>
      <section className="py-16">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold text-center mb-4">
            About Quick Hire Crew
          </h1>
          <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto mb-16">
            Connecting construction companies with skilled temporary workers
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white p-8 rounded-lg border">
              <h2 className="text-2xl font-bold text-primary mb-4">Our Mission</h2>
              <p className="text-gray-600">
                To revolutionize temporary staffing in construction by creating seamless connections between skilled workers and companies, ensuring projects stay on schedule and workers find meaningful opportunities.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg border">
              <h2 className="text-2xl font-bold text-primary mb-4">Our Vision</h2>
              <p className="text-gray-600">
                To become the leading platform for construction workforce management, making it easier than ever to find and manage temporary skilled labor.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
            <div className="bg-primary/5 p-6 rounded-lg text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="text-primary" size={28} />
              </div>
              <h3 className="text-3xl font-bold mb-2">500+</h3>
              <p className="text-gray-600">Companies</p>
            </div>
            
            <div className="bg-primary/5 p-6 rounded-lg text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-primary" size={28} />
              </div>
              <h3 className="text-3xl font-bold mb-2">10,000+</h3>
              <p className="text-gray-600">Workers</p>
            </div>
            
            <div className="bg-primary/5 p-6 rounded-lg text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="text-primary" size={28} />
              </div>
              <h3 className="text-3xl font-bold mb-2">25,000+</h3>
              <p className="text-gray-600">Jobs Completed</p>
            </div>
            
            <div className="bg-primary/5 p-6 rounded-lg text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="text-primary" size={28} />
              </div>
              <h3 className="text-3xl font-bold mb-2">95%</h3>
              <p className="text-gray-600">Success Rate</p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-16 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8">How It Works</h2>
          
          <p className="text-lg text-gray-600 max-w-5xl mb-16">
            Quick Hire Crew provides a streamlined platform where construction companies can quickly find and hire temporary workers based on their specific needs. Our matching system considers skills, experience, and availability to ensure the perfect fit.
          </p>
          
          <h2 className="text-3xl font-bold mb-8">Why Choose Us</h2>
          
          <ul className="space-y-4 text-lg text-gray-600 max-w-5xl mb-16">
            <li className="flex items-start gap-2">
              <div className="text-primary font-bold text-lg">•</div>
              <div>Quick and efficient matching process</div>
            </li>
            <li className="flex items-start gap-2">
              <div className="text-primary font-bold text-lg">•</div>
              <div>Verified skilled workers</div>
            </li>
            <li className="flex items-start gap-2">
              <div className="text-primary font-bold text-lg">•</div>
              <div>Secure payment system</div>
            </li>
            <li className="flex items-start gap-2">
              <div className="text-primary font-bold text-lg">•</div>
              <div>Real-time communication</div>
            </li>
            <li className="flex items-start gap-2">
              <div className="text-primary font-bold text-lg">•</div>
              <div>Rating and review system</div>
            </li>
          </ul>
          
          <div className="text-center">
            <Link to="/register">
              <Button className="bg-primary text-white px-8 py-6 text-lg rounded-md">
                Join Quick Hire Crew Today
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
