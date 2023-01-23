cd D:\1drive\OneDrive\Computers\rbbmgmt01\node\ftpCameras\src
ts-node main.ts

# ==========
# ROBOCOPY --- camera_rbb_xxx
# ==========

$folders = Get-Content -Raw -Path C:/ftp/ts-node-list.json | ConvertFrom-Json

foreach ($folder in $folders){
    # Write-Host " folder: $($folder)  --------------------"

    $SourceFolder = "C:\ftp\$($folder)"
    $DestinationFolder = "D:\1drive\OneDrive\webCameras_rbb\$($folder)"
    $Logfile = "C:\roboCopyLogs\camera_rbb_-$($folder).log"

    Robocopy $SourceFolder $DestinationFolder /LOG:$Logfile /MIR /XA:SH /XJD /R:5 /W:15 /MT:128 /V /NP

}
