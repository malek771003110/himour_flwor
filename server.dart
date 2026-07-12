import 'dart:io';

Future<void> main() async {
  var server = await HttpServer.bind(InternetAddress.anyIPv4, 8000);
  print('Listening on http://localhost:8000');

  await for (HttpRequest request in server) {
    String path = request.uri.path == '/' ? '/index.html' : request.uri.path;
    File file = File('.' + path);
    if (await file.exists()) {
      var contentType = ContentType.html;
      if (path.endsWith('.css')) contentType = ContentType('text', 'css');
      else if (path.endsWith('.js')) contentType = ContentType('application', 'javascript');
      else if (path.endsWith('.json')) contentType = ContentType('application', 'json');
      else if (path.endsWith('.png')) contentType = ContentType('image', 'png');
      else if (path.endsWith('.jpg') || path.endsWith('.jpeg')) contentType = ContentType('image', 'jpeg');
      else if (path.endsWith('.svg')) contentType = ContentType('image', 'svg+xml');
      
      request.response.headers.contentType = contentType;
      try {
        await file.openRead().pipe(request.response);
      } catch (e) {
        request.response.close();
      }
    } else {
      request.response.statusCode = HttpStatus.notFound;
      request.response.close();
    }
  }
}
