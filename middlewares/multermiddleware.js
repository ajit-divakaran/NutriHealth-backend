const multer = require('multer')

//1 The disk storage engine gives you full control on storing files to disk.

const storage = multer.diskStorage({
    destination:(req,file,callback)=>{
        callback(null,'./uploads')
    },
    filename:(req,file,callback)=>{
        // Returns the number of milliseconds elapsed since midnight, January 1 1970 Universal Coordinated Time(UTC).
        const filename = `image-${Date.now()}-${file.originalname}`
        callback(null,filename)
    }
})

//2 File Filter

const fileFilter = (req,file,callback) =>{
    if(file.mimetype == 'image/png' || file.mimetype=='image/jpg' || file.mimetype=='image/jpeg'){
        callback(null,true)
    }
    else{
        callback(null,false)
        return callback(new Error('Only png, jpg, jpeg files are allowed'))

    }
}

//3 multer configuration
const multerConfig = multer({
    storage,
    fileFilter

})


//export
module.exports = multerConfig