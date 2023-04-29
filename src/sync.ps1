param($listpath='__none__', $srcbase='__none__', $destbase='__none__') 

$folders = Get-Content -Raw -Path $listpath | ConvertFrom-Json

foreach ($folder in $folders){
    Write-Host "========== $($folder) =========="

    $SourceFolder = "$($srcbase)\$($folder)"
    $DestinationFolder = "$($destbase)\$($folder)"
    # $Logfile = "$($destbase)\roboCopyLogs\camera_rbb-$($folder).log"

    # Write-Host " SourceFolder---: $($SourceFolder)  -----"
    # Write-Host " DestinationFolder---: $($DestinationFolder)  --"
    # Write-Host " Logfile---: $($Logfile)  --"

    # Robocopy $SourceFolder $DestinationFolder /LOG:$Logfile /MIR /XA:SH /XJD /R:5 /W:15 /MT:128 /V /NP
    Robocopy $SourceFolder $DestinationFolder /MIR /XA:SH /XJD /R:5 /W:15 /MT:128 /V /NP

}