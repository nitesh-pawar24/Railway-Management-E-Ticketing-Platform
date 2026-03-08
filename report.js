// File: report.js

document.addEventListener("DOMContentLoaded", () => {

    // Get the top 3 card elements
    const totalUsersEl = document.getElementById("totalUsers");
    const totalBookingsEl = document.getElementById("totalBookings");
    const totalRevenueEl = document.getElementById("totalRevenue");
    
    // Get the new table body element
    const breakdownTableBody = document.getElementById("breakdownTableBody");

    // Fetch the report data from our updated PHP file
    fetch('api/get_report.php')
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                const report = data.data;

                // 1. Fill in the top 3 stat cards (same as before)
                totalUsersEl.textContent = report.total_users;
                totalBookingsEl.textContent = report.total_tickets;
                totalRevenueEl.textContent = `₹${parseFloat(report.total_revenue).toFixed(2)}`;
                
                // 2. Clear the "Loading data..." message from the table
                breakdownTableBody.innerHTML = "";
                
                // 3. Check if the breakdown array has data
                if (report.train_breakdown.length > 0) {
                    
                    // 4. Loop through each train in the array
                    report.train_breakdown.forEach(train => {
                        
                        // 5. Create a new table row element (<tr>)
                        const row = document.createElement("tr");
                        
                        // 6. Create the HTML for the 3 cells (<td>) in that row
                        row.innerHTML = `
                            <td>${train.name}</td>
                            <td>${train.booking_count}</td>
                            <td>₹${parseFloat(train.train_revenue).toFixed(2)}</td>
                        `;
                        
                        // 7. Add the new row to the table body on the page
                        breakdownTableBody.appendChild(row);
                    });

                } else {
                    // Show this if no tickets have been sold yet
                    breakdownTableBody.innerHTML = '<tr><td colspan="3" style="text-align:center;">No bookings found yet.</td></tr>';
                }
            
            } else {
                alert("Error: Could not load report data.");
            }
        })
        .catch(error => {
            console.error('Fetch Error:', error);
            alert('Error connecting to the server.');
        });
});