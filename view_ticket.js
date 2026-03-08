// File: view_ticket.js

document.getElementById("findTicketsForm").addEventListener("submit", function(e) {
    e.preventDefault();
    
    const firstName = document.getElementById("fname").value;
    const ticketId = document.getElementById("ticket_id").value;

    const data = {
        firstName: firstName,
        ticketId: ticketId
    };

    fetch('api/find_user_tickets.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        if (result.status === 'success') {
            // Save the list of tickets to localStorage
            localStorage.setItem("userTickets", JSON.stringify(result.tickets));
            
            // Redirect to a new page to show the tickets
            window.location.href = "my_bookings.html";
            
        } else {
            // Show the error message from the PHP file
            alert("Error: " + result.message);
        }
    })
    .catch(error => {
        console.error('Fetch Error:', error);
        alert('Error connecting to the server.');
    });
});