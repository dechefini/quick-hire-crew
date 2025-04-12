
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="hero-section py-32">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-primary mb-8">
          Build Your Future in <br /> Construction
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-12">
          The fastest way to find work or hire skilled contractors in your area. Join thousands of professionals making connections every day.
        </p>
        
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 bg-white rounded-md p-2 shadow-sm mb-8">
            <span className="text-gray-600 mr-2">Language:</span>
            <Button variant="default" className="bg-primary text-white rounded-md px-4">
              English
            </Button>
            <Button variant="ghost" className="text-gray-700 rounded-md px-4">
              Español
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link to="/work">
            <Button className="bg-primary text-white px-8 py-6 text-lg rounded-md w-full sm:w-auto">
              I Need Work
            </Button>
          </Link>
          <Link to="/hire">
            <Button variant="outline" className="bg-white text-primary border-primary px-8 py-6 text-lg rounded-md w-full sm:w-auto">
              I Need to Hire
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
