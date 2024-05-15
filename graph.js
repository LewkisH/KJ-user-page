
import { buildLoginForm, buildPieChart, buildProfileDiv, buildXPChart } from "./domBuilder.js";

let username;
let password

const login = buildLoginForm()
let storedDataString = localStorage.getItem("jwt");
if (storedDataString){
    login.form.remove()
        loginSuccess(storedDataString)
}


login.form.addEventListener('submit', async event => {
    event.preventDefault()
    
    username = login.usernameInput.value
    password = login.passwordInput.value

    let token = await auth(username, password);

    if (!token) {
        console.log("NONO")
        let errordiv = document.getElementById("errorDiv");
        errordiv.textContent = "Wrong username or password"
    } else {
localStorage.setItem("jwt", token);
login.form.remove()
        loginSuccess(token)
        
    }
})

async function auth(username, password) {

    const url = 'https://01.kood.tech/api/auth/signin';
    const basicAuthHeader = 'Bearer ' + btoa(username + ':' + password);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': basicAuthHeader
            },
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;

    } catch (error) {
        console.log(error);
        return null;
    }
}

async function loginSuccess(token) {
    let cont = document.querySelector("#hidcontainer")
    cont.id = "container";
    const userIdQuery = `query{
        user{
          id
        }
      }`;
    let IdData = await Query(userIdQuery, token);
    const userID = IdData.user[0].id;

    const query = `query auditsGiven {
        downTransactions: transaction_aggregate(
          where: { userId: { _eq: ${userID} }, type: { _eq: "down" } }
        ) {
          aggregate {
            count
          }
        }
        upTransactions: transaction_aggregate(
          where: { userId: { _eq: ${userID} }, type: { _eq: "up" } }
        ) {
          aggregate {
            count
          }
        }
        event(where: {id: {_eq: 148}}) {
          createdAt
        }
        user(where: {id: {_eq: ${userID}}}) {
          id
          email
          login
          auditRatio
          attrs
          profile
          transactions(where: {type: {_eq: "xp"}, event: {id: {_eq: 148}}}) {
            amount
            path
            type
            createdAt
            event {
              id
            }
          }
        }
      }`;

    let data = await Query(query, token)

    data.user[0].transactions.sort(function (a, b) {
        return a.createdAt > b.createdAt ? 1 : -1
    })
    let total = 0;
    let xpArr = [];
    xpArr.push({xp: 0, day: data.event[0].createdAt, event:"Beginning of the school"})
    data.user[0].transactions.forEach(trans => {
        total += trans.amount
        
        xpArr.push({xp: total, day: trans.createdAt, event: trans.path.substring(trans.path.lastIndexOf('/') + 1)})
    })


    let usr = data.user[0]
    let infoDiv = buildProfileDiv(//builds profile card
        usr.attrs.firstName+" "+usr.attrs.lastName, 
        usr.attrs.email,
        usr.attrs.addressStreet+", "+usr.attrs.addressCity,
        usr.attrs.tel);
    let infoCont = document.querySelector('#info')
    infoCont.appendChild(infoDiv)

//xp total
let totalCont = document.querySelector('#xpText')
totalCont.textContent = total;

//audit ratio
let ratioCont = document.querySelector('#ratioText')

let auditRat = usr.auditRatio+"";
ratioCont.textContent = auditRat.slice(0,6);


//create linegraph
    let ratio = 95/total
    let xpGraph = buildXPChart(xpArr, ratio)
    let lineCONT = document.querySelector('#line')
    lineCONT.appendChild(xpGraph)

    

    //create piechart
    let pieData = [
        {label: "Audits Given", value:data.upTransactions.aggregate.count,color:"purple"},
        {label: "Audits Given", value:data.downTransactions.aggregate.count,color:"#2d2c2e"}]
    let pieChart = buildPieChart(pieData)
    let pieCont = document.querySelector('#pie')
    pieCont.appendChild(pieChart)
}


async function Query(query, token) {
    const url = 'https://01.kood.tech/api/graphql-engine/v1/graphql';
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ query })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            return data.data
        })
        .catch(error => {
            console.error('Error while sending GraphQL request:', error);
        });
}

