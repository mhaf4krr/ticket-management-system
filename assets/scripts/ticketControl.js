/* make a request to get current correspondance */



document.querySelector('#forward_menu').style.display = 'none';
document.querySelector('#remarks_menu').style.display = 'none';

if (document.querySelector('#dispatch_number').innerText == "") {
    document.querySelector('#dispatch_number').innerText = "Not Dispatched"
}



function WindowClose() {
    window.close();
}

/* Notifiers */
let result = {}
let hasBeenForwarded = false;
let hasBeenClosed = false;
let lastActionTaken = "";

/* Event Listeners */

document.querySelector('#forward_btn').addEventListener('click', (e) => {
    document.querySelector('#forward_menu').style.display = 'block';
    hasBeenForwarded = true;
    document.querySelector('#resolved_menu').style.display = 'none';
})

document.querySelector('#close_btn').addEventListener('click', (e) => {
    document.querySelector('#remarks_menu').style.display = 'block';
    hasBeenClosed = true;
    document.querySelector('#forward_menu_prime').style.display = 'none';
})


let ticketUID = document.querySelector('#ticked_id').innerText;

let present_dept;

let xhr = new XMLHttpRequest();
xhr.open('GET', `/api/checkStatus?ticket_id=${ticketUID}`, true)
xhr.send();

xhr.onload = function () {
    result = JSON.parse(xhr.responseText)
    result = result[0];

    present_dept = result.concerned_dept;

    console.log(result.official_correspondance)
    document.querySelector('#correspondance').innerHTML = result.official_correspondance

    if (result.ticket_dispatch != "") {
        document.querySelector('#dispatch_value').value = result.ticket_dispatch
    }

}
/* Update Ticket */

document.querySelector('#update_btn').addEventListener('click', (e) => {

    UpdateTicketDB();

})


function UpdateTicketDB() {

    let date = new Date()
    let ticketHistory = result.ticket_history + `<div> <p> Ticket has been Acknowledged by ${present_dept} at ` + `${date.getDate()}/` + `${date.getMonth()+1}</p> </div>`


    if (hasBeenClosed) {
        if (document.querySelector('#official_remarks').value === "")
            return;
    }

    if (hasBeenForwarded) {
        result.concerned_dept = document.querySelector('#concerned_dept').value;
        result.last_action_taken = `Ticket has been Acknowledged by ${present_dept} and Forwarded to ` + document.querySelector('#concerned_dept').value + ` at ${date.getDate()}/` + `${date.getMonth()+1}`;
        result.ticket_history = ticketHistory + `<div> <p> Ticket has been forwarded to ${result.concerned_dept} </p> </div>`;

        result.ticket_dispatch = document.querySelector('#dispatch_value').value

        if (document.querySelector('#official_correspondance_value').value != "")
            //handles html
            result.official_correspondance = result.official_correspondance + `<div>  <h5><b>${present_dept}</b> : ${document.querySelector('#official_correspondance_value').value} </h5> </div>`
    }

    if (hasBeenClosed) {
        result.current_status = 'closed'
        result.ticket_history = ticketHistory;
        result.last_action_taken = 'Ticket has been Closed at ' + `${date.getDate()}/` + `${date.getMonth()+1}`;
        result.official_remarks = document.querySelector('#official_remarks').value;
        result.current_status = 'closed';
        result.ticket_history = ticketHistory + ' <div> <p> Ticket has been Closed ' + ` at ${date.getDate()}/` + `${date.getMonth()+1} </p> </div> `;
    }


    console.log('Modified Ticket')
    console.log(result)
    let patchTicket = new XMLHttpRequest();

    patchTicket.open('PATCH', '/api/patchTicket', true);
    patchTicket.setRequestHeader("Content-Type", "application/json");
    patchTicket.send(JSON.stringify(result))

    patchTicket.onload = function () {
        WindowClose();

    }

}