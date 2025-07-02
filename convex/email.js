import { v } from "convex/values";
import { action } from "./_generated/server";
import{Resend} from "resend"
 
export const sendEmail = action({
    args:{
        to:v.string(),
        subject:v.string(),
        html:v.string(),
        text:v.optional(v.string()),
        apiKey:v.string()
    },
    handler:async(ctx, args)=>{
        const resend = new Resend(args.apiKey)

        try {
            const result = await resend.emails.send({
                from:"SplitIt <Onboarding@resend.dev>", 
                to:args.to,
                subject:args.subject,
                text:args.text,
                html:args.html

            })
            return{success:true, id:result.id}
        } catch (error) {
            console.error("Failed to send Email", error)
            return{success:false, message:error.message}
        }
    }
})