-- Inserting initial users
INSERT INTO users (name, email, password) VALUES 
('Alice', 'alice@example.com', 'password123'),
('Bob', 'bob@example.com', 'password123'),
('Carol', 'carol@example.com', 'password123');

-- Inserting initial books
INSERT INTO books (title, author, publication_year, status) VALUES 
('1984', 'George Orwell', 1949, 'available'),
('The Lord of the Rings', 'J.R.R. Tolkien', 1954, 'available'),
('Animal Farm', 'George Orwell', 1945, 'available'),
('Don Quixote', 'Miguel de Cervantes', 1605, 'available');

-- Inserting initial loans
-- Here, an example of a loaned book and another that is available
INSERT INTO loans (user_id, book_id, loan_date) VALUES
(1, 1, CURRENT_TIMESTAMP); -- Alice loaned "1984"
