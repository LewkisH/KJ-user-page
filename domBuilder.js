 function buildLoginForm() {
    // Create form element
    var form = document.createElement('form');
    form.textContent="GraphQL"
    form.setAttribute('id', 'loginForm');

    // Create username input
    var usernameInput = document.createElement('input');
    usernameInput.setAttribute('type', 'text');
    usernameInput.setAttribute('name', 'username');
    usernameInput.setAttribute('placeholder', 'Username');
    form.appendChild(usernameInput);

    // Create password input
    var passwordContainer = document.createElement('div');
    var passwordInput = document.createElement('input');
    passwordInput.setAttribute('type', 'password');
    passwordInput.setAttribute('name', 'password');
    passwordInput.setAttribute('placeholder', 'Password');
    passwordContainer.appendChild(passwordInput);

    var showPasswordCheckbox = document.createElement('input');
    showPasswordCheckbox.setAttribute('type', 'checkbox');
    showPasswordCheckbox.classList.add('custom-checkbox');
    showPasswordCheckbox.setAttribute('id', 'showPassword');
    var checkboxImage = document.createElement('label');
    checkboxImage.setAttribute('for', 'showPassword')
    checkboxImage.classList.add('checkbox-label');
    passwordContainer.appendChild(showPasswordCheckbox);
    passwordContainer.appendChild(checkboxImage);
    form.appendChild(passwordContainer);


    // Event listener to toggle password visibility
    showPasswordCheckbox.addEventListener('change', function () {
        if (showPasswordCheckbox.checked) {
            passwordInput.setAttribute('type', 'text');
        } else {
            passwordInput.setAttribute('type', 'password');
        }
    });


    // Create submit button
    var submitButton = document.createElement('button');
    submitButton.setAttribute('type', 'submit');
    submitButton.textContent = 'Login';
    submitButton.id = "logout"


    form.appendChild(submitButton);


    var errorDiv = document.createElement('div');
    errorDiv.id = "errorDiv"
    form.appendChild(errorDiv)
    // Add form to the HTML body
    document.body.appendChild(form);
    return {
        form: form,
        passwordInput: passwordInput,
        usernameInput: usernameInput,
    }
}
 function buildProfileDiv(name, email, xp, auditRatio) {

    var profileDiv = document.createElement('div');
    

    profileDiv.setAttribute('id', 'profileDiv');
    
    var nameDiv = document.createElement('div');
    nameDiv.textContent = name;
    profileDiv.appendChild(nameDiv);
    
    var emailDiv = document.createElement('div');
    emailDiv.textContent = email;
    profileDiv.appendChild(emailDiv);
    
    var xpDiv = document.createElement('div');
    xpDiv.textContent = xp;
    profileDiv.appendChild(xpDiv);
    
    var auditRatioDiv = document.createElement('div');
    auditRatioDiv.textContent = auditRatio;
    profileDiv.appendChild(auditRatioDiv);
    
    var logout = document.createElement('button');
    logout.id = "logout"
    logout.textContent="Log Out"
    logout.addEventListener("click",event =>{
        localStorage.removeItem("jwt");
        location.reload()
    })
    let infoCont = document.querySelector('#info')
    infoCont.appendChild(logout)

    // Return the profileDiv
    return profileDiv;
}

