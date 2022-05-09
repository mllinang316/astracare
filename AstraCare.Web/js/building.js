const bldsRef = dbRef.collection('Buildings');

$(document).ready(function(){
    GetBuildings();
});

function GetBuildings(){
    bldsRef.get().then((snap) => {
        const users = snap.docs.map((doc) => ({
            id: doc.data().id,
            name: doc.data().name,
          }));

          $('#tblbldgs').DataTable({
              data: users,
              columns: [
                  {data: "name"},
                  {
                      data: "id", 
                      render: function(id){
                          return `<button type="button" class="btn btn-primary" onclick="ViewBuilding('${id}')"><i class="far fa-eye"></i> View</button>`;
                      }
                  }
              ]
          });
    });
}

function NewBldg(){
    $('#bldgModal').modal('show');
}

function SaveBldg(){
    var bldgName = $('#bldgName').val();
    var bldgDescription = $('#bldgDescription').val();

    let docRef = bldsRef.doc();

    docRef.set({
        id: docRef.id,
        name: bldgName,
        description: bldgDescription,
        updatedDate:  firebase.firestore.FieldValue.serverTimestamp(),
    })
    .then(function(){
        $('#bldgModal').modal('toggle');
        swal("SUCCESS!", "Building successfully saved!", "success").then((value) => {
            window.location = window.location;
          });
    })
    .catch((error) => {
        $('#bldgModal').modal('toggle');
        swal("FAIL!", "Something went wrong!", "error");
    });
}

function ViewBuilding(buildId){
    window.localStorage.setItem("buildId", buildId);
    window.location.href = "./room.html";
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