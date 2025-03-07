document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("#signup-form");
    const emailInput = form.querySelector("input[type='email']");
    const passwordInput = form.querySelector("input[type='password']");
    const confirmPasswordInput = form.querySelector("input[name='confirm-password']");
    const emailError = document.getElementById("email-error");
    const passwordError = document.getElementById("password-error");
    const confirmPasswordError = document.getElementById("confirm-password-error");
  
    function validateEmail(email) {
      const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return regex.test(email);
    }
  
    

    form.addEventListener("submit", function (e) {
      e.preventDefault(); 
  
      emailError.textContent = '';
      passwordError.textContent = '';
      confirmPasswordError.textContent = '';
  
      let valid = true;
  
      const email = emailInput.value;
      const password = passwordInput.value;
      const confirmPassword = confirmPasswordInput.value;
  
      
      if (!validateEmail(email)) {
        emailError.textContent = "Please enter a valid email address.";
        emailInput.classList.add('error');
        valid = false;
      } else {
        emailInput.classList.remove('error');
      }
  
    
      if (!validatePassword(password)) {
        passwordError.textContent = "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.";
        passwordInput.classList.add('error');
        valid = false;
      } else {
        passwordInput.classList.remove('error');
      }
  
     
      if (password !== confirmPassword) {
        confirmPasswordError.textContent = "Passwords do not match.";
        confirmPasswordInput.classList.add('error');
        valid = false;
      } else {
        confirmPasswordInput.classList.remove('error');
      }
  
      
      if (valid) {
        window.location.href = "index.html"; 
      }
    });
  });
  