/************************************************
 * 1. GENERATE ALL CLASSROOMS
 * Blocks A–D
 * 5 floors (0–4)
 * 10 rooms per floor
 ************************************************/

let allClassrooms = [];

["A", "B", "C", "D"].forEach(block => {
    for (let floor = 0; floor <= 4; floor++) {
        for (let room = 1; room <= 10; room++) {

            let roomNumber = floor === 0
                ? `00${room}`.slice(-3)
                : `${floor}${`0${room}`.slice(-2)}`;

            allClassrooms.push(`${block}-${roomNumber}`);
        }
    }
});


/************************************************
 * 2. ASSIGN CLASSROOM FUNCTION
 ************************************************/

function assignRoom() {

    // Reset result
    let resultDiv = document.getElementById("result");
    resultDiv.className = "result";
    resultDiv.innerHTML = "";

    // Get inputs
    let currentRoom = document.getElementById("currentRoom").value.trim();
    let time = document.getElementById("time").value;

    if (currentRoom === "" || time === "") {
        resultDiv.className = "result error";
        resultDiv.innerHTML = "Please enter current classroom and time.";
        return;
    }

    /************************************************
     * 3. GENERATE REALISTIC OCCUPIED ROOMS (~8%)
     ************************************************/

    let occupiedRooms = [];

    let shuffled = [...allClassrooms].sort(() => 0.5 - Math.random());
    let occupiedCount = Math.max(5, Math.floor(allClassrooms.length * 0.08));

    for (let i = 0; i < occupiedCount; i++) {
        if (shuffled[i] !== currentRoom) {
            occupiedRooms.push(shuffled[i]);
        }
    }

    // ✅ SHOW occupied rooms ONLY in the card
    updateOccupiedCard(occupiedRooms);

    /************************************************
     * 4. FACILITY REQUIREMENTS
     ************************************************/

    let needSmart = document.getElementById("smart").checked;
    let needBoard = document.getElementById("board").checked;
    let needMic = document.getElementById("mic").checked;

    let classroomsWithFacilities = allClassrooms.map(room => ({
        room,
        smart: Math.random() > 0.4,
        board: Math.random() > 0.3,
        mic: Math.random() > 0.5
    }));

    /************************************************
     * 5. FILTER AVAILABLE ROOMS
     ************************************************/

    let availableRooms = classroomsWithFacilities.filter(c =>
        c.room !== currentRoom &&
        !occupiedRooms.includes(c.room) &&
        (!needSmart || c.smart) &&
        (!needBoard || c.board) &&
        (!needMic || c.mic)
    );

    if (availableRooms.length === 0) {
        resultDiv.className = "result error";
        resultDiv.innerHTML =
            "No suitable classroom available right now. Please try again.";
        return;
    }

    /************************************************
     * 6. ASSIGN RANDOM ROOM
     ************************************************/

    let assigned =
        availableRooms[Math.floor(Math.random() * availableRooms.length)];

    resultDiv.className = "result";
    resultDiv.innerHTML =
        "New Classroom Assigned: <b>" + assigned.room + "</b>";
}


/************************************************
 * 7. OCCUPIED CLASSROOM CARD RENDERING
 ************************************************/

function updateOccupiedCard(occupiedRooms) {

    let card = document.getElementById("occupiedCard");
    if (!card) return;

    let html = "<ul>";

    occupiedRooms.forEach(room => {
        html += `<li><strong>${room}</strong></li>`;
    });

    html += "</ul>";

    card.innerHTML = html;
}
