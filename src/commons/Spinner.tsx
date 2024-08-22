interface SpinProps {
  text?: string;
}

const Spinner = ({ text = "Loading" }: SpinProps) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
    <svg
      className="w-12 h-12 mr-3 text-indigo-500 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v3.29a5 5 0 00-4 4.71H4z"
      ></path>
    </svg>
    <span className="text-[30px]">...{text}</span>
  </div>
);

export default Spinner;
