$(document).ready(function(){
    $('#tblUsers').DataTable();
});

function SelectUser(){
    $('.selectType').on('change', function(e){
        e.preventDefault();
        var uType = $(this).val();
        ViewUsers(uType);
    });
}

function ViewUsers(userType){ 
    $('#tblUsers').DataTable().clear().draw();
    $('#tblUsers').DataTable().destroy();

    switch (userType) {
        case "student":
            usersRef.where("userType", "==", `${userType}`)
                    .orderBy("department", "asc")
                    .get().then((querySnapshot) => {
                const users = querySnapshot.docs.map((doc) => ({
                    id: doc.data().id,
                    fullname: doc.data().fullname ?? "N/A",
                    department: doc.data().department,
                    email: doc.data().email,
                    contact: doc.data().phone
                  }));

                  if(users.lenth !== 0){
                    $('#tblUsers').DataTable({
                        data: users,
                        columns: [
                            {data: "fullname"},
                            {data: "department"},
                            {data: "email"},
                            {data: "contact"},
                            {
                                data: "id",
                                render: function(id){
                                  return `<button type="button" class="btn btn-primary" onclick="ViewProfile('${id}')">Profile</button>`;
                                }
                            }
                        ]
                    });
                  } else {
                    $('#tblUsers').DataTable();
                  }
            });
            break;

        case "employee":
            usersRef.where("userType", "!=", "student")
                    .orderBy("department", "asc")
                    .get().then((querySnapshot) => {
                const users = querySnapshot.docs.map((doc) => ({
                    id: doc.data().id,
                    fullname: doc.data().fullname,
                    department: doc.data().department,
                    email: doc.data().email,
                    contact: doc.data().phone
                  }));

                  if(users.lenth !== 0){
                    $('#tblUsers').DataTable({
                        data: users,
                        columns: [
                            {data: "fullname"},
                            {data: "department"},
                            {data: "email"},
                            {data: "contact"},
                            {
                                data: "id",
                                render: function(id){
                                  return `<button type="button" class="btn btn-primary" onclick="ViewProfile('${id}')">Profile</button>`;
                                }
                            }
                        ]
                    });
                  } else {
                    $('#tblUsers').DataTable();
                  }
            });
            break;
    }
}

function ViewProfile(profileId){
    $('#profileModal').modal('toggle');
    usersRef.where("id", "==", `${profileId}`).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            $('#profileCntnt #id').val(doc.data().id);
            $('#profileCntnt #fname').val(doc.data().firstName);
            $('#profileCntnt #mname').val(doc.data().middleName);
            $('#profileCntnt #lname').val(doc.data().lastName);
            $('#profileCntnt #level').val(doc.data().level);
            $('#profileCntnt #course').val(doc.data().course);
            $('#profileCntnt #dept').val(doc.data().department);
            $('#profileCntnt #email').val(doc.data().email);
            $('#profileCntnt #contact').val(doc.data().phone);
            if(doc.data().isActive === true){
                $('#profileCntnt #status option[value="true"]').attr('selected', true);
                $('#profileCntnt #status option[value="false"]').attr('selected', false);
            } else {
                $('#profileCntnt #status option[value="true"]').attr('selected', false);
                $('#profileCntnt #status option[value="false"]').attr('selected', true);
            }
        });
    });

    $('#covidHis tbody').empty();
    firebase.firestore().collectionGroup("CovidStatus")
            .where("userId", "==", profileId)
            .orderBy("dateEffectivity", "asc")
            .get()
            .then(snap => {
                snap.forEach(doc => {
                    let row  = `<tr>
                    <td>${doc.data().status}</td>
                    <td>${new Date(doc.data().dateEffectivity.toDate()).toISOString().slice(0, 10)}</td>`;
                let table = $('#covidHis tbody');
                table.append(row);
                            });
            });
}


function updateUser(userId, status){
    $.blockUI;
    usersRef.doc(userId).update(
        {
            isActive: JSON.parse(status)
        })
    .then(function()
    {
        $.unblockUI();
        swal("SUCCESS!", "Successfully updated!", "success").then((value) => {
            window.location = window.location;
          });
    })
    .catch(function(){
        $.unblockUI();
        swal("FAIL!", "Something went wrong!", "error");
    });
}

function updateCovid(userId, covidStatus){
    $.blockUI;
    let covidRef = usersRef.doc(userId).collection('CovidStatus').doc();
    covidRef.set(
        {
            status: covidStatus,
            dateEffectivity: new Date(),
            userId: userId
        })
    .then(function()
    {
        $.unblockUI();
        swal("SUCCESS!", "Successfully updated!", "success").then((value) => {
            window.location = window.location;
          });
    })
    .catch(function(){
        $.unblockUI();
        swal("FAIL!", "Something went wrong!", "error");
    });
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