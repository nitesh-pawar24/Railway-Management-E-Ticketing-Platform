document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. Greet the User (This part is the same) ---
    const welcomeMessage = document.getElementById("welcomeMessage");
    const currentUserData = localStorage.getItem("currentUser");
    
    if (currentUserData) {
        const user = JSON.parse(currentUserData);
        welcomeMessage.textContent = `Welcome, ${user.firstName}!`;
    } else {
        welcomeMessage.textContent = "Book Your Train";
    }

    // --- 2. The Dummy Train Database is GONE ---
    // We will now fetch this from our PHP/MySQL backend

    // --- 3. Handle Train Search ---
    const searchForm = document.getElementById("searchForm");
    const trainListDiv = document.getElementById("trainList");
    const trainOptionsDiv = document.getElementById("trainOptions");
    const nextBtn = document.getElementById("nextBtn");

    searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const source = document.getElementById("source").value;
        const destination = document.getElementById("destination").value;

        // --- NEW BACKEND CODE ---
        // We will now fetch data from our PHP script
        // We pass the source/destination as URL parameters (a GET request)
        fetch(`api/search_trains.php?source=${source}&destination=${destination}`)
            .then(response => response.json()) // Get the JSON response
            .then(data => {
                
                // Clear previous results
                trainOptionsDiv.innerHTML = "";

                if (data.status === 'success' && data.trains.length > 0) {
                    // Loop through the trains from the database
                    data.trains.forEach(train => {
                        // Note: The property names (like train_no, departure)
                        // must match what the PHP file is sending.
                        const trainHtml = `
                            <div class="train-option" style="border: 1px solid #ddd; padding: 10px; margin-bottom: 10px; border-radius: 4px;">
                                <input type="radio" id="${train.train_no}" name="selectedTrain" value='${JSON.stringify(train)}' required>
                                <label for="${train.train_no}">
                                    <strong>${train.name} (${train.train_no})</strong><br>
                                    Departs: ${train.departure} | Arrives: ${train.arrival}<br>
                                    Seats Available: ${train.seats_available}
                                </label>
                            </div>
                        `;
                        trainOptionsDiv.innerHTML += trainHtml;
                    });

                    trainListDiv.style.display = "block";
                    nextBtn.style.display = "block";

                } else {
                    // No trains found or an error occurred
                    trainOptionsDiv.innerHTML = "<p>No trains found for this route. (Try 'Mumbai' to 'Delhi')</p>";
                    trainListDiv.style.display = "block";
                    nextBtn.style.display = "none";
                }
            })
            .catch(error => {
                console.error('Fetch Error:', error);
                alert('Error connecting to the server.');
                trainOptionsDiv.innerHTML = "<p>Error connecting to the server. Is XAMPP running?</p>";
                trainListDiv.style.display = "block";
                nextBtn.style.display = "none";
            });
    });

    // --- 4. Handle Train Selection (This part is the same) ---
    const selectTrainForm = document.getElementById("selectTrainForm");
    
    selectTrainForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const selectedRadio = document.querySelector('input[name="selectedTrain"]:checked');
        
        if (selectedRadio) {
            const selectedTrainData = JSON.parse(selectedRadio.value);
            
            const bookingDetails = {
                source: document.getElementById("source").value,
                destination: document.getElementById("destination").value,
                selectedTrain: selectedTrainData
            };
            
            localStorage.setItem("bookingDetails", JSON.stringify(bookingDetails));

            alert("Train selected! Now, please select your class.");
            window.location.href = "class_selection.html"; 

        } else {
            alert("Please select a train.");
        }
    });

});