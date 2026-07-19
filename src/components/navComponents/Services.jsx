import Section from "../sections/Section";
import StepCard from "../ui/StepCard";

const steps = [
  {
    number: '01',
    title: 'Search Doctors',
    description:
      'Find doctors by specialty, location, or availability. Filter by ratings and experience.',
  },
  {
    number: '02',
    title: 'Book Appointment',
    description:
      'Select your preferred time slot and confirm your appointment with just a few clicks.',
  },
  {
    number: '03',
    title: 'Get Consultation',
    description:
      'Visit the doctor or connect online. Receive prescriptions and follow-up care.',
  },
];
const Services = () => {
  return (
    <div>
      <Section
        showTopDivider={false}
       
        id='services'
        title='Services'
        description='Getting started is simple. Follow these three easy steps to book your appointment.'
        bgColor='from-gray-950 via-blue-950/20 to-gray-950'
      >
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mt-12'>
          {steps.map((step, index) => (
            <StepCard key={index} {...step} index={index} />
          ))}
        </div>
      </Section>
    </div>
  );
};

export default Services;