function buildXPChart(xpArr, xpRatio){
    let daysRatio = 495/getDaysDifference(xpArr[0].day, xpArr[xpArr.length-1].day)
    let pointStr = "";
    // Create SVG element
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "-10 0 525 130");
    svg.setAttribute("class", "chart")

        // Add X-axis line
        var xAxis = document.createElementNS("http://www.w3.org/2000/svg", "line");
        xAxis.setAttribute("x1", "5");
        xAxis.setAttribute("y1", "100");
        xAxis.setAttribute("x2", "500");
        xAxis.setAttribute("y2", "100");
        xAxis.setAttribute("stroke", "gray");
        xAxis.setAttribute("stroke-width", "1");
        svg.appendChild(xAxis);
        
        // Add X-axis label
        var xAxisLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
        xAxisLabel.textContent = "TIME";
        xAxisLabel.setAttribute("x", "250");
        xAxisLabel.setAttribute("y", "115");
        xAxisLabel.setAttribute("stroke", "gray");
        xAxisLabel.setAttribute("text-anchor", "middle");
        svg.appendChild(xAxisLabel);
    
        // Add Y-axis line
        var yAxis = document.createElementNS("http://www.w3.org/2000/svg", "line");
        yAxis.setAttribute("x1", "5");
        yAxis.setAttribute("y1", "100");
        yAxis.setAttribute("x2", "5");
        yAxis.setAttribute("y2", "5");
        yAxis.setAttribute("stroke", "gray");
        yAxis.setAttribute("stroke-width", "1");
        svg.appendChild(yAxis);
    
        // Add Y-axis label
        var yAxisLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
        yAxisLabel.textContent = "XP";
        yAxisLabel.setAttribute("x", "-45");
        yAxisLabel.setAttribute("y", "97");
        yAxisLabel.setAttribute("stroke", "gray");
        yAxisLabel.setAttribute("text-anchor", "middle");
        yAxisLabel.setAttribute("transform", "rotate(-90 -45 50)");
        svg.appendChild(yAxisLabel);
    
    
    // Create polyline element
    var polyline = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    polyline.setAttribute("fill", "none");
    polyline.setAttribute("stroke", "gray");
    polyline.setAttribute("stroke-width", "1");
    xpArr.forEach(obj =>{
            let diff = getDaysDifference(xpArr[0].day, obj.day)
            let days = Math.round(diff*daysRatio)+5
            let xp = Math.abs(Math.round(obj.xp*xpRatio)-100)
            pointStr += days +","+xp+"\n";
            let circle = createCircle(days, xp, obj.event+'\n'+obj.xp+'xp\n'+obj.day.slice(0,10))
            svg.appendChild(circle[0])
            svg.appendChild(circle[1])
    })
    console.log(pointStr)
    polyline.setAttribute("points", pointStr);

    svg.insertBefore(polyline, svg.firstChild);
        

        return svg;
}


function getDaysDifference(dateString1, dateString2) {
    var date1 = new Date(dateString1);
    var date2 = new Date(dateString2);
    var differenceMs = Math.abs(date2 - date1);

    var daysDifference = differenceMs / (1000 * 60 * 60 * 24);

    return Math.ceil(daysDifference);
}

function createCircle(cx, cy, hoverText) {
    var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", cx);
    circle.setAttribute("cy", cy);
    circle.setAttribute("r", 2);
    circle.setAttribute("fill", "white");
    circle.classList.add('circle')
    var title = document.createElementNS("http://www.w3.org/2000/svg", "text");
    title.classList.add('pointText')
    title.textContent = hoverText;
    if (cx > 400){
        cx -= 150-(500-cx);
    }
    title.setAttribute("x", cx);
    title.setAttribute("y", cy+9); // Adjust positioning as needed
    

    return [circle,title];
}

function buildPieChart(data){
// Sample data for the pie chart
/* const data = [
    { label: 'Slice 1', value: 90, color: '#f11' },
    { label: 'Slice 3', value: 90, color: '#0f0' },
  ];
   */

  const chart = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  chart.setAttribute('width', "200")
  chart.setAttribute('height', "200")
  chart.classList.add('chart')

  const total = data.reduce((acc, slice) => acc + slice.value, 0);
  
  // Create SVG elements for each slice
  let startAngle = 0;
  data.forEach(slice => {
    const angle = (slice.value / total) * 360;
    const endAngle = startAngle + angle;
  
    //if this math seems scary take a look at https://www.youtube.com/watch?v=aHaFwnqH5CU
    const x1 = Math.cos((startAngle - 90) * Math.PI / 180) * 100 + 100;
    const y1 = Math.sin((startAngle - 90) * Math.PI / 180) * 100 + 100;
    const x2 = Math.cos((endAngle - 90) * Math.PI / 180) * 100 + 100;
    const y2 = Math.sin((endAngle - 90) * Math.PI / 180) * 100 + 100;
  
    const largeArcFlag = angle <= 180 ? '0' : '1';
    const pathData = [
      `M 100, 100`,
      `L ${x1},${y1}`,
      `A 100,100 0 ${largeArcFlag},1 ${x2},${y2}`,
      `Z`
    ].join(' ');
  
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathData);
    path.setAttribute('fill', slice.color);
    path.classList.add('slice');

    chart.appendChild(path);

    startAngle = endAngle;
  });
  return chart
}

export {buildLoginForm, buildProfileDiv, buildXPChart, buildPieChart}



