"use strict";
const form = document.getElementById("myForm");
const uploadedImg = document.getElementById("uploadImg");
const showImg = document.getElementById("showImg");
const userName = document.getElementById("name");
const age = document.getElementById("age");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const post = document.getElementById("post");
const sdate = document.getElementById("date");
const submitBtn = document.getElementById("addNewUserBtn");
const modal = document.getElementById("userForm");
const searchElement = document.getElementById("searchbox");
const modalTitle = document.querySelector("#userForm .modal-title");
const modalAdd = document.getElementById("modalAdd");
const t_Body = document.getElementById("tbody");
const overlay = document.querySelector(".overlay");
const editBtn = document.getElementsByClassName("edit");
const pageNo=document.getElementById("paginationButtons");
const description=document.getElementById("description");

let data = [];
let filteredData=[];
let dataSkip=0,loadData=4;
  let currentPage=1,pages=1;
  
// console.log("data:",data);
if (localStorage.getItem("userProfile") != null) {
  data = JSON.parse(localStorage.getItem("userProfile"));
  // console.log("data:",data);
  filteredData=[...data];
  // console.log("fitleredData:",filteredData);
  pages=Math.ceil(data.length/4);
}
// getData(0,4);
function getData(skip, load) {
  const dataToDisplay = searchElement.value ? filteredData : data;
  const filter = dataToDisplay.slice(skip, load);
  t_Body.innerHTML = "";
  description.innerHTML = `Data from ${1 + skip} to ${load}`;

  filter.forEach((item, index) => {
    index += (+skip);
    t_Body.innerHTML += `
      <tr key='${index}'>
        <td class="imgbox">
          <img src="${item.picture}" alt="profile" width="50" height="56" />
        </td>
        <td>${item.name}</td>
        <td>${item.age}</td>
        <td>${item.mail}</td>
        <td>${item.phone}</td>
        <td>${item.post}</td>
        <td>${item.startDate}</td>
        <td>
          <i id="${index}" class="edit fa-regular fa-pen-to-square"></i>
          <i id="${index}" class="delete fa-solid fa-user-minus"></i>
        </td>
      </tr>
    `;
  });
  action();
  handlePaginationButtons();  // Update pagination buttons state
}

// Handle disabling of pagination buttons
function handlePaginationButtons() {
  const prevButton = document.querySelector(".navigate[onclick='prev()']");
  const nextButton = document.querySelector(".navigate[onclick='next()']");

  prevButton.disabled = currentPage === 1;
  nextButton.disabled = currentPage === pages;
  updateActivePageButton();
}

// Update the active pagination button
function updateActivePageButton() {
  const allPaginationButtons = pageNo.querySelectorAll("#paginate");

  allPaginationButtons.forEach((btn, index) => {
    btn.classList.remove("active");
    // console.log("btn:",btn)
    // console.log("index",index)
    // console.log(index+1,currentPage)
    if (index + 1 === currentPage) {
      btn.classList.add("active");
    }
  });
}

function next() {
  const nextButton = document.querySelector(".navigate[onclick='next()']");
  const prevButton = document.querySelector(".navigate[onclick='prev()']");

  if (currentPage < pages) {
    currentPage++;
    const skip = (currentPage - 1) * 4;
    getData(skip, skip + 4);
  }
  
  // Re-enable prev button as soon as we move forward
  prevButton.disabled = currentPage === 1 ? true : false;
  
  // Disable next button on the last page
  nextButton.disabled = currentPage === pages;
}

function prev() {
  const prevButton = document.querySelector(".navigate[onclick='prev()']");
  const nextButton = document.querySelector(".navigate[onclick='next()']");

  if (currentPage > 1) {
    currentPage--;
    const skip = (currentPage - 1) * 4;
    getData(skip, skip + 4);
  }

  // Disable prev button if we're back to the first page
  prevButton.disabled = currentPage === 1;

  // Re-enable the next button as soon as we move back from the last page
  nextButton.disabled = currentPage === pages ? true : false;
}



