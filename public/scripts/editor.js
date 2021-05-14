const baseURL = 'http://localhost:8081';

const initResetButton = () => {
    // if you want to reset your DB data, click this button:
    document.querySelector('#reset').onclick = ev => {
        fetch(`${baseURL}/reset/`)
            .then(response => response.json())
            .then(data => {
                console.log('reset:', data);
            });
    };
};

const attachEventHandlers = () => {
    document.querySelectorAll('#doctors a').forEach(d => {
        d.onclick = showDetail;
    })
    // document.querySelectorAll('#edit').forEach(d => {
    //     d.onclick = editDoctor;
    // })
};

const hideDetails = () => {
    document.querySelector('#cancel').onclick = ev => {
        document.getElementById('#doctor').innerHTML = ` `;
    }
}
function hideForm() {
    document.getElementById('form1').innerHTML = ` `;
}

const patchDoctor = (id) => {
    console.log('patching doctor')
    console.log(document.getElementById('name').value);
    var myname = document.getElementById('name').value;
    var myseasons = document.getElementById('seasons').value;
    var newseasons = myseasons.split(',');
    var szns = [];
    newseasons.forEach(s => {szns.push(parseInt(s))});
    //console.log(szns);
    var myordering = document.getElementById('ordering').value;
    var myimage = document.getElementById('image_url').value;

    if (myname.length == 0 | myseasons.length == 0 | myordering.length == 0 | myimage.length == 0) {
        console.log('missing data')
        document.getElementById('missing').innerText = "Missing Data!"
    }
    const data = {name : myname, seasons : szns, ordering: myordering, image_url: myimage};
    console.log(data);
    fetch(baseURL + '/doctors/' + id,{
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data)
            getDoctors()
            document.querySelector('#doctor').innerHTML = `    
                <div id="top-bar">
                <h1>${data.name}</h1> 
                <button id="edit" > Edit </button>
                <button id="delete"> Delete </button>
                </div>
                <img src="${data.image_url}" />
                <p>Seasons: ${data.seasons}</p>
                `;
            document.getElementById('edit').onclick = function() {editDoctor(id)};
            document.getElementById('delete').onclick = function() {deleteDoctor(id)};
        })
        .catch((error) => {
            console.error('Error:', error)
        })
        
}

const editDoctor = _id => {
    console.log('hello')
    console.log(_id);
    //const id = ev.currentTarget.dataset.id;
    const doctor = doctors.filter(doc => doc._id === _id)[0];
    document.querySelector('#doctor').innerHTML = `
    <form id="form2">
        <div id="missing"></div>
        <!-- Name -->
        <label for="name">Name</label>
        <input type="text" id="name" value="${doctor.name}">

        <!-- Seasons -->
        <label for="seasons">Seasons</label>
        <input type="text" id="seasons" value="${doctor.seasons}">

        <!-- Ordering -->
        <label for="ordering">Ordering</label>
        <input type="text" id="ordering" value="${doctor.ordering}">

        <!-- Image -->
        <label for="image_url">Image</label>
        <input type="text" id="image_url" value="${doctor.image_url}">

        <!-- Buttons -->
        <button class="btn btn-main" id="save" onclick="patchDoctor()" >Save</button>
        <button class="btn" id="cancel" >Cancel</button>
    </form>`
    document.getElementById('save').onclick = function() {patchDoctor(_id)};
    document.getElementById('cancel').onclick = function() {showDetails(_id)};
}

const showDetails = id => {
    const doctor = doctors.filter(doc => doc._id === id)[0];
    document.querySelector('#doctor').innerHTML = `    
    <div id="top-bar">
    <h1>${doctor.name}</h1> 
    <button id="edit" > Edit </button>
    <button id="delete"> Delete </button>
    </div>
    <img src="${doctor.image_url}" />
    <p>Seasons: ${doctor.seasons}</p>
`;
document.getElementById('edit').onclick = function() {editDoctor(id)};

//document.getElementById('edit').onclick = function() {editDoctor(id)};
document.getElementById('delete').onclick = function() {deleteDoctor(id)};
}

