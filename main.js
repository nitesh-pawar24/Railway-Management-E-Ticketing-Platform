document.addEventListener("DOMContentLoaded", () => {
    
    const userForm = document.getElementById("userForm");

    // The old button logic is gone. We only have one submit event.
    userForm.addEventListener("submit", (event) => {
        // Stop the form from refreshing the page
        event.preventDefault(); 

        // 1. Create the user data object from the form
        // (This is the same as before)
        const userData = {
            firstName: document.getElementById("fname").value,
            lastName: document.getElementById("lname").value,
            dob: document.getElementById("dob").value,
            age: document.getElementById("age").value,
            gender: document.getElementById("gender").value,
            mobile: document.getElementById("mob_no").value,
            address: document.getElementById("address").value,
            city: document.getElementById("city").value
        };

        // 2. --- NEW BACKEND CODE ---
        // Instead of saving to localStorage, we send data to our PHP file
        
        fetch('api/register_user.php', {
            method: 'POST', // We are sending data
            headers: {
                'Content-Type': 'application/json' // Tell PHP we're sending JSON
            },
            body: JSON.stringify(userData) // Convert the JS object to a JSON string
        })
        .then(response => response.json()) // Get the response from PHP and parse it as JSON
        .then(data => {
            // 'data' is the object our PHP file sent back
            // (e.g., { status: 'success', message: '...', user_id: 1 })
            
            if (data.status === 'success') {
                // 3. SUCCESS! The user is in the database.
                alert(data.message); // Show "User registered successfully!"

                // Now we add the new user_id from the database to our object
                userData.userId = data.user_id;

                // 4. NOW we use localStorage, just to pass the data to the next page
                localStorage.setItem("currentUser", JSON.stringify(userData));

                // 5. Redirect to the next page
                window.location.href = "book_train.html";

            } else {
                // 3. FAILURE! The PHP script sent an error.
                alert("Error: " + data.message);
            }
        })
        .catch(error => {
            // This catches network errors (e.g., XAMPP is off, 404 file not found)
            console.error('Fetch Error:', error);
            alert('Error connecting to the server. Is XAMPP running?');
        });
        
    }); // end of form event listener

}); // end of DOMContentLoaded