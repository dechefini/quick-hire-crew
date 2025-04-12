
import ContactForm from "@/components/ContactForm";

const Contact = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4">
          Contact Quick Hire Crew
        </h1>
        <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto mb-16">
          Get in touch with our team
        </p>
        
        <ContactForm />
      </div>
    </section>
  );
};

export default Contact;
