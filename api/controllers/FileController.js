/**
 * FileController
 *
 * @description :: Server-side logic for managing files
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var PNG = require("pngjs-image");
var files = require("fs");

module.exports = {
	upload: function  (req, res) {
		if(req.method === 'GET')
			return res.json({'status':'GET not allowed'});						
		//	Call to /upload via GET is error

		var uploadFile = req.file('file');
		console.log(uploadFile);
		
		//Use this to upload to custom folder
		//If you don't want this remove {dirname: ''}
		//There are other options also .Check at skipper docs

		//If dirname is not set the upload will be done to ./tmp/uploads	
	    uploadFile.upload({ dirname: sails.config.globals.upload_files},function onUploadComplete (err, files) {
	    // Files will be uploaded to /assets/images/
	    // Access the files via localhost:1337/images/yourfilename

	    	if (err) return res.serverError(err);								
	    	//	IF ERROR Return and send 500 error with error
			
	    	console.log(files);
	    	res.json({status:200,file:files});
	    	//This will print the details including new file name upload path etc
	    });
	},
	download: function  (req, res) {

		var filename, file;

		if(req.method !== 'GET')
			return res.json({'status':'only GET is allowed'});
		//	Call to /upload via GET is error

		filename = sails.config.globals.upload_files + 'hoek.png';

		// read file to byte array synchronous
		file = files.readFileSync(filename);

		try {
			// use library PNGJS-IMAGE
			// returns a png image object
			PNG.loadImage(file, function (err, image) {
				if (err)
					sails.log.error(err);
				// see https://www.npmjs.com/package/pngjs-image#instance-methods
				// for documentation on instance => image actions

				sails.log.info('Image width: '+image.getWidth()+' '+'Image height :'+image.getHeight());
			});
		}catch(ex){
			console.log(ex);
		}
		res.json({status:200,file:file});


		/**
		 * You can also read image asynchronous
		 */
		//
		/**
		try {
			// use library PNGJS-IMAGE
			// returns a png image object
			var img = PNG.readImage(filename, function (err, image) {
				if (err)
					console.log(err);

			});
		}catch(ex){
			console.log(ex);
		}
		//*/

		/** load image-data asynchronous
		 *
		 *  'file' is a byte array loaded in previous actions
		 *  You
		 */


	}
};

