
$(document).ready(function(){
    $("#tblEmps").DataTable();
});


function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

function GetDecs(ocassion){
    //current date
    var cd = new Date().toISOString().split('T')[0];
    //current month
    var cm = new Date().getMonth() + 1;
    //current year
    var cy = new Date().getFullYear();

    var healthDecRef = firebase.firestore().collectionGroup('HealthDeclarationForm');

    switch (ocassion) {
        case 'd':
            $('#tblEmps').DataTable().clear().draw();
            $('#tblEmps').DataTable().destroy();
            healthDecRef.where("dateTaken", ">=", new Date())
                        .where("dateTaken", "<=", addDays(new Date(), 1))
                        .get()
                        .then((snap) => {
                            const data = snap.docs.map((doc) => ({
                                id: doc.id,
                                userId: doc.data().userId,
                                dateTaken: doc.data().dateTaken
                              }));

                              if(data.length !== 0){
                                data.forEach(function (item, index) {
                                    usersRef
                                    .where("userType", "!=", "student")
                                    .where("id", "==", item.userId).onSnapshot(function(snap){
                                        snap.forEach(function(doc) {
                                            $('#tblEmps').DataTable({
                                                retrieve: true,
                                                destroy: true,
                                                dom: 'Bfrtip',
                                                buttons: [{
                                                    extend: 'excelHtml5',
                                                    title: `Employee Health Declaration Daily Report`
                                                }]
                                            }).row.add([
                                                `${doc.data().fullname}`, `${new Date(item.dateTaken.toDate()).toLocaleString('en-CA', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                  })}`, 
                                            ]).draw();
                                        });
                                    });
                                });
                              } else {
                                $('#tblEmps').DataTable();
                              }
                              
                        });
            break;
        case 'w':
            $('#tblEmps').DataTable().clear().draw();
            $('#tblEmps').DataTable().destroy();
            healthDecRef.where("dateTaken", ">=", addDays(new Date(), -7))
                        .where("dateTaken", "<=", new Date())
                        .get()
                        .then((snap) => {
                            const data = snap.docs.map((doc) => ({
                                id: doc.id,
                                userId: doc.data().userId,
                                dateTaken: doc.data().dateTaken
                              }));

                              if(data.length !== 0){
                                data.forEach(function (item, index) {
                                    usersRef
                                    .where("userType", "!=", "student")
                                    .where("id", "==", item.userId).onSnapshot(function(snap){
                                        snap.forEach(function(doc) {
                                            $('#tblEmps').DataTable({
                                                retrieve: true,
                                                destroy: true,
                                                dom: 'Bfrtip',
                                                buttons: [{
                                                    extend: 'excelHtml5',
                                                    title: `Employee Health Declaration Weekly Report`
                                                }]
                                            }).row.add([
                                                `${doc.data().fullname}`, `${new Date(item.dateTaken.toDate()).toLocaleString('en-CA', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                  })}`, 
                                            ]).draw();
                                        });
                                    });
                                });
                              } else {
                                $('#tblEmps').DataTable();
                              }
                        });
            break;
        case 'm':
            $('#tblEmps').DataTable().clear().draw();
            $('#tblEmps').DataTable().destroy();
            healthDecRef.where("dateTaken", ">=", new Date(`${cy}-${cm}-01`))
                        .where("dateTaken", "<=", new Date(`${cy}-${cm}-31`))
                        .get()
                        .then((snap) => {
                            const data = snap.docs.map((doc) => ({
                                id: doc.id,
                                userId: doc.data().userId,
                                dateTaken: doc.data().dateTaken
                              }));

                              if(data.length !== 0){
                                data.forEach(function (item, index) {
                                    usersRef
                                    .where("userType", "!=", "student")
                                    .where("id", "==", item.userId).onSnapshot(function(snap){
                                        snap.forEach(function(doc) {
                                            $('#tblEmps').DataTable({
                                                retrieve: true,
                                                destroy: true,
                                                dom: 'Bfrtip',
                                                buttons: [{
                                                    extend: 'excelHtml5',
                                                    title: `Employee Health Declaration Monthly Report`
                                                }]
                                            }).row.add([
                                                `${doc.data().fullname}`, `${new Date(item.dateTaken.toDate()).toLocaleString('en-CA', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                  })}`, 
                                            ]).draw();
                                        });
                                    });
                                });
                              } else {
                                $('#tblEmps').DataTable();
                              }
                        });
            break;
        case 'a':
            $('#tblEmps').DataTable().clear().draw();
            $('#tblEmps').DataTable().destroy();
            healthDecRef.where("dateTaken", ">=", new Date(`${cy}-01-01`))
                        .where("dateTaken", "<=", new Date(`${cy}-12-31`))
                        .get()
                        .then((snap) => {
                            const data = snap.docs.map((doc) => ({
                                id: doc.id,
                                userId: doc.data().userId,
                                dateTaken: doc.data().dateTaken
                              }));

                              if(data.length !== 0){
                                data.forEach(function (item, index) {
                                    usersRef
                                    .where("userType", "!=", "student")
                                    .where("id", "==", item.userId).onSnapshot(function(snap){
                                        snap.forEach(function(doc) {
                                            $('#tblEmps').DataTable({
                                                retrieve: true,
                                                destroy: true,
                                                dom: 'Bfrtip',
                                                buttons: [{
                                                    extend: 'excelHtml5',
                                                    title: `Employee Health Declaration Annual Report`
                                                }]
                                            }).row.add([
                                                `${doc.data().fullname}`, `${new Date(item.dateTaken.toDate()).toLocaleString('en-CA', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                  })}`, 
                                            ]).draw();
                                        });
                                    });
                                });
                              } else {
                                $('#tblEmps').DataTable();
                              }
                        });
            break;                                    
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