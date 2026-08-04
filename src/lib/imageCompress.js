// Compress a File (image) to a target size in KB. Returns a File.
// Falls through on non-images.
export function compressImage(file, targetKB) {
  var maxBytes = (targetKB || 100) * 1024
  return new Promise(function (resolve, reject) {
    if (!file || !file.type || file.type.indexOf('image/') !== 0) {
      resolve(file); return
    }
    var reader = new FileReader()
    reader.onload = function (ev) {
      var img = new Image()
      img.onload = function () {
        var canvas = document.createElement('canvas')
        var maxDim = 1600
        var w = img.width; var h = img.height
        if (w > maxDim || h > maxDim) {
          if (w > h) { h = Math.round(h * maxDim / w); w = maxDim }
          else { w = Math.round(w * maxDim / h); h = maxDim }
        }
        canvas.width = w; canvas.height = h
        var ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, w, h)
        var quality = 0.85
        function tryOnce() {
          canvas.toBlob(function (blob) {
            if (!blob) { reject(new Error('toBlob failed')); return }
            if (blob.size <= maxBytes || quality <= 0.35) {
              var out = new File([blob], file.name.replace(/\.[^.]+$/, '') + '.jpg', { type: 'image/jpeg' })
              resolve(out); return
            }
            quality -= 0.1
            tryOnce()
          }, 'image/jpeg', quality)
        }
        tryOnce()
      }
      img.onerror = function () { reject(new Error('image load failed')) }
      img.src = ev.target.result
    }
    reader.onerror = function () { reject(new Error('reader failed')) }
    reader.readAsDataURL(file)
  })
}
