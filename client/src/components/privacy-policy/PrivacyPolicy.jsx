import { Paper, Title } from "@mantine/core";
import { Link } from "react-router-dom";

export default function PrivacyPolicy() {
    return (
      <Paper shadow="md" withBorder p="1em" radius="md" maw={600} m="1em auto" w="100%">
        <Title c="cyan.6" order={4}>Privacy Policy</Title>
  
        <p>
          We value your privacy and are committed to protecting your personal information.
        </p>
  
        <Title c="cyan.6" order={4}>Information We Collect</Title>
        <p>
          When you use our app and sign in with Facebook (or other providers), we collect your basic profile
          information such as your name, email address, and profile picture. This information is used to create
          and manage your account within our service.
        </p>
  
        <Title c="cyan.6" order={4}>How We Use Your Information</Title>
        <p>
          We use your information to provide and improve our service. We do not sell, trade, or rent your
          personal information to others.
        </p>
  
        <Title c="cyan.6" order={4}>Third-Party Services</Title>
        <p>
          We may use third-party services like Firebase Authentication and Hosting. These services may collect
          information according to their own privacy policies.
        </p>
  
        <Title c="cyan.6" order={4}>Data Security</Title>
        <p>
          We take reasonable measures to protect your personal information from unauthorized access and use.
        </p>
        <Title c="cyan.6" order={4}>Data Deletion Instructions</Title>
        <p>You can permanently delete your account and all associated data at any time by visiting your Profile tab and selecting &quot;Delete My Account&quot;.</p>
  
        <Title c="cyan.6" order={4}>Changes to This Policy</Title>
        <p>
          We may update this Privacy Policy from time to time. Any changes will be posted on this page.
        </p>
  
        <Title c="cyan.6" order={4}>Contact Us</Title>
        <p>
          If you have any questions about this Privacy Policy, you can contact us at:
          <br />
          <a href="mailto:webeltek12@gmail.com">webeltek12@gmail.com</a>
        </p>
      </Paper>
    );
  }