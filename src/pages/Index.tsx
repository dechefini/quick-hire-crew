
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Hero from "@/components/Hero";
import StatCard from "@/components/StatCard";
import FeatureCard from "@/components/FeatureCard";
import TestimonialCard from "@/components/TestimonialCard";
import { 
  Users, Award, Star, Building2, HardHat, Clock, Shield,
} from "lucide-react";

const Index = () => {
  return (
    <>
      <Hero />
      
      <section className="py-16 bg-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StatCard 
              icon={<Users size={32} />}
              stat="10,000+"
              description="Active Users"
            />
            <StatCard 
              icon={<Award size={32} />}
              stat="95%"
              description="Success Rate"
            />
            <StatCard 
              icon={<Star size={32} />}
              stat="4.8/5"
              description="User Rating"
            />
          </div>
        </div>
      </section>
      
      <section className="py-16">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">
            Why Choose QuickHireCrew?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
            <FeatureCard 
              icon={<Building2 size={24} />}
              title="Connect with Top Companies"
              description="Access opportunities with leading construction firms in your area"
            />
            <FeatureCard 
              icon={<HardHat size={24} />}
              title="Skilled Workforce"
              description="Find qualified contractors for your construction projects"
            />
            <FeatureCard 
              icon={<Clock size={24} />}
              title="Quick Hiring"
              description="Streamlined process to get workers on site faster"
            />
            <FeatureCard 
              icon={<Shield size={24} />}
              title="Verified Profiles"
              description="All contractors and companies are thoroughly vetted"
            />
          </div>
        </div>
      </section>
      
      <section className="py-16 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">
            What Our Users Say
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <TestimonialCard 
              quote="QuickHireCrew transformed how we hire contractors. The process is seamless and efficient."
              name="John Smith"
              title="Project Manager, BuildCorp Inc."
            />
            <TestimonialCard 
              quote="Found consistent work opportunities within days. Best platform for construction professionals!"
              name="Sarah Johnson"
              title="Independent Contractor"
            />
          </div>
        </div>
      </section>
      
      <section className="py-16 light-blue-section">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
            Join thousands of construction professionals already using QuickHireCrew
          </p>
          
          <Link to="/register">
            <Button className="bg-primary text-white px-8 py-6 text-lg rounded-md">
              Sign Up Now
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
};

export default Index;
