
const questRef = dbRef.collection('HealthDeclarationTeacher');

$(document).ready(function(){
    $("#tblQuests").DataTable();
    GetQuestions();
});

function GetQuestions(){
    questRef.get().then((snap) => {
        const data = snap.docs.map((doc) => ({
            id: doc.id,
            options: doc.data().options,
            others: doc.data().others,
            othersQuestion: doc.data().othersQuestion,
            questions: doc.data().questions,
            subquestions: doc.data().subQuestions
          }));

        if(data.length !== 0){
            data.forEach(function (item, index) {
                $('#tblQuests').DataTable({
                    retrieve: true,
                    destroy: true,
                }).row.add([
                    `${item.questions}`, `<button class="btn btn-primary" onclick="ViewQuestion('${item.id}')"><i class="far fa-eye"></i>View</button>`, 
                ]).draw();
            });
        } else {
            $('#tblQuests').DataTable();
        }        
    });
}

function ViewQuestion(itemId){
    window.localStorage.setItem('questId', itemId);
    window.location.href = './quest-item.html';
}

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.
        uid = user.uid;

        usersRef.doc(uid)
    .get()
    .then((docRef) => {
        var fullname = docRef.data().first_name + " " + docRef.data().last_name;
        var email = docRef.data().email;
        var balance = docRef.data().balance;

        $('#Fullname').val(fullname);
        $('#Email').val(email);
        $('#Balance').val(balance);

        $('#Fullname2').val(fullname);
        $('#Email2').val(email);
        $('#Balance2').val(balance);
    })
    .catch((error) => {
        console.log(error);
    });
    } else {
        // No user is signed in.
        //$('#lblUserStat').text('Signed out');
        //window.location.href = "/";

    }
});