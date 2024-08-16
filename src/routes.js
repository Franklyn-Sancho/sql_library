const express = require('express');
const router = express.Router();
const queries = require('./queries');

// Rota para emprestar livro
router.post('/lend-book', async (req, res) => {
    const { userId, bookId } = req.body;

    if (!userId || !bookId) {
        console.error("UserId or bookId not found")
        res.status(401).json({ error: "userId or bookId not found" })
    }

    try {
        const result = await queries.lendBook(userId, bookId);
        res.json({ message: result });
    } catch (error) {
        console.error('Error lending book:', error);
        res.status(500).json({ error: error.message || 'Failed to lend book' });
    }
});



// Rota para devolver um livro
router.post('/return-book', async (req, res) => {
    const { loanId } = req.body;

    try {
        if (!loanId) {
            return res.status(400).json({ error: "loanId is required" });
        }

        // Verifique se o loanId existe no banco de dados
        const loanExists = await queries.checkLoanExists(loanId);

        if (!loanExists) {
            return res.status(404).json({ error: "Loan not found" });
        }

        const result = await queries.returnBook(loanId);
        res.json({ message: result });
    } catch (error) {
        console.error('Error returning book:', error);
        res.status(500).json({ error: error.message || 'Failed to return book' });
    }
});


// Rota para obter todos os empréstimos ativos
router.get('/active-loans', async (req, res) => {
    try {
        const loans = await queries.getActiveLoans();
        res.json(loans);
    } catch (error) {
        console.error('Error retrieving active loans:', error);
        res.status(500).json({ error: 'Failed to retrieve active loans' });
    }
});

module.exports = router;



