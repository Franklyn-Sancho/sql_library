-- Procedure to lend a book
CREATE OR REPLACE PROCEDURE lend_book(p_user_id INT, p_book_id INT)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Check if the book is available
    IF (SELECT status FROM books WHERE id = p_book_id) = 'available' THEN
        -- Insert a new loan
        INSERT INTO loans(user_id, book_id) 
        VALUES (p_user_id, p_book_id);
        
        -- Update the status of the book to 'loaned'
        UPDATE books SET status = 'loaned' WHERE id = p_book_id;
    ELSE
        RAISE EXCEPTION 'Book is already loaned!';
    END IF;
END;
$$;

-- Function to calculate overdue days
CREATE OR REPLACE FUNCTION calculate_overdue(p_loan_id INT)
RETURNS INT
LANGUAGE plpgsql
AS $$
DECLARE
    overdue_days INT;
BEGIN
    SELECT EXTRACT(DAY FROM (CURRENT_TIMESTAMP - loan_date))
    INTO overdue_days
    FROM loans
    WHERE id = p_loan_id AND return_date IS NULL;

    RETURN overdue_days;
END;
$$;

-- Trigger to update the status of the book after return
CREATE OR REPLACE FUNCTION update_book_status()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    -- When the book is returned, update the status to 'available'
    IF NEW.return_date IS NOT NULL THEN
        UPDATE books SET status = 'available' WHERE id = NEW.book_id;
    END IF;
    RETURN NEW;
END;
$$;

-- Associate the trigger with the loans table
CREATE TRIGGER trg_update_book_status
AFTER UPDATE OF return_date ON loans
FOR EACH ROW
EXECUTE FUNCTION update_book_status();
