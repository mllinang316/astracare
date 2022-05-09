const bldsRef = dbRef.collection('Buildings');
const roomsRef = dbRef.collection('Rooms');
var arryRooms = [];
var tRow = "";

$(document).ready(function(){
    var bldgId = window.localStorage.getItem("buildId");
    GetBuilding(bldgId);
});

function GetBuilding(bldgId){
    bldsRef.where("id", "==", `${bldgId}`).get().then((snap) => {
        snap.forEach((doc) => {
            $('#bldgId').val(doc.data().id);
            $('#bldgName').val(doc.data().name);
            $('#roomPrfx').val(doc.data().name);
            $('#bldgDes').val(doc.data().description);
        });
    });

    firebase.firestore().collectionGroup('Rooms')
            .where("bldgId", "==", `${bldgId}`)
            .get().then((snap) => {
                // snap.forEach((doc) => {
                //     let row = `<tr><td>${doc.data().description}</td><td><button class="btn btn-primary" onclick="ViewRoom('${doc.data().id}')"><i class="far fa-eye"></i>View</button>&nbsp;&nbsp;<button class="btn btn-primary" onclick="ViewTracks('${doc.data().id}')"><i class="fas fa-map-marked-alt"></i> Tracks</button></td></tr>`;

                //     $('#tblRooms tbody').append(row);
                // });

                const rooms = snap.docs.map((doc) => ({
                    id: doc.data().id,
                    description: doc.data().description
                  }));
                
        $('#tblRooms').DataTable({
            data: rooms,
            columns: [
                {data: "description"},
                {
                    data: "id",
                    render: function(id){
                        return `<button class="btn btn-primary" onclick="ViewRoom('${id}')"><i class="far fa-eye"></i>View</button>&nbsp;&nbsp;<button class="btn btn-primary" onclick="ViewTracks('${id}')"><i class="fas fa-map-marked-alt"></i> Tracks</button>`;
                    }
                }
            ]
        });
                
    });
}

function ViewRoom(roomId){
    $('#roomModal').modal('show');
    console.log(roomId);
    if(roomId !== '0'){
        firebase.firestore().collectionGroup('Rooms').where("id", "==", `${roomId}`).get().then((snap)=>{
            snap.forEach((doc) => {
                $('#roomId').val(doc.data().id);
                $('#roomName').val(doc.data().name);
                $('#roomDescription').val(doc.data().description);
            });
        });
    }
}

function ViewTracks(roomId){
    window.localStorage.setItem('roomId', roomId);
    window.location.href = '/tracks.html';
}

function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
  }
  
function formatDate(date) {
    return [
        padTo2Digits(date.getDate()),
        padTo2Digits(date.getMonth() + 1),
        date.getFullYear()
        ].join('');
}

function SaveRoom(){
    var bldgId = $('#bldgId').val();
    var bldgName = $('#bldgName').val();
    var rmId = $('#roomId').val();
    var rmName = $('#roomName').val();
    var rmDes = $('#roomDescription').val();

    if( rmId === '' && bldgName === "Gates"){
        let docRef = bldsRef.doc(bldgId).collection('Rooms').doc();
        docRef.set({
            id: docRef.id,
            name: rmName,
            description: rmDes,
            updatedDate:  firebase.firestore.FieldValue.serverTimestamp(),
            bldgId: bldgId,
            lastQrCode: `${rmName}-${formatDate(new Date())}`
        })
        .then(function(){
            $('#roomModal').modal('toggle');
            swal("SUCCESS!", "Room successfully saved!", "success").then((value) => {
                window.location = window.location;
              });
        })
        .catch((error) => {
            $('#roomModal').modal('toggle');
            swal("FAIL!", "Something went wrong!", "error");
        });
    } else if(rmId === ''){
        let docRef = bldsRef.doc(bldgId).collection('Rooms').doc();
        docRef.set({
            id: docRef.id,
            name: rmName,
            description: rmDes,
            updatedDate:  firebase.firestore.FieldValue.serverTimestamp(),
            bldgId: bldgId
        })
        .then(function(){
            $('#roomModal').modal('toggle');
            swal("SUCCESS!", "Room successfully saved!", "success").then((value) => {
                window.location = window.location;
              });
        })
        .catch((error) => {
            $('#roomModal').modal('toggle');
            swal("FAIL!", "Something went wrong!", "error");
        });
    } else {
        bldsRef.doc(bldgId).collection('Rooms').doc(rmId).update(
            {
                id: docRef.id,
                name: rmName,
                description: rmDes,
                updatedDate:  new Date(),
            }).then(function()
            {
                swal("SUCCESS!", "Successfully updated!", "success").then((value) => {
                    window.location = window.location;
                  });
            })
            .catch((error) => {
                console.log(error);
                $('#roomModal').modal('toggle');
                swal("FAIL!", "Something went wrong!", "error");
            });
    }
}

function GenQr(){
    var name = $('#roomName').val();
    var rmId = $('#roomId').val();
    var bldgName = $('#bldgName').val();
    var bldgId = $('#bldgId').val();

    bldsRef.doc(bldgId).collection('Rooms').doc(rmId).update({updatedDate: new Date()});

        new QRCode($('#qrcode'),
               {
                text: bldgName === "Gates" ? `${name}#${formatDate(new Date())}` : name,
                width: 450,
                height: 450,
                colorDark : "#000000",
                colorLight : "#ffffff",
                correctLevel : QRCode.CorrectLevel.H
              });  
    setTimeout(
      function ()
      {
          let dataUrl = document.querySelector('#qrcode').querySelector('img').src;
          downloadURI(dataUrl, `${name}.png`);
      }
      ,1000)
}

function downloadURI(uri, name) {
    var link = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.append(link);
    link.click();
    document.body.removeChild(link);
    delete link;
  };

function SaveBldg(){
    var bldgId = $('#bldgId').val();
    var bldgName = $('#bldgName').val();
    var bldgDes = $('#bldgDes').val();

    if(bldgId !== ''){
        bldsRef.doc(bldgId).update({
            name: bldgName,
            bldgDes: bldgDes,
            updatedDate: new Date()
        }).then(function()
        {
            swal("SUCCESS!", "Successfully updated!", "success").then((value) => {
                window.location = window.location;
              });
        })
        .catch((error) => {
            console.log(error);
            $('#roomModal').modal('toggle');
            swal("FAIL!", "Something went wrong!", "error");
        });
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