let filArray = [];
let ajaxCall;
let fileName = "";

// $('.btn-submit').on('click', function(e){
//     e.preventDefault();
//     uploadFile(fileName);   
//     alert("I am done");
// })


$('.file-input').on('change', function({target}){
    let file = target.files[0];
    let allowedTypes = ['application/pdf', 'application/csv', 'application/vnd.ms-excel'];
    let fileType = file.type;

    console.log("target", file);

        if(file && allowedTypes.includes(fileType)){

            fileName = file.name;  
            if(fileName.length >= 12){
                let splitText = fileName.split('.');
                console.log("splitText",splitText);
                fileName = splitText[0].substring(0, 12) + '..' + splitText[1];
            }
            uploadFile(fileName);
            fileStorage(file);
        }else{
            console.log("cannot save");
            filArray.pop();
            $('.fileType').val('');
            return false;
        }
    
});
function fileStorage(arr){
    filArray.push(arr);
    console.log("file array", filArray);
}
function uploadFile(name){
    ajaxCall = $.ajax({
        xhr: function(){
            let xhr = new XMLHttpRequest();
            xhr.upload.addEventListener("progress", ({loaded, total}) =>{
                console.log("loaded, total",loaded, total);
                let fileLoaded = Math.floor((loaded / total) * 100);
                let fileTotal = Math.floor(total / 1000);
            
                let fileSize;
                
                fileSize = (fileTotal < 1024) ? fileSize = fileTotal + 'KB' : fileSize = (loaded / (1024 * 1024)).toFixed(2) + 'MB';

            
                let progressHtml = `<div class="row"><div class="details"><span class="name"> ${name}</span><span>- </span></div><div class="progress-bar"><div class="progress--1" style="width:${fileLoaded}%"></div></div></div>`
                progressHtml += `<div class="upload-status"><span class="uploading-status">Uploading</span><span class="percentage">${fileLoaded}%</span></div></div>`
                progressHtml += `<button class="btn btn-danger btn-cancel">Cancel</button>`
                $('.progress-area').html(progressHtml);

      

                if(loaded == total){
                    $('.progress-area').html('');
                    let uploadedHTML = `<div class="row"> <div class="uploaded"><div class="details"><span class="name"> ${name}</span><span>- </span> <p>Uploaded .<span class="size">${fileSize}</span></p></div></div><div class="success-msg"><p>Successfull!!</p></div></div>`
                    uploadedHTML += `<button class="btn btn-sucess btn-remove">Remove</button>`
                    $(".uploaded-area").html(uploadedHTML);   
                }

                $('.btn-cancel').on('click', function(){
                    ajaxCall.abort();
                    filArray.pop();
                    $('form')[0].reset();
                    $('.fileType').val('');
                    $('.progress-area').html('');
                })
                $('.btn-remove').on('click', function(){
                    filArray.pop();
                    $('form')[0].reset();
                    $('.file-input').val('');
                    $('.uploaded-area').html('');
                    alert("file is removed");
                    console.log("cleared array", filArray);
                })
    
            }, false);
            return xhr;
        },
        // Your server script to process the upload
        type: 'POST',
        url: "php/uploaded.php",
        //formData
        data: new FormData($('form')[0]),
        cache: false,
        contentType: false,
        processData: false,
        error: function(){
            alert("This is an error");
        },
        success: function(){
           alert("successfull");
        }
    
    })
}