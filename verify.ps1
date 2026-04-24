Write-Host "=== FINAL VERIFICATION ===" -ForegroundColor Cyan

$check1 = Get-ChildItem -Path app/api -Filter *.ts -Recurse | Select-String "from 'openai'" | Measure-Object | Select-Object -ExpandProperty Count
Write-Host "openai imports: $check1"

$check2 = Get-ChildItem -Path app/api -Filter *.ts -Recurse | Select-String "from 'replicate'" | Measure-Object | Select-Object -ExpandProperty Count
Write-Host "replicate imports: $check2"

$check3 = Get-ChildItem -Path app/api -Filter *.ts -Recurse | Select-String "from '@google/generative-ai'" | Measure-Object | Select-Object -ExpandProperty Count
Write-Host "google-generative-ai imports: $check3"

$check4 = Get-ChildItem -Path app,components,lib -Include *.ts,*.tsx -Recurse | Select-String "console\.log" | Where-Object { $_.Line -notmatch "//" } | Measure-Object | Select-Object -ExpandProperty Count
Write-Host "console.log instances: $check4"

$check5 = Get-ChildItem -Path app,components,lib -Include *.ts,*.tsx -Recurse | Select-String ": any" | Where-Object { $_.Line -notmatch "//" } | Measure-Object | Select-Object -ExpandProperty Count
Write-Host "':any' types: $check5"

if ($check1 -eq 0 -and $check2 -eq 0 -and $check3 -eq 0 -and $check4 -eq 0 -and $check5 -eq 0) {
  Write-Host "ALL CHECKS PASSED" -ForegroundColor Green
} else {
  Write-Host "SOME CHECKS FAILED - FIX BEFORE PROCEEDING" -ForegroundColor Red
}
