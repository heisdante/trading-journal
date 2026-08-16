param([Parameter(ValueFromRemainingArguments = $true)][string[]]$Arguments)

& "$PSScriptRoot\..\.venv\Scripts\python.exe" @Arguments
exit $LASTEXITCODE
