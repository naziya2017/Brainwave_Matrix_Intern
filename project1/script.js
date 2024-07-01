if ("Notification" in window) {
    Notification.requestPermission().then(function(permission) {
        if (Notification.permission !== "granted") {
            alert("Please allow notification access!");
            location.reload();
        }
    });
}
var timeoutIds = [];
function scheduleReminder() {
    var title = document.getElementById("title").value;
    var description = document.getElementById("description").value;
    var reminderTime = document.getElementById("reminderTime").value;
    var scheduledTime = new Date(reminderTime);
    var currentTime = new Date();
    var timeDiff = scheduledTime - currentTime;
    if (timeDiff > 0) {
        addReminder(title, description, reminderTime);
        var timeoutId = setTimeout(function() {
            document.getElementById("notificationSound").play();
            var notification = new Notification(title, {
                body: description,
                requireInteraction: true,
                actions: [{action: 'acknowledge', title: 'Acknowledge'}]
            });
            notification.onclick = function(event) {
                event.preventDefault(); // Prevent the browser from focusing the Notification's tab
                notification.close();
                document.getElementById("notificationSound").pause();
                document.getElementById("notificationSound").currentTime = 0;
            };
        }, timeDiff);
        timeoutIds.push(timeoutId);
    } else {
        alert("Please select a valid time!");
    }
}
function addReminder(title, description, reminderTime) {
    var remainderTableBody = document.getElementById("remainderTableBody");
    var remainderRow = document.createElement("tr");

    var remainderTitle = document.createElement("td");
    var remainderDescription = document.createElement("td");
    var remainderDateAndTime = document.createElement("td");
    var actionCell = document.createElement("td");

    remainderTitle.innerHTML = title;
    remainderDescription.innerHTML = description;
    remainderDateAndTime.innerHTML = reminderTime;
    actionCell.innerHTML = '<button onclick="deleteReminder(this);">Delete</button>';

    remainderRow.appendChild(remainderTitle);
    remainderRow.appendChild(remainderDescription);
    remainderRow.appendChild(remainderDateAndTime);
    remainderRow.appendChild(actionCell);

    remainderTableBody.appendChild(remainderRow);
}
function deleteReminder(button) {
    var row = button.closest("tr");
    var index = Array.from(row.parentElement.children).indexOf(row);
    clearTimeout(timeoutIds[index]);
    timeoutIds.splice(index, 1);
    row.remove();
}