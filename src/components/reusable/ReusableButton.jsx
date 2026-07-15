const ReusableButton = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className='bg-cyan-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-cyan-700 transition cursor-pointer'
    >
      {children}
    </button>
  );
};

export default ReusableButton;
