document.addEventListener("DOMContentLoaded", () => {

    const trainDetailsDiv = document.getElementById("trainDetails");
    const classForm = document.getElementById("classForm");
    const classOptionsDiv = document.getElementById("classOptions");

    // --- 1. Get data from localStorage (Same as before) ---
    const bookingDetailsJSON = localStorage.getItem("bookingDetails");
    if (!bookingDetailsJSON) {
        alert("No train selected. Redirecting.");
        window.location.href = "book_train.html";
        return;
    }
    const bookingDetails = JSON.parse(bookingDetailsJSON);
    const train = bookingDetails.selectedTrain;

    // --- 2. Display the selected train details (Same as before) ---
    trainDetailsDiv.innerHTML = `
        <p><strong>Your Selected Train:</strong></p>
        <p>
            ${train.name} (${train.train_no})<br>
            ${train.source} to ${train.destination}<br>
            Departs: ${train.departure} | Arrives: ${train.arrival}
        </p>
    `;

    // --- 3. NEW: Function to load classes from the database ---
    function loadClasses() {
        fetch('api/get_classes.php')
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success' && data.classes.length > 0) {
                    
                    // Clear the "Loading..." message
                    classOptionsDiv.innerHTML = ""; 

                    // Loop through each class from the database
                    data.classes.forEach(cls => {
                        // Create the HTML for the radio button
                        const classHtml = `
                            <div class="class-option" style="border: 1px solid #ddd; padding: 10px; margin-bottom: 10px; border-radius: 4px;">
                                <input type="radio" id="class_${cls.class_id}" 
                                       name="trainClass" 
                                       value="${cls.class_id}"
                                       data-class-name="${cls.class_name}"
                                       data-price="${cls.price}" required>
                                
                                <label for="class_${cls.class_id}">
                                    <strong>${cls.class_name} Class</strong> (₹${cls.price})
                                </label>
                            </div>
                        `;
                        // Add this HTML to the page
                        classOptionsDiv.innerHTML += classHtml;
                    });
                } else {
                    classOptionsDiv.innerHTML = "<p>Error: Could not load train classes.</p>";
                }
            })
            .catch(error => {
                console.error('Fetch Error:', error);
                classOptionsDiv.innerHTML = "<p>Error connecting to server.</p>";
            });
    }

    // --- 4. Handle form submission (Slightly modified) ---
    classForm.addEventListener("submit", (e) => {
        e.preventDefault();

        // Find the selected radio button
        const selectedClassRadio = document.querySelector('input[name="trainClass"]:checked');

        if (selectedClassRadio) {
            // Get the details from the radio button's data attributes
            const selectedClassId = selectedClassRadio.value;
            const selectedClassName = selectedClassRadio.getAttribute("data-class-name");
            const price = selectedClassRadio.getAttribute("data-price");

            // 4. Save the new info to localStorage
            bookingDetails.selectedClassId = parseInt(selectedClassId); // Store the ID
            bookingDetails.selectedClassName = selectedClassName;     // Store the Name
            bookingDetails.price = parseFloat(price);               // Store the Price

            localStorage.setItem("bookingDetails", JSON.stringify(bookingDetails));

            alert(`Class selected: ${selectedClassName}. Price: ₹${price}`);
            window.location.href = "ticket.html"; // Go to the next page

        } else {
            alert("Please select a class.");
        }
    });

    // --- 5. Call the new function to load the classes ---
    loadClasses();

});