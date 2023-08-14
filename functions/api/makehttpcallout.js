/*export async function onRequest({request, env}) {
  return new Response("Hello, world 1234!");
  //console.log('context.Request::', context.Request);
  //const result = await fetch(context.Request.url, context.Request);
  //return new Response(result);
}*/
export async function onRequestPost({ request, env }) {
	let reqBody = await request.json();

    try {
      if( reqBody.selectedBodyType != '' ) {
        var bodyParams = reqBody.bodyParameters;
        if( reqBody.selectedBodyType == 'form-data' ) {
          var formdata = new FormData();
          for (const key in bodyParams) {
            formdata.append(key, bodyParams[key]);
          }
          reqBody.options['body'] = formdata
        } else if( reqBody.selectedBodyType == 'raw' ) {
          reqBody.options['body'] = reqBody.action.RequestInputData.ReqBody.raw.JSON.data;
          //add header of content type
        } else if( reqBody.selectedBodyType == 'x-www-form-urlencoded' ) {
          var urlencoded = new URLSearchParams();
          for (const key in bodyParams) {
            urlencoded.append(key, bodyParams[key]);
          }
          reqBody.options['body'] = urlencoded;
          reqBody.options.headres['Content-Type'] = 'application/x-www-form-urlencoded';
        }
        
      }
      var resp = await fetch( reqBody.action.Url_c, reqBody.options );
      var respObj = {
        success : true,
        message : 'Request executed successfully!',
        statusCode : resp.status,
        reasonPhrase : resp.statusText,
        body : await resp.text(),
        headers : resp.headers
      }
      return new Response( JSON.stringify( respObj ) );    
    } catch( error ) {
      console.error("There has been a problem with your fetch operation:", error);
    }
  
}