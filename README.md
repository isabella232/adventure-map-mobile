[![CircleCI](https://circleci.com/gh/CraftAcademyLabs/adventure-map-mobile.svg?style=svg&circle-token=490dd46cd4b07d41ff4682e6ec0904d6a6471bed)](https://circleci.com/gh/CraftAcademyLabs/adventure-map-mobile)
# Adventure Map Mobile (Ionic 1.x)
AdventureMap Mobile application - Ionic v1 😞


### Running tests

#### Features
This project uses Protractor and CucumberJS for acceptance tests
Feature files are placed in `tests/features` folder. 
Step definitions are placed in `tests/features/step_definitions`

##### Dependencies
Install `protractor` and update the webdriver

```shell
$ npm install -g protractor
$ webdriver-manager update
```

This line may be necessary:
```
$ node_modules/protractor/bin/webdriver-manager update
```

##### Running the tests
In order to run features, an instance of the application must be running:

```shell
$ ionic serve
```
(See below for more options)

Then open another tab on your terminal and to run the test you must run the following command:
```
$ npm run cucumber
```
In order to run a specific scenario you can run `protractor` with a `--specs` flag: 
```
protractor tests/protractor.conf.js --specs tests/features/feature_file_.feature 
```

## "possible EventEmitter memory leak detected." warning 
If you get this warning please run this command to install 
```
$ sudo npm install -g npm@next
```

### Running the App
You can choose to run the app on your phone or in an emulator.

#### iOs Simulator
Run the following commands
```
$ gulp sass # May not be necessary - This will compile the stylesheets
$ ionic platform remove ios (optional)
$ ionic platform add ios
$ ionic emulate ios
```

#### Browser
You can run the app in your browser by starting the Ionic server with:
```
$ gulp watch sass # Run this in a separate terminal
$ ionic serve
```

You can access the application by navigalign to:
```
http://localhost:8100/
```

If you prefer to view a simulator of iOS and Android side by side, you can choose to do that by navigating to:
```
http://localhost:8100/ionic-lab
```

You can also choose to run the Ionic server in the background by using `screen` Execute the following command:

```
$ screen -d -m -L ionic serve --address localhost -p 8100 --nolivereload --nogulp --nobrowser &
```

Remember to terminate the process when you no longer need to run the process:

Find out the PID (numeric value) for the process
```
ps aux | grep ionic
```
That will return a list of processes that runs Ionic

Terminate the process with the `kill` command
```
$ kill 11111 #whatever number your process has (PID)
```

If you revisit `http://localhost:8100/` you should no longer be able to access the application.

### How to upload files to S3

Make use of the `S3FileUpload` service to upload files to an S3 bucket. This service makes a request to the API to get
a presigned (encrypted) url that it then uses to upload the file to the bucket. This way we don't have to expose all
AWS secret credentials on the client. This service can be used to upload any type of files from the client app.

#### Example: Upload an image

In order to upload an image, just inject `S3FileUpload` in the controller responsible for handling the file upload. Then
call the `upload` function of the service that takes *02 arguments*, the _file type_ (`images` in this case) and the _file to upload_

```javascript
resp = S3FileUpload.upload('images', $scope.file);
```

If the file is uploaded successfully, the `upload` function returns the following object:

```javascript
{
  message: 'File was successfully uploaded!',
  public_url: 'https://bucket_name.s3-region.amazonaws.com/images/file_name.png',
  success: true
}
```

In case of failure, we get the following response:

```javascript
{
  message: 'An error occurred while attaching your file',
  success: false
}
```

#### Development Server Credentials
```
admin@calabs.se
password
```