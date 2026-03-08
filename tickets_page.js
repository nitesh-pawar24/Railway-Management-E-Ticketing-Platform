// File: my_bookings.js
alert("TEST: tickets_page.js is LOADING!");



document.addEventListener("DOMContentLoaded", () => {
    
    const tableBody = document.getElementById("bookingsTableBody");
    const ticketsDataJSON = localStorage.getItem("userTickets");

    if (!ticketsDataJSON) {
        tableBody.innerHTML = '<tr><td colspan="7" style="text-align:center;">Could not find ticket data. Please try again.</td></tr>';
        return;
    }

    const tickets = JSON.parse(ticketsDataJSON);

    if (tickets.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" style="text-align:center;">No tickets found for this user.</td></tr>';
        return;
    }

    tableBody.innerHTML = ""; // Clear the table

    tickets.forEach(ticket => {
        const row = document.createElement("tr");
        const bookingDate = new Date(ticket.booking_date).toLocaleString();
        
        let actionButton = '';
        if (ticket.status === 'Confirmed') {
            actionButton = <button class="btn-cancel" data-ticket-id="${ticket.ticket_id}">Cancel</button>;
        } else {
            actionButton = (Cancelled);
        }

        // This block MUST start and end with backticks (`)
        row.innerHTML = `
            <td>${ticket.ticket_id}</td>
            <td>${ticket.train_name}</td>
            <td>${ticket.source} → ${ticket.destination}</td>
            <td>${bookingDate}</td>
            <td>₹${parseFloat(ticket.total_amount).toFixed(2)}</td>
            <td>${ticket.status}</td>
            <td>${actionButton}</td>
        `;

        tableBody.appendChild(row);
    });

    // Clean up localStorage
    localStorage.removeItem("userTickets");

    // Add one event listener to the whole table for all "Cancel" buttons
    tableBody.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-cancel')) {
            
            const ticketId = e.target.dataset.ticketId;
            const button = e.target;
            
            if (confirm(Are you sure you want to cancel Ticket ID ${ticketId}?)) {
                cancelTicket(ticketId, button);
            }
        }
    });

});

// Function to handle the fetch call for cancelling
function cancelTicket(ticketId, buttonElement) {
    
    buttonElement.textContent = "Cancelling...";
    buttonElement.disabled = true;

    fetch('api/cancel_ticket.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ticket_id: ticketId })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            alert(data.message);
            const row = buttonElement.closest('tr');
            row.cells[5].textContent = 'Cancelled'; // Update Status
            row.cells[6].innerHTML = '(Cancelled)'; // Update Action
        } else {
            alert("Error: " + data.message);
            buttonElement.textContent = "Cancel";
            buttonElement.disabled = false;
        }
    })
    .catch(error => {
        console.error('Fetch Error:', error);
        alert('Error connecting to the server.');
        buttonElement.textContent = "Cancel";
        buttonElement.disabled = false;
    });
}