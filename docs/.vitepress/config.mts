import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'ITSC Student Helper Guide',
  description: 'Duties, procedures and tips for ITSC Student Helpers at Lingnan University',
  lang: 'en-US',
  lastUpdated: true,
  cleanUrls: true,

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Duties', link: '/duties/' },
      { text: 'Tips', link: '/tips/' },
      { text: 'Reference', link: '/reference/faq' }
    ],

    sidebar: [
      {
        text: 'Getting Started',
        items: [
          { text: 'Welcome', link: '/guide/getting-started' },
          { text: 'Your First Shift', link: '/guide/first-shift' },
          { text: 'Code of Conduct', link: '/guide/code-of-conduct' }
        ]
      },
      {
        text: 'Duties',
        items: [
          { text: 'Overview', link: '/duties/' },
          { text: 'Service Counter', link: '/duties/service-counter' },
          { text: 'Computer Lab Support', link: '/duties/lab-support' },
          { text: 'AV & Classroom Equipment', link: '/duties/av-equipment' },
          { text: 'Accounts & Passwords', link: '/duties/accounts' },
          { text: 'Printing Services', link: '/duties/printing' }
        ]
      },
      {
        text: 'Tips',
        items: [
          { text: 'Overview', link: '/tips/' },
          { text: 'Troubleshooting Playbook', link: '/tips/troubleshooting' },
          { text: 'Talking to Users', link: '/tips/communication' }
        ]
      },
      {
        text: 'Reference',
        items: [
          { text: 'FAQ', link: '/reference/faq' },
          { text: 'Contacts & Escalation', link: '/reference/contacts' }
        ]
      }
    ],

    search: {
      provider: 'local'
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/ansonlo-dev/ITSC_Student_Helper_Guide' }
    ],

    footer: {
      message: 'Internal reference for ITSC Student Helpers.',
      copyright: 'Lingnan University — Information Technology Services Centre'
    },

    editLink: {
      pattern: 'https://github.com/ansonlo-dev/ITSC_Student_Helper_Guide/edit/main/docs/:path',
      text: 'Suggest changes to this page'
    },

    outline: [2, 3]
  }
})
