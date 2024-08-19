const form = document.getElementById("myForm");
const uploadedImg = document.getElementById("uploadImg");
const showImg = document.getElementById("showImg");
const userName = document.getElementById("name");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const submitBtn = document.getElementById("addNewUserBtn");
// const userInfo = document.getElementById("data");
const modal = document.getElementById("userForm");
const modalTitle = document.querySelector("#userForm .modal-title");
// const newUserBtn = document.getElementById("addNewUserBtn");
const modalAdd = document.getElementById("modalAdd");
const t_Body = document.getElementById("tbody");
const overlay = document.querySelector(".overlay");
const editBtn = document.getElementsByClassName("edit");
let data = [];
// console.log("data before",data);
if (localStorage.getItem("userProfile") != null) {
  data = JSON.parse(localStorage.getItem("userProfile"));
}
// getData();
function getData() {
  t_Body.innerHTML = "";
  data.forEach((data, index) => {
    t_Body.innerHTML += `
      
                          <tr key='${index}'>
                              <td>${index + 1}</td>
                              <td>${data.name}</td>
                              <td class="imgbox">
                                  <img src="${data.picture}"
                                      alt="profile" width="120" height="150" />
                              </td>
                              <td>${data.mail}</td>
                              <td>${data.phone}</td>
                              <td>
                                  <button id="${index}" class="edit"><i class="fa-regular fa-pen-to-square"></i></button>
                                  <button id="${index}" class="delete"><i class="fa-solid fa-user-minus"></i></button>
                              </td>
                          </tr>
                   `;
  });
  deleteOneItem();
}

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
const updateData = (i) => {
  overlay.classList.add("showOverlay");
  modalAdd.classList.add("showModalAdd");
  // newUserBtn.innerHTML = "Update";
  // console.log(i.value);
};
overlay.addEventListener("click", closeModalAdd);

for (let i = 0; i <= editBtn.length - 1; i++) {
  editBtn[i].addEventListener("click", updateData);
}
// swal("Good job!", "You clicked the button!", "success");

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
  let checkPhone = data.find((res) => res.phone == phone.value);
  // console.log("checkEmail", checkEmail);
  // console.log("checkPhone",checkPhone);
  if (checkEmail == undefined && checkPhone == undefined) {
    let information = {
      name: userName.value,
      picture:
        showImg.src == undefined ? "./image/Profile Icon.webp" : showImg.src,
      mail: email.value,
      phone: phone.value,
    };
    data.push(information);
    // adding data to local storage of browser
    localStorage.setItem("userProfile", JSON.stringify(data));
    closeModalAdd();
    getData();
    form.reset();
    uploadedImg.value = "";
    showImg.src = "./image/Profile Icon.webp";
    swal("Data inserted", "New Employee Added Successfully", "success");
  } else {
    swal("failed", "Entered email or phone number already exists", "warning");
  }
});

// delete all data
function deleteAll() {
 let delAllBtn= document.getElementById("delAllBtn");
 delAllBtn.onclick=async ()=>{

   let deleteTrue=await confirm();
   if(deleteTrue){
 
     data = [];
     localStorage.setItem("userProfile", JSON.stringify(data));
     getData();
 }
  
}
}
// delete on data
function deleteOneItem() {
  let deletebuttons = t_Body.querySelectorAll(".delete");
  for (let btn of deletebuttons) {
    btn.onclick = async () => {
      let ifTrue = await confirm();
      if (ifTrue) {
        let index = btn.getAttribute("id");
        // console.log(index);
        data.splice(index, 1);
        localStorage.setItem("userProfile", JSON.stringify(data));
        getData();
      }
    };
  }
}

// sweet alert confirmation for delete one item
const confirm = () => {
  return new Promise((resolve, reject) => {
    swal({
      title: "Are you sure?",
      text: "You will not be able to recover this imaginary file!",
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
          swal("Deleted!", "Your imaginary file has been deleted.", "success");
          resolve(true);
        } else {
          swal("Cancelled", "Your imaginary file is safe :)", "error");
          reject(true);
        }
      })
      .catch((err) => {
        // Handle the case when something goes wrong
        console.error("SweetAlert error:", err);
      });
  });
};
getData();
