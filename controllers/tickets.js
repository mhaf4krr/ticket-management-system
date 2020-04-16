const express = require("express");
const uuidv1 = require("uuid/v1");
const mongoose = require("mongoose");

const sendTicket = require("../controllers/nodemailer");

const router = express.Router();

/* Database connect */

mongoose
  .connect(
    "mongodb://localhost:27017/project",
    {
      useNewUrlParser: true
    }
  )
  .then(console.log("Database connected"))
  .catch(err => {
    console.log("Database connection failed");
  });

/* Ticket Schema */

const ticketSchema = new mongoose.Schema({
  ticket_id: String,
  ticket_dispatch: String,
  reg_number: String,
  name: String,
  email: String,
  date_date: Number,
  date_month: Number,
  date_year: Number,
  current_status: String,
  concerned_dept: String,
  ticket_history: String,
  ticket_body: String,
  last_action_taken: String,
  official_correspondance: String,
  official_remarks: String,
  escalated: Number
});

const TICKET = mongoose.model("tickets", ticketSchema);

router.post("/addTicket", express.json(), (req, res) => {
  createTicket(req.body, res);
});

/* Display a ticket for Admin to Update*/
router.get("/ticket", async (req, res) => {
  console.log(req.query.ticket_id);
  let result = await TICKET.find({
    ticket_id: req.query.ticket_id
  });

  res.render("ticket", {
    ticket: result[0]
  });
});

/* Update a Ticket */

router.patch("/patchTicket", express.json(), async (req, res) => {
  TICKET.replaceOne(
    {
      ticket_id: req.body.ticket_id
    },
    req.body
  )
    .then(resolve => {
      console.log("Updated");

      res.send("Updated");
    })
    .catch(err => {
      console.log(error);
    });
});

router.get("/getTickets", (req, res) => {
  getTickets(req.query.concerned_dept, res);
});

router.get("/checkStatus", express.json(), (req, res) => {
  checkStatus(req.query.ticket_id, res);
});

/* function adds new ticket to database */
async function createTicket(body, res) {
  let uid = uuidv1();
  let newTicket = new TICKET({
    ticket_id: uid,
    email: body.email,
    official_correspondance: "",
    reg_number: body.reg_number.toUpperCase(),
    name: body.name,
    current_status: "open",
    concerned_dept: body.concerned_dept,
    ticket_history: "",
    ticket_dispatch: "",
    ticket_body: body.ticket_body,
    last_action_taken: "Ticket has been forwarded to Concerned Department",
    official_remarks: "",
    date_date: body.date_date,
    date_month: body.date_month,
    date_year: body.date_year,
    escalated: 0
  });

  const result = await newTicket.save();

  res
    .status(200)
    .header("ticket_id", uid)
    .send("Ticket has been raised");

  sendTicket(
    body.email,
    `<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Document</title>
        <style>
            @media(min-width:650px) {
                .logo {
                    width: 170px;
                }
            }
    
    
            @media(max-width:649px) {
                .logo {
                    width: 40vw;
                }
            }
    
            header {
                text-align: center;
            }
    
            .body-wrapper {
                margin: 0 auto;
            }
    
            body {
                text-align: center
            }
    
            ol {
                list-style: none;
            }
    
            li {
                margin-bottom: 10px;
            }
    
            .right {
                float: right;
                margin-right: 60px;
            }
        </style>
    </head>
    
    <body>
        <header>
            <img src="https://scontent-maa2-1.xx.fbcdn.net/v/t1.0-9/19598547_1575485815797544_6553580693098721958_n.jpg?_nc_cat=109&_nc_ht=scontent-maa2-1.xx&oh=1ce9fb22e7abbf6aaf33ac20fe8cfce5&oe=5CD239FC"
                class='logo' alt="">
    
        </header>
    
        <div class="body-wrapper">
            <h2 style="text-align:center">IUST GRIEVANCE PORTAL</h2><br>
    
            <h3>Dear ${
              body.name
            } , we have successfully received your complaint on our portal. Please read the
                following
                carefully</h3>
            <div>
                <ol>
                    <li>Every complaint is assigned a unique identification , your UID is :  <b>${uid} </b> </li>
                    <li>Complaint once filed reflects in the admin portal of concerned department.</li>
                    <li>Concerned department is empowered with the authority to either forward this to another department
                        or
                      close the ticket.</li>
                    <li>Ticket can be closed , only when some department issues concluding remarks against the ticket.</li>
                    <li>If your ticket is not addressed(closed) within 7 days of issuing , the priority of the ticket is
                        increased and ticket reflects in the dashboard of Vice Chancellor</li>
                    <li>Even after this , if your issue has not been taken up within 15 days , the ticket is forwarded to All
                        India
                        Council For Technical Education </li>
                </ol>
            </div>
        </div>
    
        <div class="container">
            <h4>Name : ${body.name} </h4>
            <h4>Concerned Department : ${body.concerned_dept} </h4>
            <p>Body:${body.ticket_body} </p>
        </div>
    
        <div class='right'>
            <h3>Your's Faithfully</h3>
            <h4>Team IUST</h4>
        </div>
    </body>
    
    </html> `
  );
}

