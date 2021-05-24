# Welcome to Pupperty!
Puppery is a web-application developed by Lander Cua, Jacob Gaba, and Matthew Singson in compliance with the requirements set for CCAPDEV S14 | Term 2, S.Y. 20-21. 

## About Pupperty
Pupperty is a web-application focused on being a dog adoption hub. One can create an account to adopt dogs, put dogs up for adoption, and ask for questions for any dog-related problems! 
The following is a list of Pupperty's inherent features, as required by the CCAPDEV course:
- Front-end and back-end form validation for account login and register
- Database manipulation for storage of objects (Users, Adoption Posts, FAQs) using CRUD operations
- *Asynchronous Javascript and XML (AJAX)* html/css manipulation for reduced page refreshes
- Password hashing for security
- Session Management 
   - Front-end: Accessing '/' while a session is active will lead only to the homepage, not the log-in page
   - Back-end: Determining current user for database searching
- Online deployment to Heroku: https://pupperty.herokuapp.com/

Aside from the required specifications for CCAPDEV, Pupperty boasts the following additonal features:
* Image uploading through multer
* Case-insensitive substring database search 

###### Note: The search functionality in the navbar of pupperty also requires one of the search filters to be selected. Searching without a search filter will not yield any results. To select a search filter, simply hover over the dropdown box located beside the input text field and select one of the radio button filters.

## Accessing the Application
Pupperty is primarily hosted on heroku and can be accessed through the following link: https://pupperty.herokuapp.com/. In order to access all the features of pupperty, a user account is required. However, registering an account on pupperty is very easy! Simply click the register button at the log-in page and input your e-mail and desired password. Once the website has confirmed your e-mail to be unique, you're all set to go!

## Setting-up Pupperty Locally
Pupperty runs on node.js and can be run locally. Simply download the files in the repository, access the downloaded folder in your command prompt, and run the command: **supervisor index.js**. Should you have any missing packages, the commands to install any of the used modules/packages are as follows:
* npm init
* npm install dotenv
* npm install express
* npm install body-parser
* npm install mongodb
* npm install hbs
* npm install multer
* npm install routes
* npm install session
* npm install bcrypt

###### Note: The "Dev Notes" page in the application also contains the list of used modules/packages for your reference.

## Caveats
Pupperty has unfortunately encountered some difficulties with being launched as a web application, specifically with functionalities concerning AJAX. Therefore, the developers encourage it being run locally so as to avoid any unwanted delays in accessing the webpage/server of pupperty. To set-up the web-application locally, see the section above, titled "Setting-up Pupperty Locally". The list of functionalities you can expect to be affected by the hosting of pupperty on a webpage are listed below:
* Delays in submitting dog adoptions posts because of photo uploads.
* Delay in appending of newly-submitted FAQs through AJAX on the FAQ page.
* Delay in appending of administrator comments through AJAX in FAQ posts.
* Delay in front-end form validation through AJAX at the log-in page.
* Delay in removal of comment box through AJAX when using a restricted account (not the administrator).

Rest assured however, that these were tested to be working at an acceptable speed during development. It was only at application deployment that the delays became noticeable. Changing to a local database would also significantly reduce the delays mentioned. This is possible by editing the **.env** file located at the root folder, and changing the **DB_URL** variable to a local database *(e.g. mongodb://localhost:27017)*.
