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
    <div>
      <button
        onClick={async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
          await handleNextorPrev(e, "prev");
        }}
        disabled={prevDisabled}
        className="inline-flex size-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 rtl:rotate-180"
      >
        <span className="sr-only">Prev Page</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="size-3"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      <button
        onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
          handleNextorPrev(e, "next");
        }}
        disabled={nextDisabled}
        className="inline-flex size-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 rtl:rotate-180"
      >
        <span className="sr-only">Next Page</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="size-3"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
}