// Initialize display on page load
// Initialize display on page load
getData(0, 4);
handlePaginationButtons();  // To set initial button states



// getData(data);
// console.log("data later",data);

const showModal = () => {
  overlay.classList.add("showOverlay");
  modalAdd.classList.add("showModalAdd");
};

const closeModalAdd = () => {
  overlay.classList.remove("showOverlay");
  modalAdd.classList.remove("showModalAdd");
};

overlay.addEventListener("click", closeModalAdd);

// image show on form
uploadedImg.onchange = function () {
  if (uploadedImg.files[0].size < 1000000) {
    // console.log(uploadedImg.files[0].size);
    let fileReader = new FileReader();

    fileReader.onload = function (e) {
      showImg.src = e.target.result;
    };
    fileReader.readAsDataURL(uploadedImg.files[0]);
  } else {
    swal(
      "This file is too large!",
      " Please upload a file of size less than 1MB",
      "error"
    );
    uploadedImg.value = "";
  }
};

// retrive form data
form.addEventListener("submit", (e) => {
  e.preventDefault();
  // console.log("name",userName.value);
  // console.log("email",email.value);
  // console.log("phone",phone.value);
  let checkEmail = data.find((res) => res.mail == email.value);
  // let checkPhone = data.find((res) => res.phone == phone.value);
  // console.log("checkEmail", checkEmail);
  // console.log("checkPhone",checkPhone);
  // if (checkEmail == undefined && checkPhone == undefined) {
  if (checkEmail == undefined) {
    let information = {
      name: userName.value,
      picture:
        showImg.src == undefined ? "./image/Profile Icon.webp" : showImg.src,
      mail: email.value,
      phone: phone.value,
      age: age.value,
      post: post.value,
      startDate: sdate.value,
    };
    data.push(information);
    // alert("add sec");

    // adding data to local storage of browser
    localStorage.setItem("userProfile", JSON.stringify(data));
    closeModalAdd();
    getData(0,4);
    form.reset();
    uploadedImg.value = "";
    showImg.src = "./image/Profile Icon.webp";
    swal("Data inserted", "New Employee Added Successfully", "success")
        .then(() => {
          location.reload();
        });
    // swal("Data inserted", "New Employee Added Successfully", "success").then(  location.reload());
  } else {
    swal("failed", "Entered email  already exists", "warning").then(() => {
      location.reload();
    });
  }
});

// delete all data
function deleteAll() {
  let delAllBtn = document.getElementById("delAllBtn");
  delAllBtn.onclick = async () => {
    let deleteTrue = await confirm();
    if (deleteTrue) {
      data = [];
      localStorage.setItem("userProfile", JSON.stringify(data));
      getData();
      location.reload()
    }
  };
}

