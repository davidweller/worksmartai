import{h as m,a as n,r as g}from"./academy.DhAEdgxf.js";const o=document.getElementById("academy-course-grid"),d=document.getElementById("academy-dashboard-feedback"),c=document.getElementById("academy-signout-button");if(!o)throw new Error("Academy course grid not found");const b=JSON.parse(o.getAttribute("data-courses")||"[]"),u=(r,e=!0)=>{d&&(d.textContent=r,d.className=e?"mt-6 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800":"mt-6 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800")},l=(r={})=>{const e=b.map(t=>{const s=Number(r[t.id]??0),a=Number.isFinite(s)?Math.max(0,Math.min(100,Math.round(s))):0;return`
        <article class="rounded-2xl border border-default bg-card p-6 shadow-card">
          <h2 class="font-heading text-xl font-bold text-heading">${t.title}</h2>
          <p class="mt-2 text-sm leading-relaxed text-muted">${t.summary}</p>
          <div class="mt-5">
            <div class="mb-1.5 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-muted">
              <span>Progress</span>
              <span>${a}%</span>
            </div>
            <div class="h-2 rounded-full bg-slate-200">
              <div class="h-full rounded-full bg-accent transition-all" style="width: ${a}%"></div>
            </div>
          </div>
          <a
            href="/academy/view/${t.id}/"
            class="mt-6 inline-flex items-center justify-center rounded-full border-2 border-brand bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:border-accent hover:bg-accent"
          >
            Continue course
          </a>
        </article>
      `});o.innerHTML=e.join("")};l();if(!m||!n)u("Dashboard is unavailable. Missing Supabase configuration.");else{const e=(await g("/academy/login/"))?.user;if(e){const{data:t,error:s}=await n.from("progress").select("course_id, progress_percent").eq("user_id",e.id);if(s)u("We could not load your progress yet. Please refresh and try again.");else{const a=Object.fromEntries((t||[]).map(i=>[String(i.course_id),Number(i.progress_percent||0)]));l(a)}c&&c.addEventListener("click",async()=>{await n.auth.signOut(),window.location.replace("/academy/login/")})}}
