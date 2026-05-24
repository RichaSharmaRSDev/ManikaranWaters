import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import "./pagination.css";

export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const visiblePageNumbers = pageNumbers.slice(
    Math.max(currentPage - 2, 0),
    Math.min(currentPage + 3, totalPages)
  );

  return (
    <nav className="pagination-container">
      <ul className="pagination">
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <button
            className="page-link"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <IconChevronLeft size={17} stroke={2.5} />
          </button>
        </li>
        {visiblePageNumbers.map((pageNumber) => (
          <li
            key={pageNumber}
            className={`page-item ${currentPage === pageNumber ? "active" : ""}`}
          >
            <button className="page-link" onClick={() => onPageChange(pageNumber)}>
              {pageNumber}
            </button>
          </li>
        ))}
        <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
          <button
            className="page-link"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <IconChevronRight size={17} stroke={2.5} />
          </button>
        </li>
      </ul>
    </nav>
  );
};
