// JQuery form validation
$(function() {
  $("#confirmation").validate({
    // validation rules
    rules: {
      firstname: "required",
      lastname: "required",
      email: {
        required: true,
        email: true
      },
      password: {
        required: true,
        minlength: 7
      }
    },
    // validation error messages
    messages: {
      firstname: "Enter your firstname",
      lastname: "Please enter your lastname",
      password: {
        required: "Please provide a password",
        minlength: "Your password must be at least 7 characters long"
      },
      email: "Please enter a valid email address"
    },

    // form submission
    submitHandler: function(form) {
      form.submit();
    }
  });
});