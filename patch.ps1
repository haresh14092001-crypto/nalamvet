$lines = Get-Content -Path nalamvet_teaching.html -Encoding UTF8
$newLines = @()

for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($i -ge 286 -and $i -le 310) {
        if ($i -eq 286) {
            $newLines += '            <div class="card" style="border-color: rgba(142,68,173,0.4); box-shadow: 0 0 20px rgba(142,68,173,0.15);">'
            $newLines += '                <div class="card-header" style="color:var(--accent);">'
            $newLines += '                    <div style="display:flex; align-items:center; gap:8px;">'
            $newLines += '                        <span>🎓 Faculty Review Queue</span>'
            $newLines += '                        <span style="background:var(--danger); color:#fff; font-size:10px; padding:2px 8px; border-radius:12px;">2 Pending</span>'
            $newLines += '                    </div>'
            $newLines += '                </div>'
            $newLines += '                <div class="card-body" style="padding:0; display:block;">'
            $newLines += '                    <table style="width:100%; text-align:left; border-collapse:collapse;">'
            $newLines += '                        <thead>'
            $newLines += '                            <tr>'
            $newLines += '                                <th style="padding:12px 16px; border-bottom:1px solid var(--border); color:var(--muted); font-size:11px;">Case ID</th>'
            $newLines += '                                <th style="padding:12px 16px; border-bottom:1px solid var(--border); color:var(--muted); font-size:11px;">Student</th>'
            $newLines += '                                <th style="padding:12px 16px; border-bottom:1px solid var(--border); color:var(--muted); font-size:11px;">Species</th>'
            $newLines += '                                <th style="padding:12px 16px; border-bottom:1px solid var(--border); color:var(--muted); font-size:11px;">Status</th>'
            $newLines += '                                <th style="padding:12px 16px; border-bottom:1px solid var(--border); color:var(--muted); font-size:11px;">Action</th>'
            $newLines += '                            </tr>'
            $newLines += '                        </thead>'
            $newLines += '                        <tbody>'
            $newLines += '                            <tr><td style="padding:12px 16px; border-bottom:1px solid var(--border);">C-2023-081</td><td style="padding:12px 16px; border-bottom:1px solid var(--border);">Ravi K (4th Yr)</td><td style="padding:12px 16px; border-bottom:1px solid var(--border);">Canine</td><td style="padding:12px 16px; border-bottom:1px solid var(--border);"><span style="background:rgba(255,176,32,0.15); color:var(--warn); padding:4px 10px; border-radius:6px; font-size:11px; font-weight:700;">Submitted</span></td><td style="padding:12px 16px; border-bottom:1px solid var(--border);"><button class="btn btn-primary btn-sm" onclick="nav(''teaching'', document.querySelectorAll(''.nav-item'')[4])">Grade Case</button></td></tr>'
            $newLines += '                            <tr><td style="padding:12px 16px; border-bottom:1px solid var(--border);">C-2023-082</td><td style="padding:12px 16px; border-bottom:1px solid var(--border);">Anjali M (Intern)</td><td style="padding:12px 16px; border-bottom:1px solid var(--border);">Feline</td><td style="padding:12px 16px; border-bottom:1px solid var(--border);"><span style="background:rgba(255,176,32,0.15); color:var(--warn); padding:4px 10px; border-radius:6px; font-size:11px; font-weight:700;">Submitted</span></td><td style="padding:12px 16px; border-bottom:1px solid var(--border);"><button class="btn btn-primary btn-sm" onclick="nav(''teaching'', document.querySelectorAll(''.nav-item'')[4])">Grade Case</button></td></tr>'
            $newLines += '                            <tr><td style="padding:12px 16px; border-bottom:none;">C-2023-080</td><td style="padding:12px 16px; border-bottom:none;">Vikram S (3rd Yr)</td><td style="padding:12px 16px; border-bottom:none;">Bovine</td><td style="padding:12px 16px; border-bottom:none;"><span style="background:rgba(0,229,160,0.15); color:#00e5a0; padding:4px 10px; border-radius:6px; font-size:11px; font-weight:700;">Graded</span></td><td style="padding:12px 16px; border-bottom:none;"><button class="btn btn-secondary btn-sm">View</button></td></tr>'
            $newLines += '                        </tbody>'
            $newLines += '                    </table>'
            $newLines += '                </div>'
            $newLines += '            </div>'
        }
    } else {
        $newLines += $lines[$i]
    }
}

$newLines | Set-Content -Path nalamvet_teaching.html -Encoding UTF8
