import{i as e,o as t,t as n}from"./academy.BKyaevXY.js";import{a as r,n as i,r as a,t as o}from"./courses.LQlAxnQs.js";var s=document.getElementById(`academy-dashboard-feedback`),c=document.getElementById(`academy-signout-button`),l=(e,t=!0)=>{s&&(s.textContent=e,s.className=t?`mt-6 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800`:`mt-6 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800`)},u=(e={})=>{document.querySelectorAll(`[data-progress-bar]`).forEach(t=>{if(!(t instanceof HTMLElement))return;let n=t.getAttribute(`data-progress-bar`);if(!n||t.closest(`.hidden`))return;let r=Number(e[n]??0),i=Number.isFinite(r)?Math.max(0,Math.min(100,Math.round(r))):0;document.querySelectorAll(`[data-progress-label="${n}"]`).forEach(e=>{e.textContent=`${i}%`}),t.style.width=`${i}%`})},d=e=>`
    <article class="rounded-xl border border-default bg-page p-5" data-course-id="${a(e.id)}">
      <h4 class="text-base font-semibold text-heading">${a(e.title)}</h4>
      <p class="mt-2 text-sm leading-relaxed text-muted">${a(e.summary)}</p>
      <p class="mt-3 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
        ${a(e.level)}
      </p>
      ${e.is_live?`<div class="mt-5">
              <div class="mb-1.5 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-muted">
                <span>Progress</span>
                <span data-progress-label="${a(e.id)}">0%</span>
              </div>
              <div class="h-2 rounded-full bg-slate-200">
                <div class="h-full rounded-full bg-accent transition-all" style="width: 0%" data-progress-bar="${a(e.id)}"></div>
              </div>
            </div>
            <a
              href="${i(e.id)}"
              class="mt-4 inline-flex items-center justify-center rounded-full border-2 border-brand bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:border-accent hover:bg-accent"
            >
              Continue course
            </a>`:`<p class="mt-5 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700">
              Coming soon
            </p>`}
    </article>`,f=(e,t)=>{let n=document.getElementById(`academy-course-grid`),r=document.getElementById(`academy-empty-enrollments`),i=document.getElementById(`academy-course-intro-label`),s=document.getElementById(`academy-course-intro`),c=e.filter(e=>t.has(e.id)),l=[...o,...new Set(c.map(e=>e.group_name).filter(e=>!o.includes(e)))];n&&(n.innerHTML=l.map(e=>{let t=c.filter(t=>t.group_name===e);return t.length===0?``:`
            <div data-course-group>
              <h3 class="font-heading text-xl font-bold text-heading">${a(e)}</h3>
              <div class="mt-4 grid gap-4 md:grid-cols-2">${t.map(d).join(``)}</div>
            </div>`}).join(``));let u=c.length>0;r?.classList.toggle(`hidden`,u),n?.classList.toggle(`hidden`,!u),i?.classList.toggle(`hidden`,!u),s?.classList.toggle(`hidden`,!u),n?.setAttribute(`aria-busy`,`false`)};if(!e||!n)l(`Dashboard is unavailable. Missing Supabase configuration.`);else{let e=(await t(`/academy/login/`))?.user;if(e){if(e.app_metadata?.role===`admin`){let e=document.getElementById(`academy-admin-link`);e?.classList.remove(`hidden`),e?.classList.add(`inline-flex`)}let{data:t,error:i}=await n.from(`enrollments`).select(`course_id`).eq(`user_id`,e.id),a=null;try{a=await r()}catch{a=null}if(i||!a)l(`We could not load your courses yet. Please refresh and try again.`);else{let r=new Set((t||[]).map(e=>String(e.course_id)).filter(Boolean));f(a,r);let{data:i,error:o}=await n.from(`progress_compat`).select(`course_id, progress_percent`).eq(`user_id`,e.id);o?l(`We could not load your progress yet. Please refresh and try again.`):u(Object.fromEntries((i||[]).map(e=>[String(e.course_id),Number(e.progress_percent||0)])))}c&&c.addEventListener(`click`,async()=>{let e=n;if(!e){l(`Sign out is unavailable right now. Please refresh and try again.`);return}await e.auth.signOut(),window.location.replace(`/academy/login/`)})}}