/* function gets tickets from database */
async function getTickets(concerned_dept, res) {
  try {
    let result = await TICKET.find({
      concerned_dept: concerned_dept
    });
    res.send(JSON.stringify(result));
  } catch (error) {
    console.log(error);
  }
}

/* Search for Ticket */

router.get("/search", (req, res) => {
  searchTicket(req.query.ticket, req.query.ticket, res);
});

async function searchTicket(ticket_id, ticket_dispatch, res) {
  try {
    let result = await TICKET.find({
      $or: [
        {
          ticket_id: ticket_id
        },
        {
          ticket_dispatch: ticket_dispatch
        }
      ]
    });
    res.send(JSON.stringify(result));

    console.log(result);
  } catch (error) {
    console.log(error);
  }
}

/* checks status of a ticket */
async function checkStatus(ticket_id, res) {
  try {
    let result = await TICKET.find({
      ticket_id: ticket_id
    });
    res.send(JSON.stringify(result));
  } catch (error) {
    console.log(error);
  }
}

/* escalate Ticket to Higher Authority */

async function escalateTicket() {
  try {
    let result = await TICKET.find();
    let date = new Date();
    let currentDate = date.getDate();
    let currentMonth = date.getMonth() + 1;
    for (let i = 0; i < result.length; i++) {
      if (!(result[i].current_status == "closed") && result[i].escalated != 2) {
        if (result[i].date_month <= currentMonth && !result[i].escalated) {
          if (
            (result[i].date_month == currentMonth &&
              currentDate - result[i].date_date >= 7) ||
            (result[i].date_month < currentMonth &&
              currentDate + (30 - result[i].date_date) >= 7)
          ) {
            /* escalate to VC , escalated remains false until it is send to last AICTE */

            result[i].ticket_body += `  ... Ticket was left unattended by  ${
              result[i].concerned_dept
            }  and has been escalated `;
            result[i].concerned_dept = "VC";
            result[i].last_action_taken +=
              " Ticket has been escalated to Vice Chancellor IUST";
            result[i].escalated = 1;

            TICKET.replaceOne(
              {
                ticket_id: result[i].ticket_id
              },
              result[i]
            )
              .then(resolve => {
                sendTicket(
                  result[i].email,
                  `
                            <body><center>
                            <h2> IUST Grievience Portal </h2><br/>
                            <p> Dear <b>${
                              result[i].name
                            }</b> your complaint having  UID <i>${
                    result[i].ticket_id
                  }</i> with message body as : "${
                    result[i].ticket_body
                  }" has been <b>escalated to ${
                    result[i].concerned_dept
                  } </b> </p>
                            </center></body>`
                );
              })
              .catch(err => {
                console.log(error);
              });
            console.log("Ticket Escalated to VC");
          }
        } else if (
          result[i].date_month <= currentMonth &&
          result[i].escalated === 1
        ) {
          if (
            (result[i].date_month == currentMonth &&
              currentDate - result[i].date_date >= 15) ||
            (result[i].date_month < currentMonth &&
              currentDate + (30 - result[i].date_date) >= 15)
          ) {
            /* escalate to VC , escalated less than 2 until it is send to last AICTE */

            result[i].ticket_body += `  ... Ticket was left unattended by ${
              result[i].concerned_dept
            }  and has been escalated `;
            result[i].concerned_dept = "AICTE";
            result[i].last_action_taken +=
              " Ticket has been escalated to Aicte";
            result[i].escalated = 2;

            TICKET.replaceOne(
              {
                ticket_id: result[i].ticket_id
              },
              result[i]
            )
              .then(resolve => {
                sendTicket(
                  result[i].email,
                  `
                            <body><center>
                            <h2> IUST GRIEVANCE PORTAL </h2><br/>
                            <p> Dear <b>${
                              result[i].name
                            }</b> your complaint having  UID <i>${
                    result[i].ticket_id
                  }</i> with message body as : "${
                    result[i].ticket_body
                  }" has been <b>escalated to ${
                    result[i].concerned_dept
                  } </b> </p>
                            </center></body>`
                );
              })
              .catch(err => {
                console.log(error);
              });
            console.log("Ticket Escalated to AICTE");
          }
        }
      } else {
        console.log("Ticket doesnot meet the escalation requirements");
      }
    }
  } catch (error) {
    console.log(error);
  }
}

escalateTicket();
module.exports = router;
