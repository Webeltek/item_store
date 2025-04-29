import { Link } from "react-router-dom";

export default function PrivacyPolicy() {
    return (
      <div style={{ maxWidth: '800px', margin: '50px auto', padding: '80px 0 100px', fontFamily: 'Arial, sans-serif' }}>
        <h1 style={{ color: '#3b5998'}}>Privacy Policy</h1>
  
        <p>
          We value your privacy and are committed to protecting your personal information.
        </p>
  
        <h2>Information We Collect</h2>
        <p>
          When you use our app and sign in with Facebook (or other providers), we collect your basic profile
          information such as your name, email address, and profile picture. This information is used to create
          and manage your account within our service.
        </p>
  
        <h2>How We Use Your Information</h2>
        <p>
          We use your information to provide and improve our service. We do not sell, trade, or rent your
          personal information to others.
        </p>
  
        <h2>Third-Party Services</h2>
        <p>
          We may use third-party services like Firebase Authentication and Hosting. These services may collect
          information according to their own privacy policies.
        </p>
  
        <h2>Data Security</h2>
        <p>
          We take reasonable measures to protect your personal information from unauthorized access and use.
        </p>
        <h2>Data Deletion Instructions</h2>
        <p>You can permanently delete your account and all associated data at any time by visiting your Profile tab and selecting &quot;Delete My Account&quot;.</p>
  
        <h2>Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Any changes will be posted on this page.
        </p>
  
        <h2>Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, you can contact us at:
          <br />
          <a href="mailto:webeltek12@gmail.com">webeltek12@gmail.com</a>
        </p>
      </div>
    );
  }