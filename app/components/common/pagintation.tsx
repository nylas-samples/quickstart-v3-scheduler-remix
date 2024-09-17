type PaginationProps = {
  handlePagination: (method: PaginationMethod) => void;
  nextDisabled: boolean;
  prevDisabled: boolean;
};

export type PaginationMethod = "next" | "prev";

export default function Pagination({
  handlePagination,
  nextDisabled,
  prevDisabled,
}: PaginationProps) {
  const handleNextorPrev = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    method: PaginationMethod
  ) => {
    handlePagination(method);
  };
  return (
    <div className="flex mt-2 justify-center">
      <button
        onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
          handleNextorPrev(e, "prev");
        }}
        disabled={prevDisabled}
        className="flex items-center justify-center px-3 h-8 me-3 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
      >
        Prev
        <svg
          className="w-3.5 h-3.5 me-2 rtl:rotate-180"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 10"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 5H1m0 0 4 4M1 5l4-4"
          />
        </svg>
      </button>
      <button
        onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
          handleNextorPrev(e, "next");
        }}
        disabled={nextDisabled}
        className="flex items-center justify-center px-3 h-8 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
      >
        Next
        <svg
          className="w-3.5 h-3.5 ms-2 rtl:rotate-180"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 10"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M1 5h12m0 0L9 1m4 4L9 9"
          />
        </svg>
      </button>
    </div>
  );
}
