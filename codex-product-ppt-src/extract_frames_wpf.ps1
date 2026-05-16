$ErrorActionPreference='Stop'
Add-Type -AssemblyName PresentationCore,WindowsBase
$video=(Resolve-Path 'codex-product-ppt-src\merge1.mp4').Path
$outDir=(Resolve-Path 'codex-product-ppt-src').Path + '\frames-wpf'
New-Item -ItemType Directory -Force -Path $outDir | Out-Null
$player=New-Object System.Windows.Media.MediaPlayer
$script:done=$false
$script:failed=$false
$player.add_MediaOpened({ $script:done=$true })
$player.add_MediaFailed({ $script:failed=$true })
$player.Open([Uri]$video)
$sw=[Diagnostics.Stopwatch]::StartNew()
while(-not $script:done -and -not $script:failed -and $sw.Elapsed.TotalSeconds -lt 20){ Start-Sleep -Milliseconds 100 }
if($script:failed){ throw 'Media open failed' }
if(-not $script:done){ throw 'Media open timeout' }
$duration=$player.NaturalDuration.TimeSpan.TotalSeconds
$width=$player.NaturalVideoWidth
$height=$player.NaturalVideoHeight
$times=@(0.5,$duration*0.12,$duration*0.25,$duration*0.38,$duration*0.5,$duration*0.63,$duration*0.76,$duration*0.9)
for($i=0;$i -lt $times.Count;$i++){
  $player.Position=[TimeSpan]::FromSeconds([Math]::Max(0.1,[Math]::Min($duration-0.2,$times[$i])))
  Start-Sleep -Milliseconds 900
  $dv=New-Object System.Windows.Media.DrawingVisual
  $dc=$dv.RenderOpen()
  $rect=New-Object System.Windows.Rect(0,0,$width,$height)
  $vd=New-Object System.Windows.Media.VideoDrawing
  $vd.Player=$player
  $vd.Rect=$rect
  $dc.DrawDrawing($vd)
  $dc.Close()
  $bmp=New-Object System.Windows.Media.Imaging.RenderTargetBitmap($width,$height,96,96,[System.Windows.Media.PixelFormats]::Pbgra32)
  $bmp.Render($dv)
  $enc=New-Object System.Windows.Media.Imaging.PngBitmapEncoder
  $enc.Frames.Add([System.Windows.Media.Imaging.BitmapFrame]::Create($bmp))
  $fs=[IO.File]::Open((Join-Path $outDir ('frame-{0:D2}.png' -f ($i+1))), [IO.FileMode]::Create)
  $enc.Save($fs)
  $fs.Close()
}
$player.Close()
[PSCustomObject]@{Duration=$duration; Width=$width; Height=$height; OutDir=$outDir} | Format-List
