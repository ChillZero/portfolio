document.addEventListener('DOMContentLoaded', function () {
    const table = document.getElementById('textbooksTable');
    const tableBody = table.querySelector('tbody');
    const searchInput = document.getElementById('searchInput');

    function loadTextbooks() {
        fetch('textbooks.json')
            .then(response => response.json())
            .then(textbooks => {
                displayTextbooks(textbooks);
            })
            .catch(error => {
                console.error('Error loading textbooks:', error);
                tableBody.innerHTML = '<tr><td colspan="3">Failed to load textbooks.</td></tr>';
            });
    }

    function displayTextbooks(textbooks) {
        tableBody.innerHTML = '';
        textbooks.forEach(textbook => {
            const row = tableBody.insertRow();
            row.innerHTML = `
                <td>${textbook.title}</td>
                <td>${textbook.authors}</td>
                <td>${textbook.course}</td>
                <td><a href="${textbook.downloadLink}" target="_blank"><i class="icon-download"></i></a></td>
            `;
        });
    }

    function sortTable(columnIndex, ascending) {
        const rows = Array.from(tableBody.querySelectorAll('tr'));
        rows.sort((a, b) => {
            const aValue = a.cells[columnIndex].textContent.toLowerCase();
            const bValue = b.cells[columnIndex].textContent.toLowerCase();
            return ascending ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        });
        rows.forEach(row => tableBody.appendChild(row));
    }

    function filterTextbooks(searchText) {
        fetch('textbooks.json')
            .then(response => response.json())
            .then(textbooks => {
                const filteredTextbooks = textbooks.filter(textbook => {
                    const name = textbook.name.toLowerCase();
                    const author = textbook.author.toLowerCase();
                    const course = textbook.course.toLowerCase();
                    const search = searchText.toLowerCase();
                    return name.includes(search) || author.includes(search) || course.includes(search);
                });
                displayTextbooks(filteredTextbooks);
            });
    }

    table.querySelectorAll('th').forEach((th, index) => {
        let ascending = true;
        th.addEventListener('click', () => {
            sortTable(index, ascending);
            ascending = !ascending;
        });
    });

    searchInput.addEventListener('input', () => {
        filterTextbooks(searchInput.value);
    });

    loadTextbooks();
});