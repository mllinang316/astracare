
const dbRef = firebase.firestore();
const usersRef = dbRef.collection('ApplicationUsers');
var uid = ""
let confirmed = [];
let activeCases = [];
let recovered = [];
let total = [];
let currentDec = [];

$(document).ready(function(){
    let curr = new Date();
    let week = [];
    
    //weekly date
    for (let i = 1; i <= 7; i++) {
      let first = curr.getDate() - curr.getDay() + i 
      let day = new Date(curr.setDate(first)).toISOString().slice(0, 10)
      week.push(day)
    }

    //current date
    var cd = new Date().toISOString().split('T')[0];
    //current month
    var cm = new Date().getMonth() + 1;
    //current year
    var cy = new Date().getFullYear();

    $('#saveProfile').on('click', function(e){
        e.preventDefault();

        var profId = $('#profileForm #id').val();
        var status = $('#profileForm #status').val();

        updateUser(profId, status);
    });

    $('#saveCovStatus').on('click', function(e){
        e.preventDefault();

        var profId = $('#profileForm #id').val();
        var status = $('#profileForm #covidStatus').val();

        updateCovid(profId, status);
    });

    $('#tblRespondents').DataTable();
    $('#tblReports').DataTable({
        dom: 'Bfrtip',
        buttons: [
            'excelHtml5',
        ]
    });

    var currentPage = window.location.pathname.replace("/", "").replace(".html", "");
    if(currentPage === "dashboard"){
        GetDashboard(new Date(`${cy}-01-01`), new Date(`${cy}-12-31`), "Recovered");
        GetDashboard(new Date(`${cy}-01-01`), new Date(`${cy}-12-31`), "Active");
    }

    if(currentPage === "response"){
        getCurrentDec(new Date().toISOString().slice(0, 10), new Date().toISOString().slice(0, 10));
    }
});

function Login() {

    $.blockUI();

    var email = $('#txtEmail').val();
    var password = $('#txtPassword').val();
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in
            $.unblockUI();
            var user = userCredential.user;
            swal("SUCCESS!", "You have successfully logged in!", "success").then((value) => {
                window.location.href = "dashboard.html";
              });
            
            // ...
        })
        .catch((error) => {
            $.unblockUI();
            var errorCode = error.code;
            var errorMessage = error.message;
            swal("FAIL!", "Email and password did not match. Please try again!", "error");
        });

}

function Logout(){
    $.blockUI();
    firebase.auth().signOut().then(() => {
        $.unblockUI();
        // Sign-out successful.
        window.location.href = "index.html";
      }).catch((error) => {
        // An error happened.
      });
}

function ViewDeclaration(id){
    $('#declarationModal').modal('show');
    firebase.firestore().collection(`ApplicationUsers/${id}/HealthDeclarationForm`)
            .orderBy("dateTaken", "desc")
            .limit(1)
            .get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {

            var declaration = JSON.parse(doc.data().hashData);
            console.log(declaration);
            $('#decBody #wrkQstn #arrngmnt').val(declaration[0].optionAnswer);
            $('#decBody #wrkQstn #arrngmntOther').val(declaration[0].otherAnswer);

            $('#decBody #trvlInt #intrntnl').val(declaration[1].optionAnswer);
            $('#decBody #trvlInt #intrntnlOther').val(declaration[1].otherAnswer);

            $('#decBody #trvlLcl #local').val(declaration[2].optionAnswer);
            $('#decBody #trvlLcl #lclOther').val(declaration[2].otherAnswer);

            $('#decBody #covidCntct #expsd').val(declaration[3].optionAnswer);

            $('#decBody #covidLike #expsdLike').val(declaration[4].optionAnswer);

            $('#decBody #hsptlVisit #visit').val(declaration[5].optionAnswer);
            
            $('#decBody #swabTst #test').val(declaration[6].optionAnswer);
            $('#decBody #swabTst #testResult').val(declaration[6].otherAnswer);

            $('#decBody #crwdPlcs #place').val(declaration[7].optionAnswer);

            $('#decBody #trnspt #trnsptType').val(declaration[8].optionAnswer);
            $('#decBody #trnspt #trnsptOther').val(declaration[8].otherAnswer);

            $('#decBody #vaccination #vax').val(declaration[9].optionAnswer);
            $('#decBody #vaccination #vaxOther').val(declaration[9].otherAnswer);

            $('#decBody #symptoms #symp').val(declaration[10].optionAnswer);
        });
    });
}

function GetDashboard(dateFrom, dateTo, status){
    firebase.firestore().collectionGroup("CovidStatus")
                        .where("status", "==", status)
                        .where("dateEffectivity", ">=", new Date(dateFrom))
                        .where("dateEffectivity", "<=", new Date(dateTo))
                        .orderBy("dateEffectivity", "asc")
                        .limit(1)
                        .get()
                        .then(snap => {
                            snap.forEach(doc => {
                                switch (doc.data().status) {
                                    case "Recovered":
                                        confirmed.push(doc.data());
                                        $('#confirmed').html(confirmed.length);
                                        break;
                                    case "Active":
                                        activeCases.push(doc.data());
                                        $('#activeCases').html(activeCases.length);
                                        break;
                                    case "Recovered":
                                        recovered.push(doc.data());
                                        $('#recovered').html(recovered.length);
                                        break;
                                    case "Active":
                                    case "Recovered":
                                        total.push(doc.data());
                                        $('#total').html(total.length);
                                        break;
                                }
                            });
                        });
}



function getCurrentDec(dateFrom, dateTo){
    console.log(dateFrom);
    console.log(dateTo);
    firebase.firestore().collectionGroup("HealthDeclarationForm")
            .where("dateTaken", ">=", new Date(dateFrom))
            .where("dateTaken", "<=", new Date(dateTo))
            .get()
            .then(snap => {
                snap.forEach(doc => {
                    currentDec.push(doc.data().userId);
                });
            });

    currentDec.forEach(cd => {
        usersRef.where("id", "==", `${cd.userId}`).get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                let row = `<tr><td>${doc.data().fullname}</td><td><button type="button" class="btn btn-primary" onclick="ViewDeclaration(${doc.data().id})">Profile</button> </td></tr>`;

                $('#tblDecs tbody').append(row);
            });
        });
    });

    $('#tblDecs').DataTable();
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