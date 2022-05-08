// retrieves saved books from local storage
export const getSavedBookIds = () => {
    const savedBookIds = localStorage.getItem("saved_books") ? JSON.parse(localStorage.getItem("saved_books")) : [];

    return savedBookIds;
};
// sends saved books to local storage
export const saveBookIds = (bookIdArr) => {
    if (bookIdArr.length) {
        localStorage.setItem("saved_books", JSON.stringify(bookIdArr));
    } else {
        localStorage.removeItem("saved_books");
    }
};
// finds a particular book and removes from local storage
export const removeBookId = (bookId) => {
    const savedBookIds = localStorage.getItem("saved_books") ? JSON.parse(localStorage.getItem("saved_books")) : null;

    if (!savedBookIds) {
        return false;
    }

    const updatedSavedBookIds = savedBookIds?.filter((savedBookId) => savedBookId !== bookId);
    localStorage.setItem("saved_books", JSON.stringify(updatedSavedBookIds));

    return true;
};
