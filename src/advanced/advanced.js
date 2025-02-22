// HERE ARE SOME EXAMPLES OF RAW HTTP REQUESTS (text)
// WE ARE GOING TO WRITE A COLLECTION OF FUNCTIONS THAT PARSE THE HTTP REQUEST
// AND CONVERTS IT ALL INTO A Javascript object

// EXAMPLE INPUT 1
const rawGETRequest = `
GET / HTTP/1.1
Host: www.example.com
`
// OUTPUT
const request = {
  method: 'GET',
  path: '/',
  headers: {
    Host: 'www.example.com'
  },
  body: null,
  query: null
}
// EXAMPLE 2
const rawGETRequestComplex = `
GET /api/data/123?someValue=example HTTP/1.1
Host: www.example.com
Authorization: Bearer your_access_token
`
const requestComplex = {
  method: 'GET',
  path: '/api/data/123',
  headers: {
    Host: 'www.example.com',
    Authorization: 'Bearer your_access_token'
  },
  body: null,
  query: {
    someValue: 'example'
  }
}
// EXAMPLE 3: NOTE the BODY is separated from the HEADERS via an empty line
const rawPOSTRequest = `
POST /api/data HTTP/1.1
Host: www.example.com
Content-Type: application/json
Content-Length: 36

{"key1": "value1", "key2": "value2"}
`
const requestPOST = {
  method: 'POST',
  path: '/api/data',
  headers: {
    Host: 'www.example.com',
    'Content-Type': 'application/json',
    'Content-Length': '36'
  },
  body: {
    key1: 'value1',
    key2: 'value2'
  },
  query: null
}

// IMPLEMENTATION
// WE WILL provide different tests for the different functions

// 1. Create a function named parseRequest that accepts one parameter:
// - the raw HTTP request string
// It must return an object with the following properties:
// - method: the HTTP method used in the request
// - path: the path in the request
// - headers: an object with the headers in the request
// - body: the body in the request
// - query: an object with the query parameters in the request
function parseRequest(req) {
  const request = {
    method: '',
    path: '',
    headers: {},
    body: null,
    query: null
  }
  if( req == ''){
    return request
  }
console.log(req + '\n')
  // call the other functions below as needed
  let input = req.split(' ')
  request.method = input[0].replace(/(\r\n|\n|\r)/gm, "");
  if (input[1].indexOf('?') > -1){
    // input = input[1].split('?')
    request.path = input[1].split('?')[0]
    request.query = extractQuery(input[1])
  } else {
    request.path = input[1]
  }
  
  input = req.split('\n')
  let i = 2
  while(input[i] !== ''){
    // console.log('test' + i + ': ' + input[i] + ' ' +  typeof input[i])
    parseHeader(input[i], request.headers)
    i++
  }
  i++
  request.body = parseBody(input[i])
  // console.log('Method: ' + request.method)
  // console.log('path: ' + request.path)
  // console.log('headers: ' + request.headers)
  // console.log('test: "' + input[2] + '"')
  console.log(request)


  return request
}

parseRequest(rawGETRequestComplex)
// parseRequest(rawPOSTRequest)
// 2. Create a function named parseHeader that accepts two parameters:
// - a string for one header, and an object of current headers that must be augmented with the parsed header
// it doesnt return nothing, but updates the header object with the parsed header
// eg: parseHeader('Host: www.example.com', {})
//        => { Host: 'www.example.com' }
// eg: parseHeader('Authorization: Bearer your_access_token', { Host: 'www.example.com' })
//        => { Host: 'www.example.com', Authorization: 'Bearer your_access_token'}
// eg: parseHeader('', { Host: 'www.example.com' }) => { Host: 'www.example.com' }
function parseHeader(header, headers) {
  if (header.indexOf(':') > -1){
    const input = header.split(':')
    
    if(!Object.hasOwn(headers, input[0])){
      headers[input[0]] = input[1].replace(' ', "")
    }
  }
}

// 3. Create a function named parseBody that accepts one parameter:
// - a string for the body
// It must return the parsed body as a JavaScript object
// search for JSON parsing
// eg: parseBody('{"key1": "value1", "key2": "value2"}') => { key1: 'value1', key2: 'value2' }
// eg: parseBody('') => null
function parseBody(body) {
  if (body == null || typeof body == 'undefined' || body == ''){
    return null
  }
  return JSON.parse(body)
}

// 4. Create a function named extractQuery that accepts one parameter:
// - a string for the full path
// It must return the parsed query as a JavaScript object or null if no query ? is present
// eg: extractQuery('/api/data/123?someValue=example') => { someValue: 'example' }
// eg: extractQuery('/api/data/123') => null
function extractQuery(path) {
  if (path.indexOf('?') > -1){
    const input = path.split("?")[1]
    const obj = {}
    if(input.indexOf('&') > -1){
        const output1 = input.split('&')
        output1.forEach(element => {
          obj[element.split('=')[0]] = element.split('=')[1]
        });
    } else {
      const output = input.split('=')
      obj[output[0]] = output[1]
    }
    return obj
  }
  return null
}

module.exports = {
  rawGETRequest,
  rawGETRequestComplex,
  rawPOSTRequest,
  request,
  requestComplex,
  requestPOST,
  parseRequest /* eslint-disable-line no-undef */,
  parseHeader /* eslint-disable-line no-undef */,
  parseBody /* eslint-disable-line no-undef */,
  extractQuery /* eslint-disable-line no-undef */
}
