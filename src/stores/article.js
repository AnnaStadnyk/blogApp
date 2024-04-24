import { defineStore } from 'pinia'

import {
  getDatabase,
  push,
  set,
  ref,
  onValue,
  query,
  orderByChild,
  limitToLast,
  endBefore,
  update,
  remove
} from 'firebase/database'
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  getMetadata,
  deleteObject
} from 'firebase/storage'
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut
} from 'firebase/auth'

export const useArticleStore = defineStore('article-store', {
  state() {
    return {
      article: {
        'daily-digest': [],
        'design-tools': [],
        'tutorials': []
      },
      categoryInfo: {
        'daily-digest': {
          date: new Date().getTime(),
          countExists: 0,
          countLoaded: 0,
          page: 0,
          isExists: false,
          isLoaded: false,
          isLast: false
        },
        'design-tools': {
          date: new Date().getTime(),
          countExists: 0,
          countLoaded: 0,
          page: 0,
          isExists: false,
          isLoaded: false,
          isLast: false
        },
        'tutorials': {
          date: new Date().getTime(),
          countExists: 0,
          countLoaded: 0,
          page: 0,
          isExists: false,
          isLoaded: false,
          isLast: false
        }
      },
      currentCategory: null,
      error: null,
      user: {
        uid: null,
        token: null,
        name: null,
        email: null,
        phone: null
      },
      timer: null
    }
  },

  getters: {
    getDailyDigest() {
      return this.article['daily-digest'].slice(0, 2)
    },
    getDesignTools() {
      return this.article['design-tools'].slice(0, 2)
    },
    getTutorials() {
      return this.article['tutorials'].slice(0, 2)
    }
  },

  actions: {
    async loadPost(category, id) {
      this.error = null
      try {
        const db = getDatabase()
        const dbRef = ref(db, `posts/${category}/${id}`)
        const data = await new Promise((resolve, reject) =>
          onValue(dbRef, (snapshot) => resolve(snapshot.val()), { onlyOnce: true })
        )

        const post = {}
        post.id = id
        const images = []
        for (let ikey in data.images) {
          images.push({
            url: data.images[ikey].url,
            name: data.images[ikey].name
          })
        }
        post.date = data.date
        post.title = data.title
        post.description = data.description
        post.content = data.content 
        post.author = { uid: data.author.uid, name: data.author.name } 
        post.images = images
        return post
      } catch (error) {
        this.error = error
      }
    },

    async getPostCount(category) {
      const db = getDatabase()
      const dbRef = ref(db, `category/${category}`)
      return await new Promise((resolve, reject) =>
        onValue(dbRef, (snapshot) => resolve(snapshot.val()), { onlyOnce: true })
      )
      // return await new Promise((resolve) => {
      //   onValue(dbRef, (snapshot) => {
      //     if (snapshot.exists()) {
      //       const dbCount = snapshot.val();
      //       resolve(dbCount);
      //     }
      //   }, { onlyOnce: true })
      // });
    },

    async changePostCount(category, operation) {
      let countDb = await this.getPostCount(category)
      const db = getDatabase()
      const dbRef = ref(db, `category/`)
      const updates = {}
      countDb = operation === 'inc' ? countDb + 1 : countDb - 1
      updates[`${category}`] = countDb
      await update(dbRef, updates)
    },

    async loadPosts(category, isHomeRoute) {
      this.error = null
      try {
        const db = getDatabase()
        let dbCount = 0
        let countPost = 4
        if (
          isHomeRoute ||
          (this.categoryInfo[category].page < 1 && this.categoryInfo[category].isLoaded)
        ) {
          countPost = 2
        }
        if (!this.categoryInfo[category].isLoaded) {
          dbCount = await this.getPostCount(category)
          this.categoryInfo[category].countExists = dbCount
        }

        const dbRef = ref(db, `posts/${category}`)
        const dbCateg = query(
          dbRef,
          orderByChild('date'),
          endBefore(this.categoryInfo[category].date),
          limitToLast(countPost)
        )
        const data = await new Promise((resolve, reject) =>
          onValue(dbCateg, (snapshot) => resolve(snapshot.val()), { onlyOnce: true })
        )

        const posts = []
        let i = 0
        for (let key in data) {
          const images = []
          for (let ikey in data[key].images) {
            images.push({
              url: data[key].images[ikey].url,
              name: data[key].images[ikey].name
            })
          }
          posts.push({
            id: key,
            date: data[key].date,
            title: data[key].title,
            description: data[key].description,
            content: data[key].content,
            author: { uid: data[key].author.uid, name: data[key].author.name },
            images: images
          })
          if (i === 0) this.categoryInfo[category].date = data[key].date
          i++
        }
        this.categoryInfo[category].isExists = true
        this.categoryInfo[category].countLoaded += i
        if (!isHomeRoute) this.categoryInfo[category].page++
        if (this.categoryInfo[category].countLoaded === this.categoryInfo[category].countExists)
          this.categoryInfo[category].isLast = true
        this.article[category] = this.article[category].concat(
          posts.sort((a, b) => {
            return b.date - a.date
          })
        )
        this.categoryInfo[category].isLoaded = true
      } catch (error) {
        this.error = error
      }
    },

    async addPost(category, post, files) {
      this.error = null
      try {
        // const firebaseApp = getApp();
        // const storage = getStorage(firebaseApp);
        const storage = getStorage()
        const fileUrls = []
        for (const item of files) {
          const fileName = 'image-' + Date.now()
          const imageRef = storageRef(storage, 'images/' + fileName)
          const uploadImage = await uploadBytes(imageRef, item)
          const publicImageUrl = await getDownloadURL(imageRef)
          const publicImageMeta = await getMetadata(imageRef)
          fileUrls.push({ url: publicImageUrl, name: publicImageMeta.name })
        }
        const db = getDatabase()
        const dbRef = ref(db, `posts/${category}`)
        const dbPost = await push(dbRef)
        const key = dbPost.key
        post = {
          ...post,
          author: { uid: this.user.uid, name: this.user.name },
          date: new Date().getTime(),
          images: fileUrls
        }
        await set(dbPost, post)
        await this.changePostCount(category, 'inc')
        post.id = key
        this.article[category].unshift(post)
      } catch (error) {
        this.error = error
        console.log(error)
      }
    },

    async editPost(category, id, post, files) {
      this.error = null
      try {
        const db = getDatabase()
        const dbRef = ref(db, `posts/${category}`)
        const updates = {}
        updates[`${id}/title`] = post.title
        updates[`${id}/description`] = post.description
        updates[`${id}/content`] = post.content
        const fileUrls = []
        if (files.length > 0) {
          const storage = getStorage()
          const images = this.article[category].find((a) => a.id === id).images
          for (const item of images) {
            const imageRef = storageRef(storage, 'images/' + item.name)
            await deleteObject(imageRef)
          }

          for (const item of files) {
            const fileName = 'image-' + Date.now()
            const imageRef = storageRef(storage, 'images/' + fileName)
            const uploadImage = await uploadBytes(imageRef, item)
            const publicImageUrl = await getDownloadURL(imageRef)
            const publicImageMeta = await getMetadata(imageRef)
            fileUrls.push({ url: publicImageUrl, name: publicImageMeta.name })
          }
          updates[`${id}/images`] = fileUrls
        }
        await update(dbRef, updates)
        let article = this.article[category].find((a) => a.id === id)
        article.title = post.title
        article.description = post.description
        article.content = post.content
        if (fileUrls.length > 0) article.images = fileUrls
      } catch (error) {
        this.error = error
      }
    },

    async deletePost(category, id) {
      this.error = null
      try {
        const db = getDatabase()
        const dbRef = ref(db, `posts/${category}/${id}`)
        await remove(dbRef)
        await this.changePostCount(category, 'dec')
        console.log(id, this.article[category].indexOf(id))
        this.article[category].splice(
          this.article[category].find((a) => a.id === id),
          1
        )
      } catch (error) {
        this.error = error
      }
    },

    getPost(category, id) {
      return this.article[category].find((a) => a.id === id)
    },

    async signUp(user) {
      this.error = null
      try {
        const auth = getAuth()
        const newUser = await createUserWithEmailAndPassword(auth, user.email, user.password)
        await updateProfile(newUser.user, {
          displayName: user.name
        })
        if (newUser !== null) {
          this.user.uid = newUser.user.uid
          this.user.name = newUser.user.displayName
          this.user.email = newUser.user.email
          this.user.phone = newUser.user.phoneNumber
        }
      } catch (error) {
        this.error = error
      }
    },

    async signIn(user) {
      this.error = null
      try {
        const auth = getAuth()
        const currentUser = await signInWithEmailAndPassword(auth, user.email, user.password)

        // const user = auth.currentUser;
        if (currentUser !== null) {
          this.user.uid = currentUser.user.uid
          this.user.name = currentUser.user.displayName
          this.user.email = currentUser.user.email
          this.user.phone = currentUser.user.phoneNumber
          // this.user.token = await auth.currentUser.getIdToken();
          this.user.token = currentUser.user.stsTokenManager.accessToken
          // const tokenExpiration = currentUser.user.stsTokenManager.expirationTime
          // const expiresIn = tokenExpiration - new Date().getTime()

          // localStorage.setItem('blogAppToken', this.user.token)
          // localStorage.setItem('blogAppTokenExp', tokenExpiration)
          
          // this.timer = setTimeout(() => {
          //   this.signOut()
          // }, expiresIn)
        }
      } catch (error) {
        this.error = error
      }
    },

    async signOut() {
      this.error = null
      try {
        const auth = getAuth()
        await signOut(auth)
        this.user.uid = null
        this.user.name = null
        this.user.email = null
        this.user.phone = null
        this.user.token = null

        // localStorage.removeItem('blogAppToken')
        // localStorage.removeItem('blogAppTokenExp')

        // clearTimeout(this.timer)

        if (this.router.currentRoute.value.name === 'addPost' || this.router.currentRoute.value.name === 'editPost') {
          this.router.push('/' + this.router.currentRoute.value.params.category)
        }
      } catch (error) {
        this.error = error
      }
    },

    async tryLogin() {
      const token = localStorage.getItem('blogAppToken')
      const tokenExpiration = localStorage.getItem('blogAppTokenExp')
      const expiresIn = tokenExpiration - new Date().getTime()

      if (expiresIn < 60000) return

      this.timer = setTimeout(() => {
        this.signOut()
      }, expiresIn)

      if (token) {
        this.user.token = token
        // const decodedToken = await admin.auth().verifyIdToken(user.token)
        // if (decodedToken) {
        // this.user.uid = decodedToken.uid;
        // }
      }
    }
  }
})
