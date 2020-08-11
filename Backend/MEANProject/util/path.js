const path = require('path');

                        //process global varible refers to Main Module that started our application, then 
                            // we are getting name of file in which the module is present (here , to app.js)
module.exports = path.dirname(process.mainModule.filename);
                         //this basically gives the path to file which is responsible for running our application(here, to app.js)


//dirname --   returns the directory name of a path


