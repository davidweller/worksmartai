param(
  [string]$SupabaseUrl = $env:PUBLIC_SUPABASE_URL,
  [string]$SupabaseAnonKey = $env:PUBLIC_SUPABASE_ANON_KEY,
  [string]$Name = 'Smoke Test',
  [string]$Email = 'hello@worksmart-ai.co.uk'
)

$ErrorActionPreference = 'Stop'

if (-not $SupabaseUrl -or -not $SupabaseAnonKey) {
  Write-Error "Missing Supabase values. Set PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY (or pass -SupabaseUrl and -SupabaseAnonKey)."
}

$baseUrl = $SupabaseUrl.TrimEnd('/')
$endpoint = "$baseUrl/functions/v1/send-guide-email"

$headers = @{
  "Content-Type"  = "application/json"
  "Authorization" = "Bearer $SupabaseAnonKey"
  "apikey"        = $SupabaseAnonKey
}

$payload = @{
  name  = $Name
  email = $Email
} | ConvertTo-Json -Compress

Write-Host "POST $endpoint"
Write-Host "Payload: $payload"

try {
  $response = Invoke-RestMethod -Method Post -Uri $endpoint -Headers $headers -Body $payload
} catch {
  if ($_.Exception.Response -and $_.Exception.Response.StatusCode) {
    $status = [int]$_.Exception.Response.StatusCode
    Write-Error "Smoke test failed with HTTP status $status."
  }
  throw
}

if ($null -eq $response.ok -or $response.ok -ne $true) {
  Write-Error "Smoke test failed: function did not return ok: true."
}

Write-Host "Smoke test passed. Function returned ok: true."
