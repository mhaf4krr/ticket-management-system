/* Push Ticket to Database */
document.querySelector('#ticket_submit').addEventListener('click', (e) => {

    let date = new Date()
    e.preventDefault()
    let name = document.querySelector('#name');
    let reg_number = document.querySelector('#reg_number');
    let email = document.querySelector('#email')
    let concerned_dept = document.querySelector('#concerned_dept')
    let ticket_body = document.querySelector('#ticket_body')

    let data = JSON.stringify({
        "email": `${email.value}`,
        "reg_number": `${reg_number.value}`,
        "name": `${name.value}`,
        "concerned_dept": `${concerned_dept.value}`,
        "ticket_body": `${ticket_body.value}`,
        "date_date": date.getDate(),
        /* month is zero indexed */
        "date_month": date.getMonth() + 1,
        "date_year": date.getFullYear(),
        "ticket_dispatch": ""

    })

    if (email.value === "" || reg_number.value === "" || name.value === "" || ticket_body.value === "") {
        document.querySelector('#response_message').innerText = "Please fill all the details ...";
        setTimeout(() => {
            document.querySelector('#response_message').innerText = ""
        }, 2000);
    } else {
        let checker = " ";
        checker = email.value
        if (checker.includes('@')) {} else {
            console.log('false email is provided')
            return
        }
        let xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/addTicket', true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(data)
        xhr.onload = function () {
            localStorage.setItem('ticket_id', xhr.getResponseHeader('ticket_id'));
            document.querySelector('#response_message').innerText = xhr.responseText + ' and details have been mailed to your email address';
            setTimeout(() => {
                document.querySelector('#response_message').innerText = ""
                window.location.reload();
            }, 4000);
        }

    }

})

/* Ticket Status Check */
document.querySelector('#ticket_status_check').addEventListener('click', (e) => {
    e.preventDefault();

    let ticket_id = document.querySelector('#ticket_id')

    if (ticket_id.value === "") {
        document.querySelector('#ticket_response').innerText = 'Please enter Ticket ID';
        setTimeout(() => {
            document.querySelector('#ticket_response').innerText = ""
        }, 2000);
    } else {
        let xhr = new XMLHttpRequest();

        xhr.open('GET', `/api/checkStatus?ticket_id=${ticket_id.value}`, true);
        xhr.send(ticket_id.value);
        xhr.onload = function () {
            let result = xhr.responseText;


            let ticketResponse = JSON.parse(result)

            if (ticketResponse.length == 0) {
                document.querySelector('#ticket_response').innerText = 'No Record Found !';
                setTimeout(() => {
                    document.querySelector('#ticket_response').innerText = '';
                }, 2000);
                return;
            }

            ticketResponse = ticketResponse[0];

            let ticketHistory = ""
            if (ticketResponse.ticket_history !== "") {
                ticketHistory = `<span> <i class='material-icons left hide-on-small'>dehaze</i>  Ticket History : <span>${ticketResponse.ticket_history}</span> </span>`
            }


            let ticketRemarks = ""
            if (ticketResponse.official_remarks !== "") {
                ticketRemarks = `<span> <i class='material-icons left hide-on-small'>email</i>  Official Remarks : <span class='teal-text'>${ticketResponse.official_remarks}</span> </span>`
            }

            document.querySelector('#ticket_id_response').innerHTML = `Ticket ID : ${ticketResponse.ticket_id} | Status : <span class='teal-text'> ${ticketResponse.current_status} </span> `;
            document.querySelector('#ticket_embed_response').innerHTML = `
        <div class='container'>
            <div class='input-field'>
            <span> <i class='material-icons left hide-on-small'>person</i> Name : ${ticketResponse.name}</span>
            </div>

            <div class='input-field'>
            <span> <i class='material-icons left hide-on-small'>contact_mail</i>  e-Mail : ${ticketResponse.email}</span>
            </div>

            

            <div class='input-field'>
            <span> <i class='material-icons left hide-on-small'>email</i>  Concerned Department : ${ticketResponse.concerned_dept}</span>
            </div>

            <div class='input-field'>
            <span> <i class='material-icons left hide-on-small'>drafts</i>  Dated : ${ticketResponse.date_date} / ${ticketResponse.date_month} / ${ticketResponse.date_year} </span>
            </div>


            <div class='input-field'>
            <span> <i class='material-icons left hide-on-small'>build</i>  Ticket Status : <span class='green-text'> ${ticketResponse.current_status} </span> </span>
            </div>


            <div class='input-field'>
            <span> <i class='material-icons left hide-on-small'>chat</i>  Issue : ${ticketResponse.ticket_body}</span>
            </div>


            <div class='input-field'>
            <span> <i class='material-icons left hide-on-small'>brightness_7</i>  Last Action : <span class='teal-text'>${ticketResponse.last_action_taken}</span> </span>
            </div>


            <div class='input-field'>
            ${ticketHistory}
            </div>

            <div class='input-field'>
            ${ticketRemarks}
            </div>
          

        </div>`

            $('.modal').modal('open');
        }
    }

})