// actions---> delete oneitem and update
function action() {
  // delete one data
  let deletebuttons = t_Body.querySelectorAll(".delete");
  for (let btn of deletebuttons) {
    btn.onclick = async () => {
      let ifTrue = await confirm();
      if (ifTrue) {
        let index = btn.getAttribute("id");
        // console.log(index);
        data.splice(index, 1);
        localStorage.setItem("userProfile", JSON.stringify(data));
        getData(0,4);
        location.reload();
      }
    };
  }
  // update data
  let updateButtons = t_Body.querySelectorAll(".edit");
  // console.log(updateButtons);
  for (let btn of updateButtons) {
    btn.onclick = () => {
      overlay.classList.add("showOverlay");
      modalAdd.classList.add("showModalAdd");
      submitBtn.innerHTML = "Update";
      let index = btn.getAttribute("id");
      let existingDetails = data[index];

      //  updateData(existingDetails);
      phone.value = existingDetails.phone;
      userName.value = existingDetails.name;
      showImg.src = existingDetails.picture;
      email.value = existingDetails.mail;
      age.value = existingDetails.age;
      post.value = existingDetails.post;
      sdate.value = existingDetails.startDate;
      // console.log(checkEmail)

      submitBtn.onclick = () => {
        // console.log("countMail",countMail);

        data[index] = {
          name: userName.value,
          picture:
            showImg.src == undefined
              ? "./image/Profile Icon.webp"
              : showImg.src,
          mail: email.value,
          phone: phone.value,
          age: age.value,
          post: post.value,
          startDate: sdate.value,
          // name: userName.value,
          // picture:
          //   showImg.src == undefined
          //     ? "./image/Profile Icon.webp"
          //     : showImg.src,
          // mail: email.value,
          // phone: phone.value,
        };
        let countMail = 0;
        data.find((res) => {
          // console.log("res", res.mail);
          // console.log("data", data[index].mail);

          if (res.mail == data[index].mail) {
            countMail++;
          }
        });
        if (countMail <= 1) {
          localStorage.setItem("userProfile", JSON.stringify(data));
          closeModalAdd();
          getData(0,4);
          form.reset();
          uploadedImg.value = "";
          showImg.src = "./image/Profile Icon.webp";
          swal(
            "Data Edited",
            `Some details of ${data[index].name} Updated Successfully`,
            "success"
          ).then(() => {
            location.reload();
          });
        } else if (countMail > 1) {
          swal("failed", "Entered email already exists", "warning");
        }
      };
    };
  }
}

// sweet alert confirmation for deletion of item
const confirm = () => {
  return new Promise((resolve, reject) => {
    swal({
      title: "Are you sure?",
      text: "You will not be able to recover this data!",
      icon: "warning", // 'type' is replaced with 'icon'
      buttons: {
        cancel: {
          text: "No, cancel plx!",
          value: false,
          visible: true,
          closeModal: true,
        },
        confirm: {
          text: "Yes, delete it!",
          value: true,
          visible: true,
          closeModal: false, // Prevent modal from closing automatically
        },
      },
    })
      .then((isConfirm) => {
        if (isConfirm) {
          swal("Deleted!", "Your data has been deleted.", "success");
          resolve(true);
        } else {
          swal("Cancelled", "Your data is safe :)", "error");
          reject(true);
        }
      })
      .catch((err) => {
        // Handle the case when something goes wrong
        console.error("SweetAlert error:", err);
      });
  });
};
getData(0,4);


// search data 
function findData() {
  const searched = searchElement.value.toLowerCase();
  filteredData = data.filter(item =>
    item.name.toLowerCase().includes(searched) ||
    item.post.toLowerCase().includes(searched) ||
    item.mail.toLowerCase().includes(searched)  // Include other fields as needed
  );

  pages = Math.ceil(filteredData.length / 4);  // Recalculate pages based on filtered data
  currentPage = 1;  // Reset to the first page after search
  displayIndexBtn();  // Update pagination buttons
  getData(0, 4);  // Load data for the first page of the filtered results
}


function doSomeMagic(findData, delay) {
  let timer;
  return () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      findData();
    }, delay);
  };
}

const loadFunction = doSomeMagic(findData, 500);


//pagination

function displayIndexBtn() {
  // Clear any previous buttons
  pageNo.innerHTML = "";
  dataSkip = 0;
  loadData = 4;

  // Dynamically create pagination buttons based on the number of pages
  for (let i = 1; i <= pages; i++) {
    pageNo.innerHTML += `
      <button id="paginate" data-skip="${dataSkip}" load-data="${loadData}" index="${i}" class="${i === currentPage ? 'active' : ''}" onclick="paginate(${i})">${i}</button>
    `;
    loadData += 4;
    dataSkip += 4;
  }
  // Update pagination buttons
  updateActivePageButton();
}

// Handle pagination button click
function paginate(pageNumber) {
  currentPage = pageNumber;
  const skip = (currentPage - 1) * 4;
  getData(skip, skip + 4);
  handlePaginationButtons();
}


displayIndexBtn();

// function next(){
// console.log(allPaginationBtn)
// }
// function prev(){

// }