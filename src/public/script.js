document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('lend-form')) {
        document.getElementById('lend-form').addEventListener('submit', async (event) => {
            event.preventDefault();
            const userId = document.getElementById('userId').value;
            const bookId = document.getElementById('bookId').value;
            await lendBook(userId, bookId);
        });
    }

    if (document.getElementById('return-form')) {
        document.getElementById('return-form').addEventListener('submit', async (event) => {
            event.preventDefault();
            const loanId = document.getElementById('loanId').value;
            await returnBook(loanId);
        });
    }

    if (document.getElementById('loans-table-body')) {
        loadActiveLoans();
    }
});

async function lendBook(userId, bookId) {
    try {
        const response = await fetch('/api/lend-book', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, bookId }),
        });
        const result = await response.json();

        if (response.ok) {
            document.getElementById('response-message').textContent = result.message;
        } else {
            // Verifica se o erro está na resposta
            document.getElementById('response-message').textContent = `Error: ${result.error || 'An unknown error occurred.'}`;
        }
    } catch (error) {
        console.error('Error lending book:', error);
        document.getElementById('response-message').textContent = 'An unexpected error occurred.';
    }
}




async function returnBook(loanId) {
    try {
        const response = await fetch('/api/return-book', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ loanId }),
        });
        const result = await response.json();
       
        if (response.ok) {
            document.getElementById('response-message').textContent = result.message;
        } else {
            // Verifica se o erro está na resposta
            document.getElementById('response-message').textContent = `Error: ${result.error || 'An unknown error occurred.'}`;
        }
    } catch (error) {
        console.error('Error lending book:', error);
        document.getElementById('response-message').textContent = 'An unexpected error occurred.';
    }
}

async function loadActiveLoans() {
    try {
        const response = await fetch('/api/active-loans', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const loans = await response.json();
        console.log(loans)
        const tableBody = document.querySelector('#loans-table tbody');
        tableBody.innerHTML = '';

        loans.forEach(loan => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${loan.loan_id}</td>
                <td>${loan.user_name}</td>
                <td>${loan.book_title}</td>
                <td>${loan.loan_date}</td>
                <td>${loan.return_date || 'Not Returned'}</td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading active loans:', error);
    }
}



