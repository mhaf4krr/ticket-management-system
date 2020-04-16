let auth_user

let refresh_dept

if(!localStorage.getItem('x-auth-token')){
    window.location.href = '/login'
}
else{

    /* Check token and get Details */

    let checkToken = new XMLHttpRequest();
    checkToken.open('GET','/user/checkToken',true);
    checkToken.setRequestHeader('x-auth-token',localStorage.getItem('x-auth-token'));
    checkToken.send();

    checkToken.onload = function() {
        if(checkToken.responseText == 'false')
        {
            window.location.href = '/login'

        }

        else {
             auth_user = JSON.parse(checkToken.response);

             refresh_dept = auth_user.concerned_dept
             UpdateUI(auth_user.concerned_dept)

             document.querySelectorAll('.concerned_dept')[0].innerText =auth_user.dept_name;

             document.querySelectorAll('.concerned_dept')[1].innerText =auth_user.dept_name
        }
    }
}


/* Live Reload Enabled */
setInterval(()=>{
    UpdateUI(refresh_dept);
},2000)


document.querySelector('#search_results').style.display = 'none';


let result
let UpdateUI = (dept) => {
    let xhr = new XMLHttpRequest();
    xhr.open('GET',`/api/getTickets?concerned_dept=${dept}`,true);
    xhr.send()
    xhr.onload = function() {
    result = JSON.parse(xhr.responseText);
    let OpenTickets = [];
    OpenTickets = result.filter((ticket)=>{
    return ticket.current_status === 'open'
    })
    let ReOpenedTickets = []
    ReOpenedTickets = result.filter((ticket)=>{
        return ticket.current_status === 'reopened'
    })

    let ClosedTickets = []
    ClosedTickets = result.filter((ticket)=>{
        return ticket.current_status === 'closed'
    })

    DisplayStatus(OpenTickets,ClosedTickets,ReOpenedTickets);

    /* Clear the UI */

    document.querySelector('#open-tickets-list').innerHTML = ""
    document.querySelector('#closed-tickets-list').innerHTML = ""
    document.querySelector('#reopened-tickets-list').innerHTML = ""

    embedTicketsintoCollections(OpenTickets,ClosedTickets,ReOpenedTickets)
    }

}



let DisplayStatus = (Open,Closed,Reopened) =>{
    document.querySelector('#open_count').innerText= Open.length;
    document.querySelector('#reopen_count').innerText= Reopened.length;
    document.querySelector('#closed_count').innerText= Closed.length;
}



let embedTicketsintoCollections = (Open,Closed,Reopened) => {
    Open.forEach((ticket)=>{
        document.querySelector('#open-tickets-list').innerHTML = document.querySelector('#open-tickets-list').innerHTML + `
        <li class='collection-item avatar'>
                        <i class="material-icons left">message</i>
                        <span class="title"><a href='/api/ticket?ticket_id=${ticket.ticket_id}' target='_blank' class='black-text'>${ticket.ticket_id}</a></span><br><br>
                        <div><i class="material-icons left">person</i> <span class="title"><b>${ticket.name}</b></span></div><br>
                        <div><i class="material-icons left">date_range</i> <span class="title">${ticket.date_date}/${ticket.date_month}/${ticket.date_year}</span></div>
        </li>
        `
    })


    Reopened.forEach((ticket)=>{
        document.querySelector('#reopened-tickets-list').innerHTML = document.querySelector('#reopened-tickets-list').innerHTML + `
        <li class='collection-item avatar'>
                        <i class="material-icons left">message</i>
                        <span class="title"><a href='/api/ticket?ticket_id=${ticket.ticket_id}' target='_blank'class='black-text'>${ticket.ticket_id}</a></span><br><br>
                        <div><i class="material-icons left">person</i> <span class="title"><b>${ticket.name}</b></span></div><br>
                        <div><i class="material-icons left">date_range</i> <span class="title">${ticket.date_date}/${ticket.date_month}/${ticket.date_year}</span></div>
        </li>
        `
    })


    Closed.forEach((ticket)=>{
        document.querySelector('#closed-tickets-list').innerHTML = document.querySelector('#closed-tickets-list').innerHTML + `
        <li class='collection-item avatar'>
                        <i class="material-icons left">message</i>
                        <span class="title"><a href='/api/ticket?ticket_id=${ticket.ticket_id}' target='_blank'class='black-text'>${ticket.ticket_id}</a></span><br><br>
                        <div><i class="material-icons left">person</i> <span class="title"><b>${ticket.name}</b></span></div><br>
                        <div><i class="material-icons left">date_range</i> <span class="title">${ticket.date_date}/${ticket.date_month}/${ticket.date_year}</span></div>
        </li>
        `
    })
}


document.querySelector('#logout_btn').addEventListener('click',()=>{
    localStorage.removeItem('x-auth-token');
    window.location.reload()
})



document.querySelector('#search').addEventListener('input',()=>{
   let val = document.querySelector('#search').value
   
   document.querySelector('#search_results').style.display = 'block';

   let search = new XMLHttpRequest();
   search.open('GET',`/api/search?ticket=${val}`,true)
   search.send()

   search.onload = function() {
       let search_result = JSON.parse(search.response);
       
       

       if(search_result.length === 0)
       {
        document.querySelector('#search-inner').innerHTML = ""
        document.querySelector('#search-inner').innerHTML = `<span class='flow-text'> No such Record Exists </span>`
       }

       else {
        search_result=search_result[0]
        document.querySelector('#search-inner').innerHTML = ""
           document.querySelector('#search-inner').innerHTML = ` <ul class='collection center center-align'><li class='collection-item avatar'>
           <i class="material-icons left">message</i>
           <span class="title"><a href='/api/ticket?ticket_id=${search_result.ticket_id}' target='_blank'class='black-text'>${search_result.ticket_id}</a></span><br><br>
           <div><i class="material-icons left">person</i> <span class="title"><b>${search_result.name}</b></span></div><br>
           <div><i class="material-icons left">date_range</i> <span class="title">${search_result.date_date}/${search_result.date_month}/${search_result.date_year}</span></div>
</li> </ul>`
       }
   }

})