const covidRef = firebase.firestore().collectionGroup("CovidStatus");

$(document).ready(function(){
    $('#tblSymps').DataTable();
    GetSymps();
});


function GetSymps(){
    $('#tblSymps').DataTable().clear().draw();
    $('#tblSymps').DataTable().destroy();
   covidRef.where("status", "==", "Symptomatic")
            .where("dateEffectivity", ">=", new Date('2022-01-01'))
            .where("dateEffectivity", "<=", new Date('2022-12-31'))
            .get()
            .then((snap) => {
                const data = snap.docs.map((doc) => ({
                    userId: doc.data().userId
                  }));

                  console.log(data);

                  if(data.length !== 0){
                    data.forEach(function (item, index) {
                        usersRef.where("id", "==", item.userId).onSnapshot(function(snap){
                            snap.forEach(function(doc) {
                                $('#tblSymps').DataTable({
                                    retrieve: true,
                                    destroy: true,
                                }).row.add([
                                    `${doc.data().fullname}`, `<button class="btn btn-primary" onclick="ViewDec('${doc.data().id}')">Health Declaration</button>&nbsp;&nbsp;<button class="btn btn-primary" onclick="NotifModal('${doc.data().id}')">Notify</button>`, 
                                ]).draw();
                            });
                        });
                    });
                  } else {
                    $('#tblSymps').DataTable();
                  }
            });
}

function ViewDec(userId){
    let user;

    usersRef.where("id", "==", userId).get().then((snap) => {
        const data = snap.docs.map((doc) => ({
            userType: doc.data().userType
          }));

        data.forEach(function(item, index){
            if(item.userType === "student"){
                usersRef.doc(userId).collection("HealthDeclarationForm")
                .where("dateTaken", ">=", new Date('2022-01-01'))
                .where("dateTaken", "<=", new Date('2022-12-31'))
                .get()
                .then((snap) => {
                    snap.forEach((doc) => {
                        var declaration = JSON.parse(doc.data().hashData);
                        console.log(declaration);
                        $('#decBody #wrkQstn #arrngmnt').val(declaration[0].optionAnswer);
                        $('#decBody #wrkQstn #arrngmntOther').val(declaration[0].otherAnswer);

                        $('#decBody #intTravel #travelInt').val(declaration[1].optionAnswer);
                        $('#decBody #intTravel #intOther').val(declaration[1].otherAnswer);

                        $('#decBody #lclTravel #travelLcl').val(declaration[2].optionAnswer);
                        $('#decBody #lclTravel #lclOther').val(declaration[2].otherAnswer);

                        if(declaration[3].optionAnswer === "Yes"){
                            $('#decBody #symptoms #hasFever').attr('checked', 'checked');
                        }
                        
                        if(declaration[4].optionAnswer === "Yes"){
                            $('#decBody #symptoms #hasHeadache').attr('checked', 'checked');
                        }
                        
                        if(declaration[5].optionAnswer === "Yes"){
                            $('#decBody #symptoms #hasChills').attr('checked', 'checked');
                        }
                        
                        if(declaration[6].optionAnswer === "Yes"){
                            $('#decBody #symptoms #hasRednesss').attr('checked', 'checked');
                        }

                        if(declaration[7].optionAnswer === "Yes"){
                            $('#decBody #symptoms #hasLoss').attr('checked', 'checked');
                        }
                        
                        if(declaration[8].optionAnswer === "Yes"){
                            $('#decBody #symptoms #hasRunny').attr('checked', 'checked');
                        }
                        
                        if(declaration[9].optionAnswer === "Yes"){
                            $('#decBody #symptoms #hasSore');
                        }
                        
                        if(declaration[10].optionAnswer === "Yes"){
                            $('#decBody #symptoms #hasCough').attr('checked', 'checked');
                        }
                        
                        if(declaration[11].optionAnswer === "Yes"){
                            $('#decBody #symptoms #hasPain').attr('checked', 'checked');
                        }
                        
                        if(declaration[12].optionAnswer === "Yes"){
                            $('#decBody #symptoms #hasFatigue').attr('checked', 'checked');
                        }
                        
                        if(declaration[13].optionAnswer === "Yes"){
                            $('#decBody #symptoms #hasShort').attr('checked', 'checked');
                        }
                        
                        if(declaration[14].optionAnswer === "Yes"){
                            $('#decBody #symptoms #hasDiarrhea').attr('checked', 'checked');
                        }
                        
                        if(declaration[15].optionAnswer === "Yes"){
                            $('#decBody #symptoms #hasNausea').attr('checked', 'checked');
                        }
                        
                        if(declaration[16].optionAnswer === "Yes")
                        {
                            $('#decBody #symptoms #hasRashes').attr('checked', 'checked');
                        }

                        if(declaration[17].optionAnswer === "Yes"){
                            $('#decBody #symptoms #hasDiscoloration').attr('checked', 'checked');
                        }

                        $('#decBody #covidPos #expsdPos').val(declaration[18].optionAnswer);

                        $('#decBody #covidLike #expsdLike').val(declaration[19].optionAnswer);

                        $('#decBody #hsptlVisit #visit').val(declaration[20].optionAnswer);
                        
                        $('#decBody #swabTst #test').val(declaration[21].optionAnswer);
                        $('#decBody #swabTst #testResult').val(declaration[21].otherAnswer);

                        $('#decBody #vaccination #vax').val(declaration[22].optionAnswer);
                        $('#decBody #vaccination #vaxOther').val(declaration[22].otherAnswer);

                        if(declaration[23].optionAnswer === "Yes"){
                            $('#decBody #trnspt #isCar').attr('checked', 'checked');
                        }
                        
                        if(declaration[24].optionAnswer === "Yes"){
                            $('#decBody #trnspt #isMotor').attr('checked', 'checked');
                        }
                        
                        if(declaration[25].optionAnswer === "Yes"){
                            $('#decBody #trnspt #isBike').attr('checked', 'checked');
                        }
                        
                        if(declaration[26].optionAnswer === "Yes"){
                            $('#decBody #trnspt #isFaith').attr('checked', 'checked');
                        }
                        
                        if(declaration[27].optionAnswer === "Yes"){
                            $('#decBody #trnspt #isJeep').attr('checked', 'checked');
                        }
                        
                        if(declaration[28].optionAnswer === "Yes"){
                            $('#decBody #trnspt #isBus').attr('checked', 'checked');
                        }
                        
                        if(declaration[29].optionAnswer === "Yes"){
                            $('#decBody #trnspt #isTric').attr('checked', 'checked');
                        }
                        
                        if(declaration[30].optionAnswer === "Yes"){
                            $('#decBody #trnspt #otherTranspo').attr('checked', 'checked');
                        }
                        
                        $('#decBody #trnspt #trnsptOther').val(declaration[30].otherAnswer);


                    });
                });
                
                $('#declarationModal').modal('show');
            }
        });
    });

}

function NotifModal(userId){
    $('#notifModal').modal('show');
    $('#notifBody #userId').val(userId);
}

function SendNotif(){
    var userId = $('#notifBody #userId').val();
    var title = $('#notifBody #notifTitle').val();
    var message = $('#notifBody #notifContent').val();
    let notifRef = usersRef.doc(userId).collection("Notification").doc();
    notifRef.set(
        {
            title: title,
            message: message,
            dateNotif: new Date(),
            isRead: false,
            userId : userId
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