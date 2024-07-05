import React from 'react';
import styles from './Pagination.module.scss';

interface IProps {
    totalPages: number,
    currentPage: number,
    handlePagination: (page: number) => void,
}

const Pagination = ({ totalPages, currentPage, handlePagination }: IProps) => {

    const renderPageNumbers = () => {
        const pageNumbers = [];
        const maxPageNumbersToShow = 10;
        const startPage = Math.max(currentPage - Math.floor(maxPageNumbersToShow / 2), 1);
        const endPage = Math.min(startPage + maxPageNumbersToShow - 1, totalPages);

        if (startPage > 1) {
            pageNumbers.push(
                <button key={1} className={styles.paginationButton} onClick={() => handlePagination(1)}>
                    1
                </button>
            );
            if (startPage > 2) {
                pageNumbers.push(<span key="ellipsis-start" className={styles.paginationEllipsis}>...</span>);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(
                <button key={i} className={currentPage === i ? `${styles.paginationButton} ${styles.active}` : styles.paginationButton} onClick={() => handlePagination(i)}>
                    {i}
                </button>
            );
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pageNumbers.push(<span key="ellipsis-end" className={styles.paginationEllipsis}>...</span>);
            }
            pageNumbers.push(
                <button key={totalPages} className={styles.paginationButton} onClick={() => handlePagination(totalPages)}>
                    {totalPages}
                </button>
            );
        }

        return pageNumbers;
    };

    return (
        <div className={styles.pagination}>
            <button
                className={styles.paginationButton}
                onClick={() => handlePagination(currentPage - 1)}
                disabled={currentPage === 1}
            >
                &laquo;
            </button>
            {renderPageNumbers()}
            <button
                className={styles.paginationButton}
                onClick={() => handlePagination(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                &raquo;
            </button>
        </div>
    );
};

export default Pagination;