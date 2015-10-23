// Userlist data array for filling in info box
var userListData = [];

// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the user table on initial page load
    populateTable();
    // Add User button click
    $('#sample_editable_1_new').on('click', logIn());


});

// Functions =============================================================
function newCompany(){
    var company = {};
    $.ajax({
        type: 'POST',
        data: user,
        url: '/login/ola',
        dataType: 'JSON'
    }).done(function( response ) {

        // Check for successful (blank) response
        if (response.msg === '') {

            // Clear the form inputs
            $('#addUser fieldset input').val('');

            // Update the table
            populateTable();

        }
        else {

            // If something goes wrong, alert the error message that our service returned
            alert('Error: ' + response.msg);

        }
    });

}

function logIn(){
    var username = $('#username');
    var password = $('#password');

    var user ={'usernames': username, 'password': password}

    $.ajax({
        type: 'POST',
        data: user,
        url: '/login/ola',
        dataType: 'JSON'
    }).done(function( response ) {

        // Check for successful (blank) response
        if (response.msg === '') {

            // Clear the form inputs
            $('#addUser fieldset input').val('');

            // Update the table
            populateTable();

        }
        else {

            // If something goes wrong, alert the error message that our service returned
            alert('Error: ' + response.msg);

        }
    });


}


// Fill table with data
function populateTable() {

    // Empty content string
    var tableContent = '';


    // jQuery AJAX call for JSON
    $.getJSON( '/users/companylist', function( data ) {
        // Stick our user data array into a userlist variable in the global object
        userListData = data;
        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.userNameCEO + '">' + this.CEO + '</a></td>';
            tableContent += '<td>' + "Company ID: "+this.company.companyID + '</td>';
            tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#userList2 table tbody').html(tableContent);
        // Username link click
        $('#userList2 table tbody').on('click', 'td a.linkshowuser', showUserInfo);
        // Delete User link click
        $('#userList2 table tbody').on('click', 'td a.linkdeleteuser', deleteUser);
    });
};

// Show User Info
function showUserInfo(event) {

    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve username from link rel attribute
    var thisUserName = $(this).attr('rel');

    // Get Index of object based on id value
    var arrayPosition = userListData.map(function (arrayItem) {
        return arrayItem.userNameCEO;
    }).indexOf(thisUserName);
    // Get our User Object
    var thisUserObject = userListData[arrayPosition];

    //Populate Info Box
    $('#companyInfoMail').text(thisUserObject.company.companyMail);
    $('#companyInfoCEO').text(thisUserObject.userNameCEO);
    $('#userInfoGender').text(thisUserObject.gender);
    $('#userInfoLocation').text(thisUserObject.location);
}

// Add User
function addUser(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addUser input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all user info into one object
        var newCompany = {
            company: {
                companyName: $('#addUser fieldset input#inputCompanyName').val(),
                companyMail:$('#addUser fieldset input#inputCompanyEmail').val(),
                street: $('#addUser fieldset input#inputCompanyLocation').val(),
                companyID: $('#addUser fieldset input#inputCompanyID').val()
            },
            CEO: $('#addUser fieldset input#inputCEOName').val(),
            userNameCEO: $('#addUser fieldset input#inputCEOUsername').val()
        }
        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            data: newCompany,
            url: '/users/newcompany',
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {

                // Clear the form inputs
                $('#addUser fieldset input').val('');

                // Update the table
                populateTable();

            }
            else {

                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);

            }
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
};

// Delete User
function deleteUser(event) {

    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this user?');

    // Check and make sure the user confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/users/deletecompany/' + $(this).attr('rel')
        }).done(function( response ) {

            // Check for a successful (blank) response
            if (response.msg === '') {
            }
            else {
                alert('Error: ' + response.msg);
            }

            // Update the table
            populateTable();

        });

    }
    else {

        // If they said no to the confirm, do nothing
        return false;

    }

};
