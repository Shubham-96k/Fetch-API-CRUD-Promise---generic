const cl = console.log;

const postContainer = document.getElementById("postContainer");
const addbtn = document.getElementById("addbtn");
const updtbtn = document.getElementById("updtbtn");
const titleControl = document.getElementById("title");
const bodyControl = document.getElementById("body");
const userIdControl = document.getElementById("userId");
const postform = document.getElementById("postform")

let baseUrl = `https://js-crud-post-default-rtdb.asia-southeast1.firebasedatabase.app`;
let postUrl = `${baseUrl}/posts.json`;

const makeApiCall = (apiUrl, methodname, bodymsg = null) => {
    return fetch(apiUrl, {
        method : methodname,
        body: bodymsg,
        headers : {
            "content-type" : "application/json",
        }
    })
    .then(res => {
        return res.json();
    })
}

const objtoarr = eve => {
    let arr = [];
    for (const key in eve) {
        eve[key]['id'] = key
        arr.push(eve[key]);
    }
    return arr;
}

const onEdit = (eve) => {
    let getid = eve.closest(".card").id;
    localStorage.setItem("editId", getid);
    let editUrl = `${baseUrl}/posts/${getid}.json`;
    makeApiCall(editUrl, "GET")
        .then(res => {
            titleControl.value = res.title;
            bodyControl.value = res.body;
            userIdControl.value = res.userId;
            addbtn.classList.add("d-none");
            updtbtn.classList.remove("d-none")
        })
        .catch(alert)
}

const onUpdate = () => {
    let updtid = localStorage.getItem("editId");
    let updturl = `${baseUrl}/posts/${updtid}.json`
    let updtobj = {
        title : titleControl.value,
        body : bodyControl.value,
        userId : userIdControl.value,
        id : updtid
    }
    makeApiCall(updturl, "PUT", JSON.stringify(updtobj))
        .then(res => {
            let data = [...document.getElementById(updtid).children];
            data[0].innerHTML = `<h1>${res.title}</h1>`
            data[1].innerHTML = `<p>${res.body}</p>`
            updtbtn.classList.add("d-none")
            addbtn.classList.remove("d-none")
            postform.reset()
        })
        .catch(cl)
}

const onDelete = eve => {
    let deleteid = eve.closest(".card").id;
    let deleteurl = `${baseUrl}/posts/${deleteid}.json`
   let getconfirm = confirm("are your sure you want to delete post");
   if(getconfirm){
        makeApiCall(deleteurl, "DELETE")
        .then(res => {
            document.getElementById(deleteid).remove()
            postform.reset();
            updtbtn.classList.add("d-none")
            addbtn.classList.remove("d-none")
        })
        .catch(err => cl(err))
   }
}

const postobjtemplating = eve => {
    let card = document.createElement("div");
    card.className = "card mb-2 background";
    card.id = eve.id;
    card.innerHTML = `
                    <div class="card-header">
                        <h1>${eve.title}</h1>
                    </div>
                    <div class="card-body">
                        <p>${eve.body}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button class="btn btn-outline-info btn-lg" onclick="onEdit(this)"><strong>Edit</strong></button>
                        <button class="btn btn-outline-danger btn-lg" onclick="onDelete(this)"><strong>Delete</strong></button>
                    </div>
        `
    postContainer.prepend(card)
}

const onCreatepost = eve => {
    eve.preventDefault();
    let postobj = {
        title : titleControl.value,
        body : bodyControl.value,
        userId : userIdControl.value
    }
    makeApiCall(postUrl, "POST", JSON.stringify(postobj))
        .then(res => {
            postobj.id = res.name;
            postobjtemplating(postobj);
            eve.target.reset()
        })
        .catch(err => {
            alert(err)
        })
}

makeApiCall(postUrl, "GET")
    .then(res => {
        objtoarr(res).forEach(ele => postobjtemplating(ele))
    })
    .catch(alert);



postform.addEventListener("submit", onCreatepost);
updtbtn.addEventListener("click", onUpdate)
























