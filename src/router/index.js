import { createRouter, createWebHistory } from 'vue-router'
const HomeView = () => import('@/views/HomeView.vue')
const DailyDigest = () => import('@/views/DailyDigest.vue')
const DesignTools = () => import('@/views/DesignTools.vue')
const TheTutorials = () => import('@/views/TheTutorials.vue')
const ThePost = () => import('@/views/ThePost.vue')
const AddPost = () => import('@/views/AddPost.vue')
const EditPost = () => import('@/views/EditPost.vue')
const SignUp = () => import('@/views/SignUp.vue')
const SignIn = () => import('@/views/SignIn.vue')
import { getAuth, getIdTokenResult } from 'firebase/auth'
// const PostView = () => import('@/views/PostView.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: 'home'
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
      meta: {
        title: 'Home'
      }
    },
    {
      path: '/sign-up',
      name: 'signUp',
      component: SignUp,
      meta: {
        title: 'Sign Up'
      }
    },
    {
      path: '/sign-in',
      name: 'signIn',
      component: SignIn,
      meta: {
        title: 'Sign In'
      }
    },
    {
      path: '/:category',
      name: 'dailyDigest',
      component: DailyDigest,
      // component: PostView,
      props: true,
      meta: {
        title: 'Daily Digest'
      }
    },
    {
      path: '/:category',
      name: 'designTools',
      component: DesignTools,
      // component: PostView,
      props: true,
      meta: {
        title: 'Design Tools'
      }
    },
    {
      path: '/:category',
      name: 'tutorials',
      component: TheTutorials,
      // component: PostView, // one component and onBeforeMount only one time
      props: true,
      meta: {
        title: 'Tutorials'
      }
    },
    // {
    //   path: '/:category',
    //   name: 'postView',
    //   component: PostView,
    //   props: true,
    //   meta: {
    //     title: 'Post List'
    //   }
    // },
    {
      path: '/:category/add-post',
      name: 'addPost',
      component: AddPost,
      props: true,
      meta: {
        title: 'Add Post',
        requiredAuth: true
        // requiredAdmin: true
      }
    },
    {
      path: '/:category/:id',
      name: 'viewPost',
      component: ThePost,
      props: true,
      meta: {
        title: 'Read Post'
      }
    },
    {
      path: '/:category/:id/edit-post',
      name: 'editPost',
      component: EditPost,
      props: true,
      meta: {
        title: 'Edit Post',
        requiredAuth: true
        // requiredAdmin: true
      }
    }
    // {
    //   path: '/:notFound(.*)',
    //   redirect: '/home'
    // }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} | Blog App`
  next()
})

router.beforeEach(async (to, from, next) => {
  const auth = getAuth()
  const user = auth.currentUser
  let admin = null
  if (user) {
    const token = await user.getIdTokenResult()
    admin = token.claims.admin
  }
  if (to.matched.some((res) => res.meta.requiredAuth)) {
    if (user) {
      if (to.matched.some((res) => res.meta.requiredAdmin)) {
        if (admin) {
          return next()
        }
        return next(from)
      }
      return next()
    }
    return next({ name: 'home' })
  }
  return next()
})

export default router
