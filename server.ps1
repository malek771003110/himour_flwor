$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:8000/")
$listener.Start()
Write-Host "Listening on http://localhost:8000/"

while ($listener.IsListening) {
    $context = $listener.GetContext()
    $request = $context.Request
    $response = $context.Response
    
    $path = $request.Url.LocalPath
    if ($path -eq "/") { $path = "/index.html" }
    
    # decode URL encoding like %20
    $path = [System.Uri]::UnescapeDataString($path)
    
    $filePath = Join-Path (Get-Location).Path $path
    
    if (Test-Path $filePath -PathType Leaf) {
        if ($path -match "\.css$") { $response.ContentType = "text/css" }
        elseif ($path -match "\.js$") { $response.ContentType = "application/javascript" }
        elseif ($path -match "\.png$") { $response.ContentType = "image/png" }
        elseif ($path -match "\.jpg$|\.jpeg$") { $response.ContentType = "image/jpeg" }
        elseif ($path -match "\.json$") { $response.ContentType = "application/json" }
        else { $response.ContentType = "text/html" }
        
        $content = [System.IO.File]::ReadAllBytes($filePath)
        $response.ContentLength64 = $content.Length
        $response.OutputStream.Write($content, 0, $content.Length)
    } else {
        $response.StatusCode = 404
    }
    $response.Close()
}
