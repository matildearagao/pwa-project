// offline data
db.enablePersistence()
    .catch(err => {
        if (err.code == 'failed-precondition') {
            //multiple tabs opened
            console.log('persistence failed');
        } else if (err.code == 'unimplemented') {
            // lack of browser support
            console.log('persistence is not avaiable');
        }
    })

// real-time listener
db.collection('recipes').onSnapshot((snapshot) => {
    // console.log(snapshot.docChanges());
    snapshot.docChanges().forEach(change => {
        // console.log(change, change.doc.data(), change.doc.id);
        if (change.type === 'added') {
            // add the document data to the web page
            renderRecipe(change.doc.data(), change.doc.id);
        }
        if (change.type === 'removed') {
            // remove the document data from the web page
            removeRecipe(change.doc.id)
        }
    });
});

// add recipes
const form = document.querySelector('form');
form.addEventListener('submit', function (evt) {
    evt.preventDefault();

    // build object of recipe
    const recipe = {
        title: form.title.value,
        ingredients: form.ingredients.value
    };

    db.collection('recipes').add(recipe)
        .catch(err => console.log(err));

        form.title.value = '';
        form.ingredients.value = '';
})

// delete recipe
const recipeContainer = document.querySelector('.recipes');
recipeContainer.addEventListener('click', evt => {
   if(evt.target.tagName == 'I'){
       const id = evt.target.getAttribute('data-id');
       db.collection('recipes').doc(id).delete();
   }
})