/* eslint-disable @typescript-eslint/no-unused-vars */
import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
// using our custom made email template

import { ApiResponse } from "@/types/ApiResponse";
// sending custom made API response to the user

export async function sendVerificationEmail(username : string,email : string,verifyCode : string) : Promise<ApiResponse> {
    try{
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Anonymous Feedback Application Verification Code',
            react: VerificationEmail({ username, otp: verifyCode }),
        });

        return {success : true, message : "Verification Email Sent Sucessfully"};
    }catch(error){
        console.error('Error sending verification email:', error);
        return { success: false, message: 'Failed to send verification email.' };
    }
}
