import { sender, mailtrapClient } from "./mailtrap.config.js";
import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js";

export const sendVerificationEmail = async (email, verificationToken) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Verify your Email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ),
      category: "Email verification",
    });

    console.log("Email sent succesfully", response);
  } catch (error) {
    console.log(`Error sending verification email:`, error);
    throw new Error(`Error sending verification email: ${error}`);
  }
};

export const sendWelcomeEmail = async (email, name) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      template_uuid: "aa975e21-8d57-44c5-a75f-a77de4d21006",
      template_variables: {
        company_info_name: "3D Pixels",
        name: name
      }
    });

    console.log("Welcome email sent successfully:", response);
    
  } catch (error) {
    console.log(`Error welcome verification email:`, error);
    throw new Error(`Error sending welcome email: ${error}`);
  }
};

export const sendPasswordResetEmail = async (email, resetURL)=>{
  const recipient = [{email}];
  try {
    const response =  await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Reset your password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
      category: "Password Reset",
    })

    
  } catch (error) {
    console.error('Error sending password reset email', error);
    throw new Error(`Error sending password reset email:, ${error}`);
    
    
  }
}

export const sendresetSuccesfulEmail = async (email) =>{
const recipient = [{email}];

try {
  const response = await mailtrapClient.send({
    from : sender,
    to: recipient,
    subject: 'Password Reset successful',
    html: PASSWORD_RESET_SUCCESS_TEMPLATE,
    category: "Password Reset"
  });
  console.log("Password reset email sent succesfully", response);
  
} catch (error) {
  console.log("Error sending Password reset email", error);
  throw new Error(`Error sending Password reset email:${error}`);
  
}
}
