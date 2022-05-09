
const roomsRef = dbRef.collection('Rooms');

$(document).ready(function(){
    var roomId = window.localStorage.getItem('roomId');
    GetRoom(roomId);
    $("#tblTracks").DataTable();
});

function GetRoom(roomId){
    firebase.firestore().collectionGroup('Rooms').where("id", "==", `${roomId}`).get().then((snap) => {
        snap.forEach((doc) => {
            $('#roomId').val(doc.data().id);
            $('#roomName').val(doc.data().name);
            $('#nameHeader').text(doc.data().name);
        });
    });
}

function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

function GetTracks(ocassion){
    //current date
    var cd = new Date().toISOString().split('T')[0];
    //current month
    var cm = new Date().getMonth() + 1;
    //current year
    var cy = new Date().getFullYear();

    var rmNAme = $('#roomName').val();
    var healthDecRef = firebase.firestore().collectionGroup('HealthDeclarationForm');

    switch (ocassion) {
        case 'd':
            $('#tblTracks').DataTable().clear().draw();
            $('#tblTracks').DataTable().destroy();
            healthDecRef.where("dateTaken", ">=", new Date())
                        .where("dateTaken", "<=", addDays(new Date(), 1))
                        .where("roomName", "==", rmNAme)
                        .get()
                        .then((snap) => {
                            const data = snap.docs.map((doc) => ({
                                id: doc.id,
                                userId: doc.data().userId,
                                dateTaken: doc.data().dateTaken
                              }));

                              if(data.length !== 0){
                                data.forEach(function (item, index) {
                                    usersRef.where("id", "==", item.userId).onSnapshot(function(snap){
                                        snap.forEach(function(doc) {
                                            $('#tblTracks').DataTable({
                                                retrieve: true,
                                                destroy: true,
                                                dom: 'Bfrtip',
                                                buttons: [{
                                                    extend: 'excelHtml5',
                                                    title: `${rmNAme} Daily Report`
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
                                $('#tblTracks').DataTable();
                              }
                              
                        });
            break;
        case 'w':
            $('#tblTracks').DataTable().clear().draw();
            $('#tblTracks').DataTable().destroy();
            healthDecRef.where("dateTaken", ">=", addDays(new Date(), -7))
                        .where("dateTaken", "<=", new Date())
                        .where("roomName", "==", rmNAme)
                        .get()
                        .then((snap) => {
                            const data = snap.docs.map((doc) => ({
                                id: doc.id,
                                userId: doc.data().userId,
                                dateTaken: doc.data().dateTaken
                              }));

                              if(data.length !== 0){
                                data.forEach(function (item, index) {
                                    usersRef.where("id", "==", item.userId).onSnapshot(function(snap){
                                        snap.forEach(function(doc) {
                                            $('#tblTracks').DataTable({
                                                retrieve: true,
                                                destroy: true,
                                                dom: 'Bfrtip',
                                                buttons: [{
                                                    extend: 'excelHtml5',
                                                    title: `${rmNAme} Weekly Report`
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
                                $('#tblTracks').DataTable();
                              }
                        });
            break;
        case 'm':
            $('#tblTracks').DataTable().clear().draw();
            $('#tblTracks').DataTable().destroy();
            healthDecRef.where("dateTaken", ">=", new Date(`${cy}-${cm}-01`))
                        .where("dateTaken", "<=", new Date(`${cy}-${cm}-31`))
                        .where("roomName", "==", rmNAme)
                        .get()
                        .then((snap) => {
                            const data = snap.docs.map((doc) => ({
                                id: doc.id,
                                userId: doc.data().userId,
                                dateTaken: doc.data().dateTaken
                              }));

                              if(data.length !== 0){
                                data.forEach(function (item, index) {
                                    usersRef.where("id", "==", item.userId).onSnapshot(function(snap){
                                        snap.forEach(function(doc) {
                                            $('#tblTracks').DataTable({
                                                retrieve: true,
                                                destroy: true,
                                                dom: 'Bfrtip',
                                                buttons: [{
                                                    extend: 'excelHtml5',
                                                    title: `${rmNAme} Monthly Report`
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
                                $('#tblTracks').DataTable();
                              }
                        });
            break;
        case 'a':
            $('#tblTracks').DataTable().clear().draw();
            $('#tblTracks').DataTable().destroy();
            healthDecRef.where("dateTaken", ">=", new Date(`${cy}-01-01`))
                        .where("dateTaken", "<=", new Date(`${cy}-12-31`))
                        .where("roomName", "==", rmNAme)
                        .get()
                        .then((snap) => {
                            const data = snap.docs.map((doc) => ({
                                id: doc.id,
                                userId: doc.data().userId,
                                dateTaken: doc.data().dateTaken
                              }));

                              if(data.length !== 0){
                                data.forEach(function (item, index) {
                                    usersRef.where("id", "==", item.userId).onSnapshot(function(snap){
                                        snap.forEach(function(doc) {
                                            $('#tblTracks').DataTable({
                                                retrieve: true,
                                                destroy: true,
                                                dom: 'Bfrtip',
                                                buttons: [{
                                                    extend: 'excelHtml5',
                                                    title: `${rmNAme} Annual Report`
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
                                $('#tblTracks').DataTable();
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