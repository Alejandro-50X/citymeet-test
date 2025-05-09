
import { createServerClient } from "@supabase/ssr";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
/*
This is supposed to be for email confirmation, not ready to
implement yet

import { NextResponse } from "next/server";
import { Resend } from 'resend';
*/

export async function POST(request){
    try {
        const body = await request.json();
        const path = body.path
        const cookieStore = cookies();

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            {
                cookies: {
                    get(name){
                        return cookieStore.get(name)?.value
                    },
                    set(name, value, options){
                        cookieStore.set({name, value, ...options})
                    },
                    remove(name, options){
                        cookieStore.set({name, value: '', ...options})
                    }
                }
            }
        )

        const {data: {user}} = await supabase.auth.getUser()

        if (!user){
            return new Response(JSON.stringify({message: 'Unauthorized'}), {
                status: 401,
                headers: {'Content-Type': 'application/json'}
            })
        }

        if (path){
            revalidatePath(path)
            return new Response(JSON.stringify({message: `Revalidated ${path}`}), {
                status: 200,
                headers: {'Content-Type': 'application/json'}
            })
        } else {
            return new Response(JSON.stringify({message: 'No path!'}), {
                status: 400,
                headers: {'Content-Type': 'application/json'}
            })
        }
    } catch(err){
        console.error(err)
         return new Response(JSON.stringify({message: 'Error revalidating path'}), {
            status: 500,
            headers: {'Content-Type': 'application/json'}
        })
    }
}
//trying to implement email confirmation

/*
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  const body = await req.json();
  const { name, email, message } = body;

  try {
    const data = await resend.emails.send({
      from: 'your-email@yourdomain.com',
      to: email,
      subject: 'Thanks for contacting us!',
      html: `<p>Hi ${name},</p><p>We received your message:</p><blockquote>${message}</blockquote><p>We'll get back to you soon!</p>`,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: error.message });
  }
}
*/