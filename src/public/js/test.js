let dataList = document.querySelector('.userListing');
let dataUl = document.querySelector('ul');
var getData = !JSON.parse(localStorage.getItem('userData')) ? [] : JSON.parse(localStorage.getItem('userData'))

getData.forEach(element => {
  dataUl.innerHTML += `<li>${element}</li>`
})

const data = fetch("https://jsonplaceholder.typicode.com/users").then(e=>e.json()).then(data => {
  data.forEach(e =>  {
    let option = document.createElement('option')
     option.innerText = e.name;
      dataList.append(option);
  })
})
document.querySelector('#userInput').addEventListener('change', (e) => {
  let liCreate = document.createElement('li')
  liCreate.innerText = e.target.value;
  getData.push(e.target.value);
  let pushData = dataUl.append(liCreate);
  localStorage.setItem('userData', JSON.stringify(getData));
});
