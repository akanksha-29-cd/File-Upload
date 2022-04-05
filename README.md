# File-Upload

JS Changes

$(document).ready(function(){

    let filArray = [];
    let ajaxCall;
    let fileName = "";
    let fileSize;
    
    
    
        $('.uploadfile__from .js-input-file').on('change', function({target}){
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
                xhr.upload.addEventListener("progress", (evt) =>{
                    console.log("loaded, total",evt.loaded, evt.total);
                    let fileLoaded = Math.floor((evt.loaded / evt.total) * 100);
                    let fileTotal = Math.floor(evt.total / 1000);
    
                    
    
                    fileSize = (fileTotal < 1024) ? fileSize = fileTotal + 'KB' : fileSize = (evt.loaded / (1024 * 1024)).toFixed(2) + 'MB';
                    console.log("file size", fileSize);
    
                    let progressHtml = `<div class="row"><div class="details"><span class="name"> ${name}</span><span> - </span></div><div class="progress-bar"><div class="progress--1" style="width:${fileLoaded}%"></div></div></div>`
                    progressHtml += `<div class="upload-status"><span class="uploading-status">Uploading</span><span class="percentage">${fileLoaded}%</span></div></div>`
                    progressHtml += `<button class="btn btn-danger btn-cancel">Cancel</button>`
                    $('.progress-area').html(progressHtml);
    

    
                     /*if(evt.loaded == evt.total){
                        $('.progress-area').html('');
                        let uploadedHTML = `<div class="row"> <div class="uploaded"><div class="details"><span class="name"> ${name}</span><span> - ${fileSize}</span><p>Successfully Uploaded </p></div></div></div>`
                        uploadedHTML += `<button class="btn btn-sucess btn-remove">Remove</button>`
                        $(".uploaded-area").html(uploadedHTML);   
                        $("form.uploadfile__from :input").prop("disabled", true);
                        $(".uploadfile__inputlabel").addClass("uploadfile__btn--disabled");

                    }*/
    
                    $('.btn-cancel').on('click', function(){
                        ajaxCall.abort();
                        filArray.pop();
                        $('form.uploadfile__from')[0].reset();
                        $('.fileType').val('');
                        $('.progress-area').html('');
                    })
                    $('.btn-remove').on('click', function(){
                        filArray.pop();
                        $('form.uploadfile__from')[0].reset();
                        $('.file-input').val('');
                        $('.uploaded-area').html('');
                        $("form.uploadfile__from :input").prop("disabled", false);
                        $(".uploadfile__inputlabel").removeClass("uploadfile__btn--disabled");
                        alert("file is removed");
                        console.log("cleared array", filArray);
                    })

                }, false);
                return xhr;
            },
            // Your server script to process the upload
            type: 'POST',
            url: " ",
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
    
    
})
