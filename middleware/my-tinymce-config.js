tinymce.init({
  selector: '#articleContent',
  width: 700,
  plugins: 'image',
  toolbar: 'image',
  images_upload_base_path: '../public/images',
  images_file_types: 'jpg,webp,png',
  file_picker_types: 'image',
  block_unsupported_drop: true,

  file_picker_callback: (callback, value, meta) => {

  const input = document.createElement('input');
  input.setAttribute('type', 'file');
  input.setAttribute('accept', 'image/*');

  input.addEventListener('change', (e) => {
  const file = e.target.files[0];

  const reader = new FileReader();
      reader.addEventListener('load', () => {
        /*
          Note: Now we need to register the blob in TinyMCEs image blob
          registry.
        */
        const id = 'blobid' + (new Date()).getTime();
        const blobCache =  tinymce.activeEditor.editorUpload.blobCache;
        const base64 = reader.result.split(',')[1];
        const blobInfo = blobCache.create(id, file, base64);
        blobCache.add(blobInfo);

        /* call the callback and populate the Title field with the file name */
        callback(blobInfo.blobUri(), { title: file.name });
      });
      reader.readAsDataURL(file);
    });

    input.click();
  },

  /*images_upload_handler: function (blobInfo, success, failure) {
    var image_size = blobInfo.blob().size / 1000;  // image size in kbytes
    var max_size   = max_size_value                // max size in kbytes
    if( image_size  > max_size ){        
        failure('Image is too large( '+ image_size  + ') ,Maximum image size is:' + max_size + ' kB');
        return;      
    } else {
        // Your code
    }
  }*/
});
