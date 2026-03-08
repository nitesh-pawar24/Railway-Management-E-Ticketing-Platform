document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Get both data objects from localStorage
    const userDataJSON = localStorage.getItem("currentUser");
    const bookingDataJSON = localStorage.getItem("bookingDetails");

    // 2. Check if data exists. If not, send user back to the start.
    if (!userDataJSON || !bookingDataJSON) {
        alert("Session expired or data missing. Please start over.");
        window.location.href = "index.html";
        return;
    }

    // 3. Parse the data back into objects
    const userData = JSON.parse(userDataJSON);
    const bookingData = JSON.parse(bookingDataJSON);
    const trainData = bookingData.selectedTrain;

    // 4. Fill in the "Passenger Details"
    document.getElementById("paxName").textContent = `${userData.firstName} ${userData.lastName}`;
    document.getElementById("paxId").textContent = userData.userId;
    document.getElementById("paxAgeGender").textContent = `${userData.age} / ${userData.gender}`;
    document.getElementById("paxMobile").textContent = userData.mobile;

    // 5. Fill in the "Journey Details"
    document.getElementById("trainName").textContent = trainData.name;
    document.getElementById("trainNo").textContent = trainData.trainNo;
    document.getElementById("source").textContent = bookingData.source;
    document.getElementById("destination").textContent = bookingData.destination;
    document.getElementById("departure").textContent = trainData.departure;
    document.getElementById("arrival").textContent = trainData.arrival;

    // 6. Fill in the "Booking Details"
    document.getElementById("className").textContent = bookingData.selectedClass;
    document.getElementById("totalPrice").textContent = `₹${bookingData.price}`;

    // 7. Handle the "Proceed to Payment" button
    const paymentBtn = document.getElementById("paymentBtn");
    paymentBtn.addEventListener("click", () => {
        // We don't need to save anything new, just redirect
        alert("Redirecting to payment page...");
        window.location.href = "payment.html";
    });

    // ==== NEW CODE BLOCK ADDED HERE ====
    // 8. Handle the "Cancel" button
    const cancelBtn = document.getElementById("cancelBtn");
    cancelBtn.addEventListener("click", () => {
        
        // Ask the user to confirm first
        const isConfirmed = confirm("Are you sure you want to cancel this booking? All your data will be cleared.");

        if (isConfirmed) {
            // Clear ALL data from localStorage
            localStorage.clear();
            
            alert("Booking cancelled. Returning to homepage.");
            
            // Send user back to the first page
            window.location.href = "index.html";
        }
    });
    // ==== END OF NEW CODE BLOCK ====

});