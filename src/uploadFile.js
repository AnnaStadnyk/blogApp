import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL
} from 'firebase/storage'

export default class UploadAdapter {
  constructor(loader) {
    // The file loader instance to use during the upload.
    this.loader = loader
  }

  // Starts the upload process.
  async upload() {
    try {
      const file = await this.loader.file
      const fileName = 'image-' + Date.now()
      const storage = getStorage()
      const imageRef = storageRef(storage, 'images/' + fileName)
      const uploadImage = await uploadBytes(imageRef, file)
      const publicImageUrl = await getDownloadURL(imageRef)
      // const publicImageMeta = await getMetadata(imageRef)
      return new Promise((resolve, reject) => {
        resolve({
          default: publicImageUrl
        })
      })
    } catch (error) {
      console.log(error)
    }
  }

  // Aborts the upload process.
  abort() {
    if (this.xhr) {
      this.xhr.abort()
    }
  }
}
