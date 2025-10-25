
// import { NextResponse } from "next/server";

// export const runtime = "nodejs";

// export async function POST(req: Request) {
//   try {
//     const { message } = await req.json();
//     console.log("Message received:", message);

//     const apiKey = process.env.OPENAI_API_KEY;
//     if (!apiKey) {
//       console.error(" Missing OPENAI_API_KEY");
//       return NextResponse.json({ reply: "Server misconfigured" }, { status: 500 });
//     }

//     const res = await fetch("https://api.openai.com/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${apiKey}`,
//       },
//       body: JSON.stringify({
//         model: "gpt-4o-mini",
//         messages: [{ role: "user", content: message }],
//       }),
//     });

//     const data = await res.json();
//     console.log("OpenAI response:", res.status, data);

//     if (!res.ok) {
//       console.error("OpenAI API Error:", data);
//       return NextResponse.json(
//         { reply: `OpenAI Error: ${data.error?.message || "Unknown error"}` },
//         { status: res.status }
//       );
//     }

//     const reply = data.choices?.[0]?.message?.content || "No response found.";
//     return NextResponse.json({ reply });
//   } catch (error) {
//     console.error("Server error:", error);
//     return NextResponse.json({ reply: "Unexpected server error" }, { status: 500 });
//   }
// }











// import { NextResponse } from "next/server";

// export const runtime = "nodejs";

// export async function POST(req: Request) {
//   try {
//     const { message } = await req.json();
//     console.log("Message received:", message);

//     const apiKey = process.env.OPENAI_API_KEY;

//     if (!apiKey) {

//       const offlineReply = `
// 🇧🇩 **বাংলা:**
// বর্তমানে "Mini App Hub (MAH)"-এর AI সেবা (OpenAI Integration) আপাতত স্থগিত রয়েছে। 
// এই ফিচারটি চালু করতে ডেভেলপার (Samiul Islam - Owner of MAH) বিলিং সম্পন্ন করলে এটি আবার সক্রিয় হবে। 
// আপনি এই মুহূর্তে Firebase লাইভ চ্যাট বা "History" সেকশন ব্যবহার করে পূর্বের প্রশ্ন-উত্তর দেখতে বা সমস্যার সমাধান খুঁজতে পারেন। 
// দুঃখিত, AI Assistant এখন আপনার প্রশ্নের উত্তর দিতে পারবে না।

// ---

// 🇺🇸 **English:**
// Currently, the AI service of "Mini App Hub (MAH)" (OpenAI Integration) is temporarily suspended. 
// The feature will be reactivated once the developer (Samiul Islam - Owner of MAH) completes the billing. 
// Meanwhile, you can use the Firebase live chat or check the "History" section to see previous Q&A or find solutions. 
// We apologize, AI Assistant cannot respond to your questions at the moment.
// `;

//       return NextResponse.json({ reply: offlineReply }, { status: 200 });
//     }

//     // ✅ API key আছে, AI কল করা
//     const res = await fetch("https://api.openai.com/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${apiKey}`,
//       },
//       body: JSON.stringify({
//         model: "gpt-3.5-turbo",
//         messages: [{ role: "user", content: message }],
//       }),
//     });

//     const data = await res.json();
//     console.log("OpenAI response status:", res.status, data);

//     if (!res.ok) {
//       return NextResponse.json(
//         { reply: "AI service temporarily unavailable. Please try later." },
//         { status: res.status }
//       );
//     }

//     const reply = data.choices?.[0]?.message?.content || "No response found.";
//     return NextResponse.json({ reply });
//   } catch (error) {
//     console.error("Server error:", error);
//     return NextResponse.json(
//       { reply: "Unexpected server error occurred." },
//       { status: 500 }
//     );
//   }
// }








import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    console.log("User wrote:", message);


    const offlineReply = `

বর্তমানে "Mini Apps Hub (MAH)"-এর AI সেবা (OpenAI Integration) আপাতত স্থগিত রয়েছে। 
এই ফিচারটি চালু করতে ডেভেলপার (Sameul Islam - Owner of MAH) বিলিং সম্পন্ন করলে এটি আবার সক্রিয় হবে। 
আপনি Firebase লাইভ চ্যাট বা "History" সেকশন ব্যবহার করে পূর্বের প্রশ্ন-উত্তর দেখতে বা সমস্যার সমাধান খুঁজতে পারেন। 
দুঃখিত, AI Assistant এখন আপনার প্রশ্নের উত্তর দিতে পারবে না। 
-------------------
-------------------
-------------------

Currently, the AI service of "Mini Apps Hub (MAH)" (OpenAI Integration) is temporarily suspended. 
The feature will be reactivated once the developer (Sameul Islam - Owner of MAH) completes the billing. 
Meanwhile, you can use Firebase live chat or check the "History" section to see previous Q&A. 
We apologize, AI Assistant cannot respond to your questions at the moment.
`;

    return NextResponse.json({ reply: offlineReply }, { status: 200 });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { reply: "Unexpected server error occurred." },
      { status: 500 }
    );
  }
}
