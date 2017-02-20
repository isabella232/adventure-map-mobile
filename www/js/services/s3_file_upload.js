angular.module('adventureMap.s3FileUpload', [])
  .service('S3FileUpload', function($http, API_URL) {

    var error =  {
      message: 'An error occurred while attaching your file',
      success: false
    };

    /**
     * Upload file to S3
     * @namespace adventureMap.s3FileUpload
     * @argument
     *  type: File type, will be used to create directories on S3
     *        e.g. `images` or `text`
     *  file: The file to upload
     */
    this.upload = function(type, file) {
      var url = API_URL + '/upload/' + type;

      // Obtain presigned url from backend server
      $http.post(url, { filename: file.name, content_type: file.type })
        .success(function(resp) {
          // Upload the file to S3 using presigned url
          $http.put(resp.upload_url, file, {
            cache: false, headers: { 'Content-Type' : file.type }
          })
          .success(function(response) {
            return {
              message: 'File was successfully uploaded!',
              public_url: resp.public_url,
              success: true
            };
          })
          .error(function(response) {
            return error;
          });
        })
        .error(function(resp) {
          return error;
        });
    }
  });
