    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    var firebaseConfig = {
        apiKey: "AIzaSyBoUmj6EkZgtfAMwmYfiKvziY_7s2hYVdo",
        authDomain: "mancera-7c8f1.firebaseapp.com",
        projectId: "mancera-7c8f1",
        storageBucket: "mancera-7c8f1.appspot.com",
        messagingSenderId: "108600440121",
        appId: "1:108600440121:web:57d0f418c09d5e3a4a24e8",
        measurementId: "G-2NBQFH6GNV"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    const db = firebase.firestore();
    db.collection('receta').get()
    .then(snapshot => {
        // console.log(snapshot.docs[0].data());
        snapshot.forEach(doc => {
            console.log(doc.data());
        });
    })
    .catch(err => console.log(err));
    
    const list = document.querySelector('ul');


    const addRecipe = (recipe, id) => {
        let formattedTime = recipe.created_at.toDate();

        let diaData = formattedTime.getDate();
        diaData = (diaData<10)?"0"+diaData : diaData;

        let mesData = formattedTime.getMonth();
        mesData = (mesData<10)?"0"+mesData : mesData;

        let anyData = formattedTime.getFullYear();

        let html = `
            <li data-id="${id}">
                <div><b>${recipe.title}</b> ${diaData + "/" + mesData + "/" + anyData}</div>
                <button class="btn btn-danger btn-sm my-2">delete</button>
            </li>

        `;
        console.log(html);
        list.innerHTML += html;
    };
    
    const deleteRecipe = id => {
        const recipes = document.querySelectorAll('li');
        recipes.forEach(recipe => {
            if(recipe.getAttribute('data-id') === id) {
                recipe.remove();
            }
        });
    };
    
    
    // db.collection('receta').get()
        // .then(snapshot => {
        //     // console.log(snapshot.docs[0].data());
        //     snapshot.forEach(doc => {
        //         // console.log(doc.data());
        //         console.log(doc.id);
        //         addRecipe(doc.data(), doc.id);
        //     });
        // })
        // .catch(err => console.log(err));





        //add documents
        const form = document.querySelector('form');
        form.addEventListener('submit', e => {
            e.preventDefault();
            let now = new Date();
            const recipe = {
                title: form.recipe.value,
                created_at: firebase.firestore.Timestamp.fromDate(now)
            };
            db.collection('receta').add(recipe)
            .then(() => console.log('recipe added!'))
            .catch(err => console.log(err))
        });


// delete
        list.addEventListener('click', e => {
            // console.log(e);
            if(e.target.tagName === 'BUTTON') {
                const id = e.target.parentElement.getAttribute('data-id');
                // console.log(id);
                db.collection('receta').doc(id).delete()
                    .then(() => console.log('recipe deleted!'))
                    .catch((err) => console.log(err));
            }
        });

 // real time listener
db.collection('receta').onSnapshot(snapshot => {
    // console.log(snapshot.docChanges());
    snapshot.docChanges().forEach(change => {
        // console.log(change);
        const doc = change.doc;
        // console.log(doc);
        if (change.type === 'added') {
            addRecipe(doc.data(), doc.id);
        } else if (change.type === 'removed') {
            deleteRecipe(doc.id);
        }
    });
});