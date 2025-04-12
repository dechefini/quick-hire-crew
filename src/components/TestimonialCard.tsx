
interface TestimonialCardProps {
  quote: string;
  name: string;
  title: string;
}

const TestimonialCard = ({ quote, name, title }: TestimonialCardProps) => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-sm">
      <p className="text-lg italic mb-6">"{quote}"</p>
      <h4 className="font-bold">{name}</h4>
      <p className="text-gray-600">{title}</p>
    </div>
  );
};

export default TestimonialCard;
