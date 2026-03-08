document.addEventListener("DOMContentLoaded", () => {

    const paymentForm = document.getElementById("paymentForm");
    const amountInput = document.getElementById("amount");

    // 1. Get ALL data from localStorage
    const bookingDataJSON = localStorage.getItem("bookingDetails");
    const userDataJSON = localStorage.getItem("currentUser");

    if (!bookingDataJSON || !userDataJSON) {
        alert("Session expired or data missing. Please start over.");
        window.location.href = "index.html";
        return;
    }

    const bookingData = JSON.parse(bookingDataJSON);
    const userData = JSON.parse(userDataJSON);
    
    // 2. Auto-fill the amount (Same as before)
    if (bookingData.price) {
        amountInput.value =` ₹${bookingData.price}`;
    } else {
        alert("Error: Price not found.");
        window.location.href = "index.html";
    }

    // 3. Handle the 'Pay Now' button click
    paymentForm.addEventListener("submit", (e) => {
        e.preventDefault(); // Stop the form from refreshing

        // Get the payment form data
        const paymentData = {
            bankBranch: document.getElementById("bankBranch").value,
            cardNo: document.getElementById("cardNo").value
            // We don't need to send expiry/cvv to our DB (per your diagram)
        };
        
        // --- NEW BACKEND CODE ---
        // Bundle all data to send to the PHP file
        const fullBookingData = {
            userData: userData,
            bookingData: bookingData,
            paymentData: paymentData
        };

        // 4. Send ALL data to the new PHP script
        fetch('api/book_ticket.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(fullBookingData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                // 5. SUCCESS!
                alert("Payment Successful! 🎉 Your ticket is confirmed. Ticket ID: " + data.ticket_id);

                // 6. Clean up the session
                localStorage.clear();

                // 7. Send the user back to the homepage
                window.location.href = "index.html";

            } else {
                // 5. FAILURE!
                alert("Payment Failed: " + data.message);
            }
        })
        .catch(error => {
            console.error('Fetch Error:', error);
            alert('Error connecting to the payment server. Is XAMPP running?');
        });
    });

});
