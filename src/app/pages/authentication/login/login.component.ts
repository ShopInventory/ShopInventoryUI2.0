import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { MaterialModule } from '../../../shared/shared-module/material/material.module';
import { Router, RouterLink } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
    selector: 'app-login',
    imports: [CommonModule, MaterialModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {
  // Property to track whether the password is hidden or visible
  hidePassword: boolean = true;
  // Define the login form group
  loginForm!: FormGroup;

  usernameError: string | null = null; // Error message for username
  passwordError: string | null = null; // Error message for password

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object // Inject PLATFORM_ID to check the environment
  ) {

  }

  ngOnInit(): void {
    this.initializeForm();
    // Only call setValues if the code is running in a browser
    if (isPlatformBrowser(this.platformId)) {
      this.setValues();
    }

  }

  setValues() {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.clear();
    } else {
      console.warn('sessionStorage is not available in this environment.');
    }

    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    } else {
      console.warn('localStorage is not available in this environment.');
    }
  }


  initializeForm() {
    // Initialize the form with username and password controls
    this.loginForm = this.formBuilder.group({
      username: [''],
      password: ['']
    });
  }

  // Function to toggle password visibility
  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  onSubmit(): void {
    const username = this.loginForm.get('username')?.value;
    const password = this.loginForm.get('password')?.value;

    // Reset error messages before validation
    this.usernameError = null;
    this.passwordError = null;

    if (this.loginForm.valid) {
      if (isPlatformBrowser(this.platformId)) {

        // Generate a mock JWT token for demo purposes
        const token = this.generateToken();
        console.log('Generated Token:', token);

        // Store token in sessionStorage
        sessionStorage.setItem('authToken', token);
        console.log('Token stored in sessionStorage');

        // Check if credentials match the stored token for authorization
        const isAuthenticated = this.authorizeUser(username, password);

        if (isAuthenticated) {
          console.log('User authorized successfully!');
          this.router.navigate(['/dashboard']);
        } else {
          console.log('Authorization failed. Invalid username or password.');

          // // Set the appropriate error messages
          // const tokenData: any = jwtDecode(token);
          // // const tokenData = this.decodeTokenPayload(token);
          // if (tokenData.username !== username) {
          //   this.usernameError = 'Username does not match';
          // }
          // if (tokenData.password !== password) {
          //   this.passwordError = 'Password does not match';
          // }
        }
      }
    }
  }

  // Mock JWT Token Generation Function
  generateToken() {
    // In a real application, you'd get the token from the server
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHBfYXQiOjE3Mjk1ODI2ODIsImlzc3VlX2F0IjoxNzI5NTgxNDgyLCJyb2xlTmFtZSI6IkFkbWluIiwidXNlcm5hbWUiOiJwcmFzaGFudGRhdjAxIiwicGFzc3dvcmQiOiJwcmFzaGFudGRhdjAxIn0.uj8Jq5AnDgQM0nZjtYKsUNQSRR7P8sB3_mGnIHy1tgs"; // Encoding username and password in base64 (for demo purposes)
    return token;
  }

  // Helper function to decode the base64-encoded JWT payload
  decodeTokenPayload(token: string): any {
    const payloadBase64 = token.split('.')[1]; // Get the payload part of the token
    const decodedPayload = atob(payloadBase64); // Decode the base64 string
    return JSON.parse(decodedPayload); // Parse the decoded payload as JSON
  }

  // Authorize the user by checking the token in sessionStorage
  authorizeUser(username: string, password: string): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const token = sessionStorage.getItem('authToken');
      if (token) {
        const decodedToken = this.decodeTokenPayload(token); // Decode the payload part of the token
        return decodedToken.username === username && decodedToken.password === password;
      }
    }
    return false;
  }

  // Logout functionality (clears token from sessionStorage)
  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.removeItem('authToken');

      this.loginForm.get('username')?.setValue('');
      this.loginForm.get('password')?.setValue('');

      const token = sessionStorage.getItem('authToken');
      if (!token) {
        console.log('User logged out. Token removed from sessionStorage.');
        // Navigate back to the login page after logout
        this.router.navigate(['/login']);
      } else {
        console.log('Token was not removed from sessionStorage.');
      }
    }
  }

}
