const { pool } = require('../src/config');



async function checkLoanExists(loanId) {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT 1 FROM loans WHERE id = $1', [loanId]);
        return result.rowCount > 0;
    } finally {
        client.release();
    }
}

// Função para emprestar um livro
async function lendBook(userId, bookId) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const bookStatusRes = await client.query('SELECT status FROM books WHERE id = $1', [bookId]);
        const bookStatus = bookStatusRes.rows[0].status;

        if (bookStatus === 'available') {
            await client.query('INSERT INTO loans (user_id, book_id) VALUES ($1, $2)', [userId, bookId]);
            await client.query('UPDATE books SET status = $1 WHERE id = $2', ['loaned', bookId]);
            await client.query('COMMIT');
            return 'Book successfully loaned';
        } else {
            throw new Error('Book is already loaned');
        }
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

// Função para devolver um livro
async function returnBook(loanId) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');


        await client.query('UPDATE loans SET return_date = $1 WHERE id = $2', [new Date(), loanId]);


        await client.query('UPDATE books SET status = $1 FROM loans WHERE books.id = loans.book_id AND loans.id = $2', ['available', loanId]);

        await client.query('COMMIT');
        return 'Book successfully returned';
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

// Função para obter todos os empréstimos ativos
async function getActiveLoans() {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM loans');
        return result.rows;
    } finally {
        client.release();
    }
}

module.exports = {
    checkLoanExists,
    lendBook,
    returnBook,
    getActiveLoans
};
