(function() {
    function mountWSAI(rootId, CONFIG) {
        const root = document.getElementById(rootId);
        if (!root) return;

        const html = `
      <div class="wsai-sav">
        <div class="wsai-grid">
          <div class="wsai-panel">
            <h2 class="wsai-h">Calculate your savings</h2>
            <p class="wsai-sub">Directional estimate based on independent studies; adjust to match your context.</p>

            <h3 class="wsai-step-h">Step 1: Enter your staffing details:</h3>
            <div id="${rootId}-simple-controls">
              <div class="wsai-field">
                <div class="wsai-label"><span>Number of employees</span><span id="${rootId}-staff-val"></span></div>
                <input id="${rootId}-staff" class="wsai-range" type="range" min="${CONFIG.sliders.staff[0]}" max="${CONFIG.sliders.staff[1]}" step="5" value="${CONFIG.sliders.staff[2]}">
              </div>
              <div class="wsai-field">
                <div class="wsai-label"><span>Average annual salary</span><span id="${rootId}-salary-val"></span></div>
                <input id="${rootId}-salary" class="wsai-range" type="range" min="${CONFIG.sliders.salary[0]}" max="${CONFIG.sliders.salary[1]}" step="1000" value="${CONFIG.sliders.salary[2]}">
              </div>
            </div>

            <h3 class="wsai-step-h">Step 2: Choose your target adoption level</h3>
            <div class="wsai-field">
              <p class="wsai-explainer">'Adoption' means how many of your staff you want to be actively using AI, and how effectively. <a href="https://worksmart-ai.co.uk/how-our-calculator-works/" target="_blank" rel="noopener">Read more about this.</a></p>
              <div class="wsai-adopt wsai-adopt-row" role="group" aria-label="Adoption level">
                <button class="wsai-chip" data-adopt="beginner">Early Stage<small>Some staff are exploring AI for basic tasks. Use is limited.</small></button>
                <button class="wsai-chip" data-adopt="intermediate">Scaling Up<small>Most staff are growing in confidence and understanding of AI.</small></button>
                <button class="wsai-chip" data-adopt="advanced">Mature Adoption<small>Almost all staff are capable and confident with AI workflows.</small></button>
              </div>
            </div>

            <h3 class="wsai-step-h">Step 3 (Optional): Advanced settings</h3>
            <p class="wsai-step-explainer">Break down your staffing roles and numbers for higher accuracy.</p>
            <details class="wsai-advanced-details">
              <summary class="wsai-advanced-summary">Advanced breakdown by staff roles</summary>
              <div class="wsai-advanced-grid">
                <div class="wsai-advanced-col">
                  <h3 class="wsai-col-h">Academic staff</h3>
                  <div class="wsai-field wsai-field-adv">
                    <label class="wsai-label-adv" for="${rootId}-adv-edu">Educators</label>
                    <input type="number" data-role-key="edu" id="${rootId}-adv-edu" class="wsai-input-adv" placeholder="0" min="0">
                  </div>
                  <div class="wsai-field wsai-field-adv">
                    <label class="wsai-label-adv" for="${rootId}-adv-res">Researchers</label>
                    <input type="number" data-role-key="res" id="${rootId}-adv-res" class="wsai-input-adv" placeholder="0" min="0">
                  </div>
                   <div class="wsai-field wsai-field-adv">
                    <label class="wsai-label-adv" for="${rootId}-adv-eduRes">Educator-Researchers</label>
                    <input type="number" data-role-key="eduRes" id="${rootId}-adv-eduRes" class="wsai-input-adv" placeholder="0" min="0">
                  </div>
                </div>
                <div class="wsai-advanced-col">
                  <h3 class="wsai-col-h">Professional services</h3>
                  <div class="wsai-field wsai-field-adv">
                    <label class="wsai-label-adv" for="${rootId}-adv-stu">Student Services / HR / Registry</label>
                    <input type="number" data-role-key="stu" id="${rootId}-adv-stu" class="wsai-input-adv" placeholder="0" min="0">
                  </div>
                  <div class="wsai-field wsai-field-adv">
                    <label class="wsai-label-adv" for="${rootId}-adv-lib">Library & Learning Resources</label>
                    <input type="number" data-role-key="lib" id="${rootId}-adv-lib" class="wsai-input-adv" placeholder="0" min="0">
                  </div>
                  <div class="wsai-field wsai-field-adv">
                    <label class="wsai-label-adv" for="${rootId}-adv-fin">Finance</label>
                    <input type="number" data-role-key="fin" id="${rootId}-adv-fin" class="wsai-input-adv" placeholder="0" min="0">
                  </div>
                  <div class="wsai-field wsai-field-adv">
                    <label class="wsai-label-adv" for="${rootId}-adv-it">IT Services</label>
                    <input type="number" data-role-key="it" id="${rootId}-adv-it" class="wsai-input-adv" placeholder="0" min="0">
                  </div>
                  <div class="wsai-field wsai-field-adv">
                    <label class="wsai-label-adv" for="${rootId}-adv-mar">Marketing & Comms</label>
                    <input type="number" data-role-key="mar" id="${rootId}-adv-mar" class="wsai-input-adv" placeholder="0" min="0">
                  </div>
                  <div class="wsai-field wsai-field-adv">
                    <label class="wsai-label-adv" for="${rootId}-adv-est">Estates / Facilities</label>
                    <input type="number" data-role-key="est" id="${rootId}-adv-est" class="wsai-input-adv" placeholder="0" min="0">
                  </div>
                  <div class="wsai-field wsai-field-adv">
                    <label class="wsai-label-adv" for="${rootId}-adv-oth">Other Admin</label>
                    <input type="number" data-role-key="oth" id="${rootId}-adv-oth" class="wsai-input-adv" placeholder="0" min="0">
                  </div>
                </div>
              </div>
            </details>

            </div>

          <div class="wsai-panel" id="${rootId}-results-panel">
            <h2 class="wsai-h">Your potential savings</h2>
            <div class="wsai-kpis">
              <div class="wsai-card">
                <div class="wsai-kh">Annual cost savings</div>
                <div class="wsai-kv green" id="${rootId}-k-savings">—</div>
                <div class="wsai-kfoot" id="${rootId}-k-sublabel">Based on efficiency and adoption</div>
              </div>
              <div class="wsai-card">
                <div class="wsai-kh">Productivity increase</div>
                <div class="wsai-kv" id="${rootId}-k-prod">—</div>
                <div class="wsai-kfoot">Average across all entered staff</div>
              </div>
              <div class="wsai-card">
                <div class="wsai-kh">Capacity created (FTEs)</div>
                <div class="wsai-kv" id="${rootId}-k-fte">—</div>
                <div class="wsai-kfoot" id="${rootId}-k-fte-foot">Equivalent full-time roles of capacity</div>
              </div>
              <div class="wsai-card" id="${rootId}-proj-card" style="display:none;">
                <div class="wsai-kh">5-year projection</div>
                <div class="wsai-kv" id="${rootId}-k-proj">—</div>
                <div class="wsai-kfoot">Total projected savings over 5 years</div>
              </div>
            </div>

            <div class="wsai-notes-section" style="margin-top: 24px;">
              <h3 class="wsai-step-h" style="text-align: left; margin-bottom: 12px;">Notes</h3>
              <p style="text-align: left; font-size: 14px; margin-bottom: 10px; line-height: 1.5;">
                Figures are directional, not definitive. They illustrate potential benefit if AI is adopted effectively, supported by training and governance.
              </p>
              <p class="wsai-methodology-link" style="text-align: left; margin-top: 0;">
                Curious about our methodology? <a href="https://worksmart-ai.co.uk/how-our-calculator-works/" target="_blank" rel="noopener">Read how this calculator works</a>.
              </p>
            </div>
            </div>
        </div>
      </div>
    `;
        root.innerHTML = html;

        const nfMoney = (n) => new Intl.NumberFormat(CONFIG.locale, { style: 'currency', currency: CONFIG.currency, maximumFractionDigits: 0 }).format(n || 0);
        const nf = (n) => new Intl.NumberFormat(CONFIG.locale, { maximumFractionDigits: 0 }).format(n || 0);
        const pct = (x) => ((x || 0) * 100).toFixed(0) + '%';
        const $ = (sel) => root.querySelector(sel);

        const staffEl = $(`#${rootId}-staff`);
        const salaryEl = $(`#${rootId}-salary`);
        const simpleControlsEl = $(`#${rootId}-simple-controls`);
        const advancedInputs = root.querySelectorAll('[data-role-key]');
        
        const updateSliderFill = (el) => {
            const percent = (el.value - el.min) / (el.max - el.min) * 100;
            el.style.setProperty('--fill-percent', `${percent}%`);
        };

        const updateLabels = () => {
            $(`#${rootId}-staff-val`).textContent = nf(staffEl.value);
            $(`#${rootId}-salary-val`).textContent = nfMoney(salaryEl.value);
            updateSliderFill(staffEl);
            // This is where the bad text was! I have removed it.
            updateSliderFill(salaryEl);
        };

        function compute() {
            const salary = parseFloat(salaryEl.value);
            const loadedAnnual = salary * CONFIG.onCost;
            const adoptionKey = root.querySelector('[data-adopt][aria-pressed="true"]')?.dataset.adopt || CONFIG.adoption.init;
            const adoptionRate = CONFIG.adoption[adoptionKey];
            const uplift = CONFIG.uplift[adoptionKey];

            let totalStaff = 0;
            let annualSavings = 0;
            let weightedProdSum = 0;

            const advancedStaffTotal = Array.from(advancedInputs).reduce((sum, input) => sum + (parseInt(input.value, 10) || 0), 0);

            if (advancedStaffTotal > 0) {
                // --- ADVANCED MODE CALCULATION ---
                simpleControlsEl.setAttribute('disabled', 'true');
                totalStaff = advancedStaffTotal;

                advancedInputs.forEach(input => {
                    const headcount = parseInt(input.value, 10) || 0;
                    if (headcount > 0) {
                        const roleKey = input.dataset.roleKey;
                        const eligibleShare = CONFIG.eligibleByRole[roleKey] || 0;
                        const prodFraction = eligibleShare * adoptionRate * uplift;
                        
                        annualSavings += headcount * loadedAnnual * prodFraction;
                        weightedProdSum += headcount * prodFraction;
                    }
                });
            } else {
                // --- SIMPLE MODE CALCULATION ---
                simpleControlsEl.removeAttribute('disabled');
                totalStaff = parseInt(staffEl.value, 10);
                const eligibleShare = CONFIG.eligibleByIndustry[CONFIG.eligibleByIndustry.init];
                const prodFraction = eligibleShare * adoptionRate * uplift;

                annualSavings = totalStaff * loadedAnnual * prodFraction;
                weightedProdSum = totalStaff * prodFraction;
            }
            
            const overallProdFraction = totalStaff > 0 ? weightedProdSum / totalStaff : 0;
            const ftes = weightedProdSum;
            
            let proj = 0;
            if (CONFIG.projection?.show) {
                const g = CONFIG.projection.growthRate || 0;
                let mult = 0, pow = 1;
                for (let i = 0; i < 5; i++) { mult += pow; pow *= (1 + g); }
                proj = annualSavings * mult;
            }

            $(`#${rootId}-k-savings`).textContent = nfMoney(annualSavings);
            $(`#${rootId}-k-sublabel`).textContent = `Based on ${pct(uplift)} efficiency @ ${pct(adoptionRate)} adoption`;
            $(`#${rootId}-k-prod`).textContent = pct(overallProdFraction);
            $(`#${rootId}-k-fte`).textContent = ftes.toFixed(1);
            $(`#${rootId}-k-fte-foot`).innerHTML = `Equivalent full-time roles of capacity<br><small>Assumes 1 FTE = 37.5 hrs/week.</small>`;
            
            const projCard = $(`#${rootId}-proj-card`);
            if (CONFIG.projection?.show) {
                projCard.style.display = 'block';
                $(`#${rootId}-k-proj`).textContent = nfMoney(proj);
            } else {
                projCard.style.display = 'none';
            }
        }

        root.querySelectorAll('[data-adopt]').forEach(b => {
            b.addEventListener('click', (e) => {
                root.querySelectorAll('[data-adopt]').forEach(x => x.setAttribute('aria-pressed', 'false'));
                e.currentTarget.setAttribute('aria-pressed', 'true');
                compute();
            });
        });

        [staffEl, salaryEl].forEach(el => el.addEventListener('input', () => {
            updateLabels();
            compute();
        }));

        advancedInputs.forEach(input => {
            input.addEventListener('input', compute);
        });

        const initAdoptionBtn = root.querySelector(`[data-adopt="${CONFIG.adoption.init}"]`);
        if (initAdoptionBtn) {
            initAdoptionBtn.setAttribute('aria-pressed', 'true');
        } else {
            root.querySelector('[data-adopt="intermediate"]').setAttribute('aria-pressed', 'true');
        }
        updateLabels();
        compute();
    }

    document.addEventListener('DOMContentLoaded', function() {
        if (!window.WSAI_SAVINGS_CONFIGS) return;
        for (const id in window.WSAI_SAVINGS_CONFIGS) {
            if (Object.prototype.hasOwnProperty.call(window.WSAI_SAVINGS_CONFIGS, id)) {
                mountWSAI(id, window.WSAI_SAVINGS_CONFIGS[id]);
            }
        }
    });
})();