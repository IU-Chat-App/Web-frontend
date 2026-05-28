$urls = @(
  'http://localhost:5173/',
  'http://localhost:5173/admin',
  'http://localhost:5173/admin/login',
  'http://localhost:5173/admin/dashboard',
  'http://localhost:5173/admin/users',
  'http://localhost:5173/admin/reports',
  'http://localhost:5173/admin/settings',
  'http://localhost:5173/admin/analytics',
  'http://localhost:5173/admin/broadcast'
)
foreach ($u in $urls) {
  try {
    $r = Invoke-WebRequest -Uri $u -UseBasicParsing -TimeoutSec 5
    $hasRoot = if ($r.Content -match 'id="root"') { 'root=yes' } else { 'root=NO' }
    Write-Host ('{0,3}  {1,-50}  {2}' -f $r.StatusCode, $u, $hasRoot)
  } catch {
    Write-Host ('ERR  {0,-50}  {1}' -f $u, $_.Exception.Message)
  }
}
