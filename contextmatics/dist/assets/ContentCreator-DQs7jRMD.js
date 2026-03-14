import{u as I,c as S,b as T,a as P,r as o,j as e}from"./index-D8_tuuOX.js";import{G as $}from"./index-BpRkNtKl.js";import{P as A}from"./PageLayout-CLm9ofE1.js";import"./Footer-BiF5-9vX.js";const v="AIzaSyBjFpNWVutA6WspQYyfKdQiBUDBtzAEJ2M",E=new $(v),G=t=>new Promise(r=>setTimeout(r,t)),M=async(t,r)=>{if(v.includes("dummy"))switch(console.debug("[Demo] Generating mock content for",r),await G(2e3),r){case"Blog Post":return`[DEMO] 🚀 **Unlocking Potentials: A Deep Dive into Your Content**

## Introduction
In today's fast-paced world, the ${t.substring(0,20)}... is more relevant than ever. This post explores the key insights derived from the source material and how they apply to modern contexts.

## Key Takeaways
1. **Innovation is Key**: The core message highlights the importance of staying ahead.
2. **Strategic Thinking**: leveraging ${t.substring(0,10)}... can lead to better outcomes.

## Conclusion
By embracing these principles, we can achieve significant growth. Remember, it's not just about ideas, but execution.

*Generated in Demo Mode using ContextMatic*`;case"Twitter Thread":return`1/8 🧵 Dive into the world of ${t.substring(0,15)}... 👇

2/8 💡 The main point here is that innovation drives progress. #Tech #Growth

3/8 🚀 we often overlook the simple things. ${t.substring(0,20)}...

4/8 📈 Data shows that consistency is key.

5/8 ✨ "Success is a journey, not a destination."

6/8 🛠️ Actionable tip: Start small, dream big.

7/8 🤝 Share this if you found it useful!

8/8 🔗 Read more at our website. #ContextMatic [Demo]`;case"Email Newsletter":return`Subject: 🌟 Insights on ${t.substring(0,15)}... You Can't Miss!

Hi there,

We hope this week treats you well. We stumbled upon some interesting thoughts about ${t.substring(0,20)}... and wanted to share them with you.

**The Big Idea**
${t}

**Why It Matters**
Understanding this can change how you approach your daily tasks.

[CTA] 👉 Click here to learn more: [Link]

Best,
The ContextMatic Team
(Demo Mode)`;case"LinkedIn Post":return`🚀 **Thought Leadership Alert**

I've been thinking a lot about ${t.substring(0,20)}... lately.

It's fascinating how ${t} intersects with our daily professional lives.

Here are 3 things to consider:
1️⃣ Perspective shifts are necessary.
2️⃣ Agile methodology applies everywhere.
3️⃣ Community feedback is gold.

What are your thoughts? Drop a comment below! 👇

#Innovation #Growth #ContextMatic #Demo`;case"Summary":return`**Summary of Content**

- The main topic discusses the ${t.substring(0,40)}...
- Key argument presented is that leveraging AI for automation is crucial for modern efficiency.
- Conclusion suggests actionable steps for immediate implementation.

*Summarized by ContextMatic AI*`;default:return`[DEMO] Repurposed content into ${r}:

${t}

(This is a placeholder response for Demo Mode)`}try{const l=E.getGenerativeModel({model:"gemini-2.0-flash"});let a="";switch(r){case"Blog Post":a=`Repurpose the following content into a comprehensive blog post. Use a professional yet engaging tone. Structure it with a catchy title, introduction, main body with headings, and a conclusion.

Content:
${t}`;break;case"Twitter Thread":a=`Repurpose the following content into a viral Twitter (X) thread. Create 5-10 tweets. Number them (e.g., 1/8). Start with a strong hook. Use emojis where appropriate.

Content:
${t}`;break;case"Email Newsletter":a=`Repurpose the following content into an engaging email newsletter. Include a subject line, a warm greeting, the main value proposition, and a call to action.

Content:
${t}`;break;case"LinkedIn Post":a=`Repurpose the following content into a professional LinkedIn post. Focus on thought leadership and industry insights. Use appropriate hashtags and spacing for readability.

Content:
${t}`;break;case"Summary":a=`Provide a concise summary of the following content. Capture the key points and main takeaways in bullet points.

Content:
${t}`;break;default:a=`Repurpose the following content into ${r}:

${t}`}return(await(await l.generateContent(a)).response).text()}catch(l){throw console.error("Error generating content:",l),new Error("AI Content Generation failed. Please check your API key or try again later.")}},D=[{value:"summary",label:"Concise Summary"},{value:"tweet_thread",label:"Twitter (X) Thread"},{value:"blog_post",label:"Blog Post"},{value:"linkedin_post",label:"LinkedIn Post"},{value:"email_newsletter",label:"Email Newsletter"}],z=({onGenerate:t})=>{const{user:r,decrementCredits:l}=I(),{addToHistory:a}=S(),{showToast:c}=T(),h=P(),[n,m]=o.useState(""),[i,j]=o.useState("Summary"),[p,g]=o.useState(!1),[d,x]=o.useState(""),[u,k]=o.useState(!1),[b,y]=o.useState("");o.useEffect(()=>{const s=sessionStorage.getItem("template_prompt"),N=sessionStorage.getItem("template_name");s&&(m(s),y(N||""),sessionStorage.removeItem("template_prompt"),sessionStorage.removeItem("template_name"))},[]);const f=async()=>{if(!n.trim()){c("Please enter some content to repurpose","warning");return}if(!r||r.processingCredits<=0){c("No credits remaining! Please upgrade your plan.","error"),h("/pricing");return}g(!0),x("");try{const s=await M(n,i);x(s),l(),a({title:`${i} of Content`,format:i,content:s,status:"success",icon:w(i)}),t&&t(s,i)}catch(s){console.error(s),c("Failed to generate content. Check your API key and try again.","error")}finally{g(!1)}},w=s=>{switch(s){case"Blog Post":return"📝";case"Twitter Thread":return"🐦";case"Email Newsletter":return"📧";case"LinkedIn Post":return"💼";case"Summary":return"📊";default:return"📄"}},C=()=>{navigator.clipboard.writeText(d),c("Copied to clipboard!","success")};return e.jsx(A,{showPricing:!0,showSettings:!0,children:e.jsxs("div",{className:"container mx-auto px-6 py-12",children:[e.jsxs("div",{className:"mb-12 text-center",children:[e.jsx("h1",{className:"text-4xl font-bold mb-4 tracking-tight text-white",children:"Create Content"}),e.jsx("p",{className:"text-lg text-text-secondary max-w-2xl mx-auto",children:"Transform your ideas into engaging posts, threads, and emails in seconds."}),b&&e.jsxs("div",{className:"mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-sm text-blue-400",children:[e.jsx("span",{children:"📚"})," Using template: ",e.jsx("strong",{children:b}),e.jsx("button",{onClick:()=>{y(""),m("")},className:"ml-2 text-blue-300 hover:text-white",children:"✕"})]})]}),e.jsxs("div",{className:`grid gap-8 ${d?"grid-cols-1 lg:grid-cols-2":"grid-cols-1 max-w-4xl mx-auto"}`,children:[e.jsxs("div",{className:"card p-8 bg-background-surface/50 border border-white/5",children:[e.jsxs("div",{className:"mb-10",children:[e.jsx("label",{className:"text-sm font-medium text-text-secondary uppercase tracking-wider mb-3 block",children:"Source Content"}),e.jsxs("div",{className:"relative",children:[e.jsx("textarea",{value:n,onChange:s=>m(s.target.value),placeholder:"Paste your content here... (blog post, article, notes, etc.)",className:"input w-full h-64 py-4 leading-relaxed resize-none transition-colors font-mono text-sm bg-black/20 focus:bg-black/40 text-text-primary placeholder-text-muted border border-white/10 rounded-xl p-4 focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary/50 outline-none"}),e.jsxs("div",{className:"absolute bottom-4 right-4 text-xs text-text-muted font-mono",children:[n.length," chars"]})]}),n.length>0&&e.jsx("div",{className:"flex justify-end mt-2",children:e.jsx("button",{onClick:()=>m(""),className:"text-xs text-red-400 hover:text-red-300 transition-colors",children:"Clear Input"})})]}),e.jsxs("div",{className:"mb-10",children:[e.jsx("label",{className:"text-sm font-medium text-text-secondary uppercase tracking-wider mb-3 block",children:"Output Format"}),e.jsx("div",{className:"grid grid-cols-2 md:grid-cols-3 gap-3",children:D.map(s=>e.jsxs("button",{onClick:()=>j(s.value),className:`px-4 py-3 rounded-lg border text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${i===s.value?"border-brand-primary/50 bg-brand-primary/10 text-white shadow-[0_0_15px_rgba(59,130,246,0.15)]":"border-white/5 bg-white/5 text-text-muted hover:bg-white/10 hover:text-text-primary"}`,children:[e.jsx("span",{children:w(s.value)}),s.label]},s.value))})]}),e.jsx("button",{onClick:f,disabled:p||!n.trim(),className:`btn w-full py-4 text-base font-semibold tracking-wide justify-center ${p||!n.trim()?"btn-secondary opacity-50 cursor-not-allowed":"btn-primary shadow-lg hover:shadow-brand-primary/20"}`,children:p?e.jsxs("span",{className:"flex items-center justify-center gap-3",children:[e.jsxs("svg",{className:"animate-spin h-5 w-5",viewBox:"0 0 24 24",children:[e.jsx("circle",{className:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4",fill:"none"}),e.jsx("path",{className:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"})]}),"Processing..."]}):"Generate Content ✨"})]}),d&&e.jsxs("div",{className:"card p-8 bg-background-surface/50 border border-white/5 flex flex-col h-full animate-fade-in-up",children:[e.jsxs("div",{className:"flex justify-between items-center mb-6",children:[e.jsx("label",{className:"text-sm font-medium text-text-secondary uppercase tracking-wider",children:"Generated Output"}),e.jsxs("div",{className:"flex gap-2",children:[e.jsx("button",{onClick:()=>k(!u),className:`btn py-1.5 px-3 text-xs transition-all ${u?"bg-blue-500/20 text-blue-400 border-blue-500/30":"btn-secondary"}`,children:u?"✕ Close Compare":"⇆ Compare"}),e.jsx("button",{onClick:C,className:"btn btn-secondary py-1.5 px-3 text-xs",children:"Copy"})]})]}),u?e.jsxs("div",{className:"grid grid-cols-2 gap-4 flex-1",children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-xs text-text-muted uppercase tracking-wider mb-2 font-medium",children:"Original Input"}),e.jsx("textarea",{readOnly:!0,value:n,className:"input w-full min-h-[350px] bg-black/30 resize-none leading-relaxed font-mono text-sm p-4 rounded-xl border border-white/10 text-text-secondary"})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-xs text-blue-400 uppercase tracking-wider mb-2 font-medium",children:"Generated Output"}),e.jsx("textarea",{readOnly:!0,value:d,className:"input w-full min-h-[350px] bg-black/30 resize-none leading-relaxed font-mono text-sm p-4 rounded-xl border border-blue-500/20 text-text-primary"})]})]}):e.jsx("div",{className:"relative flex-1",children:e.jsx("textarea",{readOnly:!0,value:d,className:"input w-full h-full min-h-[400px] bg-black/30 resize-none leading-relaxed font-mono text-sm p-6 rounded-xl border-dashed border-2 border-white/10 focus:border-brand-primary/30 transition-colors text-text-primary"})}),e.jsxs("div",{className:"flex gap-4 mt-6 pt-6 border-t border-white/5",children:[e.jsx("button",{onClick:()=>h("/history"),className:"btn btn-secondary flex-1",children:"View History"}),e.jsx("button",{onClick:f,className:"btn btn-primary flex-1 bg-white/5 hover:bg-white/10 border-white/10",children:"Regenerate"})]})]})]})]})})};export{z as default};