const createNewDoctor = () => {
    console.log('creating doctor');
    var myname = document.getElementById('e_name').value;
    var myseasons = document.getElementById('e_seasons').value;
    var myordering = document.getElementById('e_ordering').value;
    var myimage = document.getElementById('e_image_url').value;

    if (myname.length == 0 | myseasons.length == 0 | myordering.length == 0 | myimage.length == 0) {
        console.log('missing data')
        document.getElementById('missing').innerText = "Missing Data!"
    }
    if (!myimage.includes('http')){
        console.log('missing data')
        document.getElementById('missing').innerText = "Not a URL!"
    }
    
    const data = {name : myname, seasons : myseasons, ordering: myordering, image_url: myimage};
    console.log(JSON.stringify(data));
    document.querySelector('#create').onclick = ev => {
        console.log('fetching');
        fetch(`${baseURL}/doctors`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify(data),
            //body: data,
            })
            //console.log('before then')
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data)
                getDoctors()
                document.querySelector('#doctor').innerHTML = `    
                    <div id="top-bar">
                    <h1>${data.name}</h1> 
                    <button id="edit" > Edit </button>
                    <button id="delete"> Delete </button>
                    </div>
                    <img src="${data.image_url}" />
                    <p>Seasons: ${data.seasons}</p>
                `;
            })
            .catch((error) => {
                console.error('Error:', error)
            })                 
    }
    //document.getElementById('edit').onclick = function() {editDoctor(id)};
}

const showForm = ev => {
    document.querySelector('#companions').innerHTML = `
    `;
    document.querySelector('#doctor').innerHTML = `
    <form id="form1">
        <div id="missing"></div>
        <!-- Name -->
        <label for="name">Name</label>
        <input type="text" id="e_name">

        <!-- Seasons -->
        <label for="seasons">Seasons</label>
        <input type="text" id="e_seasons">

        <!-- Ordering -->
        <label for="ordering">Ordering</label>
        <input type="text" id="e_ordering">

        <!-- Image -->
        <label for="image_url">Image</label>
        <input type="text" id="e_image_url">

        <!-- Buttons -->
        <button class="btn btn-main" id="create" onclick="createNewDoctor()" >Create</button>
        <button class="btn" id="cancel" onclick="hideForm()">Cancel</button>
    </form>`
}



const showDetail = ev => {
    const id = ev.currentTarget.dataset.id;
    
    const doctor = doctors.filter(doc => doc._id === id)[0];
    document.querySelector('#doctor').innerHTML = `  
        <div id="top-bar">
        <h1>${doctor.name}</h1> 
        <button id="edit" > Edit </button>
        <button id="delete"> Delete </button>
        </div>
        <img src="${doctor.image_url}" />
        <p>Seasons: ${doctor.seasons}</p>
      `;
    
    const comps = companions.filter(comp => comp.doctors.includes(id));
    const compNames = [];
    const listItems = comps.map(item => `
            <div class="comps">
                <img id="compImg" src="${item.image_url}" />
                <p>${item.name}</p>
            </div>`
        );

    //comps.forEach(c => compNames.push(c.name))
    document.getElementById('companions').innerHTML = `
            <h1>Companions</h1>
            <ul>
                ${listItems.join('')}
            </ul>
           `
    console.log(document.getElementById('edit').innerHTML);
    document.getElementById('edit').onclick = function() {editDoctor(id)};
    document.getElementById('delete').onclick = function() {deleteDoctor(id)};
    
};

const deleteDoctor = _id => {
    if (window.confirm("Do you really want to delete?")){
        //const doctor = doctors.filter(doc => doc._id === id)[0];
        fetch(baseURL + '/doctors/' + _id, {
            method: 'DELETE',
            body: null,
    })
            .then(response => response.text())
            .then(data => {
                console.log('Success:', data)
                getDoctors();
            })
            .catch((error) => {
                console.error('Error:', error)
            }) ; 
    }            
    else {
        console.log('dont delete');
    }
}


let doctors;
const getDoctors = () => {
    fetch(baseURL + '/doctors')
        .then(response => response.json())
        .then(data => {
            // store the retrieved data in a global variable called "artists"
            doctors = data;
            const listItems = data.map(item => `
                <li>
                    <a href="#" data-id="${item._id}">${item.name}</a>
                </li>`
            );
            document.getElementById('doctors').innerHTML = `
                <ul>
                    ${listItems.join('')}
                </ul>
                <button onclick="showForm()" id="newDoc">Add New Doctor</button>`
        })
        .then(attachEventHandlers);
}


fetch(baseURL + '/companions')
    .then(response=> response.json())
    .then(data => {
        companions = data;

    })
    .then(attachEventHandlers)

// invoke this function when the page loads:
getDoctors();
initResetButton();