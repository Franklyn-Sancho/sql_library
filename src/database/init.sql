-- Create the users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the books table
CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    author VARCHAR(100) NOT NULL,
    publication_year INT CHECK (publication_year > 0),
    status VARCHAR(20) DEFAULT 'available'
);

-- Create the loans table
CREATE TABLE loans (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    book_id INT REFERENCES books(id) ON DELETE CASCADE,
    loan_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    return_date TIMESTAMP
);

-- Create the view for active loans
CREATE VIEW view_active_loans AS
SELECT 
    l.id AS loan_id,
    u.name AS user_name,
    b.title AS book_title,
    l.loan_date,
    l.return_date
FROM 
    loans l
JOIN 
    users u ON l.user_id = u.id
JOIN 
    books b ON l.book_id = b.id
WHERE 
    l.return_date IS NULL;

