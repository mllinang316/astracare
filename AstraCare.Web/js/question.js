
const questRef = dbRef.collection('HealthDeclarationTeacher');

$(document).ready(function(){
    var questId = window.localStorage.getItem('questId');
    GetQuestion(questId);
});

function handleClick(cb) {
    if(cb.checked){
        $('#othersQ').removeClass('hidden');
    } else {
        $('#othersQ').addClass('hidden');
    }
  }

function GetQuestion(questId){

    questRef.doc(questId).get().then((doc) => {     
        console.log(doc.data().options.length);
        $('#question').val(doc.data().questions);

        if(doc.data().others === true){
            $('#others').attr('checked', 'checked');
        }
    });
}

function ViewQuestion(itemId){
    window.localStorage.setItem('questId', itemId);
    window.location.href = './quest-item.html';
}

function OptionRow () {
    var $tableBody = $('#optionBody'),
        $trLast = $tableBody.find("tr:last"),
        $trNew = $trLast.clone();

    $trNew.removeAttr("style");
    $trLast.after($trNew);
}

function OptionRowDelete () {
    var $tableBody = $('#optionBody');

    if ($tableBody.find("tr").length <= 1) {
        alert("You can't remove this fields. Please fill up!")
    } else {
        $tableBody.find("tr:last").remove();
    }
}

function SubOptRow () {
    var $tableBody = $('#subOptsBody'),
        $trLast = $tableBody.find("tr:last"),
        $trNew = $trLast.clone();

    $trNew.removeAttr("style");
    $trLast.after($trNew);
}

function SubOptRowDelete () {
    var $tableBody = $('#subOptsBody');

    if ($tableBody.find("tr").length <= 1) {
        alert("You can't remove this fields. Please fill up!")
    } else {
        $tableBody.find("tr:last").remove();
    }
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