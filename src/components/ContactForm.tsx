
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

const ContactForm = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
      <div className="md:col-span-3">
        <form className="space-y-6">
          <div>
            <label htmlFor="name" className="block font-medium mb-2">
              Name
            </label>
            <Input id="name" placeholder="Your name" />
          </div>
          
          <div>
            <label htmlFor="email" className="block font-medium mb-2">
              Email
            </label>
            <Input id="email" type="email" placeholder="your@email.com" />
          </div>
          
          <div>
            <label htmlFor="subject" className="block font-medium mb-2">
              Subject
            </label>
            <Input id="subject" placeholder="What is this about?" />
          </div>
          
          <div>
            <label htmlFor="message" className="block font-medium mb-2">
              Message
            </label>
            <Textarea id="message" placeholder="Your message..." rows={5} />
          </div>
          
          <Button className="w-full md:w-auto py-6 bg-primary text-white">
            Send Message
          </Button>
        </form>
      </div>
      
      <div className="md:col-span-2 space-y-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Mail className="text-primary" size={20} />
            <h3 className="font-semibold text-lg">Email Us</h3>
          </div>
          <p className="text-gray-600">support@quickhirecrew.com</p>
        </div>
        
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Phone className="text-primary" size={20} />
            <h3 className="font-semibold text-lg">Call Us</h3>
          </div>
          <p className="text-gray-600">+1 (555) 123-4567</p>
        </div>
        
        <div>
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="text-primary" size={20} />
            <h3 className="font-semibold text-lg">Visit Us</h3>
          </div>
          <p className="text-gray-600">123 Construction Ave</p>
          <p className="text-gray-600">Suite 456</p>
          <p className="text-gray-600">San Francisco, CA 94105</p>
        </div>
        
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Clock className="text-primary" size={20} />
            <h3 className="font-semibold text-lg">Business Hours</h3>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Monday - Friday:</p>
            <p className="text-gray-600">9:00 AM - 6:00 PM</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Saturday:</p>
            <p className="text-gray-600">10:00 AM - 4:00 PM</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Sunday:</p>
            <p className="text-gray-600">Closed</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
