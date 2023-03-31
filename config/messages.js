module.exports = {

    // All session messages here,
    /*------------------------*/


    // IF USER CLICK FORGOT PASSWORD

        // If in forgot-password route empty value input, message is
            Heading_For_Empty_Value_That_Email : 'Please fill in at least one field',
            Paragraph_For_Empty_Value_That_Email : 'Fill in at least one field to search for your account',
        // If in forgot-password route email is not found, message is
            Heading_For_NotFound_Value_That_Email : 'No search results',
            Paragraph_For_NotFound_Value_That_Email : 'Your search did not return any results. Please try again with other information.',
        // POST confirm OTP is empty, message is
            Empty_OTP_Is_Response : 'Please enter a code.',
            // The OTP is INvALID ,
            OTP_Invalid : 'Incorrect verification code provided.',
        // POST update password is empty,
            Empty_New_Password : 'Please enter new password.',
        // POST final for show message here login page that password update success or not (failed)
            //success
            Password_Reset_Successful : 'Password reset successful',
            //Failed
            Password_Reset_Failed : 'Password reset failed',
            // no more than 16 characters
             No_MoreThan_Restricted_Characters : 'No more than Sixteen characters',
            // Enter minimum 6 characters
            Enter_Minimum_Restricted_Characters : 'Please enter more than Six characters',

        }       