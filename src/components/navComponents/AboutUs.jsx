import Section from '../sections/Section';

const AboutUs = () => {
  return (
    <div>
      <Section
        showTopDivider={false}
        id='about'
        title='About Us'
        description='We are revolutionizing healthcare access by connecting patients with qualified doctors through our innovative digital platform.'
        bgColor='from-gray-950 via-purple-950/20 to-gray-950'
      >
        <div className='mt-8 max-w-3xl mx-auto'>
          <p className='text-gray-400 leading-relaxed mb-6'>
            Founded with the mission to make quality healthcare accessible to
            everyone, our platform bridges the gap between patients and
            healthcare providers. We believe that everyone deserves timely
            medical attention, and technology can make that possible.
          </p>
          <p className='text-gray-400 leading-relaxed'>
            Our team of healthcare professionals and technologists work together
            to ensure a seamless, secure, and user-friendly experience. From
            booking appointments to managing medical records, we've got you
            covered.
          </p>
        </div>
      </Section>
    </div>
  );
};

export default AboutUs